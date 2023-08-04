FROM ghcr.io/puppeteer/puppeteer:21.0.1

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

