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
    help: [
        {
            type: "button",
            label: "Go to GitHub",
        },
        {
            type: "separator",
        },
        {
            type: "button",
            label: "Documentation",
            shortcut: "F2",
        }
    ]
}

let menuActive = false
let menuHover = false
let menuDebounce = false;
let currentElementHover

const createMenuBtn = (name) => {
    const btn = document.createElement("div");
    btn.className = "menu-tab-btn";
    btn.ariaLabel = name;

    const label = document.createElement("div");
    label.className = "menu-btn-label";
    label.innerHTML = name

    let makeActive = addContextMenuBar(btn, label);

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
        if (ctxMenuBarOpen && currentElementHover) {
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

const fileBtn = createMenuBtn("File")
const editBtn = createMenuBtn("Edit")
const selectBtn = createMenuBtn("Select")
const insertBtn = createMenuBtn("Insert")
const viewBtn = createMenuBtn("View")
const windowBtn = createMenuBtn("Window")
const helpBtn = createMenuBtn("Help")

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