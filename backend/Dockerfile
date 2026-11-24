FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .


EXPOSE 5020

CMD ["npm", "run", "dev"]