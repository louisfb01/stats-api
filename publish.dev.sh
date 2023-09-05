rm -r -f ./build
npm ci
npm run build
docker build -t coda19-stats-api:dev .

docker tag coda19-stats-api:dev coda19/coda19-stats-api:dev
docker push coda19/coda19-stats-api:dev
echo "Finished running script sleeping 30s"
sleep 30