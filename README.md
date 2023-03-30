## Setup Instructions:

1. Run `npm install` to install the dependencies
2. Install docker desktop https://www.docker.com/products/docker-desktop/
3. Run `npm run start-db` to start (or restart) the database
    - You can connect to dev db on command line  by running `npm run connect-dev-db`
    - You can connect to test db on command line by running `npm run connect-test-db`
4. Run `npm run dev` to start the dev server at port 3000

_Other npm scripts are defined in `./package.json`._

### If db schema doesn't load in container:

1. List the container by running `docker ps` and delete the containers by `docker container rm -f <container-name>`
2. List the volumes by running `docker volume ls` and delete the associated volume by `docker volume rm -f <volume-name>`
3. Run `npm run start-db`

# Bob Rodes says hello.