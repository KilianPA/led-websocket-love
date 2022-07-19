const { initLedClient, notify, animation } = require("./index");

try {
  const { channel, ws281x } = initLedClient();
  notify(channel, ws281x);
} catch (e) {
  console.log(e);
}
