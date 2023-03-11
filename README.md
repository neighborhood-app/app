Setup Instructions:
1. Install docker desktop https://www.docker.com/products/docker-desktop/
2. Run docker-compose -f db_init.yaml up;
3. Open browser at localhost:8080;
4. Login
  System: PostgreSQL
  User: postgres
  Password: example

If db schema doesn't load in container:
1. Delete the container.
2. Delete the associated volume.
3. Run docker-compose -f db_init.yaml up;