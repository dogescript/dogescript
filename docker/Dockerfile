FROM node:14-alpine

LABEL maintainer="dogescript.lang@gmail.com"

# RUN apk add git

# WORKDIR /code
# RUN git clone https://github.com/dogescript/dogescript

# WORKDIR /code/dogescript
# RUN git checkout master

# RUN npm install
# RUN npm run build
# RUN npm link .


RUN npm install -g dogescript
ENTRYPOINT ["dogescript"]
