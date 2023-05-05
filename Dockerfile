FROM node:18-alpine3.14

# Build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
ENV MODE prod
RUN chmod a+x ./dist/cli.js && npm link
RUN rm -rf ./src

CMD npm run start:${MODE}
