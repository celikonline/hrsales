FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && mkdir /app/data && chown node:node /app/data
COPY --from=build /app/dist ./dist
COPY server ./server
COPY shared ./shared
USER node
ENV HOST=0.0.0.0 PORT=4173 SERVE_DIST=true
EXPOSE 4173
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:4173/api/catalog').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/index.js"]
