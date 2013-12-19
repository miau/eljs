#!/usr/bin/env perl -w

# 2011-02-21
# 2006-04-05
# 2006-04-02

# --------------------------------------------------------------------
# config

$cfg_me		= 'eljssave.cgi'; # this script's name

$cfg_logdir	= 'eljssave';	# path to log file
$cfg_logfile	= 'log.txt';	# log file name

$cfg_index	= 'index.html';	    # path to index file
$cfg_eellljs	= './eellljs.html'; # path to eellljs file

$cfg_derault_css= 'css/default.css'; # path to defualt stylesheet
$cfg_eljs_css	= 'css/eljs.css';    # path to eljs stylesheet

$cfg_charset	= "euc-jp";	# charset for RESULT OUTPUT (not log!)

# --------------------------------------------------------------------
# utils

sub puts { print(join('', @_) . "\n"); }

sub escapeHTML($) {
    my $s = shift;
    $s =~ s/&/&amp;/g;
    $s =~ s/</&lt;/g;
    $s =~ s/>/&gt;/g;
    $s =~ s/\"/&quot;/g;

    $s =~ s/\f/^L/g;

    return $s;
}

# --------------------------------------------------------------------
# global vars and constants

$gcgi = '';

$c_link_to_logfile = <<"EOF";
<a href="$cfg_logdir/$cfg_logfile"
type="text/plain" hreflang="ja" charset="euc-jp"
>$cfg_logdir/$cfg_logfile</a>
EOF
$c_success0 = "<p>$cfg_me succeeded.</p>";
$c_success1 = "<p>次の内容を $c_link_to_logfile に保存しました。</p>";
$c_failure0 = "<p>$cfg_me failed.</p>";
$c_failure1 =
    "<p>次の内容を $c_link_to_logfile に保存しようとしました" .
    "<br>…が、<strong>失敗しました</strong>。</p>";

$menu = <<"EOF";
<div class="menu">
[
<a href="$cfg_index">もくじにもどる</a>
|
<a href="$cfg_eellljs">eelll/JS にもどる</a>
]
</div>
EOF

# --------------------------------------------------------------------
# init

umask(0000);

use CGI;

$gcgi = new CGI;

$geljs = $gcgi->param('eljs');
$guser = $gcgi->param('user');
$gdate = $gcgi->param('date');
$glog  = $gcgi->param('log');

# --------------------------------------------------------------------
# prototypes

sub mk_html($);
sub mk_data();

# --------------------------------------------------------------------
# main(?)

$gdata = &mk_data();
$gdata =~ s/\r\n/\n/g;		# CR/LF => LF

if (open(F, ">>$cfg_logdir/$cfg_logfile")) {
    print F $gdata;
    close(F);

    print &mk_html(1);
} else {
    print &mk_html(0);
}

exit 0;

# --------------------------------------------------------------------

sub mk_data() {
    return <<"EOF";
eljs: $geljs
user: $guser
date: $gdate

$glog
\f
EOF
}

# --------------------------------------------------------------------

sub mk_html($) {		# $ : 1 (success) or 0 (error)
    my $success = shift;
    my $msg0;
    my $msg1;
    my $data_escaped = escapeHTML($gdata);

    if ($success) {
	$msg0 = $c_success0;
	$msg1 = $c_success1;
    } else {
	$msg0 = $c_failure0;
	$msg1 = $c_failure1;
    }

    return <<"EOF";
Content-Type: text/html; charset=$cfg_charset

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
 "http://www.w3.org/TR/html4/strict.dtd">
<html lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=$cfg_charset">
<meta http-equiv="Content-Style-Type" content="text/css">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<title>eljssave</title>
<link rel="stylesheet" href="$cfg_derault_css">
<link rel="stylesheet" href="$cfg_eljs_css">
</head>
<body class="eljs">
<div class="container">
<h1><a name="top">eljssave</a></h1>
$menu
<hr>
$msg0
<hr>
$msg1
<textarea cols="80" rows="20" readonly>$data_escaped</textarea>
<hr>
$menu
<div class="version">
eljssave.cgi version <!-- version -->0.2.3<!-- /version -->
<!-- time-stamp-start -->2011-02-21 yuse<!-- time-stamp-end -->
</div>
</div>
</html>
<!-- ============================================================= -->
<!--
  :: Local Variables:
  :: time-stamp-line-limit: -20
  :: time-stamp-start: "<!-\\- *time-stamp-start *-\\-."
  :: time-stamp-end:   "<!-\\- *time-stamp-end *-\\-."
  :: time-stamp-format: "%:y-%02m-%02d %u"
  :: End:
  -->
</body>
EOF
}
