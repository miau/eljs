// qwerty.js - QWERTY keyboard data
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


{
  var kb = new Object();

  // ===================================================================
  // config

  kb.id = "QWERTY";
  kb.title = "QWERTY ±Ñ¸ì";

  var o = kb.encodemap = new Object();
  var p = kb.decodemap = new Object(); 
  o['@'] = '"';  p['"'] = '@';
  o['^'] = '&';  p['&'] = '^';
  o['&'] = "'";  p["'"] = '&';
  o['*'] = '(';  p['('] = '*';
  o['('] = ')';  p[')'] = '(';
  o[')'] = '' ;  
  o['_'] = '=';  p['='] = '_';
  o['='] = '^';  p['^'] = '=';
  o['+'] = '~';  p['~'] = '+';
  o['['] = '@';  p['@'] = '[';
  o['{'] = '`';  p['`'] = '{';
  o[']'] = '[';  p['['] = ']';
  o['}'] = '{';  p['{'] = '}';
  o[':'] = '+';  p['+'] = ':';
  o["'"] = ':';  p[':'] = "'";
  o['"'] = '*';  p['*'] = '"';
  o['\\']= ']';  p[']'] = '\\';
  o['|'] = '}';  p['}'] = '|';
  o['`'] = '\\'; p['\\'] = '`';
  o['~'] = '_';  p['_'] = '~';
  //p['\\'] = '';
  p['|'] = '';

  // ===================================================================
  // add entry

  ks.addkb(kb);
}
