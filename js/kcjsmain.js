// kcjsmain.js - KANCHOKU/JS (JavaScript implemented KANCHOKU)
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

var c_cookie_name = 'kanchokujs';


// ===================================================================
// var

var kc = new KANCHOKU();	// KANCHOKU object
var ks = kc;
var elm;			// HTML elements
var io;				// input/output


// ===================================================================
// document

// ===================================================================
// init

function do_init() {
  do_init_elm();
  do_init_io();

  kc.ck.read();
  do_init_config();
  do_set_config();

  div_visible(elm.dv_debug, false);
  do_focus_input();

  watch_beg();

  return;
}

// ===================================================================
// elm

function do_init_elm() {
  var id;
  id = [
    'dv_config', 'sl_im', 'sl_kb',
//  'cb_realtime',
    'tx_stdin',
    'tx_stdout',
//    'bt_decode',
//    'dv_help', 'dv_stdhelp',
    'dv_main',
    'ta_stdout',
    'dv_debug',
    'dv_log', 'ta_log',
    'dv_ck', 'ta_ck',
    'dv_dbg', 'ta_dbg',
    null];

  elm = new Object;
  for (var i = 0; i < id.length; i++) {
    if (id[i]) { elm[id[i]] = getelm(id[i]); }
  }
}

function do_init_io() {
  // io
  io = new Object;

  //io.debug = new OS(null, elm.ta_debug, false);

//  io.help  = new OS(null, elm.dv_stdhelp,  true);
//  io.help.refresh();

  io.input = new IS(elm.tx_stdin);
  io.output = new IS(elm.tx_stdout);
  io.result = new IS(elm.ta_stdout);

  io.log = new OS(null, elm.ta_log, false);
  io.ck  = new OS(null, elm.ta_ck,  false);
  io.dbg = new OS(null, elm.ta_dbg, false);

  io.log.refresh();
  io.ck.refresh();
  io.dbg.refresh();
}

// ===================================================================
// config

function do_init_config() {
  do_init_config_sub(ks.imid, kc.ck.get('im'), ks.ims, elm.sl_im);
  do_init_config_sub(ks.kbid, kc.ck.get('kb'), ks.kbs, elm.sl_kb);

  return false;
}

function do_init_config_sub(iddef, idck, ob, sl) {
  var a = new Array;
  for (var p in ob) { a.PUSH(ob[p]); }

  sl.options.length = a.length;
  for (var i = 0; i < a.length; i++) {
    sl.options[i].value = a[i].id;
    sl.options[i].text  = a[i].title;
    // set default
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
  ks.setim_with_ck(elm.sl_im.value);
  ks.setkb_with_ck(elm.sl_kb.value);

//  el.ck.write();
  do_ck();
//  el.reset();
//
  // XXX
  do_focus_input();
  //
  return false;
}

function do_cancel_config() {
  return do_init_config();    // XXX redundant?
}

// ===================================================================

// ===================================================================
// do help

//function do_help() {
//  var o0 = elm.sl_im.options;
//  var a1 = new Array();
//  for (var k = 0; k < o0.length; k++) {
//    var imid = o0[k].value;
//    var imname = o0[k].text;
//    if (! o0[k].selected) { continue; }
//
//    ks.helpinvalidate();
//    ks.setim(imid);
//
//    var a0 = new Array();
//    var o = elm.sl_helpstyle.options;
//    for (var j = 0; j < o.length; j++) {
//      if (o[j].selected) {
//    var style = o[j].value;
//    var a = ks.helpmk_with_style(style);
//    var s = '';
//    for (var i = 0; i < a.length; i++) {
//      s += '<nobr>' + a[i] + '</nobr> ';
//    }
//    a0.PUSH(s);
//      }
//    }
//
//    var s = '';
//    s += '<div>' + escapeHTML(imname) + '</div>';
//    s += '<div class="stdio">';
//    s += a0.join('<hr>');
//    s += '</div>';
//    a1.PUSH(s);
//  }
//  var s = a1.join('<hr>');
//
//  // output
//  io.help.clear();
//  io.help.puts(s);
//  io.help.refresh();
//
//  //do_focus_input();
//
//  return false;
//}

// ===================================================================
// do decode

function do_decode() {

  kc.decode(kc.code);

  // input -> output
  var s = kc.decoded;
  io.output.clear();
  io.output.puts(s);

  //do_focus_input();

  return false;
}

// ===================================================================
// input

function do_input() {
  var s = '';

  //kc.decode(kc.code = io.input.gets());
  kc.code = io.input.gets();
  do_decode();
  //
  s = io.output.gets();
  elm.tx_stdin.select();

  //if (s != '') { kc.decode(s); }
  //do_help();
  io.result.puts(s + "\n");
  io.input.clear();

  do_focus_input();

  return false;
}

// ===================================================================

function do_focus_input() {
  elm.tx_stdin.focus();
}

// ===================================================================

//function do_bt_up(sl) {
//  var n = sl.selectedIndex;
//  if (n < 0) { return; }
//
//  if (n == 0) { return; }
//  var m = n - 1;
//  var value = sl.options[n].value;
//  var text  = sl.options[n].text;
//
//  sl.options[n].value = sl.options[m].value;
//  sl.options[n].text = sl.options[m].text;
//
//  sl.options[m].value = value;
//  sl.options[m].text = text;
//
//  sl.options[m].selected = true;
//  sl.options[n].selected = false;
//}
//
//function do_bt_dn(sl) {
//  var n = sl.selectedIndex;
//  if (n < 0) { return; }
//
//  if (n == sl.length - 1) { return; }
//  var m = n + 1;
//  var value = sl.options[n].value;
//  var text  = sl.options[n].text;
//
//  sl.options[n].value = sl.options[m].value;
//  sl.options[n].text = sl.options[m].text;
//
//  sl.options[m].value = value;
//  sl.options[m].text = text;
//
//  sl.options[m].selected = true;
//  sl.options[n].selected = false;
//}

// ===================================================================

//function do_cb_realtime() {
//  var b = elm.cb_realtime.checked;
//
//  if (b) {
//    elm.bt_query.disabled = true;
//    watch_beg();
//  } else {
//    watch_end();
//    elm.bt_query.disabled = false;
//  }
//
//  //do_focus_input();
//}


//function do_sl_im() {
//  var sl = elm.sl_im;
//  var op = sl.options[sl.selectedIndex];
//  var imid = op.value;
//
//  if (el.ims[imid] && el.ims[imid].customizable) {
//    div_visible(elm.dv_userdef_im, true);
//    elm.ta_userdef_im.disabled = false;
//    elm.ta_userdef_im.focus();
//    elm.ta_userdef_im.select();
//  } else {
//    elm.ta_userdef_im.disabled = true;
//    div_visible(elm.dv_userdef_im, false);
//  }
//}
//
//function do_sl_kb() {
//}

// ===================================================================

var watch_tm = null;
var watch_wait = null;
var watch_fun = null;

function watch_end() {
  if (watch_tm) { clearTimeout(watch_tm); }
}

function watch_beg() {
  watch_end();
  var ret = true;
  if (watch_fun) { ret = watch_fun(); }
  if (ret && watch_wait) {
    watch_tm = setTimeout('watch_beg()', watch_wait);
  }
}



//watch_wait = 1000;
//watch_wait = 500;
watch_wait = 200;

var watch_fun = function() {
  var s0 = io.input.peek();
  var s1 = kc.code;
  if (s0 == s1) { return true; }
  //kc.decode(kc.code = s0);
  kc.code = s0;
  do_decode();
  return true;
}

// ===================================================================

//function do_sl_im() {
//  var sl = elm.sl_im;
//  var op = sl.options[sl.selectedIndex];
//  var imid = op.value;
//
//  if (el.ims[imid] && el.ims[imid].customizable) {
//    div_visible(elm.dv_userdef_im, true);
//    elm.ta_userdef_im.disabled = false;
//    elm.ta_userdef_im.focus();
//    elm.ta_userdef_im.select();
//  } else {
//    elm.ta_userdef_im.disabled = true;
//    div_visible(elm.dv_userdef_im, false);
//  }
//}

// ===================================================================
// log

function do_log_clear() {
  if (confirm('本当にログを消去してもいいですか?')) {
    io.log.clear();
    io.log.refresh();
  }
  return false;
}

// -------------------------------------------------------------------

function do_dbg_clear() {
  io.dbg.clear();
  io.dbg.refresh();
  return false;
}

// ===================================================================
// cookie

function do_ck() {
  kc.ck.write();
  do_ck_refresh();
}

function do_ck_remove() {
  var s = kc.ck.showcontent();
  if (confirm('本当にクッキーを消去してもいいですか?' + '\n' +
	      'クッキーの名前: ' + kc.ck.name + '\n' +
	      'クッキーの内容: ' + s)) {
    kc.ck.remove();
    kc.ck.read();
    do_ck_refresh();
  }
  return false;
}

function do_ck_refresh() {
  //var s = kc.ck.showcontent();
  var s = ''
    for (var p in kc.ck.content) {
      s += p + '=' + kc.ck.content[p] + ':\n';
    }
  //
  io.ck.clear();
  io.ck.puts('[' + kc.ck.name + ']');
  io.ck.puts(s);
  io.ck.refresh();
}

// ===================================================================
// Local Variables:
// mode: c++
// end:
