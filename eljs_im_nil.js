// eljs_im_mil.js --- empty input method data
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


var im = new Object();

// ===================================================================
// config

im.id = "nil";
im.title = "なし";
//im.ltid = "EELLLTXT";

im.encodetable = o = new Object();

// decode table
// nop

// alternate definitions (optional)
im.encodetable_alt = o = new Object();
// nop

// ===================================================================
// make encodetable

im.decodetable = new Object();
im.ndefs = 0;
for (var kanji in im.encodetable) {
  // avoid double definition
  if (im.decodetable[im.encodetable[kanji]] != null) {
    continue;
  }
  im.decodetable[im.encodetable[kanji]] = kanji;
  im.ndefs += 1;
}

// ===================================================================
// add entry

el.addim(im);
