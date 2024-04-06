FROM node:20-alpine3.19

ENV MODE prod
ENV MIGRATIONS_RUN true

# Build
WORKDIR /app
COPY package*.json ./
COPY yarn* ./
RUN yarn
COPY . .
RUN yarn build
RUN chmod a+x ./dist/cli.js && npm link
RUN rm -rf ./src

CMD npm run start:${MODE}
