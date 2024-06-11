FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN rm -rf src && rm -rf node_modules && npm install --production
FROM node:alpine
WORKDIR /app
COPY --from=0 /app/dist ./dist
COPY --from=0 /app/package.json ./
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/data ./data
EXPOSE 3000
CMD ["npm", "run", "serve"]
