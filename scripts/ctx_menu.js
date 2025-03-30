// This script is responsible for context menus.

let contextMenus

const ctxFrameEl = document.getElementById("context-menu-frame")
const ctxMenuEl = document.getElementById("context-menu")
const ctxMenuContainer = document.getElementById("context-menu-container")

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

const eval = (list) => {
    if (list) {
        list.forEach(e => {
            switch (e.type) {
                case "button":
                    const btn = document.createElement("div");
                    const lbl = document.createElement("div");
                    const shc = document.createElement("div");
                    const lfi = document.createElement("div");
                    const rti = document.createElement("div");
                    const inn = document.createElement("div");
                    btn.className = "context-menu-button";
                    inn.className = "context-menu-button-inner";
                    shc.className = "context-menu-button-shortcuts";
                    lfi.className = "context-menu-button-left-icon";
                    rti.className = "context-menu-button-right-icon";
                    lbl.className = "context-menu-button-label";
                    lbl.innerHTML = e.label;
                    shc.innerHTML = e.shortcut?.win
                    if (e.func) btn.addEventListener("click", () => { e.func(); closeCtxMenu(); });
                    inn.appendChild(lfi);
                    inn.appendChild(lbl);
                    inn.appendChild(rti);
                    if (e.shortcut) inn.appendChild(shc);
                    btn.appendChild(inn);
                    ctxMenuContainer.appendChild(btn);
                    break;
                case "separator":
                    const sep = document.createElement("div");
                    sep.className = "context-menu-separator";
                    ctxMenuContainer.appendChild(sep);
                    break;
                case "tree":
                    const btn1 = document.createElement("div");
                    const lbl1 = document.createElement("div");
                    const shc1 = document.createElement("div");
                    const lfi1 = document.createElement("div");
                    const rti1 = document.createElement("div");
                    const inn1 = document.createElement("div");
                    btn1.className = "context-menu-button";
                    inn1.className = "context-menu-button-inner";
                    shc1.className = "context-menu-button-shortcuts";
                    lfi1.className = "context-menu-button-left-icon";
                    rti1.className = "context-menu-button-right-icon";
                    lbl1.className = "context-menu-button-label";
                    lbl1.innerHTML = e.label;
                    shc1.innerHTML = e.shortcut?.win
                    inn1.appendChild(lfi1);
                    inn1.appendChild(lbl1);
                    inn1.appendChild(rti1);
                    if (e.shortcut) inn1.appendChild(shc1);
                    btn1.appendChild(inn1);
                    ctxMenuContainer.appendChild(btn1);
                    //eval(e.list)
                    break;
            }
        });
    }
}

const addContextMenuBar = (element, label, ctxList) => {
    const makeActive = () => { // OPEN CTX MENU
        while (ctxMenuContainer.firstChild) {
            ctxMenuContainer.firstChild.remove();
        }

        eval(ctxList);

        const rect = label.getBoundingClientRect();
        const rect1 = ctxMenuContainer.getBoundingClientRect();

        const posX = rect.left;
        const posY = rect.top + rect.height;

        const maxLeftVal = window.innerWidth - rect1.width;
        //const maxTopVal = window.innerHeight - rect1.height;

        ctxFrameEl.style.display = "block";
        ctxFrameEl.style.pointerEvents = "none";

        ctxMenuEl.style.left = Math.min(posX, maxLeftVal) + "px";
        ctxMenuEl.style.top = posY + "px";

        ctxMenuBarOpen = true;
    }

    // element.addEventListener("click", (e) => { makeActive() })

    return makeActive;
}

const addContextMenu = (element, ctxList) => {
    element.addEventListener("mouseup", (e) => {
        if (e.button === 2) { // OPEN CTX MENU
            while (ctxMenuContainer.firstChild) {
                ctxMenuContainer.firstChild.remove();
            }

            eval(ctxList);

            ctxFrameEl.style.display = "block";
            ctxFrameEl.style.pointerEvents = null;
            //ctxMenuEl.style.display = "block";

            ctxMenuEl.style.animation = null;

            const rect = ctxMenuContainer.getBoundingClientRect();

            let posX = e.clientX + ctxOffsetX;
            let posY = e.clientY + ctxOffsetY;

            if (posX + rect.width > window.innerWidth) {
                posX = e.clientX - rect.width - ctxOffsetX;
            }

            if (posY + rect.height > window.innerHeight) {
                posY = e.clientY - rect.height - ctxOffsetY;
            }

            ctxMenuEl.style.left = Math.max(0, posX) + "px";
            ctxMenuEl.style.top = Math.max(0, posY) + "px";
        }
    })
}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

document.addEventListener("mousedown", (e) => {
    if (!menuHover) {
        const rect = ctxMenuContainer.getBoundingClientRect();

        if (!((e.clientX >= rect.left &&
            e.clientX < rect.left + rect.width) &&
            (e.clientY >= rect.top &&
            e.clientY < rect.top + rect.height))) {
            closeCtxMenu();
        }
    }
});

// document.addEventListener("mouseup", (e) => {
//     if (e.button === 2) { // OPEN CTX MENU
//         while (ctxMenuEl.firstChild) {
//             ctxMenuEl.firstChild.remove();
//         }

//         ctxFrameEl.style.display = "block";
//         ctxFrameEl.style.pointerEvents = null;
//         //ctxMenuEl.style.display = "block";

//         ctxMenuEl.style.animation = null;

//         const rect = ctxMenuEl.getBoundingClientRect();

//         let posX = e.clientX + ctxOffsetX;
//         let posY = e.clientY + ctxOffsetY;

//         if (posX + rect.width > window.innerWidth) {
//             posX = e.clientX - rect.width - ctxOffsetX;
//         }

//         if (posY + rect.height > window.innerHeight) {
//             posY = e.clientY - rect.height - ctxOffsetY;
//         }

//         ctxMenuEl.style.left = posX + "px";
//         ctxMenuEl.style.top = posY + "px";
//     }
// })

window.addEventListener("blur", (e) => {
    closeCtxMenu()
});

window.addEventListener("resize", (e) => {
    closeCtxMenu()
})