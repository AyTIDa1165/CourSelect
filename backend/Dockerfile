FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY ./prisma ./prisma

RUN npm install && npx prisma generate

COPY . .

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]