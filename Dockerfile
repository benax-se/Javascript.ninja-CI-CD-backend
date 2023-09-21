FROM node:14.17.0


RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

EXPOSE 3000

CMD [ "./bin/start.sh" ]
