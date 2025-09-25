FROM oven/bun:latest as base

ARG POCKETBASE_URL
ENV POCKETBASE_URL=$POCKETBASE_URL

WORKDIR /app

COPY bun.lockb package.json ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:latest as runner

WORKDIR /app

COPY --from=base /app ./

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]
