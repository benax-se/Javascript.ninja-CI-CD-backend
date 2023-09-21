FROM node:14.17.0

RUN npm install -g npm@latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD [ "./bin/start.sh" ]
