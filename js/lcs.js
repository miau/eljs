// lcs.js - LCS algorithm for EELLL
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
// LCS

// MAXI : max Japanese chars
// MAXJ : max strokes
// MAXM : max matched Japanese chars

function LCS() {
  this.MAXI = 80;
  this.MAXJ = 160;
  this.MAXM = 80;
  // XXX ???

  // match table
  this.mt = new Array(this.MAXJ + 1);
  for (var j = 0; j <= this.MAXJ; j++) {
    this.mt[j] = new Array(this.MAXI + 1);
    for (var i = 0; i <= this.MAXI; i++) {
      this.mt[j][i] = new Object(); // {m:0, j:null, i:null};
    }
  }

  // match data
  this.md = new Array(this.MAXM + 1);
  for (var n = 0; n <= this.MAXM; n++) {
    this.md[n] = new Object();	// {len:0, j:null, i:null};
  }

  this.res = null;
  // [ [true, 'の', 'kd'], [false, [['が', ';s'], ['、', 'jd']], 'js;d'] ]

  this.stall = null;
  this.sterr = null;
  this.stcor = null;
  ///<errorrate>
  this.stquest = null;

  return this;
}

// do match
// - r : [['の', 'kd'], ['、', 'jd'], ['が', ';s'], ...]
// - s : 'kdjs;d...' (user input)
LCS.prototype.match = function(r, s) {
  var sa = s.split('');
  this.stall = s.length;
  ///<errorrate>
  this.stquest = 0;

  var ra_j = new Array();
  var ra   = new Array();
  for (var i = 0; i < r.length; i++) {
    ra_j.PUSH(r[i][0]);
    ra.PUSH(r[i][1]);
    ///<errorrate>
    this.stquest += r[i][1].length;
  }

  var maxj = Math.min(sa.length, this.MAXJ);
  var maxi = Math.min(ra.length, this.MAXI);

  // init match table
  for (var j = 0; j <= maxj; j++) {
    for (var i = 0; i <= maxi; i++) {
      this.mt[j][i].m = 0;
    }
  }

  // make match table
  var m;
  for (var j = 0; j < maxj; j++) {
    for (var i = 0; i < maxi; i++) {
      var relm = ra[i], len = relm.length;

      if (((j + len) <= maxj) && (relm == s.substr(j, len))) {
	// matched
	for (var dj = 0; dj < len; dj++) {
	  this.mt[j + dj + 1][i + 1].m =
	    Math.max(this.mt[j + dj + 1][i + 1].m,
		     Math.max(this.mt[j + dj + 1][i].m,
			      this.mt[j + dj][i + 1].m));
	}
	m = this.mt[j][i].m + len;
	if (this.mt[j + len][i + 1].m < m) {
	  this.mt[j + len][i + 1].m = m;
	  this.mt[j + len][i + 1].j = j;
	  this.mt[j + len][i + 1].i = i;
	}

      } else {
	// NOT matched
	this.mt[j + 1][i + 1].m =
	  Math.max(this.mt[j + 1][i + 1].m,
		   Math.max(this.mt[j + 1][i].m,
			    this.mt[j][i + 1].m));
      }
    } // i
  } // j

  // go backward and make match data
  var nmatch = 0;
  this.md[nmatch].j = maxj;
  this.md[nmatch].i = maxi;
  this.md[nmatch].len = 0;
  for (nmatch = 1, j = maxj, i = maxi, m = this.mt[j][i].m;
       0 < m;
       nmatch += 1) {
    while (0 < i && this.mt[j][i - 1].m == m) { i -= 1; }
    while (0 < j && this.mt[j - 1][i].m == m) { j -= 1; }
    var prevj = this.mt[j][i].j;
    var previ = this.mt[j][i].i;
    this.md[nmatch].j = prevj;
    this.md[nmatch].i = previ;
    this.md[nmatch].len = ra[previ].length;
    j = prevj; i = previ;
    m = this.mt[j][i].m;
  }

  // result
  this.res = new Array();
  this.typo = new Array();
  this.sterr = 0;
  this.stcor = 0;
  this.err = '';

  var j = 0, i = 0;
  for (var n = nmatch - 1; 0 <= n; n--) {
    var len = this.md[n].len;
    var nextj = this.md[n].j;
    var nexti = this.md[n].i;

    var erri = [];
    var errj = '';
    var errp = false;

    if (i < nexti) {
      errp = true;
      while (i < nexti) {
	erri.PUSH([ra_j[i], ra[i]]);
	this.sterr += ra[i].length;
	i++;
      }
    }
    i++;

    if (j < nextj) {
      errp = true;
      while (j < nextj) {
	errj += sa[j];
	this.sterr += 1;
	j++;
      }
    }
    
    if (errp) {
      this.res.PUSH([false, erri, errj]);
    }

    if (0 < len) {
      this.res.PUSH([true, ra_j[nexti], ra[nexti]]);
      this.stcor += ra[nexti].length;
    }
    j += len;
  }

  return this;
  // {res:res, stall:stall, sterr:sterr, stcor:stcor}
}


// ===================================================================
// Local Variables:
// mode: c++
// end:

