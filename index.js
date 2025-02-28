"use strict";

document.querySelector("#menu-github-btn").addEventListener("click", () => {
  window.open("https://github.com/AlaTomKing/pixomato")
})

const canvasEl = document.getElementById("drawing-canvas")
const ctx = canvasEl.getContext("2d")

let mouseX, mouseY = 0;

const rectSize = 10;

let posX, posY = 0
let zoom = 100; // 1: 100%

const res = window.devicePixelRatio;

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

const render = () => {
  const x = window.scrollX + window.innerWidth / 2;
  const y = window.scrollY + window.innerHeight / 2;

  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  
  ctx.fillStyle = "rgb(255,255,255,0.3)"
  ctx.fillRect(50*res, 60*res, 320*res, 180*res)

  ctx.fillStyle = "#f00"
  ctx.fillRect((mouseX - rectSize / 2) * res, (mouseY - rectSize / 2) * res, rectSize * res, rectSize * res)

  console.log(x, y)

  //requestAnimationFrame(render)
}

const resize = (e) => {
  // if (ctx) {
  //   ctx.scale((devicePixelRatio * res), (devicePixelRatio * res));
  // }

  ctx.scale(res, res);

  const displayWidth = window.innerWidth - canvasEl.offsetLeft
  const displayHeight = window.innerHeight - canvasEl.offsetTop

  canvasEl.style.width = displayWidth + "px"
  canvasEl.style.height = displayHeight + "px"

  canvasEl.width = displayWidth * res
  canvasEl.height = displayHeight * res

  render()
}

const changeMousePos = (e) => {
  // console.log(e)
  // console.log("client:", e.clientX, e.clientY)
  // console.log("screen:", e.screenX, e.screenY)
  mouseX = e.clientX - canvasEl.offsetLeft
  mouseY = e.clientY - canvasEl.offsetTop

  render()
}

const wheel = (e) => {
  e.preventDefault()

  zoom = Math.floor(zoom - e.deltaY).clamp(0, 10000)
  console.log(zoom)

  console.log("wheel")
  console.log(e)

  render()
}

const touch = (e) => {
  e.preventDefault()

  // console.log("touch")
  // console.log(e)
}

//window.onresize(resize)

document.addEventListener("resize", resize)
document.addEventListener("mousemove", changeMousePos)
document.addEventListener("wheel", wheel, { passive: false })
document.addEventListener("touchmove", touch, { passive: false })

console.log(window.devicePixelRatio)

render()
resize()

// window.addEventListener("load", () => {
//     "use strict";
    
//     if ("serviceWorker" in navigator && document.URL.split(":")[0] !== "file") {
//       navigator.serviceWorker.register("./sw.js");
//     }
// })