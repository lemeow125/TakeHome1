# Notes

A minimal notes app: add text widgets, type, and they persist. Each widget is independent — text is never shared between them, and every save is debounced ~2s before hitting the API.

Built with React, TypeScript, React Query, and Vite.

# Development

## Building
Follow the commands below in order to produce a development build
```bash
npm install
npx msw init public/ --save   # once — drops the service worker script into public/
npm run build
```
Skip `msw` should you wish to opt for a production build instead

## Testing
A very brief testing framework is set up at `src/mocks` which should not require an API
```bash
npx vitest
```
