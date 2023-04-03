## Setup Instructions:

1. Run `npm install` to install the dependencies
2. Install docker desktop https://www.docker.com/products/docker-desktop/
3. Run `npm run start-db` to start (or restart) the database
    - You can re-initialize the db on command line by running `npm run reinitialize-db.sh`. NOTE : THIS WILL DELETE ALL EXISTING DATA FROM THE DEV DATABASE.
    - You can connect to dev db on command line  by running `npm run connect-dev-db`
    - You can connect to test db on command line by running `npm run connect-test-db`
4. Run `npm run seed` in order to seed the dabase (this will reset all data stored in the db).
5. Run `npm run dev` to start the dev server at port 3000

_Other npm scripts are defined in `./package.json`._

### If db schema doesn't load in container:

1. List the container by running `docker ps` and delete the containers by `docker container rm -f <container-name>`
2. List the volumes by running `docker volume ls` and delete the associated volume by `docker volume rm -f <volume-name>`
3. Run `npm run start-db`

## Prisma 
1. Run `npx prisma generate` if this is the first time setting up Prisma.
2. Run `npx prisma db seed` to seed the database;
2. Check out the db using `npx prisma studio`;
3. To reset the database run `npx prisma migrate reset`.