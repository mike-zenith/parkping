FROM node:6.2

RUN apt-get update \
    && mkdir -p /www/api \
    && DEBIAN_FRONTEND="noninteractive" apt-get install -y --force-yes \
        curl \
        unzip \
        syslog-ng \
    && npm install -g pm2

WORKDIR /www/api
ADD . /www/api

COPY server/default_syslog-ng /etc/default/syslog-ng
COPY server/syslog-ng.conf /etc/syslog-ng/syslog-ng.conf

CMD ["./scripts/bootup.sh"]

EXPOSE 3000
