// TomatoTools UI Library Module

let rootContainer;

const WINDOW_BORDER_GAP = 16;

const setRootContainer = (container) => {
    rootContainer = container;
}

class ComponentHandler {
    constructor(parent, window) {

    }
}

class Window extends ComponentHandler {
    static targetWindow;
    static startPosX;
    static startPosY;
    static startMouseX;
    static startMouseY;

    title = "New Window"

    x;
    y;
    width = 300;
    height = 200;

    constructor(title) {
        super();

        this.title = title;
    }

    changePosition(x, y) {
        this.x = Math.min(Math.max(x, -this.width + WINDOW_BORDER_GAP), rootContainer.offsetWidth - WINDOW_BORDER_GAP);
        this.y = Math.min(Math.max(y, 0), rootContainer.offsetHeight - WINDOW_BORDER_GAP);

        this.element.style.top = this.y + "px";
        this.element.style.left = this.x + "px";
    }

    changeSize(width, height) {
        this.width = width;
        this.height = height;
    }

    show() {
        console.log("show tomatotools");

        if (!this.x || !this.y) {
            this.x = Math.floor(rootContainer.offsetWidth / 2 - this.width / 2);
            this.y = Math.floor(rootContainer.offsetHeight / 2 - this.height / 2);
        }

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

        element.style.top = this.y + "px";
        element.style.left = this.x + "px";
        element.style.width = this.width + "px";
        element.style.height = this.height + "px";

        const titleBar = element.querySelector(".tt-titleBar");

        titleBar.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                Window.targetWindow = this;
                Window.startPosX = this.x;
                Window.startPosY = this.y;
                Window.startMouseX = e.clientX;
                Window.startMouseY = e.clientY;
            }
        })

        document.addEventListener("mouseup", (e) => {
            if (Window.targetWindow && e.button === 0) {
                Window.targetWindow = null;
            }
        })

        rootContainer.appendChild(element);

        this.element = element;
    }
}

// handle window dragging
document.addEventListener("mousemove", (e) => {
    if (Window.targetWindow) {
        console.log("move", Window.startPosX, Window.startPosY);

        Window.targetWindow.changePosition(Window.startPosX + e.clientX - Window.startMouseX,
            Window.startPosY + e.clientY - Window.startMouseY
        )
    }
});

console.log("tomato tools worky?");