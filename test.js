const led = require("./index");

try {
  led.notify({
    brightness: 150,
  });
} catch (e) {
  console.log(e);
}
