# dogescript

Docker images for the [dogescript](http://dogescript.io/) language

## Usage

```bash
# repl
docker run -it dogescript/dogescript:latest
# transpiler
docker run -v ${PWD}/samples:/samples dogescript/dogescript:latest /samples/fizzbuzz.djs --beautify > fizzbuzz.js
# interpreter
docker run -v ${PWD}/samples:/samples dogescript/dogescript:latest /samples/fizzbuzz.djs --run
```

## Extending

### Sample Express

This sample uses `express` and a small app written in dogescript to launch a containerized app

_app.djs_
```dogescript
so express 

very app is plz express
very port is 3000

app dose get with '/' much req res
  res dose send with 'Wow we are running dogescript in a container'
wow&

such listenMsg
  console dose loge with 'dogexpress http://localhost:3000'
wow

app dose listen with 3000 listenMsg
```

```Dockerfile
FROM dogescript/dogescript:2.4.0

RUN npm i express
COPY app.djs /app.djs

ENTRYPOINT ["dogescript", "/app.djs", "--run"]
```

Build and run!
```bash
docker build . -t myapp
docker run -p 3000:3000 myapp
```
