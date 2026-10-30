# ---- Build the React client ----
FROM node:22-alpine AS frontend-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
# The client reads VITE_API_BASE_URL; empty means it calls relative /api
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build


# ---- Run the backend, which also serves the built client ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./
# Vite -> dist ; Create React App -> build
COPY --from=frontend-build /app/client/dist ./public

RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
