This is a signalling server that is used to establish WebRTC connections between users. It is built using Node.js and Socket.IO.

## Getting Started

First, install the dependencies:

```bash
npm install -g pnpm

pnpm install --frozen-lockfile

# if pnpm install --frozen-lockfile fails, try running
pnpm install
```

Then, follow the `.env.example` file and create a `.env` file in the current directory. Replace the necessary values within.

```bash
PORT=4444
```

First, run the development server:

```bash
pnpm dev
```

## Build Dockerfile (TODO)
