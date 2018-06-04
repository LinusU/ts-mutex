# Mutex

A very simple Mutex, with an easy to use API and excellent TypeScript typings.

## Installation

```sh
npm install --save ts-mutex
```

## Usage

```js
import Mutex = require('mutex')

const lock = new Mutex()

// Only one request will be sent at a time

lock.use(async () => {
  console.log((await fetch('https://google.com/')).code)
})

lock.use(async () => {
  console.log((await fetch('https://twitter.com/')).code)
})

lock.use(async () => {
  console.log((await fetch('https://facebook.com/')).code)
})
```

## API

### `new Mutex()`

Creates a new `Mutex` instance.

### `Mutex#locked: boolean`

Whether the mutex is currently locked or not.

### `Mutex#use<T> (fn: () => T | PromiseLike<T>): Promise<T>`

Aquire the lock, then execute (possibly async) function `fn`, and finally release the lock. Returns a `Promise` of whatever the function `fn` returns.

The lock will be released even if `fn` throws or returns a rejected `Promise`. In this case, the `Promise` returned will also be rejected with that error.
