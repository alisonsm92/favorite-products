FROM node:14.17-alpine

WORKDIR /usr/src/app
ADD . /usr/src/app/

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]