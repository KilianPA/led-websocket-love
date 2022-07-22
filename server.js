var WebSocket = require("ws");
const address = "wss://websocket-love.herokuapp.com/";
const client = "k";
var timeout = 1; // seconds
const led = require("./index");
connect(address);
function connect(address) {
  let ws = new WebSocket(address);
  let timerTimeout = setTimeout(() => ws.terminate(), timeout * 1000); // force close unless cleared on 'open'
  ws.on("open", () => {
    console.log("Opened. Clearing timeout ...");
    clearTimeout(timerTimeout);
    // do your thing here, like ws.send(...);
  });
  ws.on("message", function incoming(message) {
    console.log(message.toString());
    const sender = message.toString().split(";")[1];
    const brightness = message.toString().split(";")[2];
    if (sender !== client) {
      led.notify();
    } else {
      led.sendingAnimation({ brightness });
    }
  });
  ws.on("close", () => {
    clearTimeout(timerTimeout);
    console.error(
      "Websocket connection closed. Reconnecting in %f seconds ...",
      timeout
    );
    setTimeout(() => connect(address), timeout * 1000);
  });
  ws.on("error", (reason) =>
    console.error("Websocket error: " + reason.toString())
  );
  return ws;
}
