#!/bin/bash
docker compose down -v

docker compose up --build -d

echo "Waiting 10 sec for the database to be ready..."
sleep 10
echo "Database is ready!"

npm run prepare-test

npm run dev