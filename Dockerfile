FROM node:16

WORKDIR /usr/src/app
COPY ./ ./

# Make build footprint version for easier debugging.
RUN rm ./version.txt
RUN openssl rand -hex 12 > version.txt

RUN rm -rf ./build
RUN npm ci
RUN npm run build

# Install local packages for running server.
RUN npm install dotenv
RUN npm install pm2 -g

EXPOSE 8082
CMD ["pm2-runtime","build/server.js"]
