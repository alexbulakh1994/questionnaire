FROM node:20 AS base

WORKDIR /usr/src/app
COPY package*.json ./

RUN apk update && apk add bash && npm install & npm install -g prisma@latest
COPY . .
RUN npm run build & prisma generate

COPY docker/entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]