# Axios Promise Leak

This application reproduces a memory leak in the New Relic Node.js agent prior to being fixed. Leverage this application to demonstrate leaking memory and generating heap snapshots that can be used to diagnose and ultimately fix.

To get the agent to attach/run, you will need to configure a valid license key. You may do so via the `newrelic.js` config file (`license_key: 'your key here'`) or via ENV var `NEW_RELIC_LICENSE_KEY=key`.


`npm start` to start the application.

`npm run capture-snapshots` to start the application with automatic capture of heap snapshots.


TODO:


* Create other endpoints to make heap snapshot a little more polluted

* script that sets up endpoint that returns an error
* test script that exercises traffic at the right time to capture all the snapshots and prob quits at the right time too
