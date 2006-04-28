#!/usr/bin/env ruby -Ke

# usage:
# - eellltxtindex.rb < eellltxtindex.rb > eellltxtindex.html

# 2006-04-06

$ln = Array::new
flag = false

while ln = gets do
  ln.chomp!

  break if /^=end/ =~ ln
  flag = true if /^=begin eellltxtindex/ =~ ln
  next unless flag

  case ln
  when /^- (.+)\t(.+)\t(.+)\t(.+)/
    e = ['-', $1, $2, [[$3, $4].collect {|f| f == "_" ? "" : f}]]
    $ln.push(e)
  when /^\t\t(.+)\t(.+)/
    $ln[$ln.length - 1][3].push([$1,$2].collect {|f| f == "_" ? "" : f})

  when /^\* (.+)/
    e = ['*', $1]
    $ln.push(e)

  when /^\*\* (.+)/
    e = ['**', $1]
    $ln.push(e)

  when /^\*\*\* (.+)/
    e = ['***', $1]
    $ln.push(e)

  else
    warn "  skipped #{ln}"
  end
end


puts <<"EOH"
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
 "http://www.w3.org/TR/html4/strict.dtd">
<html lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Content-Style-Type" content="text/css">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<!--
<meta name="author" content="">
<meta name="description" content="">
<meta name="keywords" content="">
-->
<title>EELLLTXT もくじ</title>
<link rel="stylesheet" href="css/default.css">
<!--
<link rel="alternate" href="">
<link rel="start" href="">
<link rel="next" href="">
<link rel="previous" href="">
<link rel="contents" href="">
<link rel="index" href="">
<link rel="glossary" href="">
<link rel="copyright" href="">
<link rel="chapter" href="">
<link rel="section" href="">
<link rel="subsection" href="">
<link rel="help" href="">
<link rel="bookmark" href="">
-->
</head>
<body>
EOH

puts <<"EOH"
<!-- STYLE BEG -->
<style type="text/css">
<!--
table.eellltxt {
  font-family: monospace;
  font-size: small;
  margin-left: auto;
  margin-right: auto;
}

.eellltxt tr    { line-height: 100%; }
.eellltxt tr.odd  { background-color: #dde; }
.eellltxt tr.even { background-color: #eee; }

.eellltxt td {
  vertical-align : top;
  text-align: left;
  padding: 0px 0.2em;
}

.eellltxt tr.section {
  color: #fff;
  background-color: #336;
  line-height: 320%;
  font-weight: bold;
}

.eellltxt tr.subsection {
  color: #fff;
  background-color: #679;
  line-height: 176%;
}

.eellltxt tr.subsubsection {
  color: #003;
  background-color: #abc;
  line-height: 100%;
}
-->
</style>
<!-- STYLE END -->
EOH

puts <<"EOH"
</head>
<body>
EOH

puts <<"EOH"
<!-- TABLE BEG -->
<table class="eellltxt">
<caption>EELLLTXT もくじ</caption>
EOH
oddp = false
$ln.each do |e|
  oddp = !oddp
  case e[0]
  when '-'
    rowspan = ''
    if e[3].length > 1 then
      rowspan = " rowspan=\"#{e[3].length}\""
    end
    klass = ' class="' + (oddp ? "odd" : "even") + '"'
    print "<tr#{klass}> <td#{rowspan}>#{e[1]}</td> <td#{rowspan}>#{e[2]}</td>"

      f = e[3].shift
    puts " <td>#{f[0]}</td> <td>#{f[1]}</td> </tr>"
    e[3].each do |f|
      puts "<tr#{klass}> <td>#{f[0]}</td> <td>#{f[1]}</td> </tr>"
    end

  when '*'
    oddp = false
    klass = ' class="section"'
    puts "<tr#{klass}> <td colspan=\"4\">#{e[1]}</td> </tr>"

  when '**'
    klass = ' class="subsection"'
    puts "<tr#{klass}> <td colspan=\"4\">#{e[1]}</td> </tr>"

  when '***'
    klass = ' class="subsubsection"'
    puts "<tr#{klass}> <td colspan=\"4\">#{e[1]}</td> </tr>"

  else
    warn "  ignored #{e}"
  end
end
puts <<"EOH"
</table>
<!-- TABLE END -->
EOH

puts <<"EOH"
</body>
</html>
EOH



=begin eellltxtindex
# 
# 
# 
# 
# 
# 全 197 課
#
# ※ ゆ が欠番
# 
# 凡例
# - RL : 右手 → 左手
# - RR : 右手 → 右手
# - LL : 左手 → 左手
# - LR : 左手 → 右手
# 
# - RL↑ : 右手 → 左手 (最上段)
# - RR↑ : 右手 → 右手 (最上段)
# - LL↑ : 左手 → 左手 (最上段)
# - LR↑ : 左手 → 右手 (最上段)
# 
# - RL↓ : 右手 (最上段) → 左手
# - RR↓ : 右手 (最上段) → 右手
# - LL↓ : 左手 (最上段) → 左手
# - LR↓ : 左手 (最上段) → 右手


* 000 番台	かな (1)
** ひらがな (1)
*** 中段
- 1	RL	中段	、がの
- 2	RL	中段	てと
- 3	RL	中段	でにはを
- 4	RL	中段	。たな
- 5	RL	中段	いしる
*** 上段
- 6	RL	上段	（）おこども
- 7	RL	上段	られ
- 8	RL	上段	あうえ
- 9	RL	上段	かきくさっろ
- 10	RL	上段	せやよわ
- 11	RL	復習	_
*** 下段
- 12	RL	下段	「」すそまり
- 13	RL	下段	だちつ
- 14	RL	下段	けみめん
- 15	RL	下段	げじずばほ
** 数字
- 16	RL	_	０１２３４５月時人
- 17	RL	_	―６７８９円日年分
- 18	RL	_	_
- 19	RL	_	・
** かたかな (1)
*** 上段
- 20	RL	上段	ーアシストラリルレ
- 21	RL	上段	キコタナマ
*** 下段
- 22	RL	下段	イカクドフン
- 23	RL	下段	ジッニバムロ
- 24	RL	下段	サチテパプュ
- 25	RL	下段	ウオグビメ
* 100 番台	かな (2)
** ひらがな (2)
- 101	RR	RR	ごひへべむ
- 102	RR	RR	ぞひびょ
- 103	LL	LL	ぎぐねふぶ
- 104	LR	LR	ざづぬぼゅ
- 105	RL!	RL↑	ぜぢ
- 106	LL!	LL↓	ぱぴぷぺぽ
** かたかな (2) (未)
* 200 番台	漢字 (RL) (初打固定)
** 一巡目
- 201	RL	初打 k	円会社日
		初打 l	一国子小千前代野
- 202	RL	初打 ;	大同二
		初打 ,	下川的面
		初打 i	区者場東
- 203	RL	初打 i	自町務
		初打 o	手高学生和住経発
- 204	RL	初打 o	百島所議
		初打 y	本中問後全歩店
- 205	RL	初打 m	時工名合家売理化
		初打 h	新上分
- 206	RL	初打 h	事通給
		初打 j	田員
		初打 /	地見市入歴作
- 207	RL	初打 n	業委不内海付気当
		初打 p	立月定保
- 208	RL	初打 p	木動女産明北
		初打 .	電長機京方
- 209	RL	初打 .	第政目都西
		初打 u	部山間金持回
** 二巡目
- 210	RL	初打 k	日会社円
- 211	RL	初打 l	一国子前
- 212	RL	初打 l	千代野小
- 213	RL	初打 ;	二大年同
- 214	RL	初打 ,	川面下的
- 215	RL	初打 i	東者場区
- 216	RL	初打 i	自務町
		初打 o	十
- 217	RL	初打 o	学高生手
- 218	RL	初打 o	発経和住
- 219	RL	初打 o	百島議所
- 220	RL	初打 y	中本後問
- 221	RL	初打 y	全歩店
		初打 m	人
- 222	RL	初打 m	時工名合
- 223	RL	初打 m	化売理家
- 224	RL	初打 m	道
		初打 h	上新分
- 225	RL	初打 h	事通給行
- 226	RL	初打 j	田員
		初打 /	地見
- 227	RL	初打 /	入市作歴
- 228	RL	初打 n	業内九不委
- 229	RL	初打 n	付気当相海
- 230	RL	初打 p	月定保立
- 231	RL	初打 p	動女産木
- 232	RL	初打 p	北明開
		初打 .	電
- 233	RL	初打 .	京長方機
- 234	RL	初打 .	都第目都対
- 235	RL	初打 .	西
		初打 u	出山部
- 236	RL	初打 u	金間回持
* 300 番台	漢字 (RR) (終打固定)
** 一巡目
- 301	RR	終打 k	他橋現話村座校
- 302	RR	終打 k	線製
		終打 j	力教男関戦午
- 303	RR	終打 j	信鉄来連式私
		終打 ;	書映
- 304	RR	終打 ;	主歳可米期外近強
- 305	RR	終打 ;	係光
		終打 l	成文成天民遇
- 306	RR	終打 l	完各世重点約
		終打 h	水有
- 307	RR	終打 h	藤原設物楽平要南
- 308	RR	終打 h	共
		終打 i	谷特送運記朝知
- 309	RR	終打 i	念振
		終打 u	画安集急最制
- 310	RR	終打 u	備接遠
		終打 p	品公屋石語
- 311	RR	終打 p	無演解募難即示辺
- 312	RR	終打 o	神打資士勤費視効
- 313	RR	終打 y	実洋数談題法美敗
- 314	RR	終打 y	巨短昔
		終打 ,	調決混総団
- 315	RR	終打 ,	食計夫司許迎華
		終打 m	交
- 316	RR	終打 m	商台口多先再環史
- 317	RR	終打 m	討響忘
		終打 /	以銀営勝治
- 318	RR	終打 /	身反巻陸担競護
		終打 .	選
- 319	RR	終打 .	体組党与戸択価並
- 320	RR	終打 .	冷復
		終打 n	用正表界協今
- 321	RR	終打 n	意支心個静医羽洗
		補遺	将
- 322	RR	補遺	序練宿優普版耳井岩佐郎補
- 323	RR	復習	(地名・人名)
** 二巡目
- 350	RR	終打 k	度他橋現話村座校線
		終打 j	鉄力教
- 351	RR	終打 j	男関戦信来連式私
		終打 ;	書主映
- 352	RR	終打 ;	可米期外近強係光
		終打 l	文成天
- 353	RR	終打 l	民各世重点約
		終打 h	水有平設物駅
- 354	RR	終打 h	楽平要南共
		終打 i	特送運記知念振
- 355	RR	終打 u	画安集急最制備接将遠
		終打 p	品公
- 356	RR	終打 p	屋語無演解難即
		終打 o	資費視
		終打 y	実洋
- 357	RR	終打 y	数談題法美
		終打 ,	調決団食計響商
- 358	RR	終打 m	口多先再
		終打 /	営勝身反陸
		終打 .	選体党
- 359	RR	終打 .	価
		終打 n	用正表界今意支心
* 400 番台	漢字 (LL) (初打固定)
** 一巡目
- 401	LL	初打 a	料受英案横局宅向
- 402	LL	初打 a	割種音報件料
		初打 d	切結
- 403	LL	初打 d	番活待館卒放情配
- 404	LL	初打 s	予土興府白曲頭熟
- 405	LL	初打 s	紙王
		初打 g	参真科職院位
- 406	LL	初打 g	少応慣写覚球元
		初打 f	進
- 407	LL	初打 f	取室育夜々引初技
- 408	LL	初打 f	官望側直
		初打 q	指思武風
- 409	LL	初打 q	若細収概果帝読族
- 410	LL	初打 q	徳
		初打 e	広次太利能丸策
- 411	LL	初打 e	両未恐守訪
		初打 z	投込転
- 412	LL	初打 z	済及説休判従適母
- 413	LL	初打 z	財欠
		初打 c	性軍別算蔵号
- 414	LL	初打 c	証感御裏厚因
		初打 w	格術
- 415	LL	初打 w	古際残告買始渡刊
		初打 t	船
- 416	LL	初打 t	賞火農死聞増熱退返
- 417	LL	初打 r	論在由首門習続園
- 418	LL	初打 r	才督極融登
		補遺	氏雄丁鈴
- 419	LL	補遺	池倉伊崎
		初打 b	伸推量差善
- 420	LL	初打 b	級清県造権毎派照
- 421	LL	初打 v	酒宇顔居妻使青半
- 422	LL	初打 v	早考福葉器値
		初打 x	奥類
- 423	LL!	初打 x	骨針夏空沢義
- 424	LL	初打 x	江省週吉規誤
- 431	LL	補遺	宮刺富求友黒械査
- 432	LL	補遺	詳了階雨況央
** 二巡目
- 451	LL	初打 a	料受英案横局宅向割種音報
- 452	LL	初打 a	件
		初打 d	加切結番活待館放情配
		初打 s	予
- 453	LL	初打 s	土白曲頭熟紙王
		初打 g	参真科職院
- 454	LL	初打 g	位応慣写覚元
		初打 f	進取室育夜
- 455	LL	初打 f	々引初技官望側直
		初打 q	指思武風
- 456	LL	初打 q	若細収概果帝読徳
		初打 e	広次太利
- 457	LL	初打 e	能丸策両未守
		初打 z	転済説休判適
- 458	LL	初打 z	欠
		初打 c	性軍別算号証感御裏厚因
- 459	LL	初打 w	格古際残告買刊
		初打 t	船賞火農
- 460	LL	初打 t	死増熱退
*** 初打その他 (未)
* 500 番台	漢字 (LR) (初打固定)
** 一巡目
- 501	LR	初打 a	左根婦勢限輸基足
- 502	LR	初打 a	色億逆令変服
		初打 b	状遊
- 503	LR	初打 b	単坂寮尾良命飛免
- 504	LR	初打 b	比便般波曜
		初打 d	改労精
- 505	LR	初打 d	任装味助築活販警
- 506	LR	初打 d	講衛赤独
		初打 s	録貸態展
- 507	LR	初打 s	様必形好草段声審
- 508	LR	初打 s	研企違
		初打 f	愛宝観額統
- 509	LR	初打 f	昇然検編栄型止想
- 510	LR	初打 g	争言管流渋役印
- 511	LR	初打 g	芸豊確誰消堂
- 512	LR	初打 w	終置質注程秀抜折
- 513	LR	初打 w	修寄張賃領庁鉱
- 514	LR	初打 v	落着準率非親健
- 515	LR	初打 v	施履袋税街庫諸
- 516	LR	初打 e	追究昨提起裁整
- 517	LR	初打 e	容断航供薬糸介
- 518	LR	初打 x	悪構満末負導客材
- 519	LR	初打 x	永払浅仲庭挙兵
- 520	LR	初打 r	答軽達防低具路跡
- 521	LR	初打 r	試層春隊港玉児
- 522	LR	初打 c	何認専乗過課
- 523	LR!	初打 c	頃険旅師茶秋津
- 524	LR!	初打 t	右得角減失評深
- 525	LR	初打 t	越角席養敷条芝
- 526	LR	初打 z	字等図例伝素陽
- 527	LR	初打 z	板券州爆毛殺之
- 528	LR	初打 q	常竹帰積害病志
- 529	LR	初打 q	故撃監停浴寺河
** 二巡目
- 551	LR	初打 a	左根婦勢限輸基足色億逆令
- 552	LR	初打 a	変服
		初打 b	状遊単坂寮尾良命飛免
*** 初打その他 (未)
* 600 番台	漢字 (RL!・LR!)
** 一巡目
*** RL↑ 終打固定
- 601	RL↑	終打 1	依温革境系借象須盛請繊探突捕訳
- 602	RL↑	終打 2	域益援賀岸漁荒香周尚織責父枚乱
- 603	RL↑	終打 3	ぜヘ幹喜丘景康降舎処譲走徒突模
- 604	RL↑	終打 4	圧干漢均緊苦恵激固雑彦布舞邦又
- 605	RL↑	終打 5	押血散姿衆除笑杉節絶測肉秘弁密
*** LR↑ 終打固定 (未)
*** LR↓ 終打固定 (未)
*** RL↓ 終打固定 (未)
** 二巡目
*** LR↓ 初打固定
- 651	LR↓	初打 1	快簡還眼執朱唱
- 652	LR↓	初打 1	承陣替迫包欲留岳
- 653	LR↓	初打 2	刑更災沼章紹巣遅
- 654	LR↓	初打 2	徴納繁否暮列鶴
- 655	LR↓	初打 3	憲候甲刻誌歯鹿
- 656	LR↓	初打 3	弱触占夢頼恋茂
- 657	LR↓	初打 4	勉雲卸貨途辞述致
- 658	LR↓	初打 4	宗招豆逃脳筆箱
- 659	LR↓	初打 5	阿看季献罪植寝
- 660	LR↓	初打 5	窓汎複矢絡里朗老
*** RL↓ 五十音順
- 661	RL↓	い～き	識易異稲影延帯拡歓破盤希汽紀範
- 662	RL↓	き～さい	疑旧去績筋君郡警核功抗攻更催採
- 663	RL↓	さく～ぞく	桜鳥酸雪療乳純焼障瀬捜互速属
- 664	RL↓	だい～ひ	仏麻炭換忠昼呼盗湯闘奈博幡犯肩
- 670	RL↓	ひょ～れん	標秒副幅房貿堀夕余謡離隣盟綿
*** RL↑ 五十音順
- 671	RL↑	あつ～き	ぜヘ圧依益援押温喜革干喜漢境幹
- 672	RL↑	きゅ～こう	丘漁均緊節苦景系激血康固舎荒香
- 673	RL↑	ざつ～ぜつ	雑借周衆処除象譲織杉徒盛請責絶
- 674	RL↑	せん～ふ	岸繊域走測探圧降糖突肉秘彦須父
- 675	RL↑	ぶ～わ	舞弁捕邦布枚又密模訳姿乱散笑尚
*** LR↑ 五十音順
- 676	LR↑	あ～きつ	亜扱移維遺刷塩柄欧札願危礎則喫
- 677	LR↑	ぎゅ～し	牛群郷禁群慶絹源湖乞弘紅豪砂操
- 678	LR↑	しゃ～せん	釈寿樹就飾充順傷償渉硝潟震端鮮
- 679	LR↑	そ～はつ	訴創存脱丹片駐著痛底努倒背倍揮
- 680	LR↑	ひ～わん	批皮被票句併舗暴郵綱竜輪臨礼腕
* 700 番台	漢字 (RR!・LL!) (未)
=end
