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
// will still be put inside the code, e.g.: parameter types

const SLOW = false;

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
        if (s.incnt == s.inlen)
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
    if (s.in[s.incnt++] != (~len & 0xff) ||
        s.in[s.incnt++] != ((~len >> 8) & 0xff))
        return 2;
    
    if (s.incnt + len > s.inlen)
        return 2;
    if (s.out != null) {
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
            if (left == 0)
                break;
            if (s.incnt == s.inlen)
                longjmp(s.env, 1);         /* out of input */
            bitbuf = s.in[s.incnt++];
            if (left > 8)
                left = 8;
        }
        return -10;                         /* ran out of codes */
    }
}