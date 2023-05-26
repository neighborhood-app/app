#!/bin/bash

# removes the volume and container and then creates a fresh volume and container

docker compose -f docker-compose.dev.yaml down --volumes

docker compose -f docker-compose.dev.yaml up