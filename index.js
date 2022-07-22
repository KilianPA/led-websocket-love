const ws281x = require("@gbkwiatt/node-rpi-ws281x-native");

const NUM_LEDS = 38;

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

const initLedClient = (options = {}) => {
  return ws281x(NUM_LEDS, {
    stripType: "ws2812",
    brightness: parseInt(options.brightness) || 255,
  });
};

exports.notify = (options = {}) => {
  const channel = initLedClient({ brightness: 0 });
  const maxLoop = 5;
  let loop = 0;
  let sign;
  let currentBrightness = 0;
  const step = 2;
  ws281x.render();
  const notifyInterval = setInterval(() => {
    const lastSign = sign;
    if (currentBrightness === 0) {
      sign = "+";
    } else if (currentBrightness >= 128) {
      sign = "-";
    }
    if (lastSign != sign && sign === "+") {
      loop += 1;
      let currentColor = colorwheel(
        Math.floor(Math.random() * (255 - 0 + 1) + 0)
      );
      for (var i = 0; i < NUM_LEDS; i++) {
        channel.array[i] = currentColor;
      }
      ws281x.render();
    }
    if (loop === maxLoop) {
      clearInterval(notifyInterval);
      console.log("Finalize");
      ws281x.reset();
      ws281x.finalize();
    } else {
      currentBrightness =
        sign === "+" ? currentBrightness + step : currentBrightness - step;
      channel.brightness = Math.floor(currentBrightness);
      ws281x.render();
    }
  }, 40);
};

exports.sendingAnimation = (options = {}) => {
  const channel = initLedClient(options);
  const animationTime = 10000;
  const maxLoop = 5;
  let loop = 0;
  let index = -10;
  const maxIndex = 10;
  let currentColor = rgb2Int(255, 255, 255);
  const notifyInterval = setInterval(() => {
    ws281x.reset();
    for (let i = 0; i < maxIndex; i++) {
      channel.array[index + i] = currentColor;
      channel.array[index - i] = currentColor;
    }
    if (index === NUM_LEDS + 15) {
      currentColor = colorwheel(Math.floor(Math.random() * (255 - 0 + 1) + 0));
      loop += 1;
      index = -10;
    }
    ws281x.render();
    if (loop === maxLoop) {
      clearInterval(notifyInterval);
      console.log("Finalize");
      ws281x.reset();
      ws281x.finalize();
    }
    index += 1;
  }, 40);
};

const animation = () => {
  return new Uint32Array(60)
    .fill(null)
    .map((i) => colorwheel(Math.floor(Math.random() * (255 - 0 + 1) + 0)));
};
