// This script is responsible for context menus.

let contextMenus

const ctxFrameEl = document.getElementById("context-menu-frame")
const ctxMenuEl = document.getElementById("context-menu")

const addContextMenu = () => {

}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    console.log(e.clientX, e.clientY);

    console.log("context menu");

    ctxFrameEl.style.display = "block";
    ctxMenuEl.style.display = "block";

    const rect = ctxMenuEl.getBoundingClientRect();

    let posX = e.clientX;
    let posY = e.clientY;

    if (e.clientX + rect.width > window.innerWidth) {
        posX = e.clientX - rect.width;
    }

    if (e.clientY + rect.height > window.innerHeight) {
        posY = e.clientY - rect.height;
    }

    ctxMenuEl.style.left = posX + "px";
    ctxMenuEl.style.top = posY + "px";
});

document.addEventListener("mousedown", (e) => {
    const rect = ctxMenuEl.getBoundingClientRect();

    if (!((e.clientX >= rect.left && e.clientX <= rect.left + rect.width) && (e.clientY >= rect.top && e.clientY <= rect.top + rect.height))) {
        ctxFrameEl.style.display = "none";
        ctxMenuEl.style.display = "none";
    }
});

window.addEventListener("blur", (e) => {
    console.log("windows blur")
    ctxFrameEl.style.display = "none";
    ctxMenuEl.style.display = "none";
});

window.addEventListener("resize", (e) => {
    ctxFrameEl.style.display = "none";
    ctxMenuEl.style.display = "none";
})