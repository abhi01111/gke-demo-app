FROM node:18-alpine
WORKDIR /app
COPY product-service/package.json .
RUN npm install
COPY product-service/ .
EXPOSE 3002
CMD ["node", "server.js"]
