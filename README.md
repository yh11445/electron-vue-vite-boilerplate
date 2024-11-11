<div align="center">

# Electron Vue Vite Boilerplate

A simple starter boilerplate for a **Vue3** + **Electron** TypeScript based application, including **ViteJS** and **Electron Builder**.

</div>

## About

This template is based on the [electron-vue-template](https://github.com/Deluze/electron-vue-template) created by Deluze. I've enhanced and extended it to include additional functionality and optimizations for streamlined development. This version is tailored for more advanced use cases, incorporating improvements in performance, configuration, and usability for Electron and Vue.js projects.

## Getting started

Click the green **Use this template** button on top of the repository, and clone your own newly created repository.

### Install dependencies ⏬

```bash
yarn install
```

### Start developing ⚒️

```bash
yarn dev
```

## Additional Commands

```bash
yarn dev # starts application with hot reload
yarn electron-build # builds application, distributable files can be found in "dist" folder

# OR

yarn electron-build:win # uses windows as build target
yarn electron-build:mac # uses mac as build target
yarn electron-build:linux # uses linux as build target
```

Optional configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).

## Project Structure

```bash
- scripts/ # all the scripts used to serve your application, change as you like.
- src/
  - electron/ # Main thread (Electron application source)
  - renderer/ # Renderer thread (VueJS application source)
```

## Using static files

If you have any files that you want to copy over to the app directory after installation, you will need to add those files in your `src/electron/static` directory.

Files in said directory are only accessible to the `main` process, similar to `src/renderer/public` only being accessible to the `renderer` process. Besides that, the concept is the same as to what you're used to in your front-end projects.

#### Referencing static files from your electron main process

```ts
/* Assumes src/electron/static/myFile.txt exists */

import { app } from 'electron'
import { join } from 'path'
import { readFileSync } from 'fs'

const path = join(app.getAppPath(), 'static', 'myFile.txt')
const buffer = readFileSync(path)
```
