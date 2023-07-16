// /* eslint-disable no-underscore-dangle */ // Need to access httpResponse._body
// // import { Neighborhood, User } from '@prisma/client';
import { Response } from "supertest";
import app from "../app";
import prismaClient from "../../prismaClient";
import seed from "./seed";
import testHelpers from "./testHelpers";
import { LoginData, UpdateResponseData } from "../types";

const supertest = require("supertest"); // eslint-disable-line
// 'require' was used because supertest does not support import

const api = supertest(app);

const ANTONINAS_LOGIN_DATA: LoginData = {
  username: "antonina",
  password: "secret",
};

const BOBS_LOGIN_DATA: LoginData = {
  username: "bob1234",
  password: "secret",
};

const ANTONINAS_NHOOD_ID = 2;
const INVALID_NHOOD_ID = 12345;
const RADUS_REQUEST_ID = 2;
const ANTONINAS_RESPONSE_ID = 1;

const loginUser = async (loginData: LoginData) => {
  const loginResponse = await api.post("/api/login").send(loginData);

  return loginResponse;
};

beforeAll(async () => {
  await seed();
});

// In the test seed file, we have ANTONINA's (user_id = 2) respone (httpResponse = 1)
// The httpResponse is to request with id = 2, created by the user RADU (user_id = 4)
// Radu's request is in ANTONINA's NEIGHBORHOOD (neighborhood_id = 2, admin_id = 2)
// We will write test according to the above data

describe("Tests for updating a request: PUT /requests/:id", () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse: Response = await loginUser(ANTONINAS_LOGIN_DATA);
    token = loginResponse.body.token;
  });

  beforeEach(async () => {
    await seed();
  });

  test("User cannot update httpResponse if they aren't logged in", async () => {
    const newData: UpdateResponseData = { content: "new content" };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .send(newData);

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(httpResponse.status).toBe(401);
    expect(httpResponse.body.error).toBe("user not signed in");
    expect(responseInDbAfterUpdate.content).not.toBe(newData.content);
  });

  test("User cannot update httpResponse if they didn't create it", async () => {
    const loginResponse: Response = await loginUser(BOBS_LOGIN_DATA);
    const bobToken: string = loginResponse.body.token;

    const newData: UpdateResponseData = { content: "test content" };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${bobToken}`)
      .send(newData);

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(httpResponse.status).toBe(401);
    expect(httpResponse.body.error).toBe("User does not have edit rights.");
    expect(responseInDbAfterUpdate.content).not.toBe(newData.content);
  });

  test("Update with invalid properties raises an error", async () => {
    const invalidData = { invalid: "Test" };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(invalidData);

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(httpResponse.status).toBe(400);
    // Does the following error message makes sense here?
    // Probably a very minor thing which can be ignored
    expect(httpResponse.body.error).toBe(
      "Content and/or status value is invalid."
    );
    expect(responseInDbAfterUpdate).not.toHaveProperty("invalid");
  });

  test("Update with invalid values raises an error", async () => {
    const invalidContentData = {
      content: 2,
    };

    const invalidStatusData = {
      status: "random string",
    };

    const responseInDbBeforeUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    const response1: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(invalidContentData);

    expect(response1.status).toBe(400);
    expect(response1.body.error).toBe(
      "Content and/or status value is invalid."
    );

    const response2: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(invalidStatusData);

    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe(
      "Content and/or status value is invalid."
    );

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(responseInDbAfterUpdate).toEqual(responseInDbBeforeUpdate);
  });

  test("Empty input doesn't change anything on the server", async () => {
    const responseInDbBeforeUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(httpResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(responseInDbAfterUpdate).toEqual(responseInDbBeforeUpdate);
    expect(httpResponse.status).toEqual(200);
  });

  test("id, user_id, request_id and time_created fields cannot be edited", async () => {
    const requestInDbBeforeUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    // Cheking for failure to update id
    const response1 = await api
      .put(`/api/responses/${ANTONINAS_NHOOD_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1000 });

    expect(response1.status).toBe(404);

    // Checking for failure to update user_id
    const response2 = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ user_id: 1000 });

    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe(
      "Content and/or status value is invalid."
    );

    // Checking for failure to update request_id
    const response3 = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ request_id: 1000 });

    expect(response3.status).toBe(400);
    expect(response3.body.error).toBe(
      "Content and/or status value is invalid."
    );

    // Checking for failure to update time_created
    const response4 = await api
      .put(`/api/responses/${ANTONINAS_NHOOD_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ time_created: new Date() });

    expect(response4.status).toBe(400);
    expect(response4.body.error).toBe(
      "Content and/or status value is invalid."
    );

    const responseInDbAfterUpdate = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );
    expect(responseInDbAfterUpdate).toEqual(responseInDbAfterUpdate);
  });

  test("Able to change to status of response to ACCEPTED", async () => {
    const initialResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );
    expect(initialResponseInDb.status).toBe("PENDING");

    // Why can we not use type of `updateData` to be `UpdateRequestData` ?
    // TS still expects `status` field to be of type `number`
    const updateData = {
      status: "ACCEPTED",
    };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(httpResponse.body.status).toBe("ACCEPTED");
    expect(httpResponse.body.content).toBe(initialResponseInDb.content);

    const finalResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(finalResponseInDb.id).toBe(initialResponseInDb.id);
    expect(finalResponseInDb.request_id).toBe(initialResponseInDb.request_id);
    expect(finalResponseInDb.user_id).toBe(initialResponseInDb.user_id);
    expect(finalResponseInDb.content).toBe(initialResponseInDb.content);
    expect(finalResponseInDb.status).toBe("ACCEPTED");
  });

  test("Able to change the content of response", async () => {
    const initialResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    const updateData = {
      content: "test content",
    };

    const httpResponse: Response = await api
      .put(`/api/responses/${ANTONINAS_RESPONSE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body.id).toBe(ANTONINAS_RESPONSE_ID);
    expect(httpResponse.body.status).toBe("PENDING");
    expect(httpResponse.body.content).toBe(updateData.content);

    const finalResponseInDb = await testHelpers.getSingleResponse(
      ANTONINAS_RESPONSE_ID
    );

    expect(finalResponseInDb.id).toBe(initialResponseInDb.id);
    expect(finalResponseInDb.request_id).toBe(initialResponseInDb.request_id);
    expect(finalResponseInDb.user_id).toBe(initialResponseInDb.user_id);
    expect(finalResponseInDb.status).toBe(initialResponseInDb.status);
    expect(finalResponseInDb.content).toBe(updateData.content);
  });
});

describe("Tests for deleting a request: DELETE /requests/:rId", () => {
  // let token: string;
  // beforeAll(async () => {
  //   const loginResponse: Response = await loginUser(MIKES_LOGIN_DATA);
  //   token = loginResponse.body.token;
  // });
  // beforeEach(async () => {
  //   await seed();
  // });
  // test("Delete an existing request as the creator", async () => {
  //   const httpResponse: Response = await api
  //     .delete(`/api/requests/${MIKES_REQUEST_ID}`)
  //     .set("Authorization", `Bearer ${token}`);
  //   const deleted = await prismaClient.request.findUnique({
  //     where: { id: MIKES_REQUEST_ID },
  //   });
  //   expect(httpResponse.status).toEqual(204);
  //   expect(deleted).toBe(null);
  // });
  // test("Delete an existing request as admin of neighborhood", async () => {
  //   const loginResponse = await loginUser(BOBS_LOGIN_DATA);
  //   const bobToken: string = loginResponse.body.token;
  //   const httpResponse: Response = await api
  //     .delete(`/api/requests/${MIKES_REQUEST_ID}`)
  //     .set("Authorization", `Bearer ${bobToken}`);
  //   const deleted = await prismaClient.request.findUnique({
  //     where: { id: MIKES_REQUEST_ID },
  //   });
  //   expect(httpResponse.status).toEqual(204);
  //   expect(deleted).toBe(null);
  // });
  // test("User cannot delete request if not its creator or admin", async () => {
  //   const loginResponse = await loginUser(ANTONINA_LOGIN_DATA);
  //   const antoninaToken: string = loginResponse.body.token;
  //   const httpResponse: Response = await api
  //     .delete(`/api/requests/${MIKES_REQUEST_ID}`)
  //     .set("Authorization", `Bearer ${antoninaToken}`);
  //   const request = await prismaClient.request.findUnique({
  //     where: { id: MIKES_REQUEST_ID },
  //   });
  //   expect(httpResponse.status).toEqual(401);
  //   expect(request).not.toBe(null);
  // });
  // test("Delete non-existent request fails", async () => {
  //   const NON_EXISTENT_ID = 1000;
  //   const httpResponse: Response = await api
  //     .delete(`/api/requests/${NON_EXISTENT_ID}`)
  //     .set("Authorization", `Bearer ${token}`);
  //   expect(httpResponse.status).toBe(404);
  //   expect(httpResponse.body.error).toBe("No Request found");
  // });
  // test("Invalid requestId fails the deletion", async () => {
  //   const httpResponse: Response = await api
  //     .delete(`/api/requests/${MIKES_REQUEST_ID}foo`)
  //     .set("Authorization", `Bearer ${token}`);
  //   const request = await prismaClient.request.findUnique({
  //     where: { id: MIKES_REQUEST_ID },
  //   });
  //   expect(httpResponse.status).toBe(400);
  //   expect(httpResponse.body.error).toBe("unable to parse data");
  //   expect(request).not.toBe(null);
  // });
  // test("User cannot delete request if they aren't logged in", async () => {
  //   const httpResponse: Response = await api.delete(
  //     `/api/requests/${MIKES_REQUEST_ID}`
  //   );
  //   const request = await prismaClient.request.findUnique({
  //     where: { id: MIKES_REQUEST_ID },
  //   });
  //   expect(httpResponse.status).toEqual(401);
  //   expect(httpResponse.body.error).toBe("user not signed in");
  //   expect(request).not.toBe(null);
  // });
});

// describe("Test for getting a single request at GET /requests/:id", () => {
//   beforeAll(async () => {
//     await seed();
//   });

//   test("GET requests/:id fails when no authorization header present", async () => {
//     const getResponse: Response = await api.get(
//       `/api/requests/${MIKES_REQUEST_ID}`
//     );

//     expect(getResponse.status).toEqual(401);
//     expect(getResponse.body.error).toEqual("user not signed in");
//   });

//   test("GET /requests/:id/ fails when user request not found", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;
//     const INVALID_REQUEST_ID = 1000;

//     const getResponse: Response = await api
//       .get(`/api/requests/${INVALID_REQUEST_ID}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(getResponse.status).toEqual(404);
//     expect(getResponse.body.error).toEqual("No Request found");
//   });

//   test("GET /requests/:id/ fails when user not a member of requests neighborhood", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const getResponse: Response = await api
//       .get(`/api/requests/${RADUS_REQUEST_ID}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(getResponse.status).toEqual(401);
//     expect(getResponse.body.error).toEqual(
//       "user does not have access to the neighborhood"
//     );
//   });

//   test("GET /requests/:id/ works with valid data", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const getResponse: Response = await api
//       .get(`/api/requests/${MIKES_REQUEST_ID}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(getResponse.status).toEqual(200);
//     expect(getResponse.body.user_id).toBe(MIKES_USER_ID);
//     expect(getResponse.body.title).toBe(MIKES_REQUEST_TITLE);
//   });
// });

// describe("Tests for creating a new request at POST /requests", () => {
//   beforeEach(async () => {
//     await seed();
//   });

//   test("POST /requests fails when no token exists", async () => {
//     const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

//     const postResponse: Response = await api.post("/api/requests");

//     const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

//     expect(postResponse.status).toEqual(401);
//     expect(postResponse.body.error).toEqual("user not signed in");

//     expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
//   });

//   test("POST /requests fails when token invalid", async () => {
//     const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

//     const postResponse: Response = await api
//       .post("/api/requests")
//       .set("Authorization", "WrongToken");

//     const numberOfFinalRequests = await testHelpers.getNumberOfRequests();

//     expect(postResponse.status).toEqual(401);
//     expect(postResponse.body.error).toEqual("user not signed in");
//     expect(numberOfInitialRequests).toEqual(numberOfFinalRequests);
//   });

//   test("POST /requests fails when data missing", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

//     // no content
//     const response1 = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ title: "foo", neighborhoodId: BOBS_NHOOD_ID })
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     let numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
//     expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
//     expect(response1.body.error).toEqual(
//       "title, content or neighborhoodId missing or invalid"
//     );

//     // no title
//     const response2 = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ neighborhoodId: BOBS_NHOOD_ID, content: "foo" })
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
//     expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
//     expect(response2.body.error).toEqual(
//       "title, content or neighborhoodId missing or invalid"
//     );

//     // no neighborhoodId
//     const httpResponse = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ title: "foofoo", content: "barbar" })
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
//     expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
//     expect(httpResponse.body.error).toBe(
//       "title, content or neighborhoodId missing or invalid"
//     );
//   });

//   test("POST /requests fails when neighborhood does not exist", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

//     const httpResponse = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         title: "foofoo",
//         content: "barbar",
//         neighborhoodId: INVALID_NHOOD_ID,
//       })
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
//     expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
//     expect(httpResponse.body.error).toBe("Neighborhood does not exist");
//   });

//   test("POST /request fails when content invalid", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

//     const INVALID_TITLE = "foo";
//     const httpResponse = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         title: INVALID_TITLE,
//         content: "barbar",
//         neighborhoodId: BOBS_NHOOD_ID,
//       })
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     const numberOfFinalRequests = await testHelpers.getNumberOfRequests();
//     expect(numberOfFinalRequests).toEqual(numberOfInitialRequests);
//     expect(httpResponse.body.error).toBe("Invalid title");
//   });

//   test("POST /request fails when user not a member of the neighborhood", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const numberOfInitialRequests = await testHelpers.getNumberOfRequests();

//     const httpResponse = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         title: "foofoo",
//         content: "barbar",
//         neighborhoodId: ANTONINAS_NHOOD_ID,
//       })
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     const numberOfCurrentRequests = await testHelpers.getNumberOfRequests();
//     expect(numberOfCurrentRequests).toEqual(numberOfInitialRequests);
//     expect(httpResponse.body.error).toBe("User is not a member of neighborhood");
//   });

//   test("POST /request succeeds with valid data", async () => {
//     const loginResponse = await loginUser(BOBS_LOGIN_DATA);
//     const { token } = loginResponse.body;

//     const numOfInitialRequests = await testHelpers.getNumberOfRequests();

//     const bobsInitalRequests = await testHelpers.getRequestsOfUser(
//       BOBS_USER_ID
//     );
//     const initialNumOfBobsRequests = bobsInitalRequests.length;

//     const initialNeighborhoodRequests =
//       await testHelpers.getNeighborhoodRequests(BOBS_NHOOD_ID);
//     const numOfInitialNeighborhoodReuqests = initialNeighborhoodRequests.length;

//     const httpResponse = await api
//       .post("/api/requests")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         title: "foofoo",
//         content: "barbar",
//         neighborhoodId: BOBS_NHOOD_ID,
//       })
//       .expect(201)
//       .expect("Content-Type", /application\/json/);

//     const numOfFinalRequests = await testHelpers.getNumberOfRequests();
//     const bobsFinalRequests = await testHelpers.getRequestsOfUser(BOBS_USER_ID);
//     const finalNumOfBobsRequests = bobsFinalRequests.length;
//     const bobsRequestContentsAfterCreation = bobsFinalRequests.map(
//       (req) => req.content
//     );

//     const finalNeighborhoodRequests = await testHelpers.getNeighborhoodRequests(
//       BOBS_NHOOD_ID
//     );
//     const numOfFinalNeighborhoodRequests = finalNeighborhoodRequests.length;
//     const neighborhoodsReqTitlesAfterCreation = finalNeighborhoodRequests.map(
//       (req) => req.title
//     );

//     expect(httpResponse.body.neighborhood_id).toEqual(BOBS_NHOOD_ID);
//     expect(httpResponse.body.user_id).toEqual(BOBS_USER_ID);
//     expect(httpResponse.body.title).toEqual("foofoo");
//     expect(httpResponse.body.content).toEqual("barbar");
//     expect(httpResponse.body.status).toEqual("OPEN");
//     expect(httpResponse.body.time_created).toBeDefined();

//     expect(numOfFinalRequests).toEqual(numOfInitialRequests + 1);
//     expect(finalNumOfBobsRequests).toEqual(initialNumOfBobsRequests + 1);
//     expect(bobsRequestContentsAfterCreation).toContain("barbar");

//     expect(numOfFinalNeighborhoodRequests).toEqual(
//       numOfInitialNeighborhoodReuqests + 1
//     );
//     expect(neighborhoodsReqTitlesAfterCreation).toContain("foofoo");
//   });
// });
