FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

ENV PORT=80
EXPOSE 80

CMD ["sh", "-c", "npx serve -s dist -l tcp://0.0.0.0:${PORT:-80}"]
