// qwerty_jis.js - QWERTY JIS keyboard data
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

  kb.id = "QWERTY_JIS";
  kb.title = "QWERTY 日本語";

  // encodemap
  var o = kb.encodemap = new Object();
  // nop

  // ===================================================================
  // make decodemap

  kb.decodemap = new Object();
  for (var k in kb.encodemap) {
    kb.decodemap[kb.encodemap[k]] = k;
  }

  // ===================================================================
  // add entry

  ks.addkb(kb);
}
