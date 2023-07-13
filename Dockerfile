FROM node:18.16-alpine

WORKDIR /usr/wakatime

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

