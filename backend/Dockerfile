FROM node:lts-buster-slim

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY pnpm-lock.yaml /usr/src/app/pnpm-lock.yaml
RUN corepack enable && pnpm i

COPY . /usr/src/app

ENV BACKEND_PORT 3000
ENV BACKEND_MONGO_URL mongodb://mongodb:27017/hotel

EXPOSE 3000

CMD [ "npm", "run", "dev" ]