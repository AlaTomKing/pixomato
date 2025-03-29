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
                    shortcut: "Ctrl+N/Cmd+N"
                },
            ]
        }
    ],
    edit: [
        {
            type: "button",
            label: "Redo",
        },
        {
            type: "button",
            label: "Undo",
        },
        {
            type: "separator"
        },
        {
            type: "button",
            label: "Cut",
        },
        {
            type: "button",
            label: "Copy",
        },
        {
            type: "button",
            label: "Paste",
        }
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
            shortcut: "F2",
            func: () => {
                window.open("https://alatomking.github.io/pixomato/docs");
            }
        },
        {
            type: "button",
            label: "Return to alatomking.github.io",
            shortcut: "F2",
            func: () => {
                window.open("https://alatomking.github.io");
            }
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
const insertBtn = createMenuBtn("Insert", menuCtx.insert)
const viewBtn = createMenuBtn("View", menuCtx.view)
const windowBtn = createMenuBtn("Window", menuCtx.window)
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