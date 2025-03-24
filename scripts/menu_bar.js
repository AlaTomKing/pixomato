// This is a script made exclusively for menu bars.

const topBar = document.getElementById("top-bar")
const menuContainer = document.createElement("div")
menuContainer.className = "menu-container"

const menuList = []

let menuActive = false
let currentElementHover

const createMenuBtn = (name) => {
    const btn = document.createElement("div");
    btn.className = "menu-tab-btn";
    btn.ariaLabel = name;

    const label = document.createElement("div");
    label.className = "menu-btn-label";
    label.innerHTML = name

    let makeActive = addContextMenuBar(btn, label);

    btn.addEventListener("click", () => {
        btn.className = "menu-tab-btn-selected";
        console.log(name + " btn pressed")
        currentElementHover = btn
    })

    btn.addEventListener("mouseover", () => {
        console.log("mouse over");
        if (ctxMenuBarOpen && currentElementHover) {
            currentElementHover.className = "menu-tab-btn";
            btn.className = "menu-tab-btn-selected";
            console.log("change");
            makeActive();
            currentElementHover = btn
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

// const fileBtn = document.getElementById("menu-tab-btn");

// fileBtn.addEventListener("click", () => {
//     console.log("file btn pressed")
// })

topBar.appendChild(menuContainer)