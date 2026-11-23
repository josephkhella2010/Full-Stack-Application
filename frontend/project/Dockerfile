
# Use Node.js 22
FROM node:22-slim

# Set working directory
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3012

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3012"]
