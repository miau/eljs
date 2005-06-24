// eljs.js --- eelll/JS (JavaScript implemented EELLL)
// 
// Copyright (C) 2005  YUSE Yosihiro
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

var c_cookie_name = 'eellljs';
var c_mainbuf_size = 10;
var c_prefix_message = ':: ';
var c_prefix_prompt  = '&gt;&gt; ';


// ===================================================================
// var

var el;
var elm;
var io;

// ===================================================================
// const

var NL = '\n';
var BR = '<br>';
var NBSP = '&nbsp;';
var NLPAT = /[\r\n]+/;


// ===================================================================
// EELLL

function EELLL() {
  this.internal_keys = '1234567890qwertyuiopasdfghjkl;zxcvbnm,./';

  this.ims = new Object();
  this.imid = null;
  this.im = null;

  this.kbs = new Object();
  this.kbid = null;
  this.kb = null;

  this.lts = new Object();
  this.ltid = null;
  this.lt = null;

  this.lcs = new LCS();

  this.ck = new Cookie(c_cookie_name);

  this.log = new Array();

  this.mode = null;
  this.time = null;
  this.stall = null;
  this.stcor = null;
  this.sterr = null;

  this.lsno = null;
  this.lsusrp = null;
  this.lstitle = null;
  this.lslr = null;

  this.lshelprowE = null;
  this.lshelptab = new Array(40);
  for (var i = 0; i < 40; i++) { this.lshelptab[i] = new Array(40); }
  for (var i = 0; i < 40; i++) {
    for (var j = 0; j < 40; j++) {
      this.lshelptab[i][j] = new Object; // XXX
    }
  }
  this.lshelpalnum = new Array();

  this.lstext = null;
  this.lslineno = null;
  this.lsline = null;
  this.lschall = null;
  this.lschnew = null;
  this.lstime = null;
  this.lstimebeg = null;
  this.lstimeend = null;
  this.lsstall = null;
  this.lsstcor = null;
  this.lssterr = null;

  return this;
}

// ===================================================================
// add

EELLL.prototype.addim = function(im) {
  this.ims[im.id] = im;

  // first entry to default value
  if (this.imid == null) {
    this.imid = im.id;
    this.im = im;
  }
}

EELLL.prototype.addkb = function(kb) {
  this.kbs[kb.id] = kb;

  // first entry to default value
  if (this.kbid == null) {
    this.kbid = kb.id;
    this.kb = kb;
  }
}

EELLL.prototype.addlt = function(lt) {
  this.lts[lt.id] = lt;

  // first entry to default value
  if (this.ltid == null) {
    this.ltid = lt.id;
    this.lt = lt;
  }
}

// ===================================================================
// set
// !!! IE5/MacOS8 does not have `in' operator

EELLL.prototype.setim = function(id) {
  if (this.ims[id] != null) {
    this.im = this.ims[this.imid = id];
    this.ck.set('im', this.imid);
  }
}

EELLL.prototype.setkb = function(id) {
  if (this.kbs[id] != null) {
    this.kb = this.kbs[this.kbid = id];
    this.ck.set('kb', this.kbid);
  }
}

EELLL.prototype.setlt = function(id) {
  if (this.lts[id] != null) {
    this.lt = this.lts[this.ltid = id];
    this.ck.set('lt', this.ltid);
  }
}

// ===================================================================
// reset

EELLL.prototype.reset = function() {
  this.mode = 'quit';		// XXX
  this.time = 0;
  this.stall = 0;
  this.stcor = 0;
  this.sterr = 0;
}

// ===================================================================
// lesson

EELLL.prototype.setls = function(lsno) {
  var ls = this.lt.lesson[lsno];
  if (ls) {
    this.lsno = parseInt(lsno);
    this.lsusrp = false;
    this.lstitle = ls.title;
    this.lslr    = ls.lr;	// XXX normalize?
    this.lstext  = ls.text;
    this.lschnew = (ls.chars || '').split(''); // NO sort?
    this.lschall = ls.text.join('').split('').sort().UNIQ(); // XXX
    // 2005-06-17
    this.mkhelp();
    // 2005-06-20
    this.mkhelp_alnum();
    // /2005-06-20

    this.ck.set(this.imid + '/' + this.ltid, lsno);
  }
}

EELLL.prototype.setls_usr = function(text) { // text : Array
  if (0 < text.length) {
    //this.lsno = this.lsno; // untouched
    this.lsusrp  = true;
    this.lstitle = text[0]; // XXX
    this.lslr    = null // XXX
    this.lstext  = text;
    // 2005-06-17
    //this.lschnew = '' // XXX
    //this.lschall = text.join(''); // XXX
    this.lschnew = [] // XXX
    this.lschall = text.join('').split('').sort().UNIQ(); // XXX
    // 2005-06-17
    this.mkhelp();
    // 2005-06-20
    this.mkhelp_alnum();
    // /2005-06-20
  }
}

EELLL.prototype.lsreset = function () {
  this.mode = 'start';

  this.lslineno = 0;
  this.lsline = null;
  this.lstime = 0;
  this.lsstall = 0;
  this.lsstcor = 0;
  this.lssterr = 0;
}

// ===================================================================
// T-Code encode/decode

// return stroke seq for Japanese ch
// in internal encoding (i.e. in QWERTY_JP string)
// - "の" => "kd"
// - " " => null
EELLL.prototype.encodech_internal = function(ch) {
  return (this.im.encodetable[ch] ||
	  this.im.encodetable_alt && this.im.encodetable_alt[ch]);
}

// return stroke seq in external encoding
// - "の" => "kd" for QWERTY
// - "の" => "te" for Dvorak
EELLL.prototype.encodech_external = function(ch) {
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
EELLL.prototype.encodech_array = function(ch) {
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
EELLL.prototype.decodech_internal = function(st) {
  return this.im.decodetable[st];
}

// ===================================================================
// help

// ===================================================================
// help - stroke table

EELLL.prototype.mkhelp = function() {
  // reset
  this.lshelprowE = false;
  for (var i = 0; i < 40; i++) {
    for (var j = 0; j < 40; j++) {
      this.lshelptab[i][j].ch = null;
      this.lshelptab[i][j].klass = null;
    }
  }

  // set
  for (var i = 0; i < this.lschall.length; i++) {
    var ch = this.lschall[i];
    var sta = this.encodech_array(ch);
    if (sta != null && sta.length == 2) {
      var o = this.lshelptab[sta[0]][sta[1]];
      o.ch = ch;
      o.klass = 'all';
      if (sta[0] < 10 || sta[1] < 10) { this.lshelprowE = true; }
    }
  }

  for (var i = 0; i < this.lschnew.length; i++) {
    var ch = this.lschnew[i];
    var sta = this.encodech_array(ch);
    if (sta != null && sta.length == 2) {
      var o = this.lshelptab[sta[0]][sta[1]];
      o.ch = ch;
      o.klass = 'new';
      //if (sta[0] < 10 || sta[1] < 10) { this.lshelprowE = true; }
    }
  }

  return this.lshelptab;
}

// ===================================================================
// alnum expression

// 2005-06-20
EELLL.prototype.mkhelp_alnum = function() {
  // reset
  this.lshelpalnum.length = 0;

  // set
  for (var i = 0; i < this.lschall.length; i++) {
    var ch = this.lschall[i];
    // skip ASCII
    if (ch.match(/[ !-~]/)) { continue; }
    var st = this.encodech_external(ch) || '';
    var klass = (this.lschnew.MEMBERP(ch) ? 'new' : 'all');
    this.lshelpalnum.PUSH({ch:ch, st:st, klass:klass});
  }

  return this.lshelpalnum;
}
// /2005-06-20

// EELLL.prototype.mkhelp_alnum = function(allp) {
//   var n = 0;
//   var a;
//   var prev = '';
//   var s = '';
//   var reta = new Array();
// 
//   if (allp) {
//     a = this.lschall;
//   } else {
//     a = this.lschnew;
//   }
// 
//   for (var i = 0; i < a.length; i++) {
//     var ch = a[i];
//     var st;
//     if (prev == ch) { continue; }
//     if (st = this.encodech_external(ch)) {
// 	 prev = ch;
// 	 var a1 = st.split('');
// 	 ch = escapeHTML(ch);
// 	 if (this.lschnew.MEMBERP(ch)) {
// 	   s += '<span class="new">' + ch + '</span>';
// 	 } else {
// 	   s += ch;
// 	 }
// 	 s += st;
// 	 n += 1;
// 	 // XXX 空白とか改行は、文字・コードの出力に先立った方が
// 	 if (n % 10 == 0) {
// 	   reta.PUSH(s);
// 	   s = '';
// 	 } else {
// 	   for (var m = 0; m < (6 - st.length); m++) {
// 	     s += NBSP;
// 	   }
// 	 }
//     }
//   }
//   if (n % 10 != 0) { reta.PUSH(s); }
//   return reta;
// }


// ===================================================================
// Cookie

// eelll cookie format
//   eelll= im=T:ltext=EELLLTXT:kbd=QWERTY:T/EELLLTXT=1:TUT/kanji_a1=0: ;
//   expires= Wed, 08-Jun-2005 15:56:25 GMT

function Cookie(name) {
  this.name = name;
  this.content = new Object();
  return this;
}

Cookie.prototype.read = function() {
  var ck = document.cookie;
  var re = new RegExp(this.name + "=([^;]+);"); // XXX escape name?
  var m = (ck + ';').match(re);

  this.content = new Object;
  if (m) {
    var a = unescape(m[1]).split(':');
    for (var i = 0; i < a.length; i++) {
      if (a[i] == '') { continue; } // such as last case?
      m = a[i].match(/([^=]+)=(.*)/);
      if (m) {
	this.content[m[1]] = m[2];
      }
    }
  }
  return this;
}


Cookie.prototype.set = function(key, val) {
  this.content[key] =val;
  return this;
}

Cookie.prototype.get = function(key) {
  return this.content[key];
}

Cookie.prototype.write = function() {
  var s = '';

  for (var p in this.content) {
    s += p + '=' + this.content[p] + ':';
  }
  s = this.name + '=' + escape(s) + ';';

  var d = new Date();
  d.setFullYear(d.getFullYear() + 1); // expires to 1 year
  s += 'expires=' + d.toGMTString() + ';';

  document.cookie = s;
}

Cookie.prototype.remove = function() {
  var d = new Date();
  d.setTime(0);			// 1970-01-01 00:00:00
  var s = this.name + '=;expires=' + d.toGMTString() + ';';
  document.cookie = s;
}


// ===================================================================
// LCS

// MAXI : max Japanese chars
// MAXJ : max strokes
// MAXM : max matched Japanese chars

function LCS() {
  this.MAXI = 80;
  this.MAXJ = 160;
  this.MAXM = 80;
  // XXX ???

  // match table
  this.mt = new Array(this.MAXJ + 1);
  for (var j = 0; j <= this.MAXJ; j++) {
    this.mt[j] = new Array(this.MAXI + 1);
    for (var i = 0; i <= this.MAXI; i++) {
      this.mt[j][i] = new Object(); // {m:0, j:null, i:null};
    }
  }

  // match data
  this.md = new Array(this.MAXM + 1);
  for (var n = 0; n <= this.MAXM; n++) {
    this.md[n] = new Object();	// {len:0, j:null, i:null};
  }

  this.res = null;
  // [ [true, 'の', 'kd'], [false, [['が', ';s'], ['、', 'jd']], 'js;d'] ]

  this.stall = null;
  this.sterr = null;
  this.stcor = null;

  return this;
}

// do match
// - r : [['の', 'kd'], ['、', 'jd'], ['が', ';s'], ...]
// - s : 'kdjs;d...' (user input)
LCS.prototype.match = function(r, s) {
  var sa = s.split('');
  this.stall = s.length;

  var ra_j = new Array();
  var ra   = new Array();
  for (var i = 0; i < r.length; i++) {
    ra_j.PUSH(r[i][0]);
    ra.PUSH(r[i][1]);
  }

  var maxj = Math.min(sa.length, this.MAXJ);
  var maxi = Math.min(ra.length, this.MAXI);

  // init match table
  for (var j = 0; j <= maxj; j++) {
    for (var i = 0; i <= maxi; i++) {
      this.mt[j][i].m = 0;
    }
  }

  // make match table
  var m;
  for (var j = 0; j < maxj; j++) {
    for (var i = 0; i < maxi; i++) {
      var relm = ra[i], len = relm.length;

      if (((j + len) <= maxj) && (relm == s.substr(j, len))) {
	// matched
	for (var dj = 0; dj < len; dj++) {
	  this.mt[j + dj + 1][i + 1].m =
	    Math.max(this.mt[j + dj + 1][i + 1].m,
		     Math.max(this.mt[j + dj + 1][i].m,
			      this.mt[j + dj][i + 1].m));
	}
	m = this.mt[j][i].m + len;
	if (this.mt[j + len][i + 1].m < m) {
	  this.mt[j + len][i + 1].m = m;
	  this.mt[j + len][i + 1].j = j;
	  this.mt[j + len][i + 1].i = i;
	}

      } else {
	// NOT matched
	this.mt[j + 1][i + 1].m =
	  Math.max(this.mt[j + 1][i + 1].m,
		   Math.max(this.mt[j + 1][i].m,
			    this.mt[j][i + 1].m));
      }
    } // i
  } // j

  // go backward and make match data
  var nmatch = 0;
  this.md[nmatch].j = maxj;
  this.md[nmatch].i = maxi;
  this.md[nmatch].len = 0;
  for (nmatch = 1, j = maxj, i = maxi, m = this.mt[j][i].m;
       0 < m;
       nmatch += 1) {
    while (0 < i && this.mt[j][i - 1].m == m) { i -= 1; }
    while (0 < j && this.mt[j - 1][i].m == m) { j -= 1; }
    var prevj = this.mt[j][i].j;
    var previ = this.mt[j][i].i;
    this.md[nmatch].j = prevj;
    this.md[nmatch].i = previ;
    this.md[nmatch].len = ra[previ].length;
    j = prevj; i = previ;
    m = this.mt[j][i].m;
  }

  // result
  this.res = new Array();
  this.typo = new Array();
  this.sterr = 0;
  this.stcor = 0;
  this.err = '';

  var j = 0, i = 0;
  for (var n = nmatch - 1; 0 <= n; n--) {
    var len = this.md[n].len;
    var nextj = this.md[n].j;
    var nexti = this.md[n].i;

    var erri = [];
    var errj = '';
    var errp = false;

    if (i < nexti) {
      errp = true;
      while (i < nexti) {
	erri.PUSH([ra_j[i], ra[i]]);
	this.sterr += ra[i].length;
	i++;
      }
    }
    i++;

    if (j < nextj) {
      errp = true;
      while (j < nextj) {
	errj += sa[j];
	this.sterr += 1;
	j++;
      }
    }
    
    if (errp) {
      this.res.PUSH([false, erri, errj]);
    }

    if (0 < len) {
      this.res.PUSH([true, ra_j[nexti], ra[nexti]]);
      this.stcor += ra[nexti].length;
    }
    j += len;
  }

  return this;
  // {res:res, stall:stall, sterr:sterr, stcor:stcor}
}


// ===================================================================
// document

// ===================================================================
// init

function do_init() {
  do_init_elm();
  do_init_io();

  el.ck.read();

  do_init_config();
  do_set_config();

  return;
}

// ===================================================================
// elm YYY

function do_init_elm() {
  var id;
  id = ('sl_im sl_lt sl_kb' +
	  ' rd_help_LL rd_help_LR rd_help_RL rd_help_RR rd_help_alnum' +
	  ' cb_help_all pr_help' +
	  ' pr_main pw_input sb_cr cb_echo cb_shuffle' +
	  ' rd_lesson_std sl_lesson rd_lesson_usr ta_lesson' +
	  ' ta_log' + // ' ta_debug' +
	  ' dv_config dv_help dv_main dv_lesson dv_log'
	  ).split(' ');

  elm = new Object;
  for (var i = 0; i < id.length; i++) {
    elm[id[i]] = getelm(id[i]);
  }
}

function do_init_io() {
  // io
  io = new Object;
  
  //io.debug = new OS(null, elm.ta_debug, false);
  
  io.help  = new OS(null, elm.pr_help,  true);
  io.main  = new OS(c_mainbuf_size, elm.pr_main,  true);
  io.text  = new OS(null, elm.ta_text,  false);
  io.log   = new OS(null, elm.ta_log,   false);
  //
  io.help.refresh();
  io.main.refresh();
  io.text.refresh();
  io.log.refresh();
  
  io.input = new IS(elm.pw_input);
}

// ===================================================================
// config

function do_init_config() {
  do_init_config_sub(el.imid, el.ck.get('im'), el.ims, elm.sl_im);
  do_init_config_sub(el.kbid, el.ck.get('kb'), el.kbs, elm.sl_kb);
  do_init_config_sub(el.ltid, el.ck.get('lt'), el.lts, elm.sl_lt);

  return false;
}

function do_init_config_sub(iddef, idck, ob, sl) {
  var a = new Array;
  for (var p in ob) {
    a.PUSH(ob[p]);
  }

  sl.options.length = a.length;
  for (var i = 0; i < a.length; i++) {
    sl.options[i].value = a[i].id;
    sl.options[i].text  = a[i].title;
    // default
    if (iddef == sl.options[i].value) { sl.options[i].selected = true; }
  }

  // cookie
  if (idck == null) { return; }
  for (var i = 0; i < sl.options.length; i++) {
    if (idck == sl.options[i].value) { sl.options[i].selected = true; }
  }
}

// ===================================================================

function do_set_config() {
  el.setim(elm.sl_im.value);
  el.setkb(elm.sl_kb.value);
  el.setlt(elm.sl_lt.value);

  el.ck.write();
  el.reset();

  do_init_lesson();
  do_set_lesson();

  return false;
}

function do_cancel_config() {
  return do_init_config();	// XXX redundant?
}

// ===================================================================

function do_init_lesson() {
  var sl = elm.sl_lesson;
  var a = el.lt.lesson;

  elm.rd_lesson_std.checked = true;

  sl.options.length = a.length;
  for (var i = 0; i < a.length; i++) {
    sl.options[i].value = i;
    sl.options[i].text  = a[i].title;
    
  }
  // default
  sl.options[0].selected = true;

  // cookie
  var ck = el.ck.get(el.imid + '/' + el.ltid);
  if (ck != null) {
    sl.options[parseInt(ck)].selected = true;
  }

  do_change_lesson_std();
}

function do_set_lesson() {
  if (elm.rd_lesson_std.checked) {
    el.setls(elm.sl_lesson.value);
    el.ck.write();
    //el.lsreset();
    // XXX
    do_change_lesson_std();

  } else {
    var a = text_fold(elm.ta_lesson.value, 80, 60); // XXX hardcoding
    el.setls_usr(a); 
    //el.lsreset();
    // XXX
    do_change_lesson_usr();
  }

  do_start_lesson();

  return false;
}

function do_change_lesson_std() {
  elm.sl_lesson.disabled = false;
  elm.ta_lesson.value = el.lt.lesson[elm.sl_lesson.value].text.join(NL);
  elm.ta_lesson.disabled = true;

  return false;
}

function do_change_lesson_usr() {
  elm.sl_lesson.disabled = true;
  elm.ta_lesson.disabled = false;
  elm.ta_lesson.focus();
  elm.ta_lesson.select();

  return false;
}

function do_cancel_lesson() {
  if (el.lsusrp) {
    elm.rd_lesson_usr.checked = true;
    elm.sl_lesson.disabled = true;
    elm.ta_lesson.value = el.lstext.join(NL);
    do_change_lesson_usr();	// XXX redundant?
  } else {
    elm.rd_lesson_std.checked = true;
    elm.sl_lesson.disabled = false;
    elm.sl_lesson.options[el.lsno].selected = true;
    do_change_lesson_std();
  }

  return false;
}

// ===================================================================
// do lesson

function do_start_lesson() {
  do_help();

  do_clear();
  do_message('');
  do_message(el.lstitle);
  do_message('');

  do_start_lesson_sub();
}

function do_start_lesson_sub() {
  do_puts('');
  do_prompt('リターンキーを打てば始まります');
  io.input.focus();
  el.lsreset();
}

// ===================================================================
// do help

function do_help() {
  if (el.lslr && el.lslr != '' && el.lslr.match(/[LR][LR]/)) {
    // stroke table
    do_help1(el.lslr);

  } else {
    // alnum
    do_help1_alnum();
  }

  return false;
}

// ===================================================================

function do_help1(lr) {
  var x, y;
  var dx, dy;
  var sep0 = '&nbsp;';
  var sep1 = '&nbsp;&nbsp;';
  var sep2 = '&nbsp;&nbsp;&nbsp;&nbsp;';
  var a = new Array();
  var s = '';

  if (lr.match(/LL/i)) { dx = 0; dy = 0; lr = 'LL'; }
  else if (lr.match(/LR/i)) { dx = 0; dy = 5; lr = 'LR'; }
  else if (lr.match(/RR/i)) { dx = 5; dy = 5; lr = 'RR'; }
  else /* if (lr.match(/RL/i)) */ { dx = 5; dy = 0; lr = 'RL'; }

  a.PUSH(escapeHTML(lr));	// XXX

  for (y = 0; y < 4 * 4; y++) {
    if (y % 4 == 0) {
      if (el.lshelprowE || 0 < y) { a.PUSH(''); }
    }
    s = '';
    for (x = 0; x < 5 * 5; x++) {
      var i = x % 5 + (y % 4) * 10 + dx;
      var j = Math.floor(x / 5) + Math.floor(y / 4) * 10 + dy;

      var o = el.lshelptab[i][j];
      var ch = o.ch;
      var klass = o.klass;
      // empty
      if (klass == null ||
	  !elm.cb_help_all.checked && klass == 'all') {
	ch = '・';
	klass = 'emp';
      }
      // Zwidth
      if (ch.match(/^[!-~]$/)) { ch = ch + NBSP; }// XXX

      if (x % 5 == 0) { s += sep1; }
      if (i % 10 == 4 || i % 10 == 6) { s += sep0; }
      if ((j % 10 == 4 || j % 10 == 6) &&
	(i % 10 == 0 || i % 10 == 5)) { s += sep1; }

      // highlight
      s += '<span\tclass="' + klass + '">' + ch + '</span>';
    }
    if (el.lshelprowE || 4 <= y && y % 4 != 0) { a.PUSH(s); }
  }

  // output
  io.help.clear();
  for (var i = 0; i < a.length; i++) {
    io.help.puts(a[i]);
  }
  io.help.refresh();

  // radio button
  if (elm['rd_help_' + lr]) { elm['rd_help_' + lr].checked = true; }

  do_focus_input();
}

// ===================================================================

// 2005-06-20
function do_help1_alnum() {
  var n = 0;
  var s = '';
  var a = new Array();

  for (var i = 0;
       i < el.lshelpalnum.length; i++) {
    var o = el.lshelpalnum[i];
    if (elm.cb_help_all.checked || o.klass == 'new') {
      s += '<span class="' + o.klass + '">';
      s += escapeHTML(o.ch);
      s += '</span>';
      s += o.st;
      n += 1;
      if (n % 10 == 0) {
	a.PUSH(s);
	s = '';
      } else {
	for (var j = 0; j < (6 - o.st.length); j++) { s += NBSP; }
      }
    }
  }
  if (n % 10 != 0) { a.PUSH(s); }

  // output
  io.help.clear();
  for (var i = 0; i < a.length; i++) {
    io.help.puts(a[i]);
  }
  io.help.refresh();

  // radio button
  if (elm['rd_help_alnum']) { elm['rd_help_alnum'].checked = true; }

  do_focus_input();
}
// /2005-06-20

// function do_help_alnum() {
//   // alnum
//   var a = el.mkhelp_alnum(elm.cb_help_all.checked);
//   io.help.clear();
//   for (var i = 0; i < a.length; i++) {
//     io.help.puts(a[i]);
//   }
//   io.help.refresh();
// 
//   do_focus_input();
// }

// ===================================================================
// input

function do_input() {
  var s = io.input.gets();

  switch (el.mode) {
  case 'start':
    do_input_start(s);
    break;

  case 'text':
    do_input_text(s);
    break;

  case 'command':
    do_input_command(s);
    break;

  case 'quit':
  default:
    // nop
    ;
  }

  do_focus_input();
  return false;
}

// ===================================================================

function do_input_start(s) {
  if (elm.cb_shuffle.checked) { el.lstext = el.lstext.SHUFFLE(); }

  // el.lsreseet();
  el.mode = 'text';

  do_clear();
  do_next_line();
}

// ===================================================================

function do_input_text(s) {
  el.lstimeend = (new Date()).getTime();
  el.lstime += el.lstimeend - el.lstimebeg;

  var a = el.lsline.split('');
  var r = new Array();

  for (var i = 0; i < a.length; i++) {
    var st = el.encodech_external(a[i]);
    st = st ? st : a[i];
    r.PUSH([a[i], st]);
  }

  var m = el.lcs.match(r, s);

  do_result(m.res);
  do_puts('');

  el.lsstall += m.stall;
  el.lsstcor += m.stcor;
  el.lssterr += m.sterr;

  do_next_line();
}

function do_result(res) {
  // XXX
  var s = '';
  var t = '';
  for (var i = 0; i < res.length; i++) {
    var log = '';
    var a = res[i];
    if (a[0]) {
      // corrct
      s += escapeHTML(a[1]);
    } else {
      // typo
      s += '<span\tclass="err">' + escapeHTML(a[2]) + '</span>';
      for (var j = 0; j < a[1].length; j++) {
	t += escapeHTML(a[1][j][0]);
	log += a[1][j][0] + '[' + a[1][j][1] + ']';
      }
      if (log != '') {
	log += ' * (' + a[2] + ')';
	// 2005-06-17
	io.log.puts(log);
      }
    }
  }
  s = '<span\tclass="usr">' + s + '</span>';
  do_puts(s);
  if (t != '') {
    t = '[まちがえた文字]=> 『' + '<span\tclass="err">' + t + '</span>' + '』';
    do_message(t);
  }

  // 2005-06-17
  io.log.refresh();
}

// ===================================================================

function do_input_command(c) {
  switch (c) {
  case 'y': case 'Y':
  case 'a': case 'A':
  case ' ':
    do_start_lesson_sub();
    break;

  case 'n': case 'N':
  case '':
    if (el.lsusrp) { break; } // XXX
    do_next_lesson();
    break;

  case 'p': case 'P':
    if (el.lsusrp) { break; } // XXX
    do_prev_lesson();
    break;

  case 'q': case 'Q':
    do_quit_lesson();
    break;

  default:
    // NOP
    ;
  }
}

// ===================================================================

function do_next_line() {
  if (el.lstext.length <= el.lslineno) {
    // end of lesson

    el.time += el.lstime;
    el.stall += el.lsstall;
    el.stcor += el.lsstcor;
    el.sterr += el.lssterr;

    do_score(el.lstime, el.lsstall, el.lsstcor, el.lssterr);
    do_puts('');

    el.mode = 'command';
    if (el.lsusrp) {		// XXX
      do_prompt('もう一度トライしますか? (もう一度(A) / 終了(Q))');
    } else {
      do_prompt('もう一度トライしますか? (もう一度(A) / 次へ(N) / 終了(Q))');
    }

  } else {
    el.lsline = el.lstext[el.lslineno];
    el.lslineno += 1;
    do_puts(el.lsline);

    el.lstimebeg = (new Date()).getTime();
  }
}

// ===================================================================

function do_score(ms, nraw, stcor, sterr) {
  var s;

  s = '[総打鍵成績] 毎打鍵 ';
  s += '<span\tclass="usr">';
  s += Math.floor(ms / nraw);
  s += '</span>';
  s += ' ミリ秒、毎分 ';
  s += '<span\tclass="usr">';
  s += Math.floor(nraw / ms * 60000);
  s += '</span>';
  s += ' 打鍵';
  do_message(s);

  s = '[実打鍵成績] 毎打鍵 ';
  s += '<span\tclass="usr">';
  s += Math.floor(ms / stcor);
  s += '</span>';
  s += ' ミリ秒、毎分 ';
  s += '<span\tclass="usr">';
  s += Math.floor(stcor / ms * 60000);
  s += '</span>';
  s += ' 打鍵';
  do_message(s);

  s = 'エラーレート ';
  s += '<span\tclass="err">';
  s += Math.floor(sterr / nraw * 1000) / 10;
  s += '</span>';
  s += ' %';
  do_message(s);
}

// ===================================================================

function do_quit_lesson() {
  el.mode = 'quit';

  do_clear();
  do_message('');
  do_message('総合成績');
  do_message('');

  do_score(el.time, el.stall, el.stcor, el.sterr);

  var s;
  s = '入力打鍵数 ';
  s += '<span\tclass="usr">';
  s += el.stall;
  s += '</span>';
  s += ' 打鍵、所要時間 ';
  s += '<span\tclass="usr">';
  s += Math.ceil(el.time / 1000);
  s += '</span>';
  s += ' 秒';
  do_message(s);

  do_puts('');
  do_prompt('おつかれさまでした');

  // XXX
  el.reset();
}

// ===================================================================

function do_next_lesson() {
  do_jump_lesson(el.lsno + 1);
}

function do_prev_lesson() {
  do_jump_lesson(el.lsno - 1);
}

function do_jump_lesson(no) {
  while (no < 0) { no += el.lt.lesson.length; }
  no %= el.lt.lesson.length;

  elm.sl_lesson.options[no].selected = true;

  do_set_lesson();
}

// ===================================================================
// log

function do_clear_log() {
  if (confirm('本当にログを消去してもいいですか?')) {
    io.log.clear();
    io.log.refresh();
  }
  return false;
}

function do_remove_cookie() {
  var s = '';
  for (var p in el.ck.content) {
    s += p + '=' + el.ck.content[p] + ':';
  }
  if (confirm('本当にクッキーを消去してもいいですか?' + '\n' +
	      'クッキーの名前: ' + el.ck.name + '\n' +
	      'クッキーの内容: ' + s)) {
    el.ck.remove();
    el.ck.read();
  }
  return false;
}


// ===================================================================
// text proc

function text_fold(str, maxcol, foldcol) {
  var sa = str.split(NLPAT);
  var foldp = false;
  for (var i = 0; i < sa.length; i++) {
    if (maxcol < sa[i].WIDTH()) { foldp = true; break; }
  }
  if (!foldp) { return sa; }

  var a = new Array();
  for (var i = 0; i < sa.length; i++) {
    var col = 0, s = '';
    var saa = sa[i].split('');
    for (var j = 0; j < saa.length; j++) {
      var w = saa[j].WIDTH();
      if (foldcol < col + w) { a.PUSH(s); s = ''; col = 0; }
      col += w; s += saa[j];
    }
    if (col != 0) { a.PUSH(s); }
  }
  return a;
}


// ===================================================================
// document element

// ===================================================================
// getelm

if (document.getElementById) {
  getelm = function (id) { return document.getElementById(id); }
} else {
  getelm = function (id) { return document.all(id); }
}

// function div_setvisible(elm, flag) {
//   if (elm && elm.style) {
//     elm.style.display = flag ? 'block' : 'none';
//   }
// }
// 
// XXX

function div_togglevisible(elm) {
  if (elm && elm.style) {
    elm.style.display = (elm.style.display == 'none') ? 'block' : 'none';
  }
}

function do_bt_command(c) {
  el.mode = 'command';
  elm.pw_input.value = c;
  elm.sb_cr.click();
  do_focus_input();
}

function do_cb_echo() {
  if (elm.cb_echo.checked) {
    elm.pw_input.style.color = 'Teal';
  } else {
    elm.pw_input.style.color = 'White';
  }
  do_focus_input();
}

function do_cb_shuffle() {
  do_focus_input();
}

function do_focus_input() {
  elm.pw_input.focus();
}

// ===================================================================
// puts, message, prompt

function do_puts(s) {
  io.main.puts(s);
  io.main.refresh();
}

function do_clear() {
  io.main.clear();
  io.main.refresh();
}

function do_message(s) {
  do_puts('<span class="message">' + c_prefix_message + s + '</span>');
}

function do_prompt(s) {
  do_puts('<span class="prompt">' + c_prefix_prompt + s + '</span>');
}

// ===================================================================
// HTML

function escapeHTML(s, spacep) {
  var ret = s.replace(/&/g, '&amp;').
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;').
    replace(/\"/g, '&quot;');

  if (spacep) { ret = ret.replace(/ /g, '&nbsp;'); }

  return ret;
}

function unescapeHTML(s) {
  var ret = s.
    replace(/&lt;/g, '<').
    replace(/&gt;/g, '>').
    replace(/&quot/g, '"').
    replace(/&nbsp;/g, ' ').
    replace(/&amp;/g, '&');
  return ret;
}


// ===================================================================
// IO

function OS(size, elm, htmlp) {
  this.size = size;		// max and min size if set
  this.htmlp = htmlp;		// true for HTML or false for plaintext
  this.elm = elm;

  if (this.size == null) { this.buf = new Array(); }
  else { this.buf = new Array(this.size); }
  this.clear();

  return this;
}

OS.prototype.clear = function() {
  if (this.size == null) {
    this.buf.length = 0;
  } else {
    for (var i = 0; i < this.size; i++) { this.buf[i] = ''; }
  }

  return this;
}

OS.prototype.puts = function(s) {
  this.buf.PUSH(s);
  if (this.size != null) { this.buf.SHIFT(); }

  return this;
}

OS.prototype.refresh = function() {
  if (!this.elm) { return this; }
  if (this.htmlp) {
    this.elm.innerHTML = this.buf.join(NBSP + BR) + NBSP;
  } else {
    this.elm.value = this.buf.join(NL);
  }

  return this;
}

function IS(elm) {
  this.elm = elm;
}

IS.prototype.peek = function() {
  return this.elm && this.elm.value;
}

IS.prototype.clear = function() {
  if (this.elm) { this.elm.value = ''; }
  return this;
}

IS.prototype.gets = function() {
  var s = this.peek();
  this.clear();
  return s;
}

IS.prototype.focus = function() {
  if (this.elm) { this.elm.focus(); }
}


// ===================================================================
// array

// push and shift
// -- IE5.0 JScript has neither push nor shift method for Array.

Array.prototype.PUSH = function(item) {
  this[this.length] = item;
  return this;
}

Array.prototype.SHIFT = function() {
  if (this.length < 1) { return null; }
  var ret = this[0];
  for (var i = 0; i < this.length - 1; i++) {
    this[i] = this[i + 1];
  }
  this.length -= 1;
  return ret;
}

// duplicate

Array.prototype.DUP = function() {
  var a = new Array(this.length);
  for (var i = 0; i < this.length; i++) {
    a[i] = this[i];
  }
  return a;
}

// shuffle

Array.prototype.SHUFFLE = function() {
  if (this.length == 0) { return new Array; }
  var a = this.DUP();
  // shuffle
  for (var i = 0; i < a.length; i++) {
    var t = a[i];
    var j = Math.floor(Math.random() * a.length);
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

// uniq
// usage: a = a.sort().UNIQ()

Array.prototype.UNIQ = function() {
  var a = new Array();
  var prev = null;

  for (var i = 0; i < this.length; i++) {
    if (this[i] != prev) { a.PUSH(this[i]); }
    prev = this[i];
  }

  return a;
}

// memberp

Array.prototype.MEMBERP = function(x) {
  for (var i = 0; i < this.length; i++) {
    if (x == this[i]) { return true; }
  }
  return false;
}


// ===================================================================
// String

String.prototype.WIDTH = function() {
  var w = 0;
  for (var i = 0; i < this.length; i++) {
    var ch = this.charAt(i);
    if (ch.match(/[ !-~]/)) { w += 1; }
    else { w += 2; }
  }
  return w;
}


// ===================================================================
// debug

function alertp(ob) {
  var s = '';
  for (var p in ob) {
    s += p + '=' + ob[p] + ' :: ';
  }
  alert(s);
}


// ===================================================================

el = new EELLL();
