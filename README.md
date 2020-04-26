[![Build Status](https://travis-ci.com/joaomede/api-doc-js-sdk.svg?branch=master)](https://travis-ci.com/joaomede/api-doc-js-sdk) [![codecov](https://codecov.io/gh/joaomede/api-doc-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/joaomede/api-doc-js-sdk)

# Api Doc - JS SDK

Official repository of the SDK used in the "[Api Doc](https://github.com/Api-Doc)" project, this SDK consists of an abstraction of the Api-Doc rules, it contains Knex as a base, and has migration encapsulated within itself, with that, the user will be free to be an independent project from Expressjs, which is the base where the official Api Rest was built

## Rule-Permission DER

![Rule-Permission](./documentation/Rule-Permissions.png)

## Install

```sh
$ npm install api-doc-js-sdk
or
$ yarn add install api-doc-js-sdk
```

## Setup

The "Api Doc - SDK" uses the knex as a base, so the whole mechanism behind it is based on knex, including its settings format.

```javascript
import ApiDoc from "api-doc-js-doc";

const config = {
  dev: {
    client: "pg",
    connection: {
      port: process.env.PORTDB,
      host: process.env.HOSTDB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    pool: { min: 0, max: 10, idleTimeoutMillis: 500 },
  },
};

export default new ApiDoc(config.dev, "TheApiSecretKey");
```

## Import the Instance and Use It

```javascript
import apiDoc from "../config/api";

const name = "name";
const email = "email@teste.com";
const password = "passwordTest";

// Async Await / Try Catch
async function newUserAsyncAwait() {
  try {
    const user = await apiDoc.userRegister(name, email, password);
    console.log(user); // return new user
  } catch (error) {
    console.log(error.message); // return an eventual error
  }
}

// Then Catch
apiDoc
  .userRegister(name, email, password)
  .then((newUser) => {
    console.log(newUser); // return new user
  })
  .catch((err) => {
    console.log(err); // return an eventual error
  });
```

## What other methods can I use?

All other examples can be seen in the [Api Doc](https://github.com/Api-Doc), there the SDK is 100% used.
