// Copyright (C) 2025 AlaTomKing
// Copyright (C) 2002-2013 Mark Adler

// This software is provided 'as-is', without any express or implied
// warranty.  In no event will the author be held liable for any damages
// arising from the use of this software.

// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:

// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
  
// This is some sort of a translation and a little bit of interpretation
// of "puff.c" written in JavaScript by me, Tom!

// I will comment anything different from "puff.c", while original comments
// will still be put inside the code, e.g.: data types

const SLOW = false;
const INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR = false;

/*
 * Maximums for allocations and loops.  It is not useful to change these --
 * they are fixed by the deflate format.
 */
const MAXBITS = 15;               /* maximum bits in a code */           
const MAXLCODES = 286;            /* maximum number of literal/length codes */
const MAXDCODES = 30;             /* maximum number of distance codes */
const MAXCODES = (MAXLCODES + MAXDCODES);  /* maximum codes lengths to read */
const FIXLCODES = 288;            /* number of fixed literal/length codes */

// JavaScript does not have struct so lets make a comment imagining on what
// the structs should look like

/** state (struct)
 * 
 * // output state
 * Uint8Array out       (unsigned *char, 8-bit)
 * Number outlen        (unsigned long, 32-bit)
 * Number outcnt        (unsigned long, 32-bit)
 * 
 * // input state
 * Uint8Array in        (unsigned *char, 8-bit)
 * Number inlen         (unsigned long, 32-bit)
 * Number incnt         (unsigned long, 32-bit)
 * Number bitbuf        (int,           16-bit)
 * Number bitcnt        (int,           16.bit)
 * 
 * // input limit error return state for bits() and decode()
 * ? env                (jmp_buf, i dont know)  
 * 
 */

/*
 * Return need bits from the input stream.  This always leaves less than
 * eight bits in the buffer.  bits() works properly for need == 0.
 *
 * Format notes:
 *
 * - Bits are stored in bytes from the least significant bit to the most
 *   significant bit.  Therefore bits are dropped from the bottom of the bit
 *   buffer, using shift right, and new bytes are appended to the top of the
 *   bit buffer, using shift left.
 */
const bits = (s, need) => { // s: state (struct), need: Number (int)
    let val;

    val = s.bitbuf;
    while (s.bitcnt < need) {
        if (s.incnt === s.inlen)
            longjmp(s.env, 1);
        val |= (s.in[s.incnt++]) << s.bitcnt;
        s.bitcnt += 8;
    }

    s.bitbuf = (val >> need);
    s.bitcnt -= need;

    return (val & ((1 << need) - 1));
}

const stored = (s) => {
    let len;

    s.bitbuf = 0;
    s.bitcnt = 0;

    if (s.incnt + 4 > s.inlen)
        return 2;
    len = s.in[s.incnt++];
    len |= s.in[s.incnt++] << 8;
    if (s.in[s.incnt++] !== (~len & 0xff) ||
        s.in[s.incnt++] !== ((~len >> 8) & 0xff))
        return 2;
    
    if (s.incnt + len > s.inlen)
        return 2;
    if (s.out !== null) {
        if (s.outcnt + len > s.outlen)
            return 1;
        while (len--)
            s.out[s.outcnt++] = s.in(s.incnt++);
    } else {
        s.outcnt += len;
        s.incnt += len;
    }

    return 0;
}

/** huffman (struct)
 * 
 * Uint16Array count    (*short, 16-bit)
 * Uint16Array symbol   (*short, 16-bit)
 *
 */

const decode = (s, h) => {
    if (SLOW) {
        let len;
        let code;
        let first;
        let count;
        let index;

        code = first = index = 0;
        for (len = 1; len <= MAXBITS; len++) {
            code |= bits(s, 1);
            count = h.count[len];
            if (code - count < first)
                return h.symbol[index + (code - first)];
            index += count;
            first += count;
            first <<= 1;
            code <<= 1;
        }
        return -10;
    } else {
        let len;
        let code;
        let first;
        let count;
        let index;
        let bitbuf;
        let left;
        let next;

        bitbuf = s.bitbuf;
        left = s.bitcnt;
        code = first = index = 0;
        len = 1;
        next = h.count + 1;
        while (true) {
            while (left--) {
                code |= bitbuf & 1;
                bitbuf >>= 1;
                count = next++;
                if (code - count < first) { /* if length len, return symbol */
                    s.bitbuf = bitbuf;
                    s.bitcnt = (s.bitcnt - len) & 7;
                    return h.symbol[index + (code - first)];
                }
                index += count;             /* else update for next length */
                first += count;
                first <<= 1;
                code <<= 1;
                len++;
            }
            left = (MAXBITS+1) - len;
            if (left === 0)
                break;
            if (s.incnt === s.inlen)
                longjmp(s.env, 1);         /* out of input */
            bitbuf = s.in[s.incnt++];
            if (left > 8)
                left = 8;
        }
        return -10;                         /* ran out of codes */
    }
}

const construct = (h, length, n) => {
    let symbol;
    let len;
    let left;
    let offs = new Int16Array(MAXBITS + 1);

    for (len = 0; len <= MAXBITS; len++)
        h.count[len] = 0;
    for (symbol = 0; symbol < n; symbol++)
        (h.count[length[symbol]])++;
    if (h.count[0] === n)
        return 0;

    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= h.count[len];
        if (left < 0)
            return left;
    }

    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++)
        offs[len + 1] = offs[len] + h.count[len];

    for (symbol = 0; symbol < n; symbol++)
        if (length[symbol] !== 0)
            h.symbol[offs[length[symbol]]++] = symbol;
    
    return left;
}

const lens = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
const lext = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
    3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
const dists = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
    257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
    8193, 12289, 16385, 24577];
const dext = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
    12, 12, 13, 13];
const codes = (s, lencode, distcode) => {
    let symbol;
    let len;
    let dist;
    
    do {
        symbol = decode(s, lencode);
        if (symbol < 0)
            return symbol;
        if (symbol < 256) {
            if (s.out !== null) {
                if (s.outcnt === s.outlen)
                    return 1;
                s.out[s.outcnt] = symbol;
            }
            s.outcnt++;
        } else if (symbol > 256) {
            symbol -= 257;
            if (symbol >= 29)
                return -10;
            len = lens[symbol] + bits(s, lext[symbol]);

            symbol = decode(s, distcode);
            if (symbol < 0)
                return symbol;
            dist = dists[symbol] + bits(s, dext[symbol]);
            if (INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR && dist > s.outcnt)
                return -11;

            if (s.out !== null) {
                if (s.outcnt + len > s.outlen)
                    return 1;
                while (len--) {
                    s.out[s.outcnt] = INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR &&
                        dist > s.outcnt ? 0 : s.out[s.outcnt - dist];
                    s.outcnt++;
                }
            } else
                s.outcnt += len;
        }
    } while (symbol !== 256);

    return 0;
}

// JavaScript doesn't have static variables so they are global
let virgin, lencnt, distcnt, lencode, distcode;
const fixed = (s) => {
    virgin = 1;
    lencnt = new Int16Array(MAXBITS+1), lensym = new Int16Array(FIXLCODES);
    distcnt = new Int16Array(MAXBITS + 1), distsym = new Int16Array(MAXDCODES);
    lencode, distcode;

    if (virgin) {
        let symbol;
        let lengths = new Int16Array(FIXLCODES)

        lencode.count = lencnt;
        lencode.symbol = lensym;
        distcode.count = distcnt;
        distcode.symbol = distsym;

        for (symbol = 0; symbol < 144; symbol++)
            lengths[symbol] = 8;
        for (; symbol < 256; symbol++)
            lengths[symbol] = 9;
        for (; symbol < 280; symbol++)
            lengths[symbol] = 7;
        for (; symbol < FIXLCODES; symbol++)
            lengths[symbol] = 8;
        construct(lencode, lengths, FIXLCODES);

        for (symbol = 0; symbol < MAXDCODES; symbol++)
            lengths[symbol] = 5;
        construct(distcode, lengths, MAXDCODES);

        virgin = 0;
    }

    return codes(s, lencode, distcode);
}

const order =
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
const dynamic = (s) => {
    let nlen, ndist, ncode;
    let index;
    let err;
    const lengths = new Int16Array(MAXCODES);
    const lencnt = new Int16Array(MAXBITS+1), lensym = new Int16Array(MAXLCODES);
    const distcnt = new Int16Array(MAXBITS+1), distsym = new Int16Array(MAXLCODES);
    let lencode, distcode;

    lencode.count = lencnt;
    lencode.symbol = lensym;
    distcode.count = distcnt;
    distcode.symbol = distsym;

    nlen = bits(s, 5) + 257;
    ndist = bits(s, 5) + 1;
    ncode = bits(s, 4) + 4;
    if (nlen > MAXLCODES || ndist > MAXDCODES)
        return -3;

    for (index = 0; index < ncode; index++)
        lengths[order[index]] = bits(s, 3);
    for (; index < 19; index++)
        lengths[order[index]] = 0;

    err = construct(lencode, lengths, 19);
    if (err !== 0)
        return -4;

    index = 0;
    while (index < nlen + ndist) {
        let symbol;
        let len;

        symbol = decode(s, lencode);
        if (symbol < 0)
            return symbol;
        if (symbol < 16)
            lengths[index++] = symbol;
        else {
            len = 0;
            if (symbol === 16) {
                if (index === 0)
                    reutrn - 5;
                len = lengths[index - 1]
                symbol = 3 + bits(s, 2);
            } else if (symbol === 17)
                symbol = 3 + bits(s, 3);
            else
                symbol = 11 + bits(s, 7);
            if (index + symbol > nlen + ndist)
                return -6;
            while (symbol--)
                lengths[index++] = len;
        }
    }

    if (lengths[256] === 0)
        return -9;

    err = construct(lencode, lengths, nlen);
    if (err && (err < 0 || nlen !== lencode.count[0] + lencode.count[1]))
        return -7;

    err = construct(distcode, lengths + nlen, ndist);
    if (err && (err < 0 || ndist !== distcode.count[0] + distcode.count[1]))
        return -8;

    return codes(s, lencode, distcode);
}

const puff = (dest, destlen, source, sourcelen) => {
    let s;
    let last, type;
    let err;

    s.out = dest;
    s.outlen = destlen;
    s.outcnt = 0;

    s.in = source;
    s.inlen = sourcelen;
    s.incnt = 0;
    s.bitbuf = 0;
    s.bitcnt = 0;

    if (setjmp(s.env) !== 0)
        err = 2;
    else {
        do {
            last = bits(s, 1);
            type = bits(s, 2);
            err = type === 0 ?
                stored(s) :
                (type === 1 ?
                    fixed(s) :
                    (type === 2 ?
                        dynamic(s) :
                        -1));
            if (err !== 0)
                break;
        } while (!last);
    }

    if (err <= 0) {
        destlen = s.outcnt;
        sourcelen = s.incnt;
    }
}