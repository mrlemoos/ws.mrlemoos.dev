# mrlemoos/ws

This project is a small **edge-computing** service for the implementation of web 
sockets with ease.

The service exposes a HTTP route that allows the integration with the event 
source monitored by the web socket. See the contract for it below:

```http
POST {{host}}/events
Authorization: Bearer {{token}}

{
  "event": "My event name",
  "data": {
    "message": "my custom data"
  }
}
```

## Framework 🎞️

This application uses [nitro](https://nitro.unjs.io) to utilise an agonistic approach, 
allowing this project to run either on the edge or on Node.js or any other 
JavaScript/TypeScript platform. If you want to get to know further about **nitro**, 
take a look and learn from their official [quick start guide](https://nitro.unjs.io/guide#quick-start).

## Contributing & Development 💬

To start the development environment, you must fulfill the following prerequirements:

- Any of the following JavaScript runtimes: 
  - [Node.js](https://nodejs.org) (>= **20.15.0**)
  - [Bun.sh](https://bun.sh) (>= **1.1.21**)
- [pnpm](https://pnpm.io) (>= **9.6.0**)

**a. install the dependencies** with [pnpm](https://pnpm.io)

```sh
pnpm install
```

**b. create .env file**

```sh
cp .env.example .env
```

**c. run** the development server

```sh
pnpm run dev
```

## Testing 🔬

If you'd like to use a HTTP client to test the service, we encourage you to take
a look at [Yaak](https://yaak.app). If you choose to use it, you can **import**
the Yaak schema into your workspace by selecting `e2e/yaak.yaak.json`.
