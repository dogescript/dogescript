# Developers

Notes for developers of the language.

## Build

1. `npm run build`

## Debugging

### VSCode

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Build",
      "program": "${workspaceFolder}/build.js",
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    },
  ]
}
```