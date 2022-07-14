const {initLedClient, notify} = require('./index')

try {
    const {colors, ws281x} = initLedClient()
    notify(colors, ws281x);
} catch (e) {
    console.log('Error')
}