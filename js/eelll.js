// eelll.js - EELLL part for eelll/JS (JavaScript implemented EELLL)
//
// Copyright (C) 2005, 2006, 2013  YUSE Yosihiro
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

// eelll cookie format
//   eelll= im=T:ltext=EELLLTXT:kbd=QWERTY:T/EELLLTXT=1:TUT/kanji_a1=0: ;
//   expires= Wed, 08-Jun-2005 15:56:25 GMT

var c_cookie_name = 'eellljs';


// ===================================================================
// EELLL <: KANSAKU

function EELLL() {
  KANSAKU();

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
  ///<errorrate>
  this.stquest = null;

  this.lsno = null;
  this.lstitle = null;
  this.lslr = null;

  this.lstext = null;
  this.lslineno = null;
  this.lsline = null;
  this.lstime = null;
  this.lstimebeg = null;
  this.lstimeend = null;
  this.lsstall = null;
  this.lsstcor = null;
  this.lssterr = null;
  ///<errorrate>
  this.lsstquest = null

  this.lschnew  = new Array();
  this.lschweak = new Array();
  this.lschtypo = new Array();

  return this;
}

EELLL.prototype = new KANSAKU();

// ===================================================================
// add

EELLL.prototype.addlt = function(lt) {
  this.lts[lt.id] = lt;

  // first entry to default value
  if (this.ltid == null) {
    this.ltid = lt.id;
    this.lt = lt;
  }
}

// ===================================================================
// user defined lt

EELLL.prototype.lt_userdef = function(srctext) {
  // check
  if (! this.lt.customizable) { return false; }

  // XXX : clear first ???
  // this.lt.lesson = new Array();

  var a = srctext.split(/\r\n\r\n|\n\n|\r\r/);
  //var a = srctext.split(/\r\n(\r\n)+|\n\n+|\r\r+/);
  var lesson = new Array();
  var n = 0;
  for (var i = 0; i < a.length; i++) {
    var e = a[i];

    // if valid definition, do it
    if (e.match(/[^\s]/)) {
      var o = new Object;
      o.text = new Array;
      var a1 = e.split(/\r+\n+|\r+|\n+/);
      for (var j = 0; j < a1.length; j++) {
  var s = a1[j];
  var sa = s.split('');
  // skip comment line and empty line
  if (s.match(/^[#;]/)) { continue; }
  if (s == '') { continue; }

  // fold long lines
  var maxcol = 80;
  var foldcol = 60;
  while (maxcol < s.WIDTH()) {
    var chomp;
    for (chomp = 1; chomp <= s.length; chomp++) {
      if (foldcol < s.substring(0, chomp).WIDTH()) { break; }
    }
    chomp--;
    o.text.PUSH(s.substring(0, chomp));
    s = s.substring(chomp, s.length);
  }
  if (s != '') {
    o.text.PUSH(s);
  }

      }
      if (o.text.length == 0) { continue; }
      //o.title = 'lesson ' + (n+1);
      o.name = 'Lesson ' + (n+1) + '.';
      //
      lesson.PUSH(o);
      n += 1;
    }
  }
  //this.lt.ndefs += n; // XXX : cound double defs???

  if (lesson.length == 0) { return false; }
  this.lt.srctext = srctext;
  this.lt.lesson = lesson;

  var lt = this.lt;
  {
    for (var i = 0; i < lt.lesson.length; i++) {
      if (lt.lesson[i].title == null) {
  var s = lt.lesson[i].text[0];
  if (12 < s.length) {
    s = s.substr(0, 12 - 1) + '...';
  }
  lt.lesson[i].title = lt.lesson[i].name;
  if (lt.lesson[i].lr != null) {
    lt.lesson[i].title += ' (' + lt.lesson[i].lr + ')';
  }
  lt.lesson[i].title += ' ' + s;
      }
    }
  }

  return true;
}

// ===================================================================
// set
// !!! IE5/MacOS8 does not have `in' operator

EELLL.prototype.setim_with_ck = function(id) {
  if (this.setim(id)) {
    if (! this.im.nocookie) { this.ck.set('im', this.imid); } // user def
  }
}

EELLL.prototype.setkb_with_ck = function(id) {
  if (this.setkb(id)) {
    if (! this.im.nocookie) { this.ck.set('kb', this.kbid); } // user def
  }
}

EELLL.prototype.setlt_with_ck = function(id) {
  var lt = this.lts[id];
  // check
  if (lt == null) { return false; }

  // set
  this.lt = this.lts[this.ltid = id];
  if (! this.lt.nocookie) { this.ck.set('lt', this.ltid); } // user def
  return true;
}

//// YYY ZZZ
EELLL.prototype.seths_with_ck = function(id) {
  if (this.seths(id)) {
    this.ck.set('hs', this.hsid);
  }
}

// ===================================================================
// reset

EELLL.prototype.reset = function() {
  this.mode = 'quit';   // XXX
  this.time = 0;
  this.stall = 0;
  this.stcor = 0;
  this.sterr = 0;
  ///<errorrate>
  this.stquest = 0;

  this.lschnew.length = 0;
  this.lschweak.length = 0;
  this.lschtypo.length = 0;

  this.helpclear();
}

// ===================================================================
// lesson

EELLL.prototype.setls = function(lsno) {
  var ls = this.lt.lesson[lsno];
  if (ls) {
    this.lsno = parseInt(lsno);
    this.lstitle = ls.title;
    this.lslr    = ls.lr; // XXX normalize?
    this.lstext  = ls.text.DUP();
    this.lschnew = (ls.chars || '').split(''); // NO sort
    this.helpset(this.lschnew);

    // cookie - "IM_NAME/TEXT_NAME=LESSON_NO" format
    ////if (this.imid != '_userdef_' && this.ltid != '_userdef_') {
    //// this.im.nocookie であっても、クッキー保存していいんではないかと
    ////if (! this.im.nocookie && ! this.lt.nocookie) {
    if (! this.lt.nocookie) {
      //// user def
      this.ck.set(this.imid + '/' + this.ltid, lsno);
    }
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
  ///<errorrate>
  this.lsstquest = 0;

  this.lschtypo.length = 0;
  this.helpset(this.lschnew);
}


// ===================================================================
// Local Variables:
// mode: c++
// end:

