## meli.js

Simple meli.js installation via npm. Suitable for modern web apps that use build systems such as Webpack.

The full meli.js script lives on our CDN at:

https://meli-tour.vercel.app/bundle.min.js

This module exports the `meli` object, which supports all of neli.js' methods. The meli.js script is automatically injected into the current page when a method is called. Method calls are queued if meli.js is not loaded yet.

## Installation

```sh
npm install meli.js
```

## Usage

Simply `import meli from 'meli.js'` and use it. Example:

```js
import meli from "meli.js";

meli.init("MELI_TOKEN");

meli.auth("USER_ID", {
  name: "USER_NAME",
  email: "USER_EMAIL",
  created_at: "USER_CREATED_AT", // ISO 8601 format
});
```

You can find your meli.js Token on Meli under [Workspace settings -> Environments](https://www.meli-ai.com/dashboard/workspace). Note that if you have multiple environments (e.g. Production and Staging) that each environment has a unique token.

Check out the [development docs](https://docs.meli-ai.com/introduction) for more info.

## API Reference

See the [meli.js API Reference](https://docs.meli-ai.com/api-reference/introduction).

## Importing meli.js from multiple modules

You can import `userflow` from multiple files in your app. It will always refer to the same instance. The meli.js script will only be loaded once.

```js
// App.js
import meli from "meli.js";

meli.init("MELI_TOKEN");

// AuthRoute.js
import meli from "meli.js";

meli.auth(user.id, {
  name: user.name,
});
```

## TypeScript support

This package contains TypeScript definitions of the `meli` object.

## Developing userflow.js

Install dev dependencies:

```sh
pnpm install
```

To use package locally, run:

```sh
pnpm dev_publish
```

To build, run:

```sh
pnpm run build
```

This will produce:

- `out/bundle.min.js`: Bundlers supporting ES modules can use this.
