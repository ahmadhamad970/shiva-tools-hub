# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

GitHub Actions / GHCR (automatic Docker build)

1. Enable GitHub Actions for the repository.
2. The workflow `.github/workflows/docker-publish.yml` will build and push images to GitHub Container Registry (GHCR) on pushes to `main` or `ddos-sim-demo`.
3. The `GITHUB_TOKEN` provided by Actions is used to authenticate to GHCR; ensure you grant `packages:write` permissions if your org restricts default tokens.

After the action runs, images will be available at `ghcr.io/<owner>/ddos-sim`.
