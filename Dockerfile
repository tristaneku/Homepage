# BUILDING
FROM node:26-alpine AS build

WORKDIR /app

ENV DB_FILE=file:/tmp/build.db

COPY app/package*.json ./

RUN npm ci

COPY app/ .

RUN npm run build
RUN npm prune --omit=dev


# HOSTING
FROM node:26-alpine

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
ENV DB_FILE=file:/data/local.db

EXPOSE 3000

CMD ["node", "build"]
