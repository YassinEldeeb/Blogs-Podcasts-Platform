#!/bin/bash

docker start postgres ||
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=superPassword -e POSTGRES_DB=prisma-pg -d postgres

docker start redis ||
docker run --name redis -p 6379:6379 -d redis
