FROM node:10-slim

LABEL com.github.actions.name="Primer deploy"
LABEL com.github.actions.description="Deploy to now with branch and tag aliases"
LABEL com.github.actions.icon="triangle"
LABEL com.github.actions.color="black"

LABEL version="2.0.1"
LABEL repository="http://github.com/primer/actions"
LABEL homepage="http://github.com/primer/actions/tree/master/deploy"
LABEL maintainer="GitHub Design Systems <design-systems@github.com>"

COPY . /
WORKDIR /
RUN ["npm", "install", "--production"]

ENTRYPOINT ["/entrypoint.js"]
