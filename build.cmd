docker build -t coda-stats-api:latest .
docker run --rm -d -p 8082:8082 --network bridge ^
    coda-stats-api:latest