/* eslint-env mocha */

const Mutex = require('./')

const assert = require('assert')
const assertRejects = require('assert-rejects')
const pSleep = require('p-sleep')

describe('ts-mutex', () => {
  let mutex

  beforeEach(() => { mutex = new Mutex() })

  it('locks', () => {
    return mutex.use(() => {
      assert.strictEqual(mutex.locked, true)
    }).then(() => {
      assert.strictEqual(mutex.locked, false)
    })
  })

  it('gives return value', () => {
    return mutex.use(() => 1).then((actual) => {
      assert.strictEqual(mutex.locked, false)
      assert.strictEqual(actual, 1)
    })
  })

  it('handles throw', () => {
    return assertRejects(
      mutex.use(() => { throw new Error('V8NJLRC9PW') }),
      (err) => (err.message === 'V8NJLRC9PW')
    ).then(() => {
      assert.strictEqual(mutex.locked, false)
    })
  })

  it('allows only one', () => {
    let current = 0

    const a = mutex.use(() => {
      current += 1
      assert.strictEqual(current, 1)

      return pSleep(5).then(() => {
        current -= 1
        assert.strictEqual(current, 0)
      })
    })

    const b = mutex.use(() => {
      current += 1
      assert.strictEqual(current, 1)

      return pSleep(5).then(() => {
        current -= 1
        assert.strictEqual(current, 0)
      })
    })

    const c = mutex.use(() => {
      current += 1
      assert.strictEqual(current, 1)

      return pSleep(5).then(() => {
        current -= 1
        assert.strictEqual(current, 0)
      })
    })

    return Promise.all([a, b, c])
  })

  it('respects order', () => {
    const events = []

    const a = mutex.use(() => { events.push('a') })
    const b = mutex.use(() => { events.push('b') })
    const c = mutex.use(() => { events.push('c') })

    return Promise.all([a, b, c]).then(() => {
      assert.deepStrictEqual(events, ['a', 'b', 'c'])
    })
  })
})
