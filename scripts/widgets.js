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
    constructor() {
        this.type = "tab";

        const element = document.createElement("div");
        const container = document.createElement("div");
        const content = document.createElement("div");

        element.className = "tab";
        container.className = "tab-container";
        content.className = "tab-content"

        element.appendChild(container)
        element.appendChild(content)

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
        tabItem.className = "tab-item-selected";
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

        this.selectedIndex = this.tabItems.length;
        this.currentWidget = widget;

        this.items.push(widget);
        this.tabItems.push(tabItem);

        widget.parent = this;
        widget.index = this.selectedIndex;
            
        this.container.appendChild(tabItem);
        this.content.appendChild(widget.element);
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
    }
}

class widget {
    constructor(title) {
        this.title = title;
        this.parent = null;
        this.index = null;

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



/*const root = new dock(dockType.window);

root.show();*/

// // const widget1 = new widget("test");
// // const widget2 = new widget("Layer");
// // const widget3 = new widget("Properties");

// const tab1 = new tab();
// const tab2 = new tab();

// const tab3 = new tab();
// const tab4 = new tab();

// const dock1 = new dock(dockType.horizontal);
// const dock2 = new dock(dockType.vertical);

// // tab1.addWidget(widget1);
// // tab1.addWidget(widget2);
// // tab1.addWidget(widget3);

// dock1.addChild(tab1);
// dock1.addChild(tab2);
// dock1.addChild(dock2);

// dock2.addChild(tab3);
// dock2.addChild(tab4);

/*const dock1 = new dock(false);
const dock2 = new dock(true);
const dock3 = new dock(false);
const dock4 = new dock(true);
const dock5 = new dock(false);
const dock6 = new dock(true);

const a = new tab();
const b = new tab();
const c = new tab();
const d = new tab();
const e = new tab();
const f = new tab();
const g = new tab();
const g1 = new tab();
const h = new tab();

const tab1 = new tab();
const tab2 = new tab();
const tab3 = new tab();

const aWidget = new widget("a");
const bWidget = new widget("b");
const cWidget = new widget("c");
const dWidget = new widget("d");
const eWidget = new widget("efef");
const fWidget = new widget("f");
const gWidget = new widget("g");
const g1Widget = new widget("h");
const hWidget = new widget("BALLLSSIDFIFHIDFHUI");
const iWidget = new widget("2903ri239");

const widget1 = new widget("lol")

a.addWidget(aWidget);
b.addWidget(bWidget);
c.addWidget(cWidget);
d.addWidget(dWidget);
e.addWidget(eWidget);
f.addWidget(fWidget);
g.addWidget(gWidget);
g1.addWidget(g1Widget);
h.addWidget(hWidget);
h.addWidget(iWidget);
h.addWidget(new widget("test"));
h.addWidget(new widget("testee"));
h.addWidget(new widget("test123"));

tab1.addWidget(new widget(2));

tab2.addWidget(new widget("aasd"));
tab3.addWidget(widget1);

dock1.addChild(dock2);
dock1.addChild(h);

dock2.addChild(a);
dock2.addChild(dock3);
dock2.addChild(f);
dock2.addChild(g);
dock2.addChild(g1);

dock3.addChild(b);
dock3.addChild(dock4);

dock4.addChild(c);
dock4.addChild(d);
dock4.addChild(e);
dock4.addChild(dock5);

dock5.addChild(tab1)
dock5.addChild(dock6);

dock6.addChild(tab2)
dock6.addChild(tab3)*/

const dock1 = new dock(false);
const dock2 = new dock(true);

const tab1 = new tab();
const tab2 = new tab();
const tab3 = new tab();
const tab4 = new tab();

const canvasWidget = new widget("New Animation");
const toolsWidget = new widget("Tools");
const propertiesWidget = new widget("Properties");
const timelineWidget = new widget("Timeline")

const canvasEl = document.createElement("canvas");
canvasEl.id = "drawing-canvas";

canvasWidget.element.appendChild(canvasEl);

toolsWidget.element.style.maxWidth = "64px"

tab1.addWidget(canvasWidget)
tab2.addWidget(propertiesWidget);
tab3.addWidget(timelineWidget);
tab4.addWidget(toolsWidget)

dock2.addChild(tab4)
dock2.addChild(tab1)
dock2.addChild(tab2)

dock1.addChild(dock2)
dock1.addChild(tab3)

mainFrame.appendChild(dock1.element)

/*console.log("worky?")*/
