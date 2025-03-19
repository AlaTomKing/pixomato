"use strict";

let zoom; // 1: 100%

let hasZoomed = false;

const black = (text) => (`\x1b[30m${text}`)
const red = (text) => (`\x1b[31m${text}`)
const green = (text) => (`\x1b[32m${text}`)
const yellow = (text) => (`\x1b[33m${text}`)
const blue = (text) => (`\x1b[34m${text}`)
const magenta = (text) => (`\x1b[35m${text}`)
const cyan = (text) => (`\x1b[36m${text}`)
const white = (text) => (`\x1b[37m${text}`)
const bgBlack = (text) => (`\x1b[40m${text}\x1b[0m`)
const bgRed = (text) => (`\x1b[41m${text}\x1b[0m`)
const bgGreen = (text) => (`\x1b[42m${text}\x1b[0m`)
const bgYellow = (text) => (`\x1b[43m${text}\x1b[0m`)
const bgBlue = (text) => (`\x1b[44m${text}\x1b[0m`)
const bgMagenta = (text) => (`\x1b[45m${text}\x1b[)0m`)
const bgCyan = (text) => (`\x1b[46m${text}\x1b[0m`)
const bgWhite = (text) => (`\x1b[47m${text}\x1b[0m`)

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

document.getElementById("menu-github-btn").addEventListener("click", () => {
  window.open("https://github.com/AlaTomKing/pixomato");
})

//const mainFrame = document.getElementById("main-frame");
//const canvasWidget = document.getElementById("canvas-widget");
//const canvasEl = document.getElementById("drawing-canvas");
const ctx = canvasEl.getContext("2d");

let pixels = {};

const rectSize = 10;

let cursorX, cursorY = 0;

let canvasSizeX = 36;
let canvasSizeY = 24;

let currentPixelX = 0;
let currentPixelY = 0;

const rect = canvasEl.parentElement.getBoundingClientRect();

let displayWidth = rect.width;
let displayHeight = rect.height;

let posX = 0; // 0 is center
let posY = 0; // 0 is center

let mouseInFrame = false;
let mouseInCanvas = false;

let mouseDown = false;

if (canvasSizeX / canvasSizeY > displayWidth / displayHeight) {
  zoom = ((displayWidth) / (canvasSizeX * 1.2)).clamp(0.01, 100)
} else {
  zoom = ((displayHeight) / (canvasSizeY * 1.2)).clamp(0.01, 100)
}

let showGrid = (zoom >= 5);

let image = new Image()
image.src = "./resources/testBackground.png"

const res = window.devicePixelRatio;

// #region functions for canvas
const setHexFill = (hex) => {
  ctx.fillStyle = hex;
}
const setRGBFill = (r, g, b, a = 1) => {
  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
}

const setHexStroke = (hex) => {
  ctx.strokeStyle = hex;
}
const setRGBStroke = (r, g, b, a = 1) => {
  ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
}

const fillRect = (x, y, w, h) => {
  ctx.fillRect(x * res, y * res, w * res, h * res);
}

const strokeRect = (x, y, w, h) => {
  ctx.strokeRect(x * res, y * res, w * res, h * res);
}

const insertImage = (x, y, w, h) => {
  ctx.drawImage(image, 0, 0, 1924, 1082, x * res, y * res, w * res, h * res);
}

const setLineWidth = (width) => {
  ctx.lineWidth = width;
}

const dashedLine = (x0, y0, x1, y1) => {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(x0 * res, y0 * res);
  ctx.lineTo(x1 * res, y1 * res);
  ctx.stroke();
}

const line = (x0, y0, x1, y1) => {
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(x0 * res, y0 * res);
  ctx.lineTo(x1 * res, y1 * res);
  ctx.stroke();
}

const render = () => {
  const x = window.scrollX + window.innerWidth / 2;
  const y = window.scrollY + window.innerHeight / 2;

  const midX = displayWidth / 2 - (posX);
  const midY = displayHeight / 2 - (posY);

  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  // MAIN FRAME
  //ctx.globalAlpha = 0.4
  const canvasPosX = Math.floor(((displayWidth / 2) - (canvasSizeX * zoom / 2) - posX) * res) / res
  const canvasPosY = Math.floor(((displayHeight / 2) - (canvasSizeY * zoom / 2) - posY) * res) / res
  const canvasWidth = Math.floor((canvasSizeX * zoom) * res) / res
  const canvasHeight = Math.floor((canvasSizeY * zoom) * res) / res

  setRGBFill(255, 255, 255, 1);
  fillRect(
    canvasPosX,
    canvasPosY,
    canvasWidth,
    canvasHeight
  );

  console.log(canvasPosX, canvasPosY, canvasWidth, canvasHeight)
  //ctx.globalAlpha = 1

  ctx.shadowColor = "transparent"

  for (const [key, value] of Object.entries(pixels)) {
    let [pixelX, pixelY] = key.split(":");
    pixelX = Number(pixelX);
    pixelY = Number(pixelY);

    //const cellSize = canvasEl.width / canvasSizeX

    setRGBFill(0, 0, 0, 1);
    fillRect(
      canvasPosX + Math.floor(pixelX * zoom * res) / res,
      canvasPosY + Math.floor(pixelY * zoom * res) / res,
      (canvasPosX + Math.floor((pixelX+1) * zoom * res) / res) - (canvasPosX + Math.floor(pixelX * zoom * res) / res),
      (canvasPosY + Math.floor((pixelY+1) * zoom * res) / res) - (canvasPosY + Math.floor(pixelY * zoom * res) / res)
    )
    /*fillRect(
      Math.round(Math.round((displayWidth / 2) - ((canvasSizeX) * zoom / 2) - posX) + (pixelX * (zoom))),
      Math.round(Math.round((displayHeight / 2) - ((canvasSizeY) * zoom / 2) - posY) + (pixelY * (zoom))),
      Math.round(zoom),
      Math.round(zoom)
    )*/
  }

  if (mouseInFrame) {
    setRGBFill(0, 0, 0, 1);
    strokeRect((displayWidth / 2) - ((canvasSizeX) * zoom / 2) - posX + currentPixelX * zoom, (displayHeight / 2) - ((canvasSizeY) * zoom / 2) - posY + currentPixelY * zoom, zoom, zoom)
  }

  /*if (showGrid) {
    setLineWidth(1);
    setHexStroke("#000")

    const startX = (displayWidth / 2) - (canvasSizeX * zoom / 2) - posX
    const startY = (displayHeight / 2) - (canvasSizeY * zoom / 2) - posY

    for (let i = 1; i < canvasSizeX; i++) {
      line(startX + i * zoom, startY, startX + i * zoom, (displayHeight / 2) + (canvasSizeY * zoom / 2) - posY)
    }

    for (let i = 1; i < canvasSizeY; i++) {
      line(startX, startY + i * zoom, (displayWidth / 2) + (canvasSizeX * zoom / 2) - posX, startY + i * zoom)
    }
  }*/

  // MOUSE LINE
  /*if (mouseInFrame) {
    setLineWidth(10);

    setHexStroke("#0000ff66");
    line(0, cursorY, cursorX.clamp(0, midX), cursorY);
    line(cursorX, 0, cursorX, cursorY.clamp(0, midY));

    setHexStroke("#ffffff66");
    dashedLine(cursorX, cursorY, midX, cursorY);
    dashedLine(cursorX, cursorY, cursorX, midY);
  }

  setLineWidth(5)

  setHexStroke("#ffff0066");
  line(0, displayHeight/2, (displayWidth/2).clamp(0, midX), displayHeight/2)
  line(displayWidth/2, 0, displayWidth/2, (displayHeight/2).clamp(0, midY))
  
  setHexStroke("#ffff0033");
  dashedLine(displayWidth, displayHeight/2, (displayWidth/2).clamp(midX, displayWidth), displayHeight/2)
  dashedLine(displayWidth/2, displayHeight, displayWidth/2, (displayHeight/2).clamp(midY, displayHeight))

  setHexStroke("#ff000066");
  line(0, midY, midX, midY)
  line(midX, 0, midX, midY)

  setHexStroke("#ff000033");
  dashedLine(displayWidth, midY, midX, midY)
  dashedLine(midX, displayHeight, midX, midY)

  setHexStroke("#ff007f66");
  line(midX, displayHeight/2, displayWidth/2, displayHeight/2)
  line(displayWidth / 2, midY, displayWidth / 2, displayHeight / 2)

  if (mouseInFrame) {
    setHexFill("#0000ff66");
    fillRect((cursorX - rectSize / 2), (cursorY - rectSize / 2), rectSize, rectSize);

    setHexFill("#00ff0066");
    fillRect(
      (cursorX).clamp(midX - (canvasSizeX * zoom) / 2, midX + (canvasSizeX * zoom) / 2) - rectSize / 2,
      (cursorY).clamp(midY - (canvasSizeY * zoom) / 2, midY + (canvasSizeY * zoom) / 2) - rectSize / 2,
      rectSize,
      rectSize);
  }*/

  //requestAnimationFrame(render)
}

const drawPixel = () => {
  pixels[`${currentPixelX}:${currentPixelY}`] = true;
}

const drawLine = (x0, y0, x1, y1) => {
  /*
  psuedocode from wikipedia (dont delete incase of forgeting):

  1.
  dx = x2 − x1
  dy = y2 − y1

  for x from x1 to x2 do
      y = y1 + dy × (x − x1) / dx
      plot(x,y)

  2.
  plotLine(x0, y0, x1, y1)
  dx = x1 - x0
  dy = y1 - y0
  D = 2*dy - dx
  y = y0

  for x from x0 to x1
      plot(x, y)
      if D > 0
          y = y + 1
          D = D - 2*dx
      end if
      D = D + 2*dy
  */

  /*let dx = x2 - x1;
  let dy = y2 - y1;

  if (x1 < x2)
      for (let x = x1; x <= x2; x++) {
          let y = Math.round(y1 + dy * (x - x1) / dx)

          let index = 4 * (this.canvas.width * y + x);

          var cArray = color.substring(4, color.length - 1).split(',')
          this.pixelImageData.data[index] = cArray[0];
          this.pixelImageData.data[index + 1] = cArray[1];
          this.pixelImageData.data[index + 2] = cArray[2];
          this.pixelImageData.data[index + 3] = 255;
      }
  else
      for(let x = x2; x <= x1; x++) {
          let y = Math.round(y1 + dy * (x - x1) / dx)

          let index = 4 * (this.canvas.width * y + x);

          var cArray = color.substring(4, color.length - 1).split(',')
          this.pixelImageData.data[index] = cArray[0];
          this.pixelImageData.data[index + 1] = cArray[1];
          this.pixelImageData.data[index + 2] = cArray[2];
          this.pixelImageData.data[index + 3] = 255;
      }*/

  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;

  while (true) {
    drawPixel(x0, y0);

    if ((x0 === x1) && (y0 === y1)) break;
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

const logInfo = () => {
  const midX = displayWidth / 2 - (posX);
  const midY = displayHeight / 2 - (posY);

  console.log("---------")
  console.log(blue(`cursor: ${cursorX}, ${cursorY}`))
  console.log(`cursorMid: ${cursorX - midX}, ${cursorY - midY}`)
  console.log(red(`mid: ${midX}, ${midY}`))
  console.log(yellow(`center: ${displayWidth / 2}, ${displayHeight / 2}`))
  console.log(magenta(`pos: ${posX}, ${posY}`))
}

const resize = (e) => {
  // if (ctx) {
  //   ctx.scale((devicePixelRatio * res), (devicePixelRatio * res));
  // }

  const rect = canvasEl.parentElement.getBoundingClientRect();

  ctx.scale(res, res);

  displayWidth = rect.width;
  displayHeight = rect.height;

  canvasEl.style.width = displayWidth + "px";
  canvasEl.style.height = displayHeight + "px";

  canvasEl.width = displayWidth * res;
  canvasEl.height = displayHeight * res;

  if (!hasZoomed) {
    const oldZoom = zoom;
    //zoom = (Math.floor((2 ** i)  * 100) / 100).clamp(0.01, 100)
    if (canvasSizeX / canvasSizeY > displayWidth / displayHeight) {
      zoom = ((displayWidth) / (canvasSizeX * 1.2)).clamp(0.01, 100)
    } else {
      zoom = ((displayHeight) / (canvasSizeY * 1.2)).clamp(0.01, 100)
    }

    showGrid = (zoom >= 5)

    if (zoom - oldZoom !== 0) {
      const rect = canvasEl.parentElement.getBoundingClientRect();

      const x = rect.width / 2
      const y = rect.height / 2

      const midX = displayWidth / 2 - (posX);
      const midY = displayHeight / 2 - (posY);

      const cursorXFrame = (x).clamp(midX - (canvasSizeX * oldZoom) / 2, midX + (canvasSizeX * oldZoom) / 2)
      const cursorYFrame = (y).clamp(midY - (canvasSizeY * oldZoom) / 2, midY + (canvasSizeY * oldZoom) / 2)

      const cursorMidX = cursorXFrame - midX;
      const cursorMidY = cursorYFrame - midY;

      const zoomDelta = (zoom - oldZoom)

      const zoomDiffX = cursorMidX / oldZoom * zoomDelta;
      const zoomDiffY = cursorMidY / oldZoom * zoomDelta;

      posX += zoomDiffX;
      posY += zoomDiffY;
    }

    if ((canvasSizeX * zoom) < displayWidth) {
      posX = (posX.clamp(-displayWidth / 2, displayWidth / 2));
    } else {
      posX = (posX.clamp(-canvasSizeX * zoom / 2, canvasSizeX * zoom / 2));
    }
  
    if ((canvasSizeY * zoom) < displayHeight) {
      posY = (posY.clamp(-displayHeight / 2, displayHeight / 2));
    } else {
      posY = (posY.clamp(-canvasSizeY * zoom / 2, canvasSizeY * zoom / 2))
    }
  }

  render();
}

const changeMousePos = (e) => {
  // console.log(e)
  // console.log("client:", e.clientX, e.clientY)
  // console.log("screen:", e.screenX, e.screenY)
  const oldX = cursorX;
  const oldY = cursorY;

  const rect = canvasEl.parentElement.getBoundingClientRect();

  cursorX = e.clientX - rect.left;
  cursorY = e.clientY - rect.top;

  mouseInCanvas = (cursorX >= Math.round(displayWidth / 2 - canvasSizeX / 2 * zoom - posX) && cursorY >= Math.round(displayHeight / 2 - canvasSizeY / 2 * zoom - posY) &&
    cursorX < Math.round(displayWidth / 2 + canvasSizeX / 2 * zoom - posX) && cursorY < Math.round(displayHeight / 2 + canvasSizeY / 2 * zoom - posY))

  currentPixelX = Math.floor((cursorX - (displayWidth / 2 - canvasSizeX / 2 * zoom - posX)) / zoom)
  currentPixelY = Math.floor((cursorY - (displayHeight / 2 - canvasSizeY / 2 * zoom - posY)) / zoom)

  if (mouseDown && mouseInFrame) {
    //drawLine(oldX, oldY, cursorX, cursorY);
    drawPixel(cursorX, cursorY);
  }

  //console.log(mouseX - (displayWidth / 2), mouseY - (displayHeight / 2));

  mouseInFrame = ((cursorX >= 0 && cursorX < displayWidth) && (cursorY >= 0 && cursorY < displayHeight))

  //console.log(mouseX, mouseY, mouseInFrame)

  render();
}

const wheel = (e) => {
  e.preventDefault();

  if (mouseInFrame) {
    if (e.ctrlKey) {
      const oldZoom = zoom;
      const i = Math.log2(zoom) - e.deltaY * 0.025; //0.0025;
      //zoom = (Math.floor((2 ** i)  * 100) / 100).clamp(0.01, 100)
      zoom = (2 ** i).clamp(0.01, 100)

      hasZoomed = true;

      showGrid = (zoom >= 5)

      if (zoom - oldZoom !== 0) {
        const midX = displayWidth / 2 - (posX);
        const midY = displayHeight / 2 - (posY);

        const cursorXFrame = (cursorX).clamp(midX - (canvasSizeX * oldZoom) / 2, midX + (canvasSizeX * oldZoom) / 2)
        const cursorYFrame = (cursorY).clamp(midY - (canvasSizeY * oldZoom) / 2, midY + (canvasSizeY * oldZoom) / 2)

        const cursorMidX = cursorXFrame - midX;
        const cursorMidY = cursorYFrame - midY;

        const zoomDelta = (zoom - oldZoom)

        const zoomDiffX = cursorMidX / oldZoom * zoomDelta;
        const zoomDiffY = cursorMidY / oldZoom * zoomDelta;

        posX += zoomDiffX;
        posY += zoomDiffY;
      }
    } else {
      posX += e.deltaX;
      posY += e.deltaY;
    }
  }

  if ((canvasSizeX * zoom) < displayWidth) {
    posX = (posX.clamp(-displayWidth / 2, displayWidth / 2));
  } else {
    posX = (posX.clamp(-canvasSizeX * zoom / 2, canvasSizeX * zoom / 2));
  }

  if ((canvasSizeY * zoom) < displayHeight) {
    posY = (posY.clamp(-displayHeight / 2, displayHeight / 2));
  } else {
    posY = (posY.clamp(-canvasSizeY * zoom / 2, canvasSizeY * zoom / 2))
  }

  mouseInCanvas = (cursorX >= Math.round(displayWidth / 2 - canvasSizeX / 2 * zoom - posX) && cursorY >= Math.round(displayHeight / 2 - canvasSizeY / 2 * zoom - posY) &&
    cursorX < Math.round(displayWidth / 2 + canvasSizeX / 2 * zoom - posX) && cursorY < Math.round(displayHeight / 2 + canvasSizeY / 2 * zoom - posY))

  //if (mouseInCanvas) {
  currentPixelX = Math.floor((cursorX - (displayWidth / 2 - canvasSizeX / 2 * zoom - posX)) / zoom)
  currentPixelY = Math.floor((cursorY - (displayHeight / 2 - canvasSizeY / 2 * zoom - posY)) / zoom)

  if (mouseDown && mouseInFrame) {
    drawPixel();
  }
  //}

  render();
}

const touch = (e) => {
  e.preventDefault();

  // console.log("touch")
  // console.log(e)
};

const mouseout = (e) => {
  mouseInFrame = false;
  render();
};

const mousedown = (e) => {
  if (e.button === 0) {
    mouseDown = true;

    //if (mouseInCanvas) {
    if (mouseInFrame) {
      drawPixel();
    }
    //}

    render();
  }
}

const mouseup = (e) => {
  if (e.button === 0) {
    mouseDown = false;
  }
}

//window.onresize(resize)

window.addEventListener("load", () => {
  if (ctx) {
    ctx.imageSmoothingEnabled = false;

    window.addEventListener("resize", resize);
    window.addEventListener("mouseout", mouseout);

    document.addEventListener("pointerdown", mousedown);
    document.addEventListener("pointerup", mouseup);

    document.addEventListener("pointermove", changeMousePos);
    document.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("touchmove", touch, { passive: false });

    image.addEventListener("load", render)

    /*for (let i = 0; i < canvasSizeX; i++) {
      for (let j = 0; j < canvasSizeY; j++) {
        pixels[i+":"+j] = true
      }
    }*/

    render();
    resize();
  }

  /*if ("serviceWorker" in navigator && document.URL.split(":")[0] !== "file") {
    navigator.serviceWorker.register("./sw.js");
  }*/
});