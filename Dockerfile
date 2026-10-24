FROM denoland/deno:alpine-2.1.9

WORKDIR /app

# Copy dependency files first
COPY deno.json deno.lock ./
COPY src/ ./src/
COPY static/ ./static/
COPY .env ./

# Cache dependencies
RUN deno cache src/main.ts

EXPOSE 8000

CMD ["serve", "--allow-env", "--allow-net", "-R", "--unstable-cron", "--port", "8000", "src/main.ts"]
