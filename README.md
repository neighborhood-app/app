## Setup Instructions:

1. Run `npm install` to install the dependencies in both the frontend folder and the backend folder
2. Install docker desktop https://www.docker.com/products/docker-desktop/
3. Create `.env` file in the `backend` directory using `packages/backend/src/utils/sample.env` and a `test.env` file using `packages/backend/src/utils/test-sample.env`
4. In the backend folder run `npm run start-db` to start (or restart) the database
    - You can re-initialize the db on command line by running `npm run reinitialize-db`. NOTE: THIS WILL DELETE ALL EXISTING DATA FROM THE DEV DATABASE.
    - You can connect to dev db on command line  by running `npm run connect-dev-db`
    - You can connect to test db on command line by running `npm run connect-test-db`
5. In the backend folder run `npm run seed` in order to seed the dabase (this will reset all data stored in the db).
6. In the backend folder `npm run dev` to start the dev server at port 3001
7. In the frontend folder run `npm start` to start the React application on port 3000.

_Other npm scripts are defined in `./package.json`._

### If db schema doesn't load in container:

1. List the container by running `docker ps` and delete the containers by `docker container rm -f <container-name>`
2. List the volumes by running `docker volume ls` and delete the associated volume by `docker volume rm -f <volume-name>`
3. Run `npm run start-db`
