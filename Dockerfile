FROM denoland/deno:2.0.4

EXPOSE 8080

WORKDIR /app

COPY . .
RUN deno install && deno cache src/index.ts && deno task build:doc

USER deno

CMD ["run", "--allow-all", "src/index.ts"]