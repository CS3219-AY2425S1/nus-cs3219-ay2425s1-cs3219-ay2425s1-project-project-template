## Layout

This Turborepo includes the following packages/apps:

### Apps

- `web`: another [Next.js](https://nextjs.org/) app
- `api-gateway`: [NestJS](https://nestjs.com/) backend serving as an entry point into microservices
- `questions-service`: [NestJS](https://nestjs.com/) backend handling all questions related functions.

### Packages

- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm install
pnpm dev
```
