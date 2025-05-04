// This is a script made exclusively for menu bars.

const topBar = document.getElementById("top-bar")
const menuContainer = document.createElement("div")
menuContainer.className = "menu-container"

const menuList = []

const menuCtx = {
    file: [
        /*{
            type: "tree",
            label: "New",
            list: [
                {
                    type: "button",
                    label: "Animation",
                    shortcut: {
                        win: "Ctrl+N",
                        mac: "Meta+N"
                    },
                },
            ]
        },
        {
            type: "separator"
        },*/
        {
            type: "button",
            label: "Save",
            disabled: "true",
            shortcut: {
                win: "Ctrl+S",
                mac: "Meta+S",
            }
        },
        {
            type: "button",
            label: "Save as...",
            disabled: "true",
            shortcut: {
                win: "Ctrl+Shift+S",
                mac: "Meta+Shift+S"
            }
        },
        {
            type: "separator"
        },
        {
            type: "button",
            label: "Import PNG...",
            func: () => { import_img("png") }
        },
        {
            type: "button",
            label: "Import QOI...",
            disabled: "true",
            func: () => { import_img("qoi") }
        },
        {
            type: "separator"
        },
        {
            type: "button",
            label: "Export PNG...",
            shortcut: {
                win: "Ctrl+Shift+E",
                mac: "Meta+Shift+E",
            },
            func: () => {
                export_img("png", pixels, {
                    width: canvasSizeX,
                    height: canvasSizeY,
                    channels: channels,
                });
            }
        },
        {
            type: "button",
            label: "export png upscaled 4 times...",
            func: () => {
                export_img("png", pixels, {
                    width: canvasSizeX,
                    height: canvasSizeY,
                    channels: channels,
                });
            }
        },
        {
            type: "button",
            label: "Export QOI...",
            disabled: "true",
            func: () => {
                export_img("qoi", pixels, {
                    width: canvasSizeX,
                    height: canvasSizeY,
                    channels: channels,
                    colorspace: 1
                });
            }
        },
        {
            type: "separator"
        },
        {
            type: "button",
            disabled: "true",
            label: "Project settings"
        },
        {
            type: "button",
            disabled: "true",
            label: "Preferences"
        }
    ],
    edit: [
        {
            type: "button",
            disabled: "true",
            label: "Redo",
            shortcut: {
                win: "Ctrl+Z",
                mac: "Meta+Z",
            }
        },
        {
            type: "button",
            disabled: "true",
            label: "Undo",
            shortcut: {
                win: "Ctrl+Y",
                mac: "Meta+Y",
            }
        },
        {
            type: "separator"
        },
        {
            type: "button",
            disabled: "true",
            label: "Cut",
            shortcut: {
                win: "Ctrl+X",
                mac: "Meta+X",
            }
        },
        {
            type: "button",
            disabled: "true",
            label: "Copy",
            shortcut: {
                win: "Ctrl+C",
                mac: "Meta+C",
            }
        },
        {
            type: "button",
            disabled: "true",
            label: "Paste",
            shortcut: {
                win: "Ctrl+V",
                mac: "Meta+V",
            }
        },
        {
            type: "separator"
        },
        {
            type: "button",
            label: "clear canvas",
            func: () => {
                for (let i = 0; i < pixels.length; i++) {
                    pixels[i] = 255;
                }
                render();
            }
        }
    ],
    select: [
        {
            type: "button",
            disabled: "true",
            label: "Select all",
            shortcut: {
                win: "Ctrl+A",
                mac: "Meta+A",
            }
        }
    ],
    view: [
        {
            type: "button",
            disabled: "true",
            label: "Timeline",
            shortcut: {
                win: "Ctrl+F1",
                mac: "Meta+F1",
            }
        },
        {
            type: "button",
            disabled: "true",
            label: "Tools",
            shortcut: {
                win: "Ctrl+F2",
                mac: "Meta+F2",
            }
        },
        {
            type: "button",
            disabled: "true",
            label: "Properties",
            shortcut: {
                win: "Ctrl+F3",
                mac: "Meta+F3",
            }
        },
        {
            type: "button",
            disabled: "true",
            label: "Layer",
            shortcut: {
                win: "Ctrl+F4",
                mac: "Meta+F4",
            }
        },
    ],
    help: [
        {
            type: "button",
            label: "Go to GitHub",
            func: () => {
                window.open("https://github.com/AlaTomKing/pixomato");
            }
        },
        {
            type: "button",
            label: "Documentation",
            func: () => {
                window.open("https://alatomking.github.io/pixomato/docs");
            }
        },
        {
            type: "button",
            label: "Go to alatomking.github.io",
            func: () => {
                window.open("https://alatomking.github.io");
            }
        },
        {
            type: "separator"
        },
        {
            type: "button",
            disabled: "true",
            label: "About Pixomato"
        }
    ]
}

let menuActive = false
let menuHover = false
let menuDebounce = false;
let currentElementHover

const createMenuBtn = (name, ctxList) => {
    const btn = document.createElement("div");
    btn.className = "menu-tab-btn";
    btn.ariaLabel = name;

    const label = document.createElement("div");
    label.className = "menu-btn-label";
    label.innerHTML = name

    let makeActive = addContextMenuBar(btn, label, ctxList);

    btn.addEventListener("mousedown", (e) => {
        if (e.button === 0 && !ctxMenuBarOpen) {
            btn.className = "menu-tab-btn-selected";
            currentElementHover = btn
            menuDebounce = true;
            makeActive();
        }
    })

    btn.addEventListener("mouseup", (e) => {
        if (e.button === 0 && ctxMenuBarOpen) {
            if (menuDebounce === false)
                closeCtxMenu();
            menuDebounce = false;
        }
    })

    btn.addEventListener("mouseover", () => {
        if (ctxMenuBarOpen && currentElementHover && currentElementHover != btn) {
            currentElementHover.className = "menu-tab-btn";
            btn.className = "menu-tab-btn-selected";
            currentElementHover = btn
            makeActive();
        }
    })

    btn.appendChild(label);
    menuContainer.appendChild(btn);

    menuList.push(btn);
}

const fileBtn = createMenuBtn("File", menuCtx.file)
const editBtn = createMenuBtn("Edit", menuCtx.edit)
const selectBtn = createMenuBtn("Select", menuCtx.select)
//const insertBtn = createMenuBtn("Insert", menuCtx.insert)
const viewBtn = createMenuBtn("View", menuCtx.view)
//const windowBtn = createMenuBtn("Window", menuCtx.window)
const helpBtn = createMenuBtn("Help", menuCtx.help)

menuContainer.addEventListener("mouseover", () => {
    menuHover = true;
})

menuContainer.addEventListener("mouseout", () => {
    menuHover = false;
})

// const fileBtn = document.getElementById("menu-tab-btn");

// fileBtn.addEventListener("click", () => {
//     console.log("file btn pressed")
// })

topBar.appendChild(menuContainer)