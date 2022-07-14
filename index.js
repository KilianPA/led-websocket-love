const ws281x = require('@gbkwiatt/node-rpi-ws281x-native');
const options = {
  dma: 10,
  freq: 800000,
  gpio: 18,
  invert: false,
  brightness: 100,
  stripType: ws281x.stripType.WS2812
};

const channel = ws281x(60, options);
const colors = channel.array;

// update color-values
// ws281x.reset();
let i = 0;
setInterval(() => {
  ws281x.reset();
  colors[i] = colorwheel(i);
  colors[i+1] = colorwheel(i);
  colors[i+2] = colorwheel(i);
  ws281x.render();
  i++;
  if (i > 60) {
    i = 0;
  }
}, 50)


const colorwheel = (pos) => {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

const rgb2Int = (r, g, b) => {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

exports.initLedClient = () => {
  const channels = ws281x.init({
    dma: 10,
    freq: 800000,
    channels: [
      {count: 60, gpio: 18, invert: false, brightness: 255, stripType: 'ws2812'},
    ]
  });

  const colors = channels[0].array;
  return {colors, ws281x}
}

exports.notify = (colors, ws281x) => {
  let i = 0;
  const notifyInterval = setInterval(() => {
    ws281x.reset();
    colors[i] = colorwheel(i);
    colors[i+1] = colorwheel(i);
    colors[i+2] = colorwheel(i);
    ws281x.render();
    i++;
    if (i > 60) {
      i = 0;
    }
  }, 50)
  setTimeout(() => {
    clearInterval(notifyInterval)
    console.log('Finalize')
    ws281x.reset();
    process.exit()
  }, 5000)
}