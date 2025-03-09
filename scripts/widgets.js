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
            this.children = [];
            this.isHorizontal = isHorizontal;

            this.minSize = new vector2(0, 0);

            this.element = document.createElement("div")

            if (this.isHorizontal)
                this.element.className = "horizontal-node";
            else
                this.element.className = "vertical-node";
        }

        addChild(child) {
            this.children.push(child);
            this.element.appendChild(child.element);
        }
    };

    class tab {
        constructor() {
            const element = document.createElement("div");
            const container = document.createElement("div");
            const content = document.createElement("div");

            element.className = "tab";
            container.className = "tab-container";
            content.className = "tab-content"

            element.appendChild(container)
            element.appendChild(content)

            this.element = element;
            this.content = content;
            this.container = container;

            this.items = [];
            this.tabItems = [];
            this.currentWidget = null;
        }

        addWidget(widget) {
            for (let i = 0; i < this.tabItems.length; i++) {
                this.tabItems[i].className = "tab-item";
            }

            const tabItem = document.createElement("div");
            tabItem.className = "tab-item-selected";
            tabItem.innerHTML = widget.title;

            this.container.appendChild(tabItem);
            this.content.appendChild(widget.element);

            this.items.push(widget);
            this.tabItems.push(tabItem);
            this.currentWidget = this.items.length;
        }

        makeActive(index) {
            for (let i = 0; i < this.tabItems.length; i++) {
                this.tabItems[i].className = "tab-item";
            }

            this.tabItems[index].className = "tab-item-selected"
        }
    }

    class widget {
        constructor(title, type) {
            this.title = title;

            const element = document.createElement("div");
            element.className = "widget";

            this.element = element;
        }

        close() {
            this.element.remove();
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

    const dock1 = new dock(false);
    const dock2 = new dock(true);
    const dock3 = new dock(false);
    const dock4 = new dock(true);

    const a = new tab();
    const b = new tab();
    const c = new tab();
    const d = new tab();
    const e = new tab();
    const f = new tab();
    const g = new tab();
    const h = new tab();

    const aWidget = new widget("a");
    const bWidget = new widget("b");
    const cWidget = new widget("c");
    const dWidget = new widget("d");
    const eWidget = new widget("e");
    const fWidget = new widget("f");
    const gWidget = new widget("g");
    const hWidget = new widget("BALLLSSIDFIFHIDFHUI");
    const iWidget = new widget("2903ri239");

    a.addWidget(aWidget);
    b.addWidget(bWidget);
    c.addWidget(cWidget);
    d.addWidget(dWidget);
    e.addWidget(eWidget);
    f.addWidget(fWidget);
    g.addWidget(gWidget);
    h.addWidget(hWidget);
    h.addWidget(iWidget);
    h.addWidget(new widget("test"));
    h.addWidget(new widget("testee"));
    h.addWidget(new widget("test123"));

    dock1.addChild(dock2);
    dock1.addChild(h);

    dock2.addChild(a);
    dock2.addChild(dock3);
    dock2.addChild(f);
    dock2.addChild(g);

    dock3.addChild(b);
    dock3.addChild(dock4);

    dock4.addChild(c);
    dock4.addChild(d);
    dock4.addChild(e);

    h.makeActive(1);

    mainFrame.appendChild(dock1.element)

    /*console.log("worky?")*/
