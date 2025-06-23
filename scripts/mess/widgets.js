// This script is responsible for handling widgets in Pixomato

const mainFrame = document.getElementById("main-frame");

class vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class dock {
    constructor(isHorizontal) {
        this.type = "dock";

        this.children = [];
        this.isHorizontal = isHorizontal;

        this.parent = null
        this.index = null
        this.minSize = new vector2(0, 0);

        this.element = document.createElement("div")

        if (this.isHorizontal)
            this.element.className = "horizontal-node";
        else
            this.element.className = "vertical-node";
    }

    close() {
        this.children.splice(0, this.children.length)

        if (this.parent !== null && this.index !== null) {
            this.parent.removeChild(this.index);
        } else {
            this.element.remove();
        }
    }

    removeChild(index) {
        this.element.removeChild(this.children[index].element)
        this.children[index].element.remove();
        this.children.splice(index, 1);

        if (this.children.length === 0) {
            this.close();
        } else if (this.children.length === 1) {
            if (this.parent?.isHorizontal === !this.isHorizontal) {
                if (this.children[0].type === "dock" && this.children[0].isHorizontal === this.parent.isHorizontal) {
                    for (let i = 0; i < this.children[0].children.length; i++) {
                        this.parent.addChildIndex(this.children[0].children[i], this.index + i);
                    }
                } else {
                    this.parent.addChildIndex(this.children[0], this.index);
                }
                
                this.close();
            }
        }

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].index = i;
        }
    }

    addChild(child) {
        child.parent = this;
        child.index = this.children.length;
        child.element.style.order = child.index;
        this.children.push(child);
        this.element.appendChild(child.element);
    }

    addChildIndex(child, index) {
        child.parent = this;
        child.index = index;

        this.children.splice(index, 0, child)
        this.element.appendChild(child.element);

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].index = i;
            this.children[i].element.style.order = i.toString();
        }
    }
};

class tab {
    constructor(size) {
        this.type = "tab";

        const element = document.createElement("div");
        const container = document.createElement("div");
        const content = document.createElement("div");

        element.className = "tab";
        container.className = "tab-container";
        content.className = "tab-content"

        element.appendChild(container)
        element.appendChild(content)

        element.style.width = size?.x || "none";
        element.style.height = size?.y || "none";

        this.parent = null;
        this.index = null;

        this.element = element;
        this.content = content;
        this.container = container;

        this.selectedIndex = null;
        this.currentWidget = null;
        this.items = [];
        this.tabItems = [];
    }

    addWidget(widget) {
        for (let i = 0; i < this.tabItems.length; i++) {
            this.tabItems[i].className = "tab-item";
        }

        const tabItem = document.createElement("div");
        tabItem.innerHTML = widget.title;

        tabItem.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                if (widget.index != this.selectedIndex) {
                    this.selectedIndex = widget.index
                    this.currentWidget = widget
                    this.makeActive(widget.index);
                }
            }
        })

        addContextMenu(tabItem, [
            {
                type: "button",
                label: "Close",
                func: () => { widget.close(); }
            },
            {
                type: "button",
                label: "Close all",
                func: () => { this.close(); }
            },
            {
                type: "button",
                label: "Close others",
                func: () => { widget.close(); }
            },
            {
                type: "separator"
            },
            {
                type: "button",
                label: "Detatch"
            }
        ])

        this.selectedIndex = this.tabItems.length;
        this.currentWidget = widget;

        this.items.push(widget);
        this.tabItems.push(tabItem);

        widget.parent = this;
        widget.index = this.selectedIndex;
            
        this.container.appendChild(tabItem);
        this.content.appendChild(widget.element);

        this.makeActive(this.tabItems.length - 1)
    }

    close() {
        this.items.splice(0, this.items.length);
        this.tabItems.splice(0, this.tabItems.length);

        if (this.parent !== null && this.index !== null) {
            this.parent.removeChild(this.index);
        } else {
            this.element.remove();
        }
    }

    removeWidget(index) {
        this.content.removeChild(this.items[index].element);
        this.container.removeChild(this.tabItems[index])

        this.items[index].element.remove()
        this.tabItems[index].remove()

        this.items.splice(index, 1);
        this.tabItems.splice(index, 1);

        if (this.items.length === 0) {
            this.close()
        } else {
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].index = i;
            }
    
            this.selectedIndex = this.currentWidget.index
        }
    }

    makeActive(index) {
        for (let i = 0; i < this.tabItems.length; i++) {
            this.tabItems[i].className = "tab-item";
        }

        this.selectedIndex = index;
        this.tabItems[index].className = "tab-item-selected"

        const widget = this.items[index]

        this.element.style.minWidth = widget.size.xMin;
        this.element.style.maxWidth = widget.size.xMax;
        this.element.style.minHeight = widget.size.yMin;
        this.element.style.maxHeight = widget.size.yMax;
    }
}

class widget {
    constructor(title, size) {
        this.title = title;
        this.parent = null;
        this.index = null;

        this.size = {
            xMin: size?.xMin || "none",
            xMax: size?.xMax || "none",
            yMin: size?.yMin || "none",
            yMax: size?.yMax || "none",
        }

        const element = document.createElement("div");
        element.className = "widget";

        this.element = element;
    }

    close() {
        if (this.parent !== null && this.index !== null) {
            this.parent.removeWidget(this.index)
        } else {
            this.element.remove();
        }
    }
}

const dock1 = new dock(false);
const dock2 = new dock(true);

const tab1 = new tab();
const tab2 = new tab({x:"312px"});
const tab3 = new tab();
const tab4 = new tab();

const canvasWidget = new widget("New Animation");
const toolsWidget = new widget("Tools", {xMax: "128px"});
const propertiesWidget = new widget("Properties", {xMax: "312px"});
const layerWidget = new widget("Layer");
const timelineWidget = new widget("Timeline", {yMax: "296px"});

const canvasEl = document.createElement("canvas");
canvasEl.id = "drawing-canvas";

canvasWidget.element.appendChild(canvasEl);

/*tab1.addWidget(canvasWidget)
tab2.addWidget(propertiesWidget);
tab2.addWidget(layerWidget);
tab3.addWidget(timelineWidget);
tab4.addWidget(toolsWidget)

dock1.addChild(tab1)
dock1.addChild(tab3)

dock2.addChild(tab4)
dock2.addChild(dock1)
dock2.addChild(tab2)*/

tab1.addWidget(canvasWidget);
tab4.addWidget(toolsWidget);
dock2.addChild(tab4);
dock2.addChild(tab1);

mainFrame.appendChild(dock2.element)

// MESS

const colorThing = document.createElement("input");
colorThing.type = "color";
colorThing.value = "#000000"

const colorLabel = document.createElement("label");
colorLabel.innerHTML = "Color";

const numberThing = document.createElement("input");
numberThing.type = "number"
numberThing.style.width = "64px";
numberThing.value = 1
numberThing.min = 1
numberThing.max = 16

const sizeLabel = document.createElement("label");
sizeLabel.innerHTML = "Size";

const newLine = document.createElement("br")

colorThing.addEventListener("change", (e) => {
    currentColor = colorThing.value;
}, false);

const selectList = document.createElement("select");

const pixelBrushOption = document.createElement("option");
pixelBrushOption.value = "pixel_brush"
pixelBrushOption.innerHTML = "Pixel Brush"

const eraseOption = document.createElement("option");
eraseOption.value = "erase"
eraseOption.innerHTML = "Eraser"

selectList.appendChild(pixelBrushOption)
selectList.appendChild(eraseOption)

toolsWidget.element.appendChild(selectList)
toolsWidget.element.appendChild(newLine)
toolsWidget.element.appendChild(colorThing)
toolsWidget.element.appendChild(colorLabel)
toolsWidget.element.appendChild(newLine)
toolsWidget.element.appendChild(numberThing)
toolsWidget.element.appendChild(sizeLabel)

/*console.log("worky?")*/
