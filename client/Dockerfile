FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN yarn install --production=true

COPY ./ ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
