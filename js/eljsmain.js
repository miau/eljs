// elismain.js - eelll/JS (JavaScript implemented EELLL)
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
// config

var c_cookie_name = 'eellljs';
var c_mainbuf_size = 10;
var c_prefix_message = ':: ';
var c_prefix_prompt  = '&gt;&gt; ';


// ===================================================================
// const

var NL = '\n';
var BR = '<br>';
var NBSP = '&nbsp;';
var NLPAT = /[\r\n]+/;

// ===================================================================
// var

var el = new EELLL();		// EELLL object
var ks = el;
var elm;			// HTML elements
var io;				// input/output


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

  // do_init_style();

  // img preload
  //el.img_preload();
  //

  div_visible(elm.dv_debug, false);
  do_focus_input();

  return;
}

// ===================================================================
// elm 

function do_init_elm() {
  var id;
  id = [
	'dv_config', 'sl_im', 'sl_lt', 'sl_kb',
	'sl_lesson',
	'dv_main', 'dv_stdout',
	'tx_stdin', 'sb_cr',
	'cb_shuffle',
	'dv_help', 'dv_stdhelp',
	'sl_helpstyle',
	'ta_userdef_im', 'dv_userdef_im',
	'ta_userdef_lt', 'dv_userdef_lt',
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
  
  //io.text  = new OS(null, elm.ta_text,  false);
  io.main  = new OS(c_mainbuf_size, elm.dv_stdout,  true);
  io.help  = new OS(null, elm.dv_stdhelp,  true);

  io.log = new OS(null, elm.ta_log, false);
  io.ck  = new OS(null, elm.ta_ck,  false);
  io.dbg = new OS(null, elm.ta_dbg, false);

  //io.text.refresh();
  io.main.refresh();
  io.help.refresh();

  io.log.refresh();
  io.ck.refresh();
  io.dbg.refresh();
  
  io.input = new IS(elm.tx_stdin);
}

// ===================================================================
// config

function do_init_config() {
  do_init_config_sub(el.imid, el.ck.get('im'), el.ims, elm.sl_im);
  do_init_config_sub(el.kbid, el.ck.get('kb'), el.kbs, elm.sl_kb);
  do_init_config_sub(el.ltid, el.ck.get('lt'), el.lts, elm.sl_lt);

  elm.cb_shuffle.checked = (el.ck.get('shuffle') == 'true');

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
  el.setim_with_ck(elm.sl_im.value);
  el.setkb_with_ck(elm.sl_kb.value);
  el.setlt_with_ck(elm.sl_lt.value);

  //// user def
  if (el.im.customizable) {
    var b = el.userdef(elm.ta_userdef_im.value);
  }
  if (el.lt.customizable) {
    var b = el.lt_userdef(elm.ta_userdef_lt.value);
  }

  do_ck(); // el.ck.write();
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

  sl.options.length = a.length;
  for (var i = 0; i < a.length; i++) {
    sl.options[i].value = i;
    sl.options[i].text  = a[i].title;
    
  }
  // default
  if (sl.options[0]) { sl.options[0].selected = true; }

  // cookie
  var ck = el.ck.get(el.imid + '/' + el.ltid);
  if (ck != null && sl.options[parseInt(ck)]) {
    sl.options[parseInt(ck)].selected = true;
  }
}

function do_set_lesson() {
  el.setls(elm.sl_lesson.value);
  do_ck(); // el.ck.write();

  do_start_lesson();

  return false;
}

function do_cancel_lesson() {
  elm.sl_lesson.options[el.lsno].selected = true;

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
  var style = elm.sl_helpstyle.options[elm.sl_helpstyle.selectedIndex].value;

  //var a = el.helpdata.mk_with_style(style, el);
  var a = el.helpmk_with_style(style);
  var s = '';
  for (var i = 0; i < a.length; i++) {
    s += '<nobr>' + a[i] + '</nobr> ';
  }

  // output
  io.help.clear();
  io.help.puts(s);
  io.help.refresh();

  do_focus_input();

  return false;
}

// ===================================================================
// input

function do_input() {
  var s = io.input.gets();

  switch (el.mode) {
  case 'start':   do_input_start(s); break;
  case 'text':    do_input_text(s);  break;
  case 'command':
    do_input_command(s);
    if (s == 'q' || s == 'Q') {
      elm.tx_stdin.blur(); return false; // unfocus XXX
    }
    break;
  case 'quit':    elm.tx_stdin.blur(); return false; // unfocus
  default:        ;		// nop
  }

  do_focus_input();
  return false;
}

// ===================================================================

function do_input_start(s) {
  if (elm.cb_shuffle.checked) { el.lstext.SHUFFLEself(); }

  el.mode = 'text';

  do_clear();

  // clear help
  el.helpclear();
  do_help();

  do_next_line();

  // log
  {
    var dt = new Date();
    var year  = dt.getFullYear();
    var month = dt.getMonth() + 1; if (month < 10) { month = '0' + month; }
    var day   = dt.getDate();      if (day   < 10) { day   = '0' + day; }
    var hour  = dt.getHours();     if (hour  < 10) { hour  = '0' + hour; }
    var min   = dt.getMinutes();   if (min   < 10) { min   = '0' + min; }
    var sec   = dt.getSeconds();   if (sec   < 10) { sec   = '0' + sec; }
    var date = year + '-' + month + '-' + day;
    var time = hour + ':' + min + ':' + sec;
    var dts   = year + '-' + month + '-' + day +
      ' ' + hour + ':' + min + ':' + sec;
    var s;
    if (io.log.elm.value != '') { io.log.puts(''); }
    s = '#';
    s += ' date=' + date + ' time=' + time;
    s += ' im/lt/no=' + el.imid + '/' + el.ltid + '/' + el.lsno;
    io.log.puts(s);
    io.log.refresh();
  }
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
  ///<errorrate>
  el.lsstquest += m.stquest;

  do_next_line();
}

function do_result(res) {
  // XXX
  var s = '';
  var t = '';
  var acorr = new Array();
  var aerr = new Array();
  for (var i = 0; i < res.length; i++) {
    var log = '';
    var a = res[i];
    if (a[0]) {
      // corrct
      s += escapeHTML(a[1], true);
      acorr.PUSH(a[1]);
    } else {
      // typo
      s += '<span class="err">' + escapeHTML(a[2], true) + '</span>';
      for (var j = 0; j < a[1].length; j++) {
	t += a[1][j][0];
	log += a[1][j][0] + '[' + a[1][j][1] + ']';
	aerr.PUSH(a[1][j][0]);
      }
      if (log != '') {
	log += ' * (' + a[2] + ')';
	io.log.puts(log);
      }
    }
  }
  //
  for (var i = 0; i < acorr.length; i++) {
    el.lschweak.DELETE(acorr[i]);
  }
  for (var i = 0; i < aerr.length; i++) {
    el.lschweak.PUSH(aerr[i]);
    el.lschtypo.PUSH(aerr[i]);
  }
  el.lschweak.UNIQself();

  s = '<span class="usr">' + s + '</span>';
  do_puts(s);

  //el.helpdata.set(t);
  el.helpset(t);
  do_help();

  if (t != '') {
    t = '[まちがえた文字]=> 『' + '<span\tclass="err">' +
      escapeHTML(t, true) + '</span>' + '』';
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
    do_next_lesson();
    break;

  case 'p': case 'P':
    do_prev_lesson();
    break;

  case 'r': case 'R':
    do_rand_lesson();
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
    ///<errorrate>
    el.stquest += el.lsstquest;

    ///<errorrate>
    do_score(el.lstime, el.lsstall, el.lsstcor, el.lssterr,  el.lsstquest);
    do_log(el.lstime, el.lsstall, el.lsstcor, el.lssterr,  el.lsstquest);
  
    if (0 < el.lschtypo.length) {
      var t = el.lschtypo.UNIQ().join('');
      var s = '[この課でまちがえた文字]=> 『';
      s += '<span\tclass="err">';
      s += escapeHTML(t, true);
      s += '</span>';
      s += '』';
      do_message(s);
      el.helpset(t);
    } else {
      el.helpclear();
    }

    do_puts('');

    el.mode = 'command';
    do_prompt('もう一度トライしますか? (もう一度(A) / 次へ(N) / 終了(Q))');

  } else {
    el.lsline = el.lstext[el.lslineno];
    el.lslineno += 1;

    //el.helpdata.set(el.lsline);
    el.helpset(el.lsline);
    {
      var a = el.lsline.split('');
      var s = '';
      for (var i = 0; i < a.length; i++) {
	if (el.lschweak.MEMBERP(a[i])) {
	  s += '<span\tclass="weak">' + a[i] + '</span>';
	} else {
	  s += a[i];
	}
      }
      do_puts(s);
    }

    el.lstimebeg = (new Date()).getTime();
  }
}

// ===================================================================

function do_score(ms, nraw, stcor, sterr,  stquest) {
  // nraw  : 入力総打鍵数
  // stcor : 入力のうち正しい打鍵数
  // sterr : 誤り打鍵数 (打つべきだったのに打たなかった鍵数を含む!!!)
  // ※ 一般には nraw ≠ stcor + sterr であることに注意
  // stquest : 問題文の (正しい) 打鍵数
  var s;

  s = '[総打鍵成績] 毎打鍵 ';
  s += '<span class="usr">';
  s += Math.floor(ms / nraw);
  s += '</span>';
  s += ' ミリ秒、毎分 ';
  s += '<span class="usr">';
  s += Math.floor(nraw / ms * 60000);
  s += '</span>';
  s += ' 打鍵';
  do_message(s);

  s = '[実打鍵成績] 毎打鍵 ';
  s += '<span class="usr">';
  s += Math.floor(ms / stcor);
  s += '</span>';
  s += ' ミリ秒、毎分 ';
  s += '<span class="usr">';
  s += Math.floor(stcor / ms * 60000);
  s += '</span>';
  s += ' 打鍵';
  do_message(s);

  s = 'エラーレート ';
  s += '<span\tclass="err">';
  ///<errorrate>
  // エラーレートは、 (誤り打鍵数) / (問題文の正しい打鍵数) であるべきでは
  //s += Math.floor(sterr / nraw * 1000) / 10;
  s += Math.floor(sterr / stquest * 1000) / 10;
  ///</errorrate>
  s += '</span>';
  s += ' %';
  do_message(s);
}

function do_log(ms, nraw, stcor, sterr,  stquest) {
  var s;

  s = '#';
  s += ' st=' + nraw;
  s += ' sec=' + Math.floor(ms / 100) / 10;
  s += ' ms/st=' + Math.floor(ms / stcor);
  s += ' st/min=' + Math.floor(stcor / ms * 60000);
  ///<errorrate>
  //s += ' error%=' + Math.floor(sterr / nraw * 1000) / 10;
  s += ' error%=' + Math.floor(sterr / stquest * 1000) / 10;
  ///</errorrate>
  io.log.puts(s);

  io.log.refresh();
}

// ===================================================================

function do_quit_lesson() {
  el.mode = 'quit';

  do_clear();
  do_message('');
  do_message('総合成績');
  do_message('');

  ///<errorrate>
  do_score(el.time, el.stall, el.stcor, el.sterr, el.stquest);
  //do_log(el.time, el.stall, el.stcor, el.sterr, el.stquest);
  // no log here!

  var s;
  s = '入力打鍵数 ';
  s += '<span class="usr">';
  s += el.stall;
  s += '</span>';
  s += ' 打鍵、所要時間 ';
  s += '<span class="usr">';
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

function do_rand_lesson() {
  do_jump_lesson(Math.floor(Math.random() * el.lt.lesson.length));
}

function do_jump_lesson(no) {
  while (no < 0) { no += el.lt.lesson.length; }
  no %= el.lt.lesson.length;

  elm.sl_lesson.options[no].selected = true;

  do_set_lesson();
}

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

// -------------------------------------------------------------------

function do_ck() {
  el.ck.write();
  do_ck_refresh();
}

function do_ck_remove() {
  var s = el.ck.showcontent();
  if (confirm('本当にクッキーを消去してもいいですか?' + '\n' +
	      'クッキーの名前: ' + el.ck.name + '\n' +
	      'クッキーの内容: ' + s)) {
    el.ck.remove();
    el.ck.read();
    do_ck_refresh();
  }
  return false;
}

function do_ck_refresh() {
  //var s = el.ck.showcontent();
  var s = ''
    for (var p in el.ck.content) {
      s += p + '=' + el.ck.content[p] + ':\n';
    }
  //
  io.ck.clear();
  io.ck.puts('[' + el.ck.name + ']');
  io.ck.puts(s);
  io.ck.refresh();
}

// ===================================================================
// style
// 2005-06-26

// function do_init_style() {
//   // XXX
//   elm.sl_style = getelm('sl_style');
// 
//   var o = document.styleSheets;
//   var p = elm.sl_style.options;
//   p.length = o.length;
//   for (var i = 0; i < o.length; i++) {
//     p[i].value = i;
//     p[i].text  = o[i].title;
//     // XXX
//     if (!p[i].text || '' == p[i].text) {
// 	 p[i].text = '標準';
// 	 p[i].selected = true;
//     }
//   }
// }
// 
// function do_set_style() {
//   var n = elm.sl_style.value;
//   for (i = 0; i < document.styleSheets.length; i++) {
//     document.styleSheets[i].disabled = (i != n);
//   }
// }

// ===================================================================

function do_bt_command(c) {
  el.mode = 'command';
  elm.tx_stdin.value = c;
  elm.sb_cr.click();

  //do_focus_input();
}

function do_cb_shuffle() {
  el.ck.set('shuffle', elm.cb_shuffle.checked);
  do_ck(); // el.ck.write();

  do_focus_input();
}

function do_focus_input() {
  elm.tx_stdin.focus();
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


// // ===================================================================
// // text proc
// 
// function text_fold(str, maxcol, foldcol) {
//   var sa = str.split(NLPAT);
//   var foldp = false;
//   for (var i = 0; i < sa.length; i++) {
//     if (maxcol < sa[i].WIDTH()) { foldp = true; break; }
//   }
//   if (!foldp) { return sa; }
// 
//   var a = new Array();
//   for (var i = 0; i < sa.length; i++) {
//     var col = 0, s = '';
//     var saa = sa[i].split('');
//     for (var j = 0; j < saa.length; j++) {
// 	 var w = saa[j].WIDTH();
// 	 if (foldcol < col + w) { a.PUSH(s); s = ''; col = 0; }
// 	 col += w; s += saa[j];
//     }
//     if (col != 0) { a.PUSH(s); }
//   }
//   return a;
// }
// 
// ===================================================================

function do_sl_im() {
  var sl = elm.sl_im;
  var op = sl.options[sl.selectedIndex];
  var imid = op.value;

  if (el.ims[imid] && el.ims[imid].customizable) {
    div_visible(elm.dv_userdef_im, true);
    elm.ta_userdef_im.disabled = false;
    elm.ta_userdef_im.focus();
    elm.ta_userdef_im.select();
  } else {
    elm.ta_userdef_im.disabled = true;
    div_visible(elm.dv_userdef_im, false);
  }
}

function do_sl_lt() {
  var sl = elm.sl_lt;
  var op = sl.options[sl.selectedIndex];
  var ltid = op.value;

  if (el.lts[ltid] && el.lts[ltid].customizable) {
    div_visible(elm.dv_userdef_lt, true);
    elm.ta_userdef_lt.disabled = false;
    elm.ta_userdef_lt.focus();
    elm.ta_userdef_lt.select();
  } else {
    elm.ta_userdef_lt.disabled = true;
    div_visible(elm.dv_userdef_lt, false);
  }
}


// ===================================================================
// eljssave

function do_submit_log() {
  var fm   = getelm('fm_log');
  var cgi  = getelm('tx_log_cgi');
  var date = getelm('tx_log_date');
  var user = getelm('tx_log_user');
  var eljs = getelm('tx_log_eljs');
  var ta   = getelm('ta_log');

  var dt = new Date();
  var year  = dt.getFullYear();
  var month = dt.getMonth() + 1; if (month < 10) { month = '0' + month; }
  var day   = dt.getDate();      if (day   < 10) { day   = '0' + day; }
  var hour  = dt.getHours();     if (hour  < 10) { hour  = '0' + hour; }
  var min   = dt.getMinutes();   if (min   < 10) { min   = '0' + min; }
  var sec   = dt.getSeconds();   if (sec   < 10) { sec   = '0' + sec; }
  var dts   = year + '-' + month + '-' + day +
    ' ' + hour + ':' + min + ':' + sec;
  date.value = dts;

  if (cgi.value == '' || cgi == '#') {
    alert('送信先 URL を指定してください。');
    getelm('tx_log_cgi').focus();
    return false;
  }

  fm.action = cgi.value;

  if (user.value == '') {
    alert('ユーザ名を記入してください。');
    getelm('tx_log_user').focus();
    return false;
  }

  var msg = '本当に送信してよいですか?\n' +
    'URL: '  + fm.action + '\n' +
    '\n' +
    'eljs: ' + eljs.value + '\n' +
    'date: ' + date.value + '\n' +
    'user: ' + user.value + '\n'; // +
    // '\n' + 
    // ta.value + '\n';
  return confirm(msg);
}




// ===================================================================
// Local Variables:
// mode: c++
// end:
