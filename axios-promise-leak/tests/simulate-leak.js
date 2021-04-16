'use strict'

const path = require('path')
const fork = require('child_process').fork;
const axios = require('axios')

const SNAPSHOTS_WITH_TRAFFIC_COUNT = 2

const STARTED_MESSAGE = 'STARTED'
const SNAPSHOT_MESSAGE = 'SNAPSHOT'

async function simulateLeak() {
  log('Starting endpoint that returns 500 errors...')
  const erroredEndpointChild = fork(path.join(__dirname, '../errored-endpoint.js'))

  log('Starting primary ./index application with heap snapshots')
  const axiosLeakChild = fork(path.join(__dirname, '../index.js'))

  await waitForMessage(erroredEndpointChild, STARTED_MESSAGE)
  await waitForMessage(axiosLeakChild, STARTED_MESSAGE)

  log('Waiting for warmup snapshot.')
  await waitForMessage(axiosLeakChild, SNAPSHOT_MESSAGE)

  log('Generating traffic to simulate leak.')
  await generateTraffic(axiosLeakChild)

  log('Allowing memory to clean up for one last snapshot.')
  await waitForMessage(axiosLeakChild, SNAPSHOT_MESSAGE)

  log('Shutting down.')
  erroredEndpointChild.kill()
  axiosLeakChild.kill()
}

async function generateTraffic(axiosLeakChild) {
  const generateTrafficChild = fork(path.join(__dirname, './generate-traffic.js'))
  await waitForMessage(generateTrafficChild, STARTED_MESSAGE)

  log(`Waiting for ${SNAPSHOTS_WITH_TRAFFIC_COUNT} snapshots to be collected with traffic.`)
  let snapshotCount = 0
  while (snapshotCount < SNAPSHOTS_WITH_TRAFFIC_COUNT) {
    await waitForMessage(axiosLeakChild, SNAPSHOT_MESSAGE)
    snapshotCount++

    log(`${snapshotCount} of ${SNAPSHOTS_WITH_TRAFFIC_COUNT}`)
  }

  generateTrafficChild.kill()
}

function waitForMessage(child, waitMessage) {
  return new Promise((resolve) => {
    child.on('message', messageHandler)

    function messageHandler(message) {
      if (waitMessage === message) {
        child.removeListener('message', messageHandler)

        resolve()
      }
    }
  })
}

function log(message) {
  console.log(`[Simulate-Leak]: ${message}`)
}

simulateLeak().catch((err) => {
  log(err)
  process.exit(1)
})
