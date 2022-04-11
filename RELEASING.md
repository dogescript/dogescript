# releasing

Instructions for releasing.

1. `npm run build`
2. `git tag ${VERSION}`
3. `git push origin --tags`
4. `npm publish .`