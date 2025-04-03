// This encoder is based off the Quite OK Image format by Dominic Szablewski.

const QOI_PADDING = [0,0,0,0,0,0,0,1];

const encode_qoi = (data, desc) => {
    // What a description should contain:
    
    /**
     * - width
     * - height
     */

    const maxSize = desc.width * desc.height * (desc.channels + 1) + 14 + 8;

    let bytes = new ArrayBuffer(maxSize); // an array that holds bytes nad stuff
    let i, p = 0;

    // #region 14-BYTE HEADER

    // magic "qoif"
    bytes[p++] = 0x71; // q
    bytes[p++] = 0x6f; // o
    bytes[p++] = 0x69; // i
    bytes[p++] = 0x66; // f

    // width
    bytes[p++] = desc.width;
    bytes[p++] = desc.width;
    bytes[p++] = desc.width;
    bytes[p++] = desc.width;

    // height
    bytes[p++] = desc.height;
    bytes[p++] = desc.height;
    bytes[p++] = desc.height;
    bytes[p++] = desc.height;

    // 

    // #endregion

    // END PADDING
    for (i = 0; i < QOI_PADDING.length; i++) {
        bytes[p++] = QOI_PADDING[i];
    }
}

const decode_qoi = (file) => {

}