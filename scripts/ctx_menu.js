// This script is responsible for context menus.

let contextMenus

const addContextMenu = () => {

}

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    console.log(e.clientX, e.clientY);

    console.log("context menu")
});