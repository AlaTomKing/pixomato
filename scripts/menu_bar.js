// This is a script made exclusively for menu bars.

const topBar = document.getElementById("top-bar")
const menuContainer = document.createElement("div")
menuContainer.className = "menu-container"

const menuList = []

const menuCtx = {
    file: [
        {
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
        },
        {
            type: "button",
            label: "Save",
            shortcut: {
                win: "Ctrl+S",
                mac: "Meta+S",
            }
        },
        {
            type: "button",
            label: "Save as...",
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
        },
        {
            type: "button",
            label: "Import QOI..."
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
            }
        },
        {
            type: "button",
            label: "Export QOI...",
            func: () => {
                encode_qoi(pixels, {
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
            label: "Project settings"
        },
        {
            type: "button",
            label: "Preferences"
        }
    ],
    edit: [
        {
            type: "button",
            label: "Redo",
            shortcut: {
                win: "Ctrl+Z",
                mac: "Meta+Z",
            }
        },
        {
            type: "button",
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
            label: "Cut",
            shortcut: {
                win: "Ctrl+X",
                mac: "Meta+X",
            }
        },
        {
            type: "button",
            label: "Copy",
            shortcut: {
                win: "Ctrl+C",
                mac: "Meta+C",
            }
        },
        {
            type: "button",
            label: "Paste",
            shortcut: {
                win: "Ctrl+V",
                mac: "Meta+V",
            }
        }
    ],
    select: [
        {
            type: "button",
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
            label: "Timeline",
            shortcut: {
                win: "Ctrl+F1",
                mac: "Meta+F1",
            }
        },
        {
            type: "button",
            label: "Tools",
            shortcut: {
                win: "Ctrl+F2",
                mac: "Meta+F2",
            }
        },
        {
            type: "button",
            label: "Properties",
            shortcut: {
                win: "Ctrl+F3",
                mac: "Meta+F3",
            }
        },
        {
            type: "button",
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