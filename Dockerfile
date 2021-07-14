FROM node:latest

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npx tsc

EXPOSE 4000

CMD npx prisma db push && npm run start