'use strict'

const axios = require('axios')

const LEAK_HOST = 'http://localhost:3001'
const LEAKING_ENDPOINT = `${LEAK_HOST}/error`
const STANDARD_ENDPOINT = `${LEAK_HOST}/`
const MORE_INTERESTING_ENDPOINT = `${LEAK_HOST}/more/interesting`

async function generateTraffic() {
  messageParentProcess('STARTED')

  log('Generating traffic...')

  while(true) {
    // We don't need a true realistic traffic representation
    // to reproduct this but we do intermix some calls for the memory
    // to have extra like a real app.
    await makeRequest(LEAKING_ENDPOINT)
    await makeRequest(LEAKING_ENDPOINT)
    await makeRequest(STANDARD_ENDPOINT)
    await makeRequest(MORE_INTERESTING_ENDPOINT)
    await makeRequest(MORE_INTERESTING_ENDPOINT)
  }
}

async function makeRequest(url) {
  try {
    await axios.request(url)
  } catch (error) {
    if (!error.response && error.response.status === 500) {
      log(error.message)
    }
  }
}

function messageParentProcess(message) {
  process.send && process.send(message)
}

function log(message) {
  console.log(`[Generate-Traffic]: ${message}`)
}

generateTraffic().catch((err) => {
  log(err)
  process.exit(1)
})