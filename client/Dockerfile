FROM node:15.9.0

WORKDIR /usr/src/app

COPY package.json  /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
RUN yarn install

COPY . /usr/src/app

EXPOSE 3000
