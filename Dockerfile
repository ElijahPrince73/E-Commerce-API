FROM node:12.2.0-alpine

WORKDIR /app

COPY package.json /app/package.json

RUN npm ci --only=production

COPY . /app

EXPOSE 5000

CMD ["npm","run","start"]