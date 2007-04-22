// cookie.js - eelll/JS (JavaScript implemented EELLL)
// 
// Copyright (C) 2005, 2006  YUSE Yosihiro
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
  this.content[key] = val;
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

Cookie.prototype.showcontent = function() {
  var s = '';
//  for (var p in el.ck.content) {
//    s += p + '=' + el.ck.content[p] + ':';
//  }
  for (var p in this.content) {
    s += p + '=' + this.content[p] + ':';
  }
  return s;
}


// ===================================================================
// Local Variables:
// mode: c++
// end:
