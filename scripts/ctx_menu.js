// This script is responsible for context menus.

let contextMenus

const ctxFrameEl = document.getElementById("context-menu-frame")
const ctxMenuEl = document.getElementById("context-menu")

const ctxOffsetX = 1
const ctxOffsetY = 1

let ctxMenuBarOpen = false;

const closeCtxMenu = () => {
    ctxFrameEl.style.display = "none";
    //ctxMenuEl.style.display = "none";
    ctxMenuEl.style.animation = "none";
    ctxMenuBarOpen = false;
    if (currentElementHover) {
        currentElementHover.className = "menu-tab-btn";
    }
}

// class ctxMenuBar {
//     constructor(element, label) {
//         const rect = label.getBoundingClientRect();

//         const posX = rect.left;
//         const posY = rect.top + rect.height;

//         ctxFrameEl.style.display = "block";
//         ctxFrameEl.style.pointerEvents = "none";

//         ctxMenuEl.style.left = posX + "px";
//         ctxMenuEl.style.top = posY + "px";

//         ctxMenuBarOpen = true;
//     }

//     makeActive() {
    
//     }
// }

const addContextMenuBar = (element, label) => {
    const makeActive = () => {
        const rect = label.getBoundingClientRect();

        const posX = rect.left;
        const posY = rect.top + rect.height;

        ctxFrameEl.style.display = "block";
        ctxFrameEl.style.pointerEvents = "none";

        ctxMenuEl.style.left = posX + "px";
        ctxMenuEl.style.top = posY + "px";

        ctxMenuBarOpen = true;
    }

    // element.addEventListener("click", (e) => { makeActive() })

    return makeActive;
}

const addContextMenu = () => {

}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

document.addEventListener("mousedown", (e) => {
    if (!menuHover) {
        const rect = ctxMenuEl.getBoundingClientRect();

        if (!((e.clientX >= rect.left && e.clientX <= rect.left + rect.width) && (e.clientY >= rect.top && e.clientY <= rect.top + rect.height))) {
            closeCtxMenu();
        }
        
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 2) {
        ctxFrameEl.style.display = "block";
        ctxFrameEl.style.pointerEvents = null;
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
    closeCtxMenu()
});

window.addEventListener("resize", (e) => {
    closeCtxMenu()
})