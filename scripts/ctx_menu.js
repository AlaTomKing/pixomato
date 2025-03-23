// This script is responsible for context menus.

let contextMenus

const ctxFrameEl = document.getElementById("context-menu-frame")
const ctxMenuEl = document.getElementById("context-menu")

const ctxOffsetX = 1
const ctxOffsetY = 1

const addContextMenu = () => {

}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

document.addEventListener("mousedown", (e) => {

    const rect = ctxMenuEl.getBoundingClientRect();

    if (!((e.clientX >= rect.left && e.clientX <= rect.left + rect.width) && (e.clientY >= rect.top && e.clientY <= rect.top + rect.height))) {
        ctxFrameEl.style.display = "none";
        //ctxMenuEl.style.display = "none";
        ctxMenuEl.style.animation = "none";
    }

});

document.addEventListener("mouseup", (e) => {
    if (e.button === 2) {
        console.log(e.clientX, e.clientY);

        console.log("context menu");

        ctxFrameEl.style.display = "block";
        //ctxMenuEl.style.display = "block";

        ctxMenuEl.style.animation = null;

        const rect = ctxMenuEl.getBoundingClientRect();

        let posX = e.clientX + ctxOffsetX;
        let posY = e.clientY + ctxOffsetY;

        if (posX + rect.width > window.innerWidth) {
            posX = e.clientX - rect.width - ctxOffsetX;
        }

        if (posY + rect.height > window.innerHeight) {
            posY = e.clientY - rect.height - ctxOffsetY;
        }

        ctxMenuEl.style.left = posX + "px";
        ctxMenuEl.style.top = posY + "px";
    }
})

window.addEventListener("blur", (e) => {
    console.log("windows blur")
    ctxFrameEl.style.display = "none";
    //ctxMenuEl.style.display = "none";
    ctxMenuEl.style.animation = "none";
});

window.addEventListener("resize", (e) => {
    ctxFrameEl.style.display = "none";
    // ctxMenuEl.style.display = "none";
    ctxMenuEl.style.animation = "none";
})