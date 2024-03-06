FROM node:18-alpine3.14

ENV MODE prod
ENV MIGRATIONS_RUN true

# Build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
RUN chmod a+x ./dist/cli.js && npm link
RUN rm -rf ./src

CMD npm run start:${MODE}
