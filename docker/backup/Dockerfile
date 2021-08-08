FROM node:16.5-alpine3.11

WORKDIR /devops

COPY ./package.json .
COPY ./packages/server/package.json ./packages/backup/
COPY ./packages/common/package.json ./packages/common/

RUN npm i -g yarn --force
RUN yarn --production

COPY ./packages/backup/dist ./packages/backup/dist
COPY ./packages/common/dist ./packages/common/dist
COPY ./packages/backup/config ./packages/backup/config

WORKDIR /devops/packages/backup

CMD yarn start