FROM node:18-alpine3.14

ENV MODE prod
ENV MIGRATIONS_RUN true
RUN npm i -g yarn

# Build
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build
RUN chmod a+x ./dist/cli.js && npm link
RUN rm -rf ./src

CMD npm run start:${MODE}
