// This encoder is based off the Quite OK Image format by Dominic Szablewski.

const QOI_PADDING = [0,0,0,0,0,0,0,1];

const encode_qoi = (data, desc) => {
    // What a description should contain:
    
    /**
     * - width
     * - height
     */

    console.log(desc)

    const maxSize = desc.width * desc.height * (desc.channels + 1) + 14 + 8;

    const buffer = new ArrayBuffer(maxSize);
    let bytes = new Uint8Array(buffer); // an array that holds bytes nad stuff
    let i, p = 0;
    let r, g, b, a;
    let prev_r, prev_g, prev_b, prev_a;

    // #region 14-BYTE HEADER

    // magic "qoif"
    bytes[p++] = 0x71; // q
    bytes[p++] = 0x6f; // o
    bytes[p++] = 0x69; // i
    bytes[p++] = 0x66; // f

    // width
    bytes[p++] = (0xff000000 & desc.width) >> 24;
    bytes[p++] = (0x00ff0000 & desc.width) >> 16;
    bytes[p++] = (0x0000ff00 & desc.width) >> 8;
    bytes[p++] = (0x000000ff & desc.width);

    // height
    bytes[p++] = (0xff000000 & desc.height) >> 24;
    bytes[p++] = (0x00ff0000 & desc.height) >> 16;
    bytes[p++] = (0x0000ff00 & desc.height) >> 8;
    bytes[p++] = (0x000000ff & desc.height);

    // channels & colorspace
    bytes[p++] = desc.channels;
    bytes[p++] = desc.colorspace;

    // #endregion

    r = 0;
    g = 0;
    b = 0;
    a = 255;
    prev_r = r;
    prev_g = g;
    prev_b = b;
    prev_a = a;

    // END PADDING
    for (i = 0; i < QOI_PADDING.length; i++) {
        bytes[p++] = QOI_PADDING[i];
    }

    console.log(bytes, buffer);
}

const decode_qoi = (file) => {

}

const encode_png = (data) => {

}

const decode_png = (data) => {
    
}