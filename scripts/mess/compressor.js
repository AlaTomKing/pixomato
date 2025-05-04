const pako = this.pako

// #region "QUITE OKAY IMAGE" PICTURE FORMAT
const encode_qoi = (data, desc) => {
    // This encoder is based off the Quite OK Image format by Dominic Szablewski.

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

    // 14-BYTE HEADER
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
    let c;
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

const paeth_predictor = (up, left, up_left) => {
    const v = up + left - up_left;
    const v_l = Math.abs(v - left);
    const v_u = Math.abs(v - up);
    const v_ul = Math.abs(v - up_left);
    if (v_l <= v_u && v_l <= v_ul) return left;
    else if (v_u <= v_ul) return up;
    else return up_left;
}

const chunk_types = {
    IHDR: [0x49, 0x48, 0x44, 0x52],
    IDAT: [0x49, 0x44, 0x41, 0x54],
    IEND: [0x49, 0x45, 0x4E, 0x44]
}

const encode_png = (data, desc) => {
    let p = 0;

    /*let test_idx = 0;
    let new_idx = 0;

    let new_data = new Uint8Array(desc.width * desc.height * 3);

    while (test_idx < data.length) {
        new_data[new_idx++] = data[test_idx++];
        new_data[new_idx++] = data[test_idx++];
        new_data[new_idx++] = data[test_idx++];
        test_idx++;
    }

    data = new_data;*/

    const channels = desc.channels;

    // IHDR: HEADER
    let width, height, bit_depth, color_type, compression, filter1, interlace;

    width = desc.width;
    height = desc.height;
    bit_depth = 8;
    color_type = 6; // pixomato only supports truecolor with alpha for now
    compression = 0;
    filter1 = 0;
    interlace = 0;

    const add_chunk = (type, data) => {
        const length = data.length;
        let crc_idx = 0;
        const crc_input = new Uint8Array(4 + length);

        // length
        bytes[p++] = length >>> 24 & 0xff;
        bytes[p++] = length >>> 16 & 0xff;
        bytes[p++] = length >>> 8 & 0xff;
        bytes[p++] = length & 0xff;

        // type
        bytes[p++] = type[0]; crc_input[crc_idx++] = type[0];
        bytes[p++] = type[1]; crc_input[crc_idx++] = type[1];
        bytes[p++] = type[2]; crc_input[crc_idx++] = type[2];
        bytes[p++] = type[3]; crc_input[crc_idx++] = type[3];

        // data
        for (let i = 0; i < data.length; i++) {
            bytes[p++] = data[i];
            crc_input[crc_idx++] = data[i];
        }

        // crc
        const crc = calc_crc_32(crc_input);
        bytes[p++] = crc >>> 24 & 0xff;
        bytes[p++] = crc >>> 16 & 0xff;
        bytes[p++] = crc >>> 8 & 0xff;
        bytes[p++] = crc & 0xff;
    }

    const filter = (data, width, height) => {
        const out = new Uint8Array(width * height * channels + height);
        const pixel_length = (width * channels);
        const scanline_length = pixel_length + 1;

        for (let y = height - 1; y >= 0; y--) {
            let idx = 0;

            let none_row = new Uint8Array(width * channels + 1); // SUB
            let sub_row = new Uint8Array(width * channels + 1); // SUB
            let up_row = new Uint8Array(width * channels + 1); // UP
            let avg_row = new Uint8Array(width * channels + 1); // AVG
            let paeth_row = new Uint8Array(width * channels + 1); // PAETH

            let none_score = 0;
            let sub_score = 0;
            let up_score = 0;
            let avg_score = 0;
            let paeth_score = 0;

            none_row[idx] = 0;
            sub_row[idx] = 1;
            up_row[idx] = 2;
            avg_row[idx] = 3;
            paeth_row[idx] = 4;

            idx++;

            for (x = 0; x < pixel_length; x++) {
                const up = ((y - 1) >= 0) ? data[(y - 1) * pixel_length + x] : 0;
                const left = ((x - channels) >= 0) ? data[y * pixel_length + x - channels] : 0;
                const up_left = (((y - 1) >= 0) && ((x - channels) >= 0)) ? data[(y - 1) * pixel_length + x - channels] : 0;

                const none_val = data[y * pixel_length + x];
                const sub_val = data[y * pixel_length + x] - left;
                const up_val = data[y * pixel_length + x] - up;
                const avg_val = data[y * pixel_length + x] - Math.floor((up + left) / 2);
                const paeth_val = data[y * pixel_length + x] - paeth_predictor(up, left, up_left);

                none_score += Math.abs(none_val);
                sub_score += Math.abs(sub_val);
                up_score += Math.abs(up_val);
                avg_score += Math.abs(avg_val);
                paeth_score += Math.abs(paeth_val);

                none_row[idx] = none_val;
                sub_row[idx] = sub_val;
                up_row[idx] = up_val;
                avg_row[idx] = avg_val;
                paeth_row[idx] = paeth_val;

                idx++;
            }

            let win_idx = 0;
            let win_row = none_row;

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

            for (let i = 0; i < width * channels + 1; i++) {
                out[y * scanline_length + i] = win_row[i];
            }
        }

        return out;
    }

    data = filter(data, width, height);

    const zlib_output = pako.deflate(data);

    // TEST DEFILTER
    /*let defilter_idx = 0;
    const defilter = new Uint8Array(width * height * channels);
    console.log(data)

    const pixel_length = (width * channels);
    const real_length = pixel_length;
    const scanline_length = Math.ceil(real_length) + 1;

        for (let y = 0; y < height; y++) {
            const filter_type = data[y * scanline_length];
            switch (filter_type) { // NONE
                case 0:
                    console.log("NONE");
                    for (let x = 0; x < pixel_length; x++) {
                        defilter[defilter_idx++] = data[y * scanline_length + x + 1];
                    }
                    break;
                case 1: // SUB
                    console.log("SUB");
                    for (let x = 0; x < pixel_length; x++) {
                        const left = ((x - channels) >= 0) ? defilter[y * pixel_length + x - channels] : 0;
                        defilter[defilter_idx++] = data[y * scanline_length + x + 1] + left;
                    }
                    break;
                case 2: // UP
                    console.log("UP");
                    for (let x = 0; x < pixel_length; x++) {
                        const up = ((y - 1) >= 0) ? defilter[(y - 1) * pixel_length + x] : 0;
                        defilter[defilter_idx++] = data[y * scanline_length + x + 1] + up;
                    }
                    break;
                case 3: // AVG
                    console.log("AVG");
                    for (let x = 0; x < pixel_length; x++) {
                        const up = ((y - 1) >= 0) ? defilter[(y - 1) * pixel_length + x] : 0;
                        const left = ((x - channels) >= 0) ? defilter[y * pixel_length + x - channels] : 0;
                        defilter[defilter_idx++] = data[y * scanline_length + x + 1] + Math.floor((up + left) / 2)
                    }
                    break;
                case 4: // PAETH
                    console.log("PAETH");
                    for (let x = 0; x < pixel_length; x++) {
                        const up = ((y - 1) >= 0) ? defilter[(y - 1) * pixel_length + x] : 0;
                        const left = ((x - channels) >= 0) ? defilter[y * pixel_length + x - channels] : 0;
                        const up_left = (((y - 1) >= 0) && ((x - channels) >= 0)) ? defilter[(y - 1) * pixel_length + x - channels] : 0; // R
                        defilter[defilter_idx++] = data[y * scanline_length + x + 1] + paeth_predictor(up, left, up_left); // R
                    }
                    break;
            }
        }*/

    // test trippy visualization after filtering
    // let temp = new Uint8Array(pixels);
    // let temp_idx = 0;
    // let temp_idx1 = 0;

    // while (temp_idx < pixels.length) {
    //     pixels[temp_idx++] = data[temp_idx1++];
    //     pixels[temp_idx++] = data[temp_idx1++];
    //     pixels[temp_idx++] = data[temp_idx1++];
    //     temp_idx++;
    // }
    // // for (let i = 0; i < temp.length; i++) {
    // //     pixels[temp_idx] = filtered_data[temp_idx++];
    // // }

    // render();

    // pixels = temp;

    // constructing file
    let byte_size = 0;
    byte_size += 8; // SIGNATURE
    byte_size += 4 + 4 + 13 + 4; // IHDR CHUNK (size, type, data, crc)
    byte_size += 4 + 4 + zlib_output.length + 4; // IDAT CHUNK (size, type, data, crc)
    byte_size += 4 + 4 + 4; // END CHUNK (size, type, data (0), crc)

    const bytes = new Uint8Array(byte_size);

    // the first 8 bytes that png contains according to w3c specification (signature)
    bytes[p++] += 0x89;
    bytes[p++] += 0x50;
    bytes[p++] += 0x4E;
    bytes[p++] += 0x47;
    bytes[p++] += 0x0D;
    bytes[p++] += 0x0A;
    bytes[p++] += 0x1A;
    bytes[p++] += 0x0A;

    // IHDR header
    add_chunk(chunk_types.IHDR, [
        width >>> 24 & 0xff,
        width >>> 16 & 0xff,
        width >>> 8 & 0xff,
        width & 0xff,
        height >>> 24 & 0xff,
        height >>> 16 & 0xff,
        height >>> 8 & 0xff,
        height & 0xff,
        bit_depth,
        color_type,
        compression,
        filter1,
        interlace
    ]);

    // IDAT header
    add_chunk(chunk_types.IDAT, zlib_output);

    // IEND header
    add_chunk(chunk_types.IEND, []);

    console.log(bytes, bytes.buffer);
    return bytes.buffer;
}

const decode_png = (file_name, buffer) => {
    // checking if this is a png file by the signature
    const bytes = new Uint8Array(buffer);
    console.log(bytes)
    let p = 0;

    const inflator = new pako.Inflate();

    if (bytes[p++] === 0x89 &&
        bytes[p++] === 0x50 &&
        bytes[p++] === 0x4E &&
        bytes[p++] === 0x47 &&
        bytes[p++] === 0x0D &&
        bytes[p++] === 0x0A &&
        bytes[p++] === 0x1A &&
        bytes[p++] === 0x0A) {
    } else {
        console.error(`(${file_name}): PNG_INVALID_FILE; "yeahhh the imported file is not png"`);
        return -1;
    }

    // IHDR PROPERTIES (IMPORTANT!!!)
    let width, height, bit_depth, color_type, compression, filter, interlace;

    // PLTE (if exists)
    let palette;

    // IDAT (pixomato only supports one chunk)
    let idat_data = [];

    // chunkz
    while (p < bytes.length) {
        const length = (bytes[p++] << 24 | bytes[p++] << 16 | bytes[p++] << 8 | bytes[p++]) >>> 0;

        if (length > (0x7fffffff)) {
            console.error(`(${file_name}): PNG_OVER_CHUNK_SIZE_LIMIT; one chunk of imported png file has too much data`);
            return -1;
        }

        const t_1 = bytes[p++];
        const t_2 = bytes[p++];
        const t_3 = bytes[p++];
        const t_4 = bytes[p++];

        //console.log("LENGTH: ", length, "TYPE: ", String.fromCharCode(t_1), String.fromCharCode(t_2), String.fromCharCode(t_3), String.fromCharCode(t_4), t_1.toString(16), t_2.toString(16), t_3.toString(16), t_4.toString(16));

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
            console.warn(`(${file_name}): PNG_CRC_MISMATCH; "the imported png file may be corrupted or something"`);
        };

        let i = 4;

        if (comp_bytes(t_1, t_2, t_3, t_4, 0x49, 0x48, 0x44, 0x52)) { // IHDR
            width = (crc_input[i++] << 24 | crc_input[i++] << 16 | crc_input[i++] << 8 | crc_input[i++]) >>> 0;
            height = (crc_input[i++] << 24 | crc_input[i++] << 16 | crc_input[i++] << 8 | crc_input[i++]) >>> 0;
            bit_depth = crc_input[i++];
            color_type = crc_input[i++];
            compression = crc_input[i++];
            filter = crc_input[i++];
            interlace = crc_input[i++];

            switch (bit_depth) {
                case 1: case 2: case 4: case 8:
                    break;
                case 16:
                    console.error(`(${file_name}): PNG_UNSUPPORTED_BIT_DEPTH; "Pixomato does not support 16-bit color"`);
                    return -1;
                default:
                    console.error(`(${file_name}): PNG_ILLEGAL_BIT_DEPTH; "the imported png file has an odd amount of bit depth. perhaps it's illegal?"`);
                    return -1;
            }

            if (width === 0 || height === 0) {
                console.error("the imported png file has no width or height. are you trying to import nothing?")
                return - 1;
            }

        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x50, 0x4C, 0x54, 0x45)) { // PLTE
            if (color_type != 3) {
                console.error(`(${file_name}): PNG_ILLEGAL_CHUNK; "the imported png file has a color palette, but the color type is not indexed"`);
            }

            const data = new Uint8Array(crc_input.buffer, 4, length);
            palette = data;
            // console.log("PLTE", data);
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x49, 0x44, 0x41, 0x54)) { // IDAT
            if (compression !== 0) {
                console.error("compression method other than 0 for the imported png file. other methods coming soon!")
                return -1;
            }
            idat_data.push(new Uint8Array(crc_input.buffer, 4, length));
            // console.log("IDAT", idat_data)
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x49, 0x45, 0x4E, 0x44)) { // IEND
            // console.log("IEND")
        } else if (comp_bytes(t_1, t_2, t_3, t_4, 0x74, 0x45, 0x58, 0x74)) { //tEXt
            // console.log("tEXt")
            // const data = new Uint8Array(crc_input.buffer, 4, length);
            // let out = "";
            // for (let i = 0; i < data.length; i++) {
            //     out += String.fromCharCode(data[i]);
            // }
            // console.log(out);
        }
    }

    const extract_byte = (b, idx) => {
        return ((b >> (bit_depth * ((8 / bit_depth) - 1 - idx))) & ((2 ** bit_depth) - 1))
    }

    const defilter = (data, width, height) => {
        testarr1 = data
        let out_idx = 0;
        const out = new Uint8Array(width * height * channels);

        const pixel_length = (width * channels);
        const real_length = pixel_length / (8 / bit_depth);
        const scanline_length = Math.ceil(real_length) + 1;

        for (let y = 0; y < height; y++) {
            const filter_type = data[y * scanline_length];
            switch (filter_type) { // NONE
                case 0:
                    for (let x = 0; x < pixel_length; x++) {
                        out[out_idx++] = extract_byte(data[y * scanline_length + Math.floor(x / (8 / bit_depth)) + 1], x % (8 / bit_depth));
                    }
                    break;
                case 1: // SUB
                    for (let x = 0; x < pixel_length; x++) {
                        const left = ((x - channels) >= 0) ? extract_byte(out[y * pixel_length + x - channels], x % (8 / bit_depth)) : 0;
                        out[out_idx++] = extract_byte(data[y * scanline_length + Math.floor(x / (8 / bit_depth)) + 1], x % (8 / bit_depth)) + left;
                    }
                    break;
                case 2: // UP
                    for (let x = 0; x < pixel_length; x++) {
                        const up = ((y - 1) >= 0) ? extract_byte(out[(y - 1) * pixel_length + x], x % (8 / bit_depth)) : 0;
                        out[out_idx++] = extract_byte(data[y * scanline_length + Math.floor(x / (8 / bit_depth)) + 1], x % (8 / bit_depth)) + up;
                    }
                    break;
                case 3: // AVG
                    for (let x = 0; x < pixel_length; x++) {
                        const up = ((y - 1) >= 0) ? extract_byte(out[(y - 1) * pixel_length + x], x % (8 / bit_depth)) : 0;
                        const left = ((x - channels) >= 0) ? extract_byte(out[y * pixel_length + x - channels], x % (8 / bit_depth)) : 0;
                        out[out_idx++] = extract_byte(data[y * scanline_length + Math.floor(x / (8 / bit_depth)) + 1], x % (8 / bit_depth)) + Math.floor((up + left) / 2)
                    }
                    break;
                case 4: // PAETH
                    for (let x = 0; x < pixel_length; x++) {
                        const up = ((y - 1) >= 0) ? extract_byte(out[(y - 1) * pixel_length + x], x % (8 / bit_depth)) : 0;
                        const left = ((x - channels) >= 0) ? extract_byte(out[y * pixel_length + x - channels], x % (8 / bit_depth)) : 0;
                        const up_left = (((y - 1) >= 0) && ((x - channels) >= 0)) ? extract_byte(out[(y - 1) * pixel_length + x - channels], x % (8 / bit_depth)) : 0; // R
                        out[out_idx++] = extract_byte(data[y * scanline_length + Math.floor(x / (8 / bit_depth)) + 1], x % (8 / bit_depth)) + paeth_predictor(up, left, up_left); // R
                    }
                    break;
            }
        }

        return out;
    }

    // DECODING
    //let deflate = new Zlib.Inflate(idat_data);
    for (let idat_idx = 0; idat_idx < idat_data.length; idat_idx++) {
        inflator.push(idat_data[idat_idx], idat_idx >= idat_data.length - 1);
    }

    if (inflator.err) {
        console.error(inflator.msg);
        return -1;
    }

    let out = inflator.result;

    // CHANNEL
    let channels;

    switch (color_type) {
        case 0: // GREYSCALE
            channels = 1;
            break;
        case 2: // TRUECOLOR
            channels = 3;
            break;
        case 3: // INDEXED
            channels = 1;
            break;
        case 4: // GREYSCALE WITH ALPHA
            channels = 2;
            break;
        case 6: // TRUECOLOR WITH ALPHA
            channels = 4;
            break;
    }

    let out1;

    if (interlace === 1) {
        // adam7 time (the interlacing algorithm)
        const startX = [0, 4, 0, 2, 0, 1, 0]
        const incX = [8, 8, 4, 4, 2, 2, 1]
        const startY = [0, 0, 4, 0, 2, 0, 1]
        const incY = [8, 8, 8, 4, 4, 2, 2]

        out1 = new Uint8Array(height * width * channels)

        let idx_i = 0
        let wid, hei

        for (let i = 0; i < 7; i++) {
            wid = 0;
            hei = 0;

            for (let x = startX[i]; x < width; x += incX[i])
                wid++;

            for (let y = startY[i]; y < height; y += incY[i])
                hei++;

            if (hei !== 0 && wid !== 0) {
                const data = new Uint8Array(hei * Math.ceil(wid * channels / (8 / bit_depth)) + hei);

                for (let i = 0; i < data.length; i++) {
                    data[i] = out[idx_i++];
                }

                let idx_d = 0;
                const defiltered = defilter(data, wid, hei);

                for (let y = startY[i]; y < height; y += incY[i])
                    for (let x = startX[i]; x < width; x += incX[i])
                        for (let j = 0; j < channels; j++)
                            out1[(y * width + x) * channels + j] = defiltered[idx_d++];
            }
        }
    } else {
        out1 = defilter(out, width, height);
    }

    canvasSizeX = width;
    canvasSizeY = height;

    imageData = new ImageData(width, height);
    pixels = new Uint8Array(imageData.data.buffer);

    scaler.width = width;
    scaler.height = height;

    if (color_type !== 3) {
        let offset = 0;
        for (let x = 0; x < out1.length; x += channels) {
            for (let i = 0; i < channels; i++) {
                pixels[x + offset + i] = out1[x + i];
            }
            if (channels === 3) {
                pixels[x + 3 + offset] = 255;
                offset++;
            }
        }
    } else {
        let pixel_idx = 0;
        for (let x = 0; x < out1.length; x++) {
            pixels[pixel_idx++] = palette[out1[x] * 3]
            pixels[pixel_idx++] = palette[out1[x] * 3 + 1]
            pixels[pixel_idx++] = palette[out1[x] * 3 + 2]
            pixels[pixel_idx++] = 255
        }
    }

    if (canvasSizeX / canvasSizeY > displayWidth / displayHeight) {
        zoom = ((displayWidth) / (canvasSizeX * 1.2)).clamp(0.01, 100)
    } else {
        zoom = ((displayHeight) / (canvasSizeY * 1.2)).clamp(0.01, 100)
    }

    posX = 0;
    posY = 0;

    outsidePixels = {}

    render();

    /*const temp = new Uint8Array(pixels);
    for (let i = 0; i < out1.length; i++) {
        pixels[i] = out1[i];
    }
    render();*/
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
                    decode_png(file.name, arrayBuffer);
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
    input.remove();
}

async function saveFile(plaintext, fileName, fileType) {
    return new Promise((resolve, reject) => {
      const dataView = new DataView(plaintext);
      const blob = new Blob([dataView], { type: fileType });
  
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
        return resolve();
      } else if (/iPhone|fxios/i.test(navigator.userAgent)) {
        // This method is much slower but createObjectURL
        // is buggy on iOS
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          if (reader.error) {
            return reject(reader.error);
          }
          if (reader.result) {
            const a = document.createElement('a');
            // @ts-ignore
            a.href = reader.result;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
          }
          resolve();
        });
        reader.readAsDataURL(blob);
      } else {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);
        setTimeout(resolve, 100);
      }
    });
  }

const export_img = (type, data, desc) => {
    // function download(file, data) {
    //     //creating an invisible element

    //     let element = document.createElement('a');
    //     element.setAttribute('href',
    //         'data:img/png;, '
    //         + data);
    //     element.setAttribute('download', file);
    //     element.click();

    //     element.remove();
    // }

    // download("test10.png", encode_png());

    saveFile(encode_png(data, desc), "pixomato_out", "image/png")
}