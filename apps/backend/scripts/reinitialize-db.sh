#!/bin/bash

# removes the volume and container and then creates a fresh volume and container
# removes all data and initialized db with no tables

docker compose -f docker-compose.dev.yaml down --volumes

docker compose -f docker-compose.dev.yaml up