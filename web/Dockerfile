FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i --frozen-lockfile
COPY . .
CMD ["pnpm","dev","--","--host","0.0.0.0"]
