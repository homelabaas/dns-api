FROM node:10-alpine

WORKDIR /app

RUN apk --update add bind

COPY package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 53 80

CMD ["node", "./src/server.js"]