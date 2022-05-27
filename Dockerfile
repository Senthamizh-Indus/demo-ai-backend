
# ==================================================
# Build Layer
FROM node:14-slim as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --non-interactive

COPY . .

RUN npm run build

#==================================================
# Package install Layer
FROM node:14-slim as node_modules

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

#==================================================
# Run Layer
FROM gcr.io/distroless/nodejs:14

WORKDIR /app

COPY ./src /app
COPY --from=node_modules /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 5000

CMD ["dist/index.js"]
