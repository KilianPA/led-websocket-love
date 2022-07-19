const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

const NUM_LEDS = 60;

const colorwheel = (pos) => {
  pos = 255 - pos;
  if (pos < 85) {
    return rgb2Int(255 - pos * 3, 0, pos * 3);
  } else if (pos < 170) {
    pos -= 85;
    return rgb2Int(0, pos * 3, 255 - pos * 3);
  } else {
    pos -= 170;
    return rgb2Int(pos * 3, 255 - pos * 3, 0);
  }
};

const rgb2Int = (r, g, b) => {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
};

exports.initLedClient = () => {
  const channel = ws281x(NUM_LEDS, { stripType: "ws2812" });
  return { channel, ws281x };
};

exports.notify = (channel, ws281x) => {
  let colorIndex = 0;
  const notifyInterval = setInterval(() => {
    for (let i = 0; i < NUM_LEDS; i++) {
      channel.array[i] = colorwheel(colorIndex);
    }
    colorIndex += 1;
    ws281x.render();
  }, 100);
  setTimeout(() => {
    clearInterval(notifyInterval);
    console.log("Finalize");
    ws281x.reset();
    ws281x.finalize();
  }, 15000);
};

const animation = () => {
  return new Uint32Array(60)
    .fill(null)
    .map((i) => colorwheel(Math.floor(Math.random() * (255 - 0 + 1) + 0)));
};
