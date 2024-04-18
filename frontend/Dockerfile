# build stage
FROM node:20-alpine3.19 as build-stage

WORKDIR /app

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

COPY . .

RUN pnpm build

# production stage
FROM nginx:stable as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
