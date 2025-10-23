FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci || true
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
