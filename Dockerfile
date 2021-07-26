FROM node:16.5-alpine3.11

COPY package*.json ./

RUN npm i yarn -g --force

RUN yarn

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD yarn prisma-push-prod && npm run start