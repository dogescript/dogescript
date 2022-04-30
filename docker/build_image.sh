VERSION=$(node -p "require('../package.json').version")
docker build . -t dogescript/dogescript:${VERSION} -t dogescript/dogescript:latest
