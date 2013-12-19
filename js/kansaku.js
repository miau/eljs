// kansaku.js - core of eelll/JS (JavaScript implemented EELLL)
// 
// Copyright (C) 2005, 2013  YUSE Yosihiro
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
// KANSAKU

function KANSAKU() {
  this.internal_keys = '1234567890qwertyuiopasdfghjkl;zxcvbnm,./';
  this.hasidamnem_chars = ('ごげぐぎがかきくけこ' +
			   'ぞぜずじざさしすせそ' +
			   'どでづぢだたちつてと' +
			   'ぼべぶびばはひふへほ' + 'ん').split('');

  this.ims = new Object();
  this.imid = null;
  this.im = null;

  this.kbs = new Object();
  this.kbid = null;
  this.kb = null;

  this.chars = new Array();
  this.obary = new Array();
  this.ready = true;

  //// YYY ZZZ
  this.hs = null;
  this.hsid = null;
}

// ===================================================================
// YYY
// split into chars

KANSAKU.prototype.kssplit = function(str) {
  if (this.im && this.im.charpattern) {
    return str.match(this.im.charpattern) || [];
  } else {
    return str.split('');
  }
}

// ===================================================================
// add

KANSAKU.prototype.addim = function(im) {
  this.ims[im.id] = im;

  // first entry to default value
  if (this.imid == null) {
    this.imid = im.id;
    this.im = im;
  }
}

KANSAKU.prototype.addkb = function(kb) {
  this.kbs[kb.id] = kb;

  // first entry to default value
  if (this.kbid == null) {
    this.kbid = kb.id;
    this.kb = kb;
  }
}

// ===================================================================
// user defined im

KANSAKU.prototype.userdef = function(srctext) {
  // check
  if (! this.im.customizable) { return false; }

  // XXX : clear first ???
  this.im.encodetable = new Object;
  this.im.encodetable_alt = new Object;
  this.im.prefix = new Object;
  // this.im.decodetable = new Object;
  // this.im.ndefs = 0;

  this.im.srctext = srctext;

  var a = srctext.split(/\r\n|\n|\r/);
  var n = 0;
  for (var i = 0; i < a.length; i++) {
    var e = a[i];
    // -----------------
    // include directive
    // -----------------
    // 「#include id」で該当する im/*.js を (その場で) 読みこんだことにする
    if (e.match(/^#include\s+(\S+)/)) {
      var imid = RegExp.$1;
      var im = this.ims[imid];
      if (im) {
	// 正規の定義
	for (var ch in im.encodetable) {
	  this.im.encodetable[ch] = im.encodetable[ch];
	}
	// alt 定義
	//if (! this.im.encodetable_alt) {
	//  this.im.encodetable_alt = new Object();
	//}
	for (var ch in im.encodetable_alt) {
	  this.im.encodetable_alt[ch] = im.encodetable_alt[ch];
	}
	// prefix
	if (im.prefix) {
	  //this.im.prefix = new Object();
	  for (var pref in im.prefix) {
	    this.im.prefix[pref] = im.prefix[pref];
	  }
	}
      }
    } // end of include directive

    // skip comment line
    if (e.match(/^[#;]/)) { continue; }

    // if valid definition, do it
    // -------------------
    // standard definition
    // -------------------
    if (e.match(/^(.)=(.+)/)) {
      var ch = RegExp.$1;
      var st = RegExp.$2;
      this.im.encodetable[ch] = st;
      // this.im.decodetable[st] = ch;
      //n += 1;
    }
    // ----------------
    // alias definition
    // ----------------
    if (e.match(/^(.)~(.+)/)) {
      var ch = RegExp.$1;
      var sa = RegExp.$2.split('');
      var st = '';
      for (var j = 0; j < sa.length; j++) {
	var c = sa[j];
	var s = this.im.encodetable[c] || c;
	st += s;
      }
      if (st != null) { this.im.encodetable_alt[ch] = st; }
    }
  }
  //this.im.ndefs += n; // XXX : count double defs???

  return true;
}

// ===================================================================
// set
// !!! IE5/MacOS8 does not have `in' operator

KANSAKU.prototype.setim = function(id) {
  if (this.ims[id] == null) { return false; }

  // set
  this.im = this.ims[this.imid = id];
  return true;
}

KANSAKU.prototype.setkb = function(id) {
  if (this.kbs[id] != null) {
    this.kb = this.kbs[this.kbid = id];
    return true;
  } else {
    return false;
  }
}

//// YYY ZZZ
KANSAKU.prototype.seths = function(id) {
  this.hs = id;                 // XXX
  this.hsid = id;               // XXX
  return true;
}

// ===================================================================
// T-Code encode/decode

// return stroke seq for Japanese ch
// in internal encoding (i.e. in QWERTY_JP string)
// - "の" => "kd"
// - " " => null
KANSAKU.prototype.encodech_internal = function(ch) {
  return (this.im.encodetable[ch] ||
	  this.im.encodetable_alt && this.im.encodetable_alt[ch]);
}

// return stroke seq in external encoding
// - "の" => "kd" for QWERTY
// - "の" => "te" for Dvorak
KANSAKU.prototype.encodech_external = function(ch) {
  var st = this.encodech_internal(ch);
  if (st == null) { return null; }

  var a = st.split('');
  st = '';
  for (var i = 0; i < a.length; i++) {
    st += this.kb.decodemap[a[i]] || a[i];
  }
  return st;
}

// return stroke seq in array of T-Code key (0--39)
// (this method is used for making stroke table)
KANSAKU.prototype.encodech_array = function(ch) {
  var st = this.encodech_internal(ch);
  var a = new Array;
  if (st == null) { return []; }
  var sa = st.split('');
  for (var i = 0; i < sa.length; i++) {
    var k = this.internal_keys.indexOf(sa[i]);
    if (k < 0) { return []; }	// XXX
    a.PUSH(k);
  }
  return a;
}

// return Japanese ch for stroke seq
// - "kd" => "の"
KANSAKU.prototype.decodech_internal = function(st) {
  return this.im.decodetable[st];
}

// HASIDA mnemonic
// - "kd" => "ちぢ"
KANSAKU.prototype.to_hasidamnem = function(st) {
  var mnem = '';
  var sta = st.split('');

  for (var i = 0; i < sta.length; i++) {
    var k = this.internal_keys.indexOf(sta[i]);
    if (0 <= k) { mnem += this.hasidamnem_chars[k]; }
    else if (sta[i] == ' ') { mnem += 'ん'; }	// XXX 'ん' for Space
    else { mnem += this.to_external(sta[i]); }	// XXX outer keys verbose
  }

  return mnem;
}

KANSAKU.prototype.to_external = function(st) {
  var alnum = '';
  var sta = st.split('');

  for (var i = 0; i < sta.length; i++) {
    alnum += this.kb.decodemap[sta[i]] || sta[i];
  }

  return alnum;
}

// 'の' => ['kd', null] // T-Code
// '氷' => ['kd', '▲'] // TT-Code
KANSAKU.prototype.encodech_internal_deprefixed = function(ch) {
  var st = this.encodech_internal(ch);
  if (st == null) { return ['', null]; }
  if (this.im.prefix != null) {
    for (var prefixmark in this.im.prefix) {
      var prefix = this.im.prefix[prefixmark];
      if (st.indexOf(prefix) == 0) {
	st = st.slice(prefix.length, st.length);
	return [st, prefixmark];
      }
    }
  }
  return [st, null];
}

// 'の' => ['kd', '']
// '氷' => ['kd', '▲']
KANSAKU.prototype.encodech_external_deprefixed = function(ch) {
  var a = this.encodech_internal_deprefixed(ch);
  var st = a[0];
  var prefix = a[1] || '';

  if (st == null) { return null; }

  var a = st.split('');
  st = '';
  for (var i = 0; i < a.length; i++) {
    st += this.kb.decodemap[a[i]] || a[i];
  }
  return [st, prefix];
}

// ===================================================================
// 'kd' => ['1/27', '2/22']
// 'kd', r => ['r1/27', 'r2/22']
KANSAKU.prototype.mkvkbd = function(a, prefix) {
  // to array
  if (typeof a == 'string') {
    a = a.split('');
    for (var i = 0; i < a.length; i++) {
      //var k = el.internal_keys.indexOf(a[i]);
      var k = this.internal_keys.indexOf(a[i]);
      if (k < 0) { a[i] = null; } // XXX
      else { a[i] = k; }
    }
  }
  // make virtual keyboard
  var b = new Array(40);	// virtual keyboard
  var ifw = false;		// if double stroke already
  for (var n = 0; n < a.length; n++) {
    var k = a[n];		// n'th stroke key number
    if (k == null) { continue; }
    if (b[k] != null) {		// double stroke
      if (ifw) { b[k] = 'x'; }
      else { ifw = true; b[k] = 'w'; }
    } else {			// not (yet) double
      if (3 <= n) { b[k] = '4'; }
      else        { b[k] = '' + (n+1); }
    }
  }

  // make array
  var r = new Array;
  for (var k = 0; k < b.length; k++) {
    if (b[k] != null) {
      var s = '';
      if (prefix != null) { s += prefix; }
      s += b[k] + '/' + (k < 10 ? '0' : '') + k;
      r.PUSH(s);
    }
  }

  return r;
}

// ===================================================================
// reset

KANSAKU.prototype.helpinvalidate = function() {
  this.obary.CLEAR();
  this.ready = false;

  return;
}

KANSAKU.prototype.helpclear = function() {
  ////this.helpdata.clear();
  
  this.chars.CLEAR();
  this.obary.CLEAR();
  this.ready = true;

  return this.chars;
}

KANSAKU.prototype.helpset = function(s) {
  // if arg string, convert to array
  //// YYY
  //if (typeof s == 'string') { s = s.split(''); }
  if (typeof s == 'string') { s = this.kssplit(s); }
  //alert(s);
  ////

  this.chars = s.DUP();
  this.obary.CLEAR();
  this.ready = false;

  return this.chars;
}

KANSAKU.prototype.helpmk_sub = function() {
  var ac = this.chars;
  var ao = this.obary;

  for (var i = 0; i < ac.length; i++) {
    var ch = ac[i];
    // 2011-03-01 : 0.2.4 : ignore white spaces
    if (ch == " ") { continue; }
    //
    var st_prefix = this.encodech_internal_deprefixed(ch);
    var sta = (this.encodech_internal(ch) || ch).split('');
    var sta = (this.encodech_internal(ch) || ch).split(/\s*/);
    var st = st_prefix[0] || '';
    var prefix = st_prefix[1];

    // tooltip
    for (var j = 0; j < sta.length; j++) {
      if (sta[j] == ' ') { sta[j] = 'SPC'; }
    }
    var tooltip = sta.join(' ');

    // skip ASCII if it is outset
    //XXX: outset
    //if (ch.match(/[ !-~]/) && st == '') { continue; }

    // XXX: outset
    var outset = false;
    if (st == '') { outset = true; st = ch; }
    var alt = false;
    if (! this.im.encodetable[ch]) { alt = true; }
    ao.PUSH( {ch:ch, st:st, prefix:prefix,
		   outset:outset, alt:alt,
		   tooltip:tooltip} );
  }
  
  this.ready = true;

  return ao;
}

KANSAKU.prototype.helpmk_with_style = function(style) {
  // style ::= dothelp | alnum | hasidamnem
  
  if (! this.ready) { this.helpmk_sub(); }


  var ret = new Array();
  var ao = this.obary;
  for (var i = 0; i < ao.length; i++) {
    var s;
    var o = ao[i];
    if (style == 'dothelp') {      s = this.helpmk_dothelp(o);
    } else if (style == 'alnum') { s = this.helpmk_alnum(o);
    } else if (style == 'hasidamnem') { s = this.helpmk_hasidamnem(o);
    } else { s = '???'; }		// XXX
    ret.PUSH(s);
  }

  return ret;
}

KANSAKU.prototype.helpmk_dothelp = function(ob) {
  var ch = ob.ch;
  var st = ob.st;
  var prefix = ob.prefix;
  if (prefix == '■') { prefix = 'a'; } // TRY
  else if (prefix == '▲') { prefix = 'r'; } // TT right
  else if (prefix == '▽') { prefix = 'l'; } // TT left

  var a = this.mkvkbd(st, prefix);
  // XXX: outset?
  if (ob.outset) { st = ''; }
  var ifoutkey = st.match(/[^0-9a-z,.\/;]/);
  var attr;
  if (ob.outset)   { attr = ' class="outset"'; }
  else if (ob.alt) { attr = ' class="alt"'; }
  else { attr = ' class="basic"'; }

  var s = '';
  s += '<span class="dothelp">';
  // ch
  s += '<span class="ch">' + ch + '</span>';
  // st
  s += '<span class="st" title="' + ob.tooltip + '">';
  s += '<img src="img/0/0.png" alt="0" width="100" height="40"' + attr + '>';
  for (var i = 0; i < a.length; i++) {
    var fn = '' + a[i];
    //s += '<img src="img/' + fn + '.png" alt="' + fn +
    //  '" width="100" height="40" class="llap100">';
    s += '<img src="img/' + fn + '.png" width="100" height="40" class="llap100" title="' + ob.tooltip + '">';
  }
  s += '</span>';		// class="st"
  if (ifoutkey) {
    s += '<span class="note" title="' + ob.tooltip + '">' + '(*)' + '</span>';
  }
  s += '</span>';		// class="dothelp"

  return s;
}

KANSAKU.prototype.helpmk_alnum = function(ob) {
  var ch = ob.ch;
  var st = ob.st;
  var prefix = ob.prefix || '';

  st = this.to_external(st);
  var s = '';
  var t = escapeHTML(prefix + st, true);
  if (ob.outset) { t = '<span class="outset">' + t + '</span>'; }
  else if (ob.alt) { t = '<span class="alt">' + t + '</span>'; }
  t = '<span class="st" title="' + ob.tooltip + '">' + t + '</span>';
  s += '<span class="alnum">';
  s += '<span class="ch">' + escapeHTML(ch, true) + '</span>';
  s = s + t;
  //
  s += '</span>';		// class="alnum"

  return s;
}

KANSAKU.prototype.helpmk_hasidamnem = function(ob) {
  var ch = ob.ch;
  var st = ob.st;
  var prefix = ob.prefix || '';

  st = this.to_hasidamnem(st);

  var s = '';
  var t = escapeHTML(prefix + st, true);
  if (ob.outset) { t = '<span class="outset">' + t + '</span>'; }
  else if (ob.alt) { t = '<span class="alt">' + t + '</span>'; }
  t = '<span class="st" title="' + ob.tooltip + '">' + t + '</span>';
  s += '<span class="hasidamnem">';
  s += '<span class="ch">' + escapeHTML(ch, true) + '</span>';
  s = s + t;
  //
  s += '</span>';		// class="hasidamnem"

  return s;
}



// ===================================================================
// img preload

// 打鍵図ヘルプで用いる画像ファイル
// …の名前、のパターン
//
// - img/0/0.png
// - img/[1-4wx]/[0-3][0-9].png
// - img/a[12w]/[0-3][0-9].png
// - img/[rl][12w]/[0-3][0-9].png
//
// 命名のルールは、
//   img/ <m> / <n> .png  →  第 <m> 打の打鍵で、T-Code キー番号 <n> のキー
// である。
// ただし、
// - 0.png は、“空の打鍵図”(「・」x 4 x 3 x 2)。
// - <m> として
//   - "w" は二重打鍵, "x" は三重打鍵
//   - Try の連想表は、前に "a" をつける
//   - TT の左表・右表は、前に "l"・"r" をつける

// KANSAKU.prototype.img_preload = function() {
//   this.imgs = new Object();
//   this.img_preload_sub('0/0');
//   var mth = '1 2 3 4 w x a1 a2 aw r1 r2 rw l1 l2 lw'.split(' ');
//   for (var m = 0; m < mth.length; m++) {
//     for (var n = 0; n < 40; n++) {
// 	 if (n < 10) { n = '0' + n; }
// 	 this.img_preload_sub('' + mth[m] + '/' + n);
//     }
//   }
//   return;
// }
// 
// KANSAKU.prototype.img_preload_sub = function(name) {
//   this.imgs[name] = new Image();
//   this.imgs[name].src = 'img/' + name + '.png';
// }


// ===================================================================
// Local Variables:
// mode: c++
// end:
