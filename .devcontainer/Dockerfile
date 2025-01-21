FROM mcr.microsoft.com/devcontainers/typescript-node:latest

USER root
RUN apt update && apt upgrade -y
RUN mkdir -p /site && chown -R node:node /site

WORKDIR /site
USER node