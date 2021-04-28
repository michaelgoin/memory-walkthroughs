'use strict'

const util = require('util')

const setTimeoutPromise = util.promisify(setTimeout)

async function testPromises() {
  await doWork(2)

  // avoid promise because we are tracking those.
  setTimeout(() => {
    forceGC()
  }, 2000)
}

async function doWork(timeoutMs = 0) {
  await setTimeoutPromise(timeoutMs)
}

function setupAsyncTracking() {
  const asyncHooks = require('async_hooks')

  const idMap = new Map()

  const hook = asyncHooks.createHook({
    init: function initHook(id, type, triggerId, resource) {

      // Only care about promises for this test
      if (type !== 'PROMISE') {
        return
      }

      log('init - id: %s, triggerId: %s', id, triggerId)
      idMap.set(id)
    },

    before: function beforeHook(id) {
      if(!idMap.has(id)) {
        return
      }

      log('before - id: %s', id)
    },
    after: function afterHook(id) {
      if(!idMap.has(id)) {
        return
      }

      log('after - id: %s', id)
    },
    destroy: function destHook(id) {
      if(!idMap.has(id)) {
        return
      }

      log('destroy - id: %s', id)
      idMap.delete(id)
      log('length: ', idMap.size)
    },
    promiseResolve: function resolveHook(id) {
      if(!idMap.has(id)) {
        return
      }

      log('resolve - id: %s', id)
    }
  }).enable()
}

function forceGC() {
  try {
    log('------ forcing garbage collection -------')
    global.gc()
  } catch (e) {
    log("Need to launch with: `node --expose-gc` flag");
    log("You can use 'npm run async-hooks-tracking' for convenience.")
    process.exit();
  }
}

function log(message, ...args) {
  console.log(message, ...args)
}

setupAsyncTracking()
testPromises()

// TODO: wire up a package.json script
