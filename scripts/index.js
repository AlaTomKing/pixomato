// the main script

import { setRootContainer, Window } from "./tomatotools_ui/index.js";

const finish_loading = () => {
    const loading_screen = document.getElementById("loading");
    const pixomato_app = document.getElementById("pixomato");
    console.log("pixomato has loaded");

    pixomato_app.style.display = "block";
    // loading_screen.style.opacity = 0;
    loading_screen.style.display = "none";

    // setTimeout(() => {loading_screen.style.display = "none"}, 500)
    start();
}

// the very first thing to do
const start = () => {
    setRootContainer(document.getElementById("widgets-frame"));

    // create a flying window thingy
    console.log("pixomato has started");

    const test = new Window("Welcome");

    test.show();
}

window.addEventListener("load", () => {
    //setTimeout(finish_loading, 500);
    finish_loading();
});
