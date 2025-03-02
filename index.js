"use strict";

(() => { 
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

  document.querySelector("#menu-github-btn").addEventListener("click", () => {
    window.open("https://github.com/AlaTomKing/pixomato");
  })

  const canvasEl = document.getElementById("drawing-canvas");
  const ctx = canvasEl.getContext("2d");

  const rectSize = 10;

  let cursorX, cursorY = 0;

  let canvasSizeX = 3840;
  let canvasSizeY = 2160;

  let displayWidth, displayHeight

  let zoom = 0.3; // 1: 100%

  let posX = 0; // 0 is center
  let posY = 0; // 0 is center

  let mouseMidX = 0;
  let mouseMidY = 0;

  let mouseInFrame = false;

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

  const insertImage = (x, y, w, h) => {
    ctx.drawImage(image, 0, 0, 1924, 1082, x * res, y * res, w * res, h * res);
  }
  
  const setLineWidth = (width) => {
    ctx.lineWidth = width;
  }

  const dashedLine = (x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(x0*res, y0*res);
    ctx.lineTo(x1*res, y1*res);
    ctx.stroke();
  }

  const line = (x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(x0*res, y0*res);
    ctx.lineTo(x1*res, y1*res);
    ctx.stroke();
  }

  Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
  };

  const render = () => {
    const x = window.scrollX + window.innerWidth / 2;
    const y = window.scrollY + window.innerHeight / 2;

    const midX = displayWidth / 2 - (posX);
    const midY = displayHeight / 2 - (posY);

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // MAIN FRAME
    //ctx.globalAlpha = 0.4
    setRGBFill(255, 255, 255, 0.3);
    insertImage((displayWidth / 2) - (canvasSizeX * zoom / 2) - posX, (displayHeight / 2) - (canvasSizeY * zoom / 2) - posY, canvasSizeX * zoom, canvasSizeY * zoom);
    //ctx.globalAlpha = 1

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

    ctx.scale(res, res);

    displayWidth = window.innerWidth - canvasEl.offsetLeft;
    displayHeight = window.innerHeight - canvasEl.offsetTop;

    canvasEl.style.width = displayWidth + "px";
    canvasEl.style.height = displayHeight + "px";

    canvasEl.width = displayWidth * res;
    canvasEl.height = displayHeight * res;

    render();
  }

  const changeMousePos = (e) => {
    // console.log(e)
    // console.log("client:", e.clientX, e.clientY)
    // console.log("screen:", e.screenX, e.screenY)
    cursorX = e.clientX - canvasEl.offsetLeft;
    cursorY = e.clientY - canvasEl.offsetTop;

    mouseMidX = cursorX - displayWidth / 2 - (posX);
    mouseMidY = cursorY - displayHeight / 2 - (posY);

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
        zoom = (2**i).clamp(0.01,100)
  
        if (zoom - oldZoom !== 0) {
          const midX = displayWidth / 2 - (posX);
          const midY = displayHeight / 2 - (posY);

          const cursorXFrame = (cursorX).clamp(midX - (canvasSizeX * oldZoom) / 2, midX + (canvasSizeX * oldZoom) / 2)
          const cursorYFrame = (cursorY).clamp(midY - (canvasSizeY * oldZoom) / 2, midY + (canvasSizeY * oldZoom) / 2)

          console.log(cursorXFrame, cursorYFrame, cursorX, cursorY)
  
          const cursorMidX = cursorXFrame - midX;
          const cursorMidY = cursorYFrame - midY;
  
          const zoomDelta = (zoom - oldZoom)
  
          const zoomDiffX = cursorMidX / oldZoom * zoomDelta;
          const zoomDiffY = cursorMidY / oldZoom * zoomDelta;
  
          posX += zoomDiffX;
          posY += zoomDiffY;
  
          render();
        }
      } else {
        posX += e.deltaX;
        posY += e.deltaY;
      }
    }
    
    if ((canvasSizeX * zoom) < displayWidth) {
      posX = posX.clamp(-displayWidth / 2, displayWidth / 2);
    } else {
      posX = posX.clamp(-canvasSizeX * zoom / 2, canvasSizeX * zoom / 2);
    }

    if ((canvasSizeY * zoom) < displayHeight) {
      posY = posY.clamp(-displayHeight / 2, displayHeight / 2);
    } else {
      posY = posY.clamp(-canvasSizeY * zoom / 2, canvasSizeY * zoom / 2);
    }
    
    render();
  }

  const touch = (e) => {
    e.preventDefault();

    // console.log("touch")
    // console.log(e)
  }

  const mouseout = (e) => {
    mouseInFrame = false;
    render();
  }

  //window.onresize(resize)

  if (ctx) {
    ctx.imageSmoothingEnabled = false;

    window.addEventListener("resize", resize);
    window.addEventListener("mouseout", mouseout);

    document.addEventListener("mousemove", changeMousePos);
    document.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("touchmove", touch, { passive: false });

    image.addEventListener("load", render)

    render();
    resize();
  }
})()