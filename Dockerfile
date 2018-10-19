FROM node:10.12-alpine
MAINTAINER twiage

RUN mkdir /opt/twiage

WORKDIR /opt/twiage

COPY . /opt/twiage

RUN yarn install --production

CMD ["yarn", "start"]
