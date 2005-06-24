// eljs_kb_dvorak.js --- Dvorak keyboard data
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


var kb = new Object();

// ===================================================================
// config

kb.id = "Dvorak";
kb.title = "Dvorak";

// encodemap
// - "[" => "@"
// - "'" => ":" etc.
kb.encodemap = o = new Object();
// o['1'] = '1';
// o['2'] = '2';
// o['3'] = '3';
// o['4'] = '4';
// o['5'] = '5';
// o['6'] = '6';
// o['7'] = '7';
// o['8'] = '8';
// o['9'] = '9';
// o['0'] = '0';
o["'"] = 'q';
o[','] = 'w';
o['.'] = 'e';
o['p'] = 'r';
o['y'] = 't';
o['f'] = 'y';
o['g'] = 'u';
o['c'] = 'i';
o['r'] = 'o';
o['l'] = 'p';
// o['a'] = 'a';
o['o'] = 's';
o['e'] = 'd';
o['u'] = 'f';
o['i'] = 'g';
o['d'] = 'h';
o['h'] = 'j';
o['t'] = 'k';
o['n'] = 'l';
o['s'] = ';';
o[';'] = 'z';
o['q'] = 'x';
o['j'] = 'c';
o['k'] = 'v';
o['x'] = 'b';
o['b'] = 'n';
// o['m'] = 'm';
o['w'] = ',';
o['v'] = '.';
o['z'] = '/';
o['['] = '\\';
o[']'] = '-';
o['/'] = '^'; // '=';
o['='] = '@'; // '[';
o['\\'] = '['; // ']';
o['-'] = ':'; // "'";
o['`'] = ']'; // '`';
// o['!'] = '!';
o['@'] = '"'; // '@';
o['#'] = '#';
o['$'] = '$';
o['%'] = '%';
o['^'] = '&'; // '^';
o['&'] = "'"; // '&';
o['*'] = '('; // '*';
o['('] = ')'; // '(';
o[')'] = '_'; // ')';
o['"'] = 'Q';
o['<'] = 'W';
o['>'] = 'E';
o['P'] = 'R';
o['Y'] = 'T';
o['F'] = 'Y';
o['G'] = 'U';
o['C'] = 'I';
o['R'] = 'O';
o['L'] = 'P';
// o['A'] = 'A';
o['O'] = 'S';
o['E'] = 'D';
o['U'] = 'F';
o['I'] = 'G';
o['D'] = 'H';
o['H'] = 'J';
o['T'] = 'K';
o['N'] = 'L';
o['S'] = '+'; // ':';
o[':'] = 'Z';
o['Q'] = 'X';
o['J'] = 'C';
o['K'] = 'V';
o['X'] = 'B';
o['B'] = 'N';
// o['M'] = 'M';
o['W'] = '<';
o['V'] = '>';
o['Z'] = '?';
o['{'] = '='; // '_';
o['}'] = '~'; // '+';
o['?'] = '`'; // '{';
o['|'] = '{'; // '}';
o['_'] = '*'; // '"';
o['~'] = '}'; // '~';

// ===================================================================
// make decodemap

kb.decodemap = new Object();
for (var k in kb.encodemap) {
  kb.decodemap[kb.encodemap[k]] = k;
}

// ===================================================================
// add entry

el.addkb(kb);

