FROM node:20-alpine3.19 as build-stage

WORKDIR /app

COPY package.json .

COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

COPY . .

RUN pnpm  build

# production stage
FROM node:20-alpine3.19 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/pnpm-lock.yaml /app/pnpm-lock.yaml

WORKDIR /app

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install --production

EXPOSE 3000

CMD ["node", "main"]
