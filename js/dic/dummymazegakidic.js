// dummymazegakidic.js - dummy mazegaki conversion dic
// 
// Copyright (C) 2013  YUSE Yosihiro
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


var mazegakidic = null;

// ===================================================================
// ■ 漢索/JS で交ぜ書き変換オプションを利用する方法
//
// (1) このファイルと同じ階層 (js/dic/) に mazegakidic.js を作成する。
//     書き方はこのファイルの末尾に示したとおり。
//
// (2) 作成した mazegakidic.js を kansakujs.html 内で
//     <script type="text/javascript" src="js/dic/mazegakidic.js"></script>
//     としてロードする。 kansakujs.html 内にすでにコメントアウトして
//     記述してあるので、コメントを外せばよい。
//
// (3) ブラウザで kansakujs.html にアクセスする。 [設定(C)] パネルの
//     交ぜ書き変換オプションが選択できるようになっているので、クリック
//     してチェックする
//
// (4) [検索(J)] 欄に『日ほんご』などと入力すると『本語』のコードが
//     表示される。
//
// ※ 漢索/JS は『あいいれな―』のように『―』で終わる活用語読みには
//    (現在のところ) 対応していないので、『あいいれない』などのように
//    『―』を含まない終止形で mazegakidic.js を作成するのがよい。
//
// ※ 試験的に 73374 行、 1973671 バイトの mazegakidic.js を作成し
//    実際に 漢索/JS にロードしたところ、十分高速に動作したが、
//    この mazegakidic.js はアーカイブに含めるには大きすぎる。

// ===================================================================
// mazegakidic.js の書き方の例
// ===================================================================
//
// var mazegakidic = new Object();
// 
// var _ = mazegakidic;
// 
// _["あ"] = "/亜/唖/娃/阿/吾/";
// _["ああ"] = "/嗚呼/";
// _["あい"] = "/娃/哀/愛/挨/姶/逢/会/合/相/藍/曖/隘/";
// _["あいいれない"] = "/相容れない/";
// // ... 略 ...
// _["にほんご"] = "/日本語/";
// _["にほん語"] = "/日本語/";
// _["に本ご"] = "/日本語/";
// _["に本語"] = "/日本語/";
// _["日ほんご"] = "/日本語/";
// _["日ほん語"] = "/日本語/";
// _["日本ご"] = "/日本語/";
// // ... 略 ...
// _["遙"] = "/遥/";
// _["瑤"] = "/瑶/";
// _["凜"] = "/凛/";
// _["熙"] = "/煕/";
