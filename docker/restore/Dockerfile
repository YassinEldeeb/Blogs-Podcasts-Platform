FROM node:16.5-alpine3.11

WORKDIR /devops

COPY ./package.json .
COPY ./packages/restore/package.json ./packages/restore/
COPY ./packages/common/package.json ./packages/common/

RUN npm i -g yarn --force
RUN yarn --production

COPY ./packages/restore/dist ./packages/restore/dist
COPY ./packages/common/dist ./packages/common/dist
COPY ./packages/restore/config ./packages/restore/config

WORKDIR /devops/packages/restore

CMD yarn start