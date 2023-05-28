## Setup Instructions:

1. Run `npm install` to install the dependencies in all linked apps.
2. Install docker desktop https://www.docker.com/products/docker-desktop/
3. Create `.env` file in the `apps/backend` directory using `apps/backend/src/utils/sample.env` and a `test.env` file using `apps/backend/src/utils/test-sample.env`.
4. Run `npm run server` to start (or restart) the db and backend server on port 3001.
    - You can re-initialize the db on command line by running `npm run reinitialize-db -w apps/backend`. NOTE: THIS WILL DELETE ALL EXISTING DATA FROM THE DEV DATABASE.
    - You can connect to dev db on command line  by running `npm run connect-dev-db -w apps/backend`
    - You can connect to test db on command line by running `npm run connect-test-db -w apps/backend`
5. Run `npm run seed-db` in order to seed the database (this will reset all data stored in the db).
7. Run `npm run client` to start the frontend server on port 3000.

_Other npm scripts are defined in `./package.json`, `apps/backend/package.json` and `apps/frontend/package.json`._

### If db schema doesn't load in container:

1. List the container by running `docker ps` and delete the containers by `docker container rm -f <container-name>`.
2. List the volumes by running `docker volume ls` and delete the associated volume by `docker volume rm -f <volume-name>`.
3. Run `npm run start-db -w apps/backend`.
