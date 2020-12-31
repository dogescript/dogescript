FROM dogescript/dogescript:2.4.0

RUN npm i express
COPY app.djs /app.djs

ENTRYPOINT ["dogescript", "/app.djs", "--run"]
