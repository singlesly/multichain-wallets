FROM node:16.13-alpine3.14

# Build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV MODE prod
RUN chmod a+x ./dist/cli.js && npm link

CMD npm run start:${MODE}
