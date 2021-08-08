FROM node:16.5-alpine3.11

WORKDIR /devops

COPY ./package.json .
COPY ./packages/server/package.json ./packages/server/
COPY ./packages/common/package.json ./packages/common/

RUN npm i -g yarn --force
RUN yarn --production

COPY ./packages/server/dist ./packages/server/dist
COPY ./packages/common/dist ./packages/common/dist
COPY ./packages/server/config ./packages/server/config
COPY ./packages/server/prisma ./packages/server/prisma

WORKDIR /devops/packages/server

RUN npx prisma generate

EXPOSE 4000

CMD yarn prisma-push-prod && yarn start