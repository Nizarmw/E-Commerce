FROM node:23.11-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env .env

RUN npm run build

FROM node:23.11-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY vite.config.* ./

COPY .env .env
EXPOSE 3000

CMD ["npm", "run" , "preview"]