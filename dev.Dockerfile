FROM node:12.2.0-alpine

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

EXPOSE 5000

CMD ["npm","run","dev"]