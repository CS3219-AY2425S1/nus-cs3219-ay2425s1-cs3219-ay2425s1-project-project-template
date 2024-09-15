# Frontend folder structure

> **Note:** We are using Next.js App Router, not Page Router.

```
frontend/
  ├── app/
  │   ├── layout.tsx            // Layout component
  │   ├── page.tsx              // Root page
  │   ├── error.tsx             // Error boundary component 
  │   ├── not-found.tsx         // 404 page
  │   ├── about/
  │   │   └── page.tsx          // About page
  │   ├── contact/
  │   │   └── page.tsx          // Contact page
  │   └── [slug]/
  │       └── page.tsx          // Dynamic route page
  ├── components/               // Reusable UI components
  │   ├── Header.tsx
  │   ├── Footer.tsx
  │   └── Button.tsx
  ├── lib/                      // Library code and utilities
  │   ├── api.ts
  │   ├── fetcher.ts
  │   └── utils.ts
  ├── hooks/                    // Custom React hooks
  │   ├── useAuth.ts
  │   ├── useFetch.ts
  │   └── useForm.ts
  ├── styles/                   // CSS or styled-components
  │   ├── globals.css
  │   └── theme.css
  ├── public/                   // Static assets (e.g., images)
  │   └── images/
  ├── types/                    // TypeScript types and interfaces
  │   ├── index.d.ts
  │   └── models.ts
  └── next.config.js            // Next.js configuration

```

## 1. Build the Docker image

Ensure you are in the frontend directory

```sh
docker build -t frontend .
```

## 2. Run the container

macOS users:

```sh
docker run --name my-app -p 3000:3000 -v $(pwd):/app -d frontend
```

Windows users:

```sh
docker run --name my-app -p 3000:3000 -v %cd%:/app -d frontend
```

## 3. Access the application

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)

## 4. Terminate the application

```sh
docker stop my-app
docker rm my-app
```
