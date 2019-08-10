FROM node:10-alpine

WORKDIR /app

RUN apk --update --no-cache add bind bind-tools

COPY package*.json ./

RUN npm install

COPY ./config ./config
COPY ./src ./src

EXPOSE 53 80

CMD ["node", "./src/server.js"]