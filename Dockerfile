FROM node:22-alpine
WORKDIR /app
COPY Backend/package*.json ./
RUN npm ci --omit=dev
COPY Backend/ .
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "src/server.js"]
