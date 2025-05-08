// this script is responsible for drawing

// note: channels value will always be 4
(() => {
    let pos_X, pos_Y;
    let mouse_down = false;
    let in_canvas = false;

    let canvas_width, canvas_height;
    let current_pixel_data; // because layers exist
    // let current_outside_pixel_data;

    // #region the drawing part

    // starts drawing and tracks the starting position of the mouse to calculate fair amount of distance
    // between the mouse and it's pixelated neighbours to ensure no excess amounts of pixels are drawn ykwim
    const startDrawing = (posX, posY) => {
        mouse_down = true;
    }

    // stops tracking mouse
    const stopDrawing = () => {
        pos_X = null; pos_Y = null; mouse_down = false;
    }

    // sets color of pixel
    const setColor = (r, g, b, a) => {

    }

    // adds one pixel
    const setPixel = (x, y) => {
        let r = 0, g = 0, b = 0, a = 255;

        let position = y * canvas_width + x * 4;
        current_pixel_data[position] = r;
        current_pixel_data[position + 1] = g;
        current_pixel_data[position + 2] = b;
        current_pixel_data[position + 3] = a;
    }

    // always fires everytime a mouse moves. this is used during drawing and detection of mouse inside canvas
    const mouseMoveEvent = (e) => {
        if (mouse_down) {

        }
    }

    // #endregion

    // #region setup

    // #endregion
})();