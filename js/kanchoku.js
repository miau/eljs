// kanchoku.js - core of KANCHOKU/JS (JavaScript implemented KANCHOKU)
//
// Copyright (C) 2007  YUSE Yosihiro
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA


// ===================================================================
// config

// kanchoku cookie format
//   kanchoku= im=T:kbd=QWERTY: ;
//   expires= Wed, 08-Jun-2005 15:56:25 GMT

var c_cookie_name = 'kanchokujs';


// ===================================================================
// KANCHOKU <: KANSAKU

function KANCHOKU() {
  KANSAKU();

  //this.internal_keys = '1234567890qwertyuiopasdfghjkl;zxcvbnm,./';

  this.ims = new Object();
  this.imid = null;
  this.im = null;

  this.kbs = new Object();
  this.kbid = null;
  this.kb = null;

  this.ck = new Cookie(c_cookie_name);

  //this.chars = new Array();
  this.mode = null;
  this.code = null;
  this.decoded = null;
  //this.obary = new Array();
  //this.ready = true;

  this.tbl = new Object();

  return this;
}

KANCHOKU.prototype = new KANSAKU();

// ===================================================================
// set
// !!! IE5/MacOS8 does not have `in' operator

KANCHOKU.prototype.setim = function(id) {
  if (this.ims[id] == null) { return false; }

  // set
  this.im = this.ims[this.imid = id];

  //2007-03-24
  //alert(this.im);
  this.tbl = this.mktbl(this.im);
  return true;
};

KANCHOKU.prototype.setkb = function(id) {
  if (this.kbs[id] != null) {
    this.kb = this.kbs[this.kbid = id];
    return true;
  } else {
    return false;
  }
}

KANCHOKU.prototype.setim_with_ck = function(id) {
  if (this.setim(id)) {
    if (! this.im.nocookie) { this.ck.set('im', this.imid); } // user def
  }
};

KANCHOKU.prototype.setkb_with_ck = function(id) {
  if (this.setkb(id)) {
    if (! this.im.nocookie) { this.ck.set('kb', this.kbid); } // user def
  }
};

// ===================================================================
// tbl

KANCHOKU.prototype.mktbl = function(im) {
  var code, ch;
  var tbl = new Object();
  for (ch in im.encodetable) {
    code = im.encodetable[ch];
    var a = code.split('');
    this.tbl = this.mktbl_sub(tbl, a, ch);
  }
  return tbl;
};

KANCHOKU.prototype.mktbl_sub = function(tbl, a, ch) {
  if (a.length == 1) {
    tbl[a[0]] = ch;
  } else {
    st = a.SHIFT();
    if (typeof tbl[st] == 'object') {
    } else {
      tbl[st] = new Object();
    }
    this.mktbl_sub(tbl[st], a, ch);
  }
  return tbl;
};

// ===================================================================
// decode

KANCHOKU.prototype.decode = function(s) {
  var a = s.split('');
  var i;
  for (s = '', i = 0; i < a.length; i++) {
    s += this.kb.decodemap[a[i]] || a[i];
  }
  return this.decode_internal(s);
};

KANCHOKU.prototype.decode_internal = function(s) {
  this.code = s;
  this.decoded = this.decode_sub(s);
  return this.decoded;
}

// decode
KANCHOKU.prototype.decode_sub = function(s) {
  var a = s.split('');
  var s = '';
  var tbl = this.tbl
  while (0 < a.length) {
    var st = a[0]; a.SHIFT();
    if (typeof tbl[st] == 'string') {
      s += tbl[st];
      tbl = this.tbl;
    } else if (typeof tbl[st] == 'object') {
      //s += st;
      // XXX
      tbl = tbl[st];
    } else {
      if (tbl == this.tbl) { s += st; }
      tbl = this.tbl;
    }
  }
  return s;
}

// ===================================================================
// Local Variables:
// mode: c++
// end:
