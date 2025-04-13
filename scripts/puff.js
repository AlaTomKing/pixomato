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

// This script does not have as many comments as the original one
// but I might add them if I have the courage

const MAXBITS = 15;
const MAXLCODES = 286;
const MAXDCODES = 30;
const MAXCODES = (MAXLCODES + MAXDCODES);
const FIXLCODES = 288;

// JavaScript does not have struct so lets make a comment imagining on what
// the struct should look like

/** state
 * 
 * // output state
 * Uint8Array out       (unsigned char, 8-bit)
 * Number outlen        (unsigned long, 32-bit)
 * Number outcnt        (unsigned long, 32-bit)
 * 
 * // input state
 * Uint8Array in        (unsigned char, 8-bit)
 * Number inlen         (unsigned long, 32-bit)
 * Number incnt         (unsigned long, 32-bit)
 * Number bitbuf        (int,           16-bit)
 * Number bitcnt        (int,           16.bit)
 * 
 * // input limit error return state for bits() and decode()
 * ? env                (jmp_buf, i dont know)  
 * 
 */

