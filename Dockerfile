FROM node:16

WORKDIR /app

COPY package.json /app

RUN yarn --frozen-lockfile

COPY . /app

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
# --platform linux/amd64
# docker run -p 3000:3000 -d --rm ImageID