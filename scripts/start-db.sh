#!/bin/bash

#Stops and then starts db container through the docker-compose file

docker compose -f docker-compose.dev.yaml down

docker compose -f docker-compose.dev.yaml up