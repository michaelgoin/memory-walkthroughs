# Axios Promise Leak

This application reproduces a memory leak in the New Relic Node.js agent prior to being fixed. Leverage this application to demonstrate leaking memory and generating heap snapshots that can be used to diagnose and ultimately fix.

## Before You Get Started

To get the agent to attach/run, you will need to configure a valid license key. You may do so via the `newrelic.js` config file (`license_key: 'your key here'`) or via ENV var `NEW_RELIC_LICENSE_KEY=key`.

## Running

`npm install` to install dependencies

`npm start` to start the application.

`npm run capture-snapshots` to start the application with automatic capture of heap snapshots.

`npm test` or `npm run simulate-leak` to exercise a test script that will simulate the memory leak scenario and automatically capture the necessary snapshots. Snapshots can be loaded via Chrome's DevTools on the 'Memory' tab.

  **Reminder: you need the license key configured via config file or ENV var for the agent to attach and show the memory leak**

`npm run async-hooks-tracking` to exercise a script that prints out ID's of async resources and tracking counts for promises to show behavior of the hooks and demonstrate 'destroy' is called on garbage collection.
