"use strict";

document.querySelector("#menu-github-btn").addEventListener("click", () => {
  window.open("https://github.com/AlaTomKing/to-do-list")
})

// const canvasEl = document.querySelector("#drawing-canvas")
// const ctx = canvasEl.getContext("2d")

// let resize = (e) => {
//     canvasEl.width = window.innerWidth
//     canvasEl.height = window.innerHeight

//     ctx.fillStyle = "#fff"
//     ctx.fillRect(20,40,100,100)
// }

//window.onresize(resize)

//window.addEventListener("resize", resize)

//resize()

// window.addEventListener("load", () => {
//     "use strict";
    
//     if ("serviceWorker" in navigator && document.URL.split(":")[0] !== "file") {
//       navigator.serviceWorker.register("./sw.js");
//     }
// })