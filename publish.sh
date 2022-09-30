rm -r -f ./build
npm ci
npm run build
docker build -t coda-stats-api:latest .

docker tag coda-stats-api:latest coda/coda-stats-api:latest
docker push coda/coda-stats-api:latest
echo "Finished running script sleeping 30s"
sleep 30