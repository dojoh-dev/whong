FROM node:24-alpine AS builder

WORKDIR /bot

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:24-alpine

WORKDIR /bot

COPY --from=builder /bot/dist ./dist
COPY --from=builder /bot/node_modules ./node_modules
COPY --from=builder /bot/package.json ./

RUN npm install -g cloudflared

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000

# CMD ["/start.sh"]
CMD ["while true; do sleep 1; done"]
