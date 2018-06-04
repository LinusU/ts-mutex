const kAquire = Symbol('aquire')
const kLocked = Symbol('locked')
const kQueue = Symbol('queue')
const kRelease = Symbol('release')

module.exports = class Mutex {
  get locked () {
    return this[kLocked]
  }

  constructor () {
    this[kLocked] = false
    this[kQueue] = []
  }

  [kAquire] () {
    if (this[kLocked] === false) {
      this[kLocked] = true
      return Promise.resolve()
    }

    return new Promise((resolve) => this[kQueue].push(resolve))
  }

  [kRelease] () {
    if (this[kQueue].length) {
      this[kQueue].shift()()
    } else {
      this[kLocked] = false
    }
  }

  use (fn) {
    return this[kAquire]().then(() => {
      return Promise.resolve().then(fn).then(
        (result) => { this[kRelease](); return result },
        (error) => { this[kRelease](); throw error }
      )
    })
  }
}
