// This encoder is based off the Quite OK Image format by Dominic Szablewski.

// #region "QUITE OKAY IMAGE" PICTURE FORMAT
const encode_qoi = (data, desc) => {
    // What a description should contain:

    /**
     * - width
     * - height
     */

    console.log(desc)

    const maxSize = desc.width * desc.height * (desc.channels + 1) + 14 + 8;

    const bytes = new Uint8Array(maxSize); // an array that holds bytes nad stuff
    let i, p = 0;
    let r, g, b, a;
    let prev_r, prev_g, prev_b, prev_a;

    // #region 14-BYTE HEADER

    // magic "qoif"
    bytes[p++] = 0x71; // q
    bytes[p++] = 0x6F; // o
    bytes[p++] = 0x69; // i
    bytes[p++] = 0x66; // f

    // width
    bytes[p++] = (0xFF000000 & desc.width) >> 24;
    bytes[p++] = (0x00FF0000 & desc.width) >> 16;
    bytes[p++] = (0x0000FF00 & desc.width) >> 8;
    bytes[p++] = (0x000000FF & desc.width);

    // height
    bytes[p++] = (0xFF000000 & desc.height) >> 24;
    bytes[p++] = (0x00FF0000 & desc.height) >> 16;
    bytes[p++] = (0x0000FF00 & desc.height) >> 8;
    bytes[p++] = (0x000000FF & desc.height);

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
    bytes[p++] = 0; bytes[p++] = 0;
    bytes[p++] = 0; bytes[p++] = 0;
    bytes[p++] = 0; bytes[p++] = 0;
    bytes[p++] = 0; bytes[p++] = 1;

    console.log(bytes, bytes.buffer);
}

const decode_qoi = (file) => {

}
// #endregion

// #region "PORTABLE NETWORK GRAPHICS" PICTURE FORMAT
const crc_table = new Uint32Array(256);
let crc_table_computed = false;

const make_crc_table = () => {
    let n, k;
    for (n = 0; n < 256; n++) {
        c = n;
        for (k = 0; k < 8; k++) {
            if (c & 1)
                c = 0xEDB88320 ^ (c >>> 1);
            else
                c = c >>> 1;
        }
        crc_table[n] = c;
    }
    crc_table_computed = true;
}

const update_crc = (crc, data) => {
    let n;

    if (!crc_table_computed)
        make_crc_table();

    for (n = 0; n < data.length; n++) {
        crc = crc_table[(crc ^ data[n]) & 0xff] ^ (crc >>> 8)
    }

    return crc;
}

const comp_bytes = (x0, x1, x2, x3, y0, y1, y2, y3) => {
    return x0 == y0 && x1 == y1 && x2 == y2 && x3 == y3;
}

const calc_crc_32 = (data) => {
    const out = update_crc(0xffffffff, data);
    return out ^ 0xffffffff;
}

const encode_png = (data, desc) => {
    let p = 0;

    let idx_r = 0;
    let idx_g = 0;
    let idx_b = 0;
    let idx_a = 0;

    const data_r = new Uint8Array(desc.width * desc.height);
    const data_g = new Uint8Array(desc.width * desc.height);
    const data_b = new Uint8Array(desc.width * desc.height);
    const data_a = new Uint8Array(desc.width * desc.height);

    const bytes = new Uint8Array(16);

    // the first 8 bytes that png contains according to w3c specification (signature)
    bytes[p++] += 0x89;
    bytes[p++] += 0x50;
    bytes[p++] += 0x4E;
    bytes[p++] += 0x47;
    bytes[p++] += 0x0D;
    bytes[p++] += 0x0A;
    bytes[p++] += 0x1A;
    bytes[p++] += 0x0A;

    console.log(bytes, bytes.buffer);

    // FIRST PHASE: FILTERING
    for (let i = 0; i < data.length; i += desc.channels) {
        data_r[idx_r++] = data[i];
        data_g[idx_g++] = data[i + 1];
        data_b[idx_b++] = data[i + 2];
        if (channels == 4) data_a[idx_a++] = data[i + 3];
    }

    const filter_row = (data, y) => {
        let idx = 0;

        let none_row = new Uint8Array(desc.width); // SUB
        let sub_row = new Uint8Array(desc.width); // SUB
        let up_row = new Uint8Array(desc.width); // UP
        let avg_row = new Uint8Array(desc.width); // AVG
        let paeth_row = new Uint8Array(desc.width); // PAETH

        let none_score = 0; // idx: 0
        let sub_score = 0; // idx: 1
        let up_score = 0; // idx: 2
        let avg_score = 0; // idx: 3
        let paeth_score = 0; // idx: 4

        for (let x = (y * desc.width); x < ((y + 1) * desc.width); x++) {
            none_row[idx] = data[x]; // NONE

            const up = ((y - 1) >= 0) ? data[x - desc.width] : 0;
            const left = ((x - 1) >= 0) ? data[x - 1] : 0;
            const up_left = ((y - 1) >= 0) & ((x - 1) >= 0) ? data[x - desc.width - 1] : 0;

            sub_row[idx] = data[x] - left; // SUB
            up_row[idx] = data[x] - up; // UP
            avg_row[idx] = Math.floor(data[x] - (up + left) / 2); // AVG

            // PAETH
            const v = up + left - up_left;
            const v_l = v - left;
            const v_u = v - up;
            const v_ul = v - up_left;
            const v_min = Math.min(v_l, v_u, v_ul);

            paeth_row[idx] = data[x] - v_min;

            none_score += Math.abs(data[x]);
            sub_score += Math.abs(sub_row[idx]);
            up_score += Math.abs(up_row[idx]);
            avg_score += Math.abs(avg_row[idx]);
            paeth_score += Math.abs(paeth_row[idx]);

            idx++;
        }

        let win_idx = 0;
        let win_row;

        if (none_score > sub_score) win_idx++;
        if (win_idx === 1 && sub_score > up_score) win_idx++;
        if (win_idx === 2 && up_score > avg_score) win_idx++;
        if (win_idx === 3 && avg_score > paeth_score) win_idx++;

        switch (win_idx) {
            case 0: win_row = none_row; break;
            case 1: win_row = sub_row; break;
            case 2: win_row = up_row; break;
            case 3: win_row = avg_row; break;
            case 4: win_row = paeth_row; break;
        }

        for (let i = 0; i < desc.width; i++) {
            data[y * desc.width + i] = win_row[i];
        }
        //console.log(sub_row, up_row, avg_row, paeth_row);
    }

    for (let y = desc.height - 1; y >= 0; y--) {
        filter_row(data_r, y);
        filter_row(data_g, y);
        filter_row(data_b, y);
        if (channels === 4) filter_row(data_a, y);
    }

    // trippy visualization after filtering
    let temp = new Uint8Array(pixels);

    for (let i = 0; i < desc.width * desc.height; i++) {
        pixels[(i * channels)] = data_r[i];
        pixels[(i * channels) + 1] = data_g[i];
        pixels[(i * channels) + 2] = data_b[i];
    }

    render();

    pixels = temp;

    // SECOND PHASE: LEMPEL-ZIV 77 (LZ77) ENCODING

    // THIRD PHASE: HUFFMAN ENCODING
}

const decode_png = (buffer) => {
    // checking if this is a png file by the signature
    const bytes = new Uint8Array(buffer);
    let p = 0;

    if (bytes[p++] === 0x89 &&
        bytes[p++] === 0x50 &&
        bytes[p++] === 0x4E &&
        bytes[p++] === 0x47 &&
        bytes[p++] === 0x0D &&
        bytes[p++] === 0x0A &&
        bytes[p++] === 0x1A &&
        bytes[p++] === 0x0A) {
        console.log(bytes);
    } else {
        console.log("this is not a png file");
        return -1;
    }

    // chunkz
    while (p < bytes.length) {
        const length = (bytes[p++] << 24 | bytes[p++] << 16 | bytes[p++] << 8 | bytes[p++]) >>> 0;

        if (length > (0x7fffffff)) {
            console.log("one chunk of png file has too much data");
            return -1;
        }

        const t_1 = bytes[p++];
        const t_2 = bytes[p++];
        const t_3 = bytes[p++];
        const t_4 = bytes[p++];

        console.log("LENGTH: ", length, "TYPE: ", String.fromCharCode(t_1), String.fromCharCode(t_2), String.fromCharCode(t_3), String.fromCharCode(t_4), t_1.toString(16), t_2.toString(16), t_3.toString(16), t_4.toString(16));

        let crc_idx = 0
        let crc_input = new Uint8Array(4 + length);
        //let crc_input = [];
        crc_input[crc_idx++] = t_1;
        crc_input[crc_idx++] = t_2;
        crc_input[crc_idx++] = t_3;
        crc_input[crc_idx++] = t_4;

        for (let i = 0; i < length; i++) {
            crc_input[crc_idx++] = bytes[p++];
        }

        const crc = bytes[p++] << 24 | bytes[p++] << 16 | bytes[p++] << 8 | bytes[p++];

        //console.log(crc1 << 24 | crc2 << 16 | crc3 << 8 | crc4);
        //console.log(crc_input, crc1.toString(16), crc2.toString(16), crc3.toString(16), crc4.toString(16));
        if (calc_crc_32(crc_input) !== crc) {
            console.log("yeah the file gotta be corrupted or something");
            return -1;
        };

        let i = 4;
        if (comp_bytes(t_1, t_2, t_3, t_4, 0x49, 0x48, 0x44, 0x52)) { // IHDR
            const width = (crc_input[i++] << 24 | crc_input[i++] << 16 | crc_input[i++] << 8 | crc_input[i++]) >>> 0;
            const height = (crc_input[i++] << 24 | crc_input[i++] << 16 | crc_input[i++] << 8 | crc_input[i++]) >>> 0;
            const bit_depth = crc_input[i++];
            const color_type = crc_input[i++];
            const compression = crc_input[i++];
            const filter = crc_input[i++];
            const interlace = crc_input[i++];

            console.log(width, height,bit_depth,color_type,compression,filter,interlace)
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x50, 0x4C, 0x54, 0x45)) { // PLTE
            console.log("PLTE")
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x49, 0x44, 0x41, 0x54)) { // IDAT
            let i = 0;
            const data = new Uint8Array(crc_input.buffer, 4, length)
            const zlib_flag_code = data[i++]; // compression method (1 byte)
            const zlib_check_bits = data[i++]; // additional flags (1 byte)
            const zlib_data = new Uint8Array(data.length - 6);
            while (i < data.length - 4) {
                zlib_data[i - 2] = data[i++];
            }
            const zlib_check_val = (data[i++] << 24 | data[i++] << 16 | data[i++] << 8 | data[i++]) >>> 0;
            
            console.log(data);
            console.log(zlib_flag_code);
            console.log(zlib_check_bits);
            console.log(zlib_data);
            console.log(zlib_check_val);
            /*let j = 0;
            let temp = new Uint8Array(pixels);
            while (i < 4 + length) {
                pixels[j++] = crc_input[i++];
            }
            render();
            pixels = temp;*/
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x49, 0x45, 0x4E, 0x44)) { // IEND
            console.log("IEND")
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x74, 0x45, 0x58, 0x74)) { //tEXt
            console.log("tEXt")
            const data = new Uint8Array(crc_input.buffer, 4, length);
            let out = "";
            for (let i = 0; i < data.length; i++) {
                out += String.fromCharCode(data[i]);
            }
            console.log(out);
        }
    }

    // FIRST PHASE: HUFFMAN DECODING

    // SECOND PHASE: LEMPEL-ZIV 77 (LZ77) DECODING

    // THIRD PHASE: REVERSE FILTERING
}
// #endregion

const import_img = (type) => {
    let input = document.createElement('input');
    input.type = 'file';

    if (type == "png") {
        input.accept = '.png';

        input.onchange = () => {
            const file = input.files[0];
            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.addEventListener("loadend", (ev) => {
                if (ev.target.readyState == FileReader.DONE) {
                    const arrayBuffer = ev.target.result;
                    decode_png(arrayBuffer);
                }
            });
        }
    } else if (type == "qoi") {
        input.accept = '.qoi';

        input.onchange = () => {
            const file = input.files[0];
            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.addEventListener("loadend", (ev) => {
                if (ev.target.readyState == FileReader.DONE) {
                    const arrayBuffer = ev.target.result;
                    decode_qoi(arrayBuffer);
                }
            });
        }
    }

    input.click();
}