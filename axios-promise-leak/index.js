'use strict'

// Agent 7.2.0 or earlier
const newrelic = require('newrelic')
const express = require('express')
const axios = require('axios')

const app = express()

const PORT = 3001

const ERRORED_ENDPOINT = 'http://localhost:3000/error'
const SNAPSHOT_INTERVAL_MS = 30000

app.get('/error', function middlewareOne(req, res) {
  axios.request(ERRORED_ENDPOINT).then((result) => {
    res.send('we did it!')
  }).catch((err) => {
    // TODO: does the endpoint actually have to exist?
    newrelic.noticeError(err)

    res.status(500)
    res.send('something went wrong')
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)

  if (process.env.CAPTURE_SNAPSHOTS) {
    setupSnapshots(SNAPSHOT_INTERVAL_MS)
  }
})

function setupSnapshots(interval) {
  const heapdump = require('heapdump')
  console.log(`[DIAGNOSTIC] Capturing snapshots every ${interval} ms`)
  setInterval(() => {
    heapdump.writeSnapshot()
  }, interval).unref() // allow shutdown
}
