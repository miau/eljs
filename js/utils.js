// utils.js - misc utils for eelll/JS
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
// const

var NL = '\n';
var BR = '<br>';
var NBSP = '&nbsp;';
var NLPAT = /[\r\n]+/;

// ===================================================================
// document element

// ===================================================================
// getelm

if (document.getElementById) {
  getelm = function (id) { return document.getElementById(id); }
} else {
  getelm = function (id) { return document.all(id); }
}

function div_visible(elm, flag) {
  if (typeof elm == 'string') { elm = getelm(elm); }
  elm.style.display = flag ? 'block' : 'none';
}

function div_togglevisible(elm) {
  if (typeof elm == 'string') { elm = getelm(elm); }
  if (elm && elm.style) {
    var s;
    s = (elm.style.display == 'none') ? 'block' : 'none';
    elm.style.display = s;
  }
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
  this.size = size;     // max and min size if set
  this.htmlp = htmlp;       // true for HTML or false for plaintext
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

//2007-03-24
IS.prototype.puts = function(s) {
  this.elm.value += s;
}


// ===================================================================
// array

Array.prototype.CLEAR = function() {
  this.length = 0;
  return this;
}

// REPLACE
Array.prototype.REPLACE = function(a) {
  this.length = a.length;
  for (var i = 0; i < a.length; i++) { this[i] = a[i]; }
  return this;
}

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

Array.prototype.SHUFFLEself = function() {
  return this.REPLACE(this.SHUFFLE());
}

// uniq
Array.prototype.UNIQ = function() {
  var a = new Array();
  // var prev = null;

  for (var i = 0; i < this.length; i++) {
    // if (this[i] != prev) { a.PUSH(this[i]); }
    // prev = this[i];
    if (! a.MEMBERP(this[i])) { a.PUSH(this[i]); }
  }

  return a;
}

Array.prototype.UNIQself = function() {
  return this.REPLACE(this.UNIQ());
}

// memberp
Array.prototype.MEMBERP = function(x) {
  for (var i = 0; i < this.length; i++) {
    if (x == this[i]) { return true; }
  }
  return false;
}

// DELETE
Array.prototype.DELETE = function(x) {
  var a = new Array();
  var ret = false;

  for (var i = 0; i < this.length; i++) {
    if (this[i] != x) { a.PUSH(this[i]); }
    else { ret = x; }
  }

  //return a;
  this.REPLACE(a);
  return ret;
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
// div_detail

var div_detail_cnt = 0;

var div_detail_id = '';

function div_detail_beg(title) {
  div_detail_cnt++;
  div_detail_id = 'dv_detail_' + div_detail_cnt;

  if (title && title != '')  { title = '(' + title + ')'; }
  else                       { title = ''; }
  title = '詳細... ' + title;

  document.write('<div class="div_detail_beg">');
  document.write('<a href="javascript:div_togglevisible(\'' +
         div_detail_id + '\')";>');
  document.write(title);
  document.write('</a>');
  document.write('</div>');
  document.write('<div id="' + div_detail_id + '" style="display: block;">');
}

function div_detail_end() {
  document.write('<div class="div_detail_end">');
  document.write('<a href="javascript:div_togglevisible(\'' +
         div_detail_id + '\')";>');
  document.write('詳細を隠す');
  document.write('</a>');
  document.write('</div>');
  document.write('</div>');

  div_visible(div_detail_id, false);
  ////
  //div_visible(div_detail_id, true);
}


// ===================================================================

// Local Variables:
// mode: c++
// end:
