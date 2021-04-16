'use strict'

// Agent 7.2.0 or earlier
const newrelic = require('newrelic')
const express = require('express')
const axios = require('axios')

const app = express()

const PORT = 3001

const ERRORED_ENDPOINT = 'http://localhost:3000/error'
const SNAPSHOT_INTERVAL_MS = 30000

// Reproduces the memory leak
app.get('/error', function middlewareOne(req, res) {
  axios.request(ERRORED_ENDPOINT).then((result) => {
    res.send('we did it!')
  }).catch((err) => {
    newrelic.noticeError(err)

    res.status(500)
    res.send('something went wrong')
  })
})

// ----- These just make the snapshot more varied ----------

app.get('/', (req, res) => {
  res.send('success')
})

app.get('/more/interesting', function middle1(req, res, next) {
  setTimeout(next, 10)
}, function middle2(req, res) {
  res.send('done')
})

// ---------------------------------------------------------

app.listen(PORT, () => {
  log(`App listening on port ${PORT}!`)

  if (process.env.CAPTURE_SNAPSHOTS) {
    setupSnapshots(SNAPSHOT_INTERVAL_MS)
  }

  messageParentProcess('STARTED')
})

function setupSnapshots(interval) {
  const heapdump = require('heapdump')

  log(`*** Capturing snapshots every ${interval} ms ***`)
  setInterval(() => {
    heapdump.writeSnapshot()
    messageParentProcess('SNAPSHOT')
  }, interval).unref() // allow shutdown
}

function messageParentProcess(message) {
  process.send && process.send(message)
}

function log(message) {
  console.log(`[Axios Leak Endpoint]: ${message}`)
}