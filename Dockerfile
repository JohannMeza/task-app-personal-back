# --------------- Stage 1: Build ---------------
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./
RUN pnpm install
COPY . .
RUN pnpm build:auth

# --------------- Stage 2: Runtime ---------------
FROM node:22-alpine
WORKDIR /app 
RUN corepack enable
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./
RUN pnpm install --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/apps/auth-service/main.js"]