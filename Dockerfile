FROM node:12 AS builder

WORKDIR /app
COPY ./var/www/front .

RUN yarn install \
  && yarn build


FROM node:12-slim

WORKDIR /app

COPY --from=builder /app/.nuxt/dist ./.nuxt/dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/nuxt.config.ts .
RUN yarn install

CMD yarn start
