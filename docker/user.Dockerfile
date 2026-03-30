FROM node:18-alpine
WORKDIR /app
COPY user-service/package.json .
RUN npm install
COPY user-service/ .
EXPOSE 3001
CMD ["node", "server.js"]
