'use strict'

const express = require('express')
const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('success')
})

app.get('/error', (req, res) => {
  res.status(500)
  res.send('something went wrong')
})

app.listen(PORT, () => {
  log(`App listening on port ${PORT}!`)
  messageParentProcess('STARTED')
})

function messageParentProcess(message) {
  process.send && process.send(message)
}

function log(message) {
  console.log(`[Errored Endpoint]: ${message}`)
}