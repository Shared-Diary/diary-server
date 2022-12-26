FROM node:16

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
# --platform linux/amd64
# docker run -p 3000:3000 -d --rm ImageID