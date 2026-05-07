FROM node:24-alpine AS builder

WORKDIR /bot

COPY pnpm-lock.yaml ./
COPY package.json ./

ENV HUSKY=0

RUN npm install -g pnpm && pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run build

FROM node:24-alpine

WORKDIR /bot

COPY --from=builder /bot/dist ./dist
COPY --from=builder /bot/node_modules ./node_modules

RUN cat <<EOF > package.json
{
  "name": "whong",
  "version": "0.0.0",
  "private": true
}
EOF

RUN npm install -g cloudflared

COPY ci/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000

CMD ["/start.sh"]
