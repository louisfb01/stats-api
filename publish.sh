rm -r -f ./build

docker build -t coda19-stats-api:latest .

docker tag coda19-stats-api:latest coda19/coda19-stats-api:latest
docker push coda19/coda19-stats-api:latest
echo "Finished running script sleeping 30s"
sleep 30