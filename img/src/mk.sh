#!/bin/sh

# usage
# -----
#
# ./*_.png
# |-
# mk.sh : () -> ()
# |-
# ../*/*.png

# 2006-03-23


srcdir=.

for base in 1 2 3 4 w x r l a1 a2 aw
do
    for k in `jot 40 0 39 1`
    do
	row=`expr "$k" "/" "10"`
	col=`expr "$k" "%" "10"`
	y=`expr "$row" "*" "10"`
	x=`expr "$col" "*" "10"`
	offy=`expr "30" "-" "$y"`
	offx=`expr "90" "-" "$x"`

	dstdir="../$base"
	mkdir -p "$dstdir"

	src="$srcdir/${base}_.png"
	dst="$dstdir/$row$col.png"

	2>&1 echo "$src => $dst"
	pngtopnm $src | \
	    pnmcut -left $offx -top $offy -width 100 -height 40 | \
	    pnmtopng -transparent ='rgb:cc/cc/cc' > $dst
    done
done

dstdir=..
2>&1 echo "$srcdir/0_.png => $dstdir/0/0.png"
cp $srcdir/0_.png $dstdir/0/0.png

2>&1 echo "r -> $dstdir/r1" ; ln -shf r "$dstdir/r1"
2>&1 echo "l -> $dstdir/l1" ; ln -shf l "$dstdir/l1"
2>&1 echo "r -> $dstdir/rw" ; ln -shf r "$dstdir/rw"
2>&1 echo "l -> $dstdir/lw" ; ln -shf l "$dstdir/lw"
2>&1 echo "2 -> $dstdir/r2" ; ln -shf 2 "$dstdir/r2"
2>&1 echo "2 -> $dstdir/l2" ; ln -shf 2 "$dstdir/l2"
