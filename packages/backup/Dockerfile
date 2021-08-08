FROM node:16.5-alpine3.11

RUN npm i yarn -g --force

COPY yarn.lock ./

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build

CMD yarn start