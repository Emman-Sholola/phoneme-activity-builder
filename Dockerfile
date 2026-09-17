FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Prisma requires DATABASE_URL while loading prisma.config.ts.
# This value is only used while building the image.
# Docker Compose supplies the runtime database URL later.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/phoneme_builder"

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]