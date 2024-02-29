
FROM node:lts-alpine
USER root
RUN apk add --update openssl && \
    rm -rf /var/cache/apk/* \
USER node
RUN npm install --global smee-client
ENTRYPOINT ["smee"]
CMD ["--help"]