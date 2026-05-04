// TomatoTools UI Library Module

let rootContainer;

const setRootContainer = (container) => {
    rootContainer = container;
}

class ComponentHandler {
    constructor(parent, window) {

    }
}

class Window extends ComponentHandler {
    static targetWindow;

    title = "New Window"

    constructor(title) {
        super();

        this.title = title;
    }

    show() {
        console.log("show tomatotools");

        const element = document.createElement("div");

        element.innerHTML = `
                <div class="tt-titleBar">
                    <label class="tt-titleName">${this.title}</label>
                    <button class="tt-closeButton">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5.75741 14.2426L10.0001 10M14.2427 5.75736L10.0001 10M14.2427 14.2426L10.0001 10M5.75741 5.75736L10.0001 10"
                                stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                </button></div><div class="container"></div>`

        element.className = "tt-window";

        element.style.width = "300px";
        element.style.height = "200px";

        const titleBar = element.querySelector(".tt-titleBar");

        titleBar.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                Window.targetWindow = this;
            }
        })

        document.addEventListener("mouseup", (e) => {
            if (Window.targetWindow && e.button === 0) {
                Window.targetWindow = null;
            }
        })

        rootContainer.appendChild(element);
    }
}

// handle window dragging
document.addEventListener("mousemove", (e) => {
    if (Window.targetWindow) {
        console.log("move")
    }
});

console.log("tomato tools worky?");