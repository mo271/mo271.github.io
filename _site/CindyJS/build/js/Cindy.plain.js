// rev 444
/*******************************************************************************
*                                                                              *
* Author    :  Angus Johnson                                                   *
* Version   :  6.1.2                                                           *
* Date      :  15 December 2013                                                *
* Website   :  http://www.angusj.com                                           *
* Copyright :  Angus Johnson 2010-2013                                         *
*                                                                              *
* License:                                                                     *
* Use, modification & distribution is subject to Boost Software License Ver 1. *
* http://www.boost.org/LICENSE_1_0.txt                                         *
*                                                                              *
* Attributions:                                                                *
* The code in this library is an extension of Bala Vatti's clipping algorithm: *
* "A generic solution to polygon clipping"                                     *
* Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
* http://portal.acm.org/citation.cfm?id=129906                                 *
*                                                                              *
* Computer graphics and geometric modeling: implementation and algorithms      *
* By Max K. Agoston                                                            *
* Springer; 1 edition (January 4, 2005)                                        *
* http://books.google.com/books?q=vatti+clipping+agoston                       *
*                                                                              *
* See also:                                                                    *
* "Polygon Offsetting by Computing Winding Numbers"                            *
* Paper no. DETC2005-85513 pp. 565-575                                         *
* ASME 2005 International Design Engineering Technical Conferences             *
* and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
* September 24-28, 2005 , Long Beach, California, USA                          *
* http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
*                                                                              *
*******************************************************************************/

/*******************************************************************************
*                                                                              *
* Author    :  Timo                                                            *
* Version   :  6.1.2.1                                                         *
* Date      :  15 December 2013                                                *
*                                                                              *
* This is a translation of the C# Clipper library to Javascript.               *
* Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
* Because Javascript lacks support for 64-bit integers, the space              *
* is a little more restricted than in C# version.                              *
*                                                                              *
* C# version has support for coordinate space:                                 *
* +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
* while Javascript version has support for space:                              *
* +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
*                                                                              *
* Tom Wu's JSBN proved to be the fastest big integer library:                  *
* http://jsperf.com/big-integer-library-test                                   *
*                                                                              *
* This class can be made simpler when (if ever) 64-bit integer support comes.  *
*                                                                              *
*******************************************************************************/

/*******************************************************************************
*                                                                              *
* Basic JavaScript BN library - subset useful for RSA encryption.              *
* http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
* Copyright (c) 2005  Tom Wu                                                   *
* All Rights Reserved.                                                         *
* See "LICENSE" for details:                                                   *
* http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
*                                                                              *
*******************************************************************************/
(function(){function l(a,b,c){d.biginteger_used=1;null!=a&&("number"==typeof a&&"undefined"==typeof b?this.fromInt(a):"number"==typeof a?this.fromNumber(a,b,c):null==b&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function q(){return new l(null)}function R(a,b,c,e,d,g){for(;0<=--g;){var h=b*this[a++]+c[e]+d;d=Math.floor(h/67108864);c[e++]=h&67108863}return d}function S(a,b,c,e,d,g){var h=b&32767;for(b>>=15;0<=--g;){var k=this[a]&32767,n=this[a++]>>15,m=b*k+n*h,k=h*k+((m&32767)<<
15)+c[e]+(d&1073741823);d=(k>>>30)+(m>>>15)+b*n+(d>>>30);c[e++]=k&1073741823}return d}function T(a,b,c,e,d,g){var h=b&16383;for(b>>=14;0<=--g;){var k=this[a]&16383,n=this[a++]>>14,m=b*k+n*h,k=h*k+((m&16383)<<14)+c[e]+d;d=(k>>28)+(m>>14)+b*n;c[e++]=k&268435455}return d}function M(a,b){var c=C[a.charCodeAt(b)];return null==c?-1:c}function y(a){var b=q();b.fromInt(a);return b}function D(a){var b=1,c;0!=(c=a>>>16)&&(a=c,b+=16);0!=(c=a>>8)&&(a=c,b+=8);0!=(c=a>>4)&&(a=c,b+=4);0!=(c=a>>2)&&(a=c,b+=2);0!=
a>>1&&(b+=1);return b}function z(a){this.m=a}function x(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}function U(a,b){return a&b}function J(a,b){return a|b}function N(a,b){return a^b}function O(a,b){return a&~b}function B(){}function P(a){return a}function A(a){this.r2=q();this.q3=q();l.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}var d={},E=!1;"undefined"!==typeof module&&module.exports?(module.exports=d,E=!0):
"undefined"!==typeof document?window.ClipperLib=d:self.ClipperLib=d;var t;if(E)r="chrome",t="Netscape";else{var r=navigator.userAgent.toString().toLowerCase();t=navigator.appName}var F,K,G,H,I,Q;F=-1!=r.indexOf("chrome")&&-1==r.indexOf("chromium")?1:0;E=-1!=r.indexOf("chromium")?1:0;K=-1!=r.indexOf("safari")&&-1==r.indexOf("chrome")&&-1==r.indexOf("chromium")?1:0;G=-1!=r.indexOf("firefox")?1:0;r.indexOf("firefox/17");r.indexOf("firefox/15");r.indexOf("firefox/3");H=-1!=r.indexOf("opera")?1:0;r.indexOf("msie 10");
r.indexOf("msie 9");I=-1!=r.indexOf("msie 8")?1:0;Q=-1!=r.indexOf("msie 7")?1:0;r=-1!=r.indexOf("msie ")?1:0;d.biginteger_used=null;"Microsoft Internet Explorer"==t?(l.prototype.am=S,t=30):"Netscape"!=t?(l.prototype.am=R,t=26):(l.prototype.am=T,t=28);l.prototype.DB=t;l.prototype.DM=(1<<t)-1;l.prototype.DV=1<<t;l.prototype.FV=Math.pow(2,52);l.prototype.F1=52-t;l.prototype.F2=2*t-52;var C=[],v;t=48;for(v=0;9>=v;++v)C[t++]=v;t=97;for(v=10;36>v;++v)C[t++]=v;t=65;for(v=10;36>v;++v)C[t++]=v;z.prototype.convert=
function(a){return 0>a.s||0<=a.compareTo(this.m)?a.mod(this.m):a};z.prototype.revert=function(a){return a};z.prototype.reduce=function(a){a.divRemTo(this.m,null,a)};z.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};z.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};x.prototype.convert=function(a){var b=q();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(l.ZERO)&&this.m.subTo(b,b);return b};x.prototype.revert=function(a){var b=q();a.copyTo(b);
this.reduce(b);return b};x.prototype.reduce=function(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,e=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,e,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)};x.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};x.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};l.prototype.copyTo=
function(a){for(var b=this.t-1;0<=b;--b)a[b]=this[b];a.t=this.t;a.s=this.s};l.prototype.fromInt=function(a){this.t=1;this.s=0>a?-1:0;0<a?this[0]=a:-1>a?this[0]=a+this.DV:this.t=0};l.prototype.fromString=function(a,b){var c;if(16==b)c=4;else if(8==b)c=3;else if(256==b)c=8;else if(2==b)c=1;else if(32==b)c=5;else if(4==b)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var e=a.length,d=!1,g=0;0<=--e;){var h=8==c?a[e]&255:M(a,e);0>h?"-"==a.charAt(e)&&(d=!0):(d=!1,0==g?this[this.t++]=h:g+c>this.DB?
(this[this.t-1]|=(h&(1<<this.DB-g)-1)<<g,this[this.t++]=h>>this.DB-g):this[this.t-1]|=h<<g,g+=c,g>=this.DB&&(g-=this.DB))}8==c&&0!=(a[0]&128)&&(this.s=-1,0<g&&(this[this.t-1]|=(1<<this.DB-g)-1<<g));this.clamp();d&&l.ZERO.subTo(this,this)};l.prototype.clamp=function(){for(var a=this.s&this.DM;0<this.t&&this[this.t-1]==a;)--this.t};l.prototype.dlShiftTo=function(a,b){var c;for(c=this.t-1;0<=c;--c)b[c+a]=this[c];for(c=a-1;0<=c;--c)b[c]=0;b.t=this.t+a;b.s=this.s};l.prototype.drShiftTo=function(a,b){for(var c=
a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s};l.prototype.lShiftTo=function(a,b){var c=a%this.DB,e=this.DB-c,d=(1<<e)-1,g=Math.floor(a/this.DB),h=this.s<<c&this.DM,k;for(k=this.t-1;0<=k;--k)b[k+g+1]=this[k]>>e|h,h=(this[k]&d)<<c;for(k=g-1;0<=k;--k)b[k]=0;b[g]=h;b.t=this.t+g+1;b.s=this.s;b.clamp()};l.prototype.rShiftTo=function(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var e=a%this.DB,d=this.DB-e,g=(1<<e)-1;b[0]=this[c]>>e;for(var h=c+1;h<this.t;++h)b[h-
c-1]|=(this[h]&g)<<d,b[h-c]=this[h]>>e;0<e&&(b[this.t-c-1]|=(this.s&g)<<d);b.t=this.t-c;b.clamp()}};l.prototype.subTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]-a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e-=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e-=a[c],b[c++]=e&this.DM,e>>=this.DB;e-=a.s}b.s=0>e?-1:0;-1>e?b[c++]=this.DV+e:0<e&&(b[c++]=e);b.t=c;b.clamp()};l.prototype.multiplyTo=function(a,b){var c=this.abs(),e=
a.abs(),d=c.t;for(b.t=d+e.t;0<=--d;)b[d]=0;for(d=0;d<e.t;++d)b[d+c.t]=c.am(0,e[d],b,d,0,c.t);b.s=0;b.clamp();this.s!=a.s&&l.ZERO.subTo(b,b)};l.prototype.squareTo=function(a){for(var b=this.abs(),c=a.t=2*b.t;0<=--c;)a[c]=0;for(c=0;c<b.t-1;++c){var e=b.am(c,b[c],a,2*c,0,1);(a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,e,b.t-c-1))>=b.DV&&(a[c+b.t]-=b.DV,a[c+b.t+1]=1)}0<a.t&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()};l.prototype.divRemTo=function(a,b,c){var e=a.abs();if(!(0>=e.t)){var d=this.abs();if(d.t<
e.t)null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);else{null==c&&(c=q());var g=q(),h=this.s;a=a.s;var k=this.DB-D(e[e.t-1]);0<k?(e.lShiftTo(k,g),d.lShiftTo(k,c)):(e.copyTo(g),d.copyTo(c));e=g.t;d=g[e-1];if(0!=d){var n=d*(1<<this.F1)+(1<e?g[e-2]>>this.F2:0),m=this.FV/n,n=(1<<this.F1)/n,V=1<<this.F2,w=c.t,p=w-e,s=null==b?q():b;g.dlShiftTo(p,s);0<=c.compareTo(s)&&(c[c.t++]=1,c.subTo(s,c));l.ONE.dlShiftTo(e,s);for(s.subTo(g,g);g.t<e;)g[g.t++]=0;for(;0<=--p;){var r=c[--w]==d?this.DM:Math.floor(c[w]*m+(c[w-
1]+V)*n);if((c[w]+=g.am(0,r,c,p,0,e))<r)for(g.dlShiftTo(p,s),c.subTo(s,c);c[w]<--r;)c.subTo(s,c)}null!=b&&(c.drShiftTo(e,b),h!=a&&l.ZERO.subTo(b,b));c.t=e;c.clamp();0<k&&c.rShiftTo(k,c);0>h&&l.ZERO.subTo(c,c)}}}};l.prototype.invDigit=function(){if(1>this.t)return 0;var a=this[0];if(0==(a&1))return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return 0<b?this.DV-b:-b};l.prototype.isEven=function(){return 0==(0<this.t?this[0]&1:this.s)};
l.prototype.exp=function(a,b){if(4294967295<a||1>a)return l.ONE;var c=q(),e=q(),d=b.convert(this),g=D(a)-1;for(d.copyTo(c);0<=--g;)if(b.sqrTo(c,e),0<(a&1<<g))b.mulTo(e,d,c);else var h=c,c=e,e=h;return b.revert(c)};l.prototype.toString=function(a){if(0>this.s)return"-"+this.negate().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,e=!1,d="",g=this.t,h=this.DB-g*this.DB%a;if(0<g--)for(h<this.DB&&0<(c=this[g]>>
h)&&(e=!0,d="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));0<=g;)h<a?(c=(this[g]&(1<<h)-1)<<a-h,c|=this[--g]>>(h+=this.DB-a)):(c=this[g]>>(h-=a)&b,0>=h&&(h+=this.DB,--g)),0<c&&(e=!0),e&&(d+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));return e?d:"0"};l.prototype.negate=function(){var a=q();l.ZERO.subTo(this,a);return a};l.prototype.abs=function(){return 0>this.s?this.negate():this};l.prototype.compareTo=function(a){var b=this.s-a.s;if(0!=b)return b;var c=this.t,b=c-a.t;if(0!=b)return 0>this.s?
-b:b;for(;0<=--c;)if(0!=(b=this[c]-a[c]))return b;return 0};l.prototype.bitLength=function(){return 0>=this.t?0:this.DB*(this.t-1)+D(this[this.t-1]^this.s&this.DM)};l.prototype.mod=function(a){var b=q();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(l.ZERO)&&a.subTo(b,b);return b};l.prototype.modPowInt=function(a,b){var c;c=256>a||b.isEven()?new z(b):new x(b);return this.exp(a,c)};l.ZERO=y(0);l.ONE=y(1);B.prototype.convert=P;B.prototype.revert=P;B.prototype.mulTo=function(a,b,c){a.multiplyTo(b,
c)};B.prototype.sqrTo=function(a,b){a.squareTo(b)};A.prototype.convert=function(a){if(0>a.s||a.t>2*this.m.t)return a.mod(this.m);if(0>a.compareTo(this.m))return a;var b=q();a.copyTo(b);this.reduce(b);return b};A.prototype.revert=function(a){return a};A.prototype.reduce=function(a){a.drShiftTo(this.m.t-1,this.r2);a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp());this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);0>a.compareTo(this.r2);)a.dAddOffset(1,
this.m.t+1);for(a.subTo(this.r2,a);0<=a.compareTo(this.m);)a.subTo(this.m,a)};A.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};A.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};var u=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,
409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],W=67108864/u[u.length-1];l.prototype.chunkSize=function(a){return Math.floor(Math.LN2*this.DB/Math.log(a))};l.prototype.toRadix=function(a){null==
a&&(a=10);if(0==this.signum()||2>a||36<a)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=y(b),e=q(),d=q(),g="";for(this.divRemTo(c,e,d);0<e.signum();)g=(b+d.intValue()).toString(a).substr(1)+g,e.divRemTo(c,e,d);return d.intValue().toString(a)+g};l.prototype.fromRadix=function(a,b){this.fromInt(0);null==b&&(b=10);for(var c=this.chunkSize(b),e=Math.pow(b,c),d=!1,g=0,h=0,k=0;k<a.length;++k){var n=M(a,k);0>n?"-"==a.charAt(k)&&0==this.signum()&&(d=!0):(h=b*h+n,++g>=c&&(this.dMultiply(e),this.dAddOffset(h,
0),h=g=0))}0<g&&(this.dMultiply(Math.pow(b,g)),this.dAddOffset(h,0));d&&l.ZERO.subTo(this,this)};l.prototype.fromNumber=function(a,b,c){if("number"==typeof b)if(2>a)this.fromInt(1);else for(this.fromNumber(a,c),this.testBit(a-1)||this.bitwiseTo(l.ONE.shiftLeft(a-1),J,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(l.ONE.shiftLeft(a-1),this);else{c=[];var e=a&7;c.length=(a>>3)+1;b.nextBytes(c);c[0]=0<e?c[0]&(1<<e)-1:0;this.fromString(c,
256)}};l.prototype.bitwiseTo=function(a,b,c){var e,d,g=Math.min(a.t,this.t);for(e=0;e<g;++e)c[e]=b(this[e],a[e]);if(a.t<this.t){d=a.s&this.DM;for(e=g;e<this.t;++e)c[e]=b(this[e],d);c.t=this.t}else{d=this.s&this.DM;for(e=g;e<a.t;++e)c[e]=b(d,a[e]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()};l.prototype.changeBit=function(a,b){var c=l.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c};l.prototype.addTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]+a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<
this.t){for(e+=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e+=a[c],b[c++]=e&this.DM,e>>=this.DB;e+=a.s}b.s=0>e?-1:0;0<e?b[c++]=e:-1>e&&(b[c++]=this.DV+e);b.t=c;b.clamp()};l.prototype.dMultiply=function(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()};l.prototype.dAddOffset=function(a,b){if(0!=a){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}};l.prototype.multiplyLowerTo=
function(a,b,c){var e=Math.min(this.t+a.t,b);c.s=0;for(c.t=e;0<e;)c[--e]=0;var d;for(d=c.t-this.t;e<d;++e)c[e+this.t]=this.am(0,a[e],c,e,0,this.t);for(d=Math.min(a.t,b);e<d;++e)this.am(0,a[e],c,e,0,b-e);c.clamp()};l.prototype.multiplyUpperTo=function(a,b,c){--b;var e=c.t=this.t+a.t-b;for(c.s=0;0<=--e;)c[e]=0;for(e=Math.max(b-this.t,0);e<a.t;++e)c[this.t+e-b]=this.am(b-e,a[e],c,0,0,this.t+e-b);c.clamp();c.drShiftTo(1,c)};l.prototype.modInt=function(a){if(0>=a)return 0;var b=this.DV%a,c=0>this.s?a-
1:0;if(0<this.t)if(0==b)c=this[0]%a;else for(var e=this.t-1;0<=e;--e)c=(b*c+this[e])%a;return c};l.prototype.millerRabin=function(a){var b=this.subtract(l.ONE),c=b.getLowestSetBit();if(0>=c)return!1;var e=b.shiftRight(c);a=a+1>>1;a>u.length&&(a=u.length);for(var d=q(),g=0;g<a;++g){d.fromInt(u[Math.floor(Math.random()*u.length)]);var h=d.modPow(e,this);if(0!=h.compareTo(l.ONE)&&0!=h.compareTo(b)){for(var k=1;k++<c&&0!=h.compareTo(b);)if(h=h.modPowInt(2,this),0==h.compareTo(l.ONE))return!1;if(0!=h.compareTo(b))return!1}}return!0};
l.prototype.clone=function(){var a=q();this.copyTo(a);return a};l.prototype.intValue=function(){if(0>this.s){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]};l.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24};l.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16};l.prototype.signum=function(){return 0>this.s?-1:0>=this.t||1==this.t&&0>=this[0]?
0:1};l.prototype.toByteArray=function(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,e,d=0;if(0<a--)for(c<this.DB&&(e=this[a]>>c)!=(this.s&this.DM)>>c&&(b[d++]=e|this.s<<this.DB-c);0<=a;)if(8>c?(e=(this[a]&(1<<c)-1)<<8-c,e|=this[--a]>>(c+=this.DB-8)):(e=this[a]>>(c-=8)&255,0>=c&&(c+=this.DB,--a)),0!=(e&128)&&(e|=-256),0==d&&(this.s&128)!=(e&128)&&++d,0<d||e!=this.s)b[d++]=e;return b};l.prototype.equals=function(a){return 0==this.compareTo(a)};l.prototype.min=function(a){return 0>this.compareTo(a)?
this:a};l.prototype.max=function(a){return 0<this.compareTo(a)?this:a};l.prototype.and=function(a){var b=q();this.bitwiseTo(a,U,b);return b};l.prototype.or=function(a){var b=q();this.bitwiseTo(a,J,b);return b};l.prototype.xor=function(a){var b=q();this.bitwiseTo(a,N,b);return b};l.prototype.andNot=function(a){var b=q();this.bitwiseTo(a,O,b);return b};l.prototype.not=function(){for(var a=q(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a};l.prototype.shiftLeft=function(a){var b=
q();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b};l.prototype.shiftRight=function(a){var b=q();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b};l.prototype.getLowestSetBit=function(){for(var a=0;a<this.t;++a)if(0!=this[a]){var b=a*this.DB;a=this[a];if(0==a)a=-1;else{var c=0;0==(a&65535)&&(a>>=16,c+=16);0==(a&255)&&(a>>=8,c+=8);0==(a&15)&&(a>>=4,c+=4);0==(a&3)&&(a>>=2,c+=2);0==(a&1)&&++c;a=c}return b+a}return 0>this.s?this.t*this.DB:-1};l.prototype.bitCount=function(){for(var a=0,b=this.s&
this.DM,c=0;c<this.t;++c){for(var e=this[c]^b,d=0;0!=e;)e&=e-1,++d;a+=d}return a};l.prototype.testBit=function(a){var b=Math.floor(a/this.DB);return b>=this.t?0!=this.s:0!=(this[b]&1<<a%this.DB)};l.prototype.setBit=function(a){return this.changeBit(a,J)};l.prototype.clearBit=function(a){return this.changeBit(a,O)};l.prototype.flipBit=function(a){return this.changeBit(a,N)};l.prototype.add=function(a){var b=q();this.addTo(a,b);return b};l.prototype.subtract=function(a){var b=q();this.subTo(a,b);return b};
l.prototype.multiply=function(a){var b=q();this.multiplyTo(a,b);return b};l.prototype.divide=function(a){var b=q();this.divRemTo(a,b,null);return b};l.prototype.remainder=function(a){var b=q();this.divRemTo(a,null,b);return b};l.prototype.divideAndRemainder=function(a){var b=q(),c=q();this.divRemTo(a,b,c);return[b,c]};l.prototype.modPow=function(a,b){var c=a.bitLength(),e,d=y(1),g;if(0>=c)return d;e=18>c?1:48>c?3:144>c?4:768>c?5:6;g=8>c?new z(b):b.isEven()?new A(b):new x(b);var h=[],k=3,n=e-1,m=(1<<
e)-1;h[1]=g.convert(this);if(1<e)for(c=q(),g.sqrTo(h[1],c);k<=m;)h[k]=q(),g.mulTo(c,h[k-2],h[k]),k+=2;for(var l=a.t-1,w,p=!0,s=q(),c=D(a[l])-1;0<=l;){c>=n?w=a[l]>>c-n&m:(w=(a[l]&(1<<c+1)-1)<<n-c,0<l&&(w|=a[l-1]>>this.DB+c-n));for(k=e;0==(w&1);)w>>=1,--k;0>(c-=k)&&(c+=this.DB,--l);if(p)h[w].copyTo(d),p=!1;else{for(;1<k;)g.sqrTo(d,s),g.sqrTo(s,d),k-=2;0<k?g.sqrTo(d,s):(k=d,d=s,s=k);g.mulTo(s,h[w],d)}for(;0<=l&&0==(a[l]&1<<c);)g.sqrTo(d,s),k=d,d=s,s=k,0>--c&&(c=this.DB-1,--l)}return g.revert(d)};l.prototype.modInverse=
function(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum())return l.ZERO;for(var c=a.clone(),e=this.clone(),d=y(1),g=y(0),h=y(0),k=y(1);0!=c.signum();){for(;c.isEven();)c.rShiftTo(1,c),b?(d.isEven()&&g.isEven()||(d.addTo(this,d),g.subTo(a,g)),d.rShiftTo(1,d)):g.isEven()||g.subTo(a,g),g.rShiftTo(1,g);for(;e.isEven();)e.rShiftTo(1,e),b?(h.isEven()&&k.isEven()||(h.addTo(this,h),k.subTo(a,k)),h.rShiftTo(1,h)):k.isEven()||k.subTo(a,k),k.rShiftTo(1,k);0<=c.compareTo(e)?(c.subTo(e,c),b&&d.subTo(h,d),
g.subTo(k,g)):(e.subTo(c,e),b&&h.subTo(d,h),k.subTo(g,k))}if(0!=e.compareTo(l.ONE))return l.ZERO;if(0<=k.compareTo(a))return k.subtract(a);if(0>k.signum())k.addTo(a,k);else return k;return 0>k.signum()?k.add(a):k};l.prototype.pow=function(a){return this.exp(a,new B)};l.prototype.gcd=function(a){var b=0>this.s?this.negate():this.clone();a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)){var c=b,b=a;a=c}var c=b.getLowestSetBit(),e=a.getLowestSetBit();if(0>e)return b;c<e&&(e=c);0<e&&(b.rShiftTo(e,b),
a.rShiftTo(e,a));for(;0<b.signum();)0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));0<e&&a.lShiftTo(e,a);return a};l.prototype.isProbablePrime=function(a){var b,c=this.abs();if(1==c.t&&c[0]<=u[u.length-1]){for(b=0;b<u.length;++b)if(c[0]==u[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<u.length;){for(var e=u[b],d=b+1;d<u.length&&e<W;)e*=u[d++];for(e=c.modInt(e);b<d;)if(0==e%
u[b++])return!1}return c.millerRabin(a)};l.prototype.square=function(){var a=q();this.squareTo(a);return a};var p=l;p.prototype.IsNegative=function(){return-1==this.compareTo(p.ZERO)?!0:!1};p.op_Equality=function(a,b){return 0==a.compareTo(b)?!0:!1};p.op_Inequality=function(a,b){return 0!=a.compareTo(b)?!0:!1};p.op_GreaterThan=function(a,b){return 0<a.compareTo(b)?!0:!1};p.op_LessThan=function(a,b){return 0>a.compareTo(b)?!0:!1};p.op_Addition=function(a,b){return(new p(a)).add(new p(b))};p.op_Subtraction=
function(a,b){return(new p(a)).subtract(new p(b))};p.Int128Mul=function(a,b){return(new p(a)).multiply(new p(b))};p.op_Division=function(a,b){return a.divide(b)};p.prototype.ToDouble=function(){return parseFloat(this.toString())};if("undefined"==typeof L)var L=function(a,b){var c;if("undefined"==typeof Object.getOwnPropertyNames)for(c in b.prototype){if("undefined"==typeof a.prototype[c]||a.prototype[c]==Object.prototype[c])a.prototype[c]=b.prototype[c]}else for(var e=Object.getOwnPropertyNames(b.prototype),
d=0;d<e.length;d++)"undefined"==typeof Object.getOwnPropertyDescriptor(a.prototype,e[d])&&Object.defineProperty(a.prototype,e[d],Object.getOwnPropertyDescriptor(b.prototype,e[d]));for(c in b)"undefined"==typeof a[c]&&(a[c]=b[c]);a.$baseCtor=b};d.Path=function(){return[]};d.Paths=function(){return[]};d.DoublePoint=function(){var a=arguments;this.Y=this.X=0;1==a.length?(this.X=a[0].X,this.Y=a[0].Y):2==a.length&&(this.X=a[0],this.Y=a[1])};d.DoublePoint0=function(){this.Y=this.X=0};d.DoublePoint1=function(a){this.X=
a.X;this.Y=a.Y};d.DoublePoint2=function(a,b){this.X=a;this.Y=b};d.PolyNode=function(){this.m_Parent=null;this.m_polygon=new d.Path;this.m_endtype=this.m_jointype=this.m_Index=0;this.m_Childs=[];this.IsOpen=!1};d.PolyNode.prototype.IsHoleNode=function(){for(var a=!0,b=this.m_Parent;null!==b;)a=!a,b=b.m_Parent;return a};d.PolyNode.prototype.ChildCount=function(){return this.m_Childs.length};d.PolyNode.prototype.Contour=function(){return this.m_polygon};d.PolyNode.prototype.AddChild=function(a){var b=
this.m_Childs.length;this.m_Childs.push(a);a.m_Parent=this;a.m_Index=b};d.PolyNode.prototype.GetNext=function(){return 0<this.m_Childs.length?this.m_Childs[0]:this.GetNextSiblingUp()};d.PolyNode.prototype.GetNextSiblingUp=function(){return null===this.m_Parent?null:this.m_Index==this.m_Parent.m_Childs.length-1?this.m_Parent.GetNextSiblingUp():this.m_Parent.m_Childs[this.m_Index+1]};d.PolyNode.prototype.Childs=function(){return this.m_Childs};d.PolyNode.prototype.Parent=function(){return this.m_Parent};
d.PolyNode.prototype.IsHole=function(){return this.IsHoleNode()};d.PolyTree=function(){this.m_AllPolys=[];d.PolyNode.call(this)};d.PolyTree.prototype.Clear=function(){for(var a=0,b=this.m_AllPolys.length;a<b;a++)this.m_AllPolys[a]=null;this.m_AllPolys.length=0;this.m_Childs.length=0};d.PolyTree.prototype.GetFirst=function(){return 0<this.m_Childs.length?this.m_Childs[0]:null};d.PolyTree.prototype.Total=function(){return this.m_AllPolys.length};L(d.PolyTree,d.PolyNode);d.Math_Abs_Int64=d.Math_Abs_Int32=
d.Math_Abs_Double=function(a){return Math.abs(a)};d.Math_Max_Int32_Int32=function(a,b){return Math.max(a,b)};d.Cast_Int32=r||H||K?function(a){return a|0}:function(a){return~~a};d.Cast_Int64=F?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):~~a}:G&&"function"==typeof Number.toInteger?function(a){return Number.toInteger(a)}:Q||I?function(a){return parseInt(a,10)}:r?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):a|0}:function(a){return 0>a?Math.ceil(a):
Math.floor(a)};d.Clear=function(a){a.length=0};d.PI=3.141592653589793;d.PI2=6.283185307179586;d.IntPoint=function(){var a;a=arguments;var b=a.length;this.Y=this.X=0;2==b?(this.X=a[0],this.Y=a[1]):1==b?a[0]instanceof d.DoublePoint?(a=a[0],this.X=d.Clipper.Round(a.X),this.Y=d.Clipper.Round(a.Y)):(a=a[0],this.X=a.X,this.Y=a.Y):this.Y=this.X=0};d.IntPoint.op_Equality=function(a,b){return a.X==b.X&&a.Y==b.Y};d.IntPoint.op_Inequality=function(a,b){return a.X!=b.X||a.Y!=b.Y};d.IntPoint0=function(){this.Y=
this.X=0};d.IntPoint1=function(a){this.X=a.X;this.Y=a.Y};d.IntPoint1dp=function(a){this.X=d.Clipper.Round(a.X);this.Y=d.Clipper.Round(a.Y)};d.IntPoint2=function(a,b){this.X=a;this.Y=b};d.IntRect=function(){var a=arguments,b=a.length;4==b?(this.left=a[0],this.top=a[1],this.right=a[2],this.bottom=a[3]):1==b?(this.left=a[0].left,this.top=a[0].top,this.right=a[0].right,this.bottom=a[0].bottom):this.bottom=this.right=this.top=this.left=0};d.IntRect0=function(){this.bottom=this.right=this.top=this.left=0};d.IntRect1=
function(a){this.left=a.left;this.top=a.top;this.right=a.right;this.bottom=a.bottom};d.IntRect4=function(a,b,c,e){this.left=a;this.top=b;this.right=c;this.bottom=e};d.ClipType={ctIntersection:0,ctUnion:1,ctDifference:2,ctXor:3};d.PolyType={ptSubject:0,ptClip:1};d.PolyFillType={pftEvenOdd:0,pftNonZero:1,pftPositive:2,pftNegative:3};d.JoinType={jtSquare:0,jtRound:1,jtMiter:2};d.EndType={etOpenSquare:0,etOpenRound:1,etOpenButt:2,etClosedLine:3,etClosedPolygon:4};d.EdgeSide={esLeft:0,esRight:1};d.Direction=
{dRightToLeft:0,dLeftToRight:1};d.TEdge=function(){this.Bot=new d.IntPoint;this.Curr=new d.IntPoint;this.Top=new d.IntPoint;this.Delta=new d.IntPoint;this.Dx=0;this.PolyTyp=d.PolyType.ptSubject;this.Side=d.EdgeSide.esLeft;this.OutIdx=this.WindCnt2=this.WindCnt=this.WindDelta=0;this.PrevInSEL=this.NextInSEL=this.PrevInAEL=this.NextInAEL=this.NextInLML=this.Prev=this.Next=null};d.IntersectNode=function(){this.Edge2=this.Edge1=null;this.Pt=new d.IntPoint};d.MyIntersectNodeSort=function(){};d.MyIntersectNodeSort.Compare=
function(a,b){return b.Pt.Y-a.Pt.Y};d.LocalMinima=function(){this.Y=0;this.Next=this.RightBound=this.LeftBound=null};d.Scanbeam=function(){this.Y=0;this.Next=null};d.OutRec=function(){this.Idx=0;this.IsOpen=this.IsHole=!1;this.PolyNode=this.BottomPt=this.Pts=this.FirstLeft=null};d.OutPt=function(){this.Idx=0;this.Pt=new d.IntPoint;this.Prev=this.Next=null};d.Join=function(){this.OutPt2=this.OutPt1=null;this.OffPt=new d.IntPoint};d.ClipperBase=function(){this.m_CurrentLM=this.m_MinimaList=null;this.m_edges=
[];this.PreserveCollinear=this.m_HasOpenPaths=this.m_UseFullRange=!1;this.m_CurrentLM=this.m_MinimaList=null;this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.horizontal=-9007199254740992;d.ClipperBase.Skip=-2;d.ClipperBase.Unassigned=-1;d.ClipperBase.tolerance=1E-20;d.ClipperBase.loRange=47453132;d.ClipperBase.hiRange=0xfffffffffffff;d.ClipperBase.near_zero=function(a){return a>-d.ClipperBase.tolerance&&a<d.ClipperBase.tolerance};d.ClipperBase.IsHorizontal=function(a){return 0===a.Delta.Y};
d.ClipperBase.prototype.PointIsVertex=function(a,b){var c=b;do{if(d.IntPoint.op_Equality(c.Pt,a))return!0;c=c.Next}while(c!=b);return!1};d.ClipperBase.prototype.PointOnLineSegment=function(a,b,c,e){return e?a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&p.op_Equality(p.Int128Mul(a.X-b.X,c.Y-b.Y),p.Int128Mul(c.X-b.X,a.Y-b.Y)):a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&(a.X-b.X)*(c.Y-b.Y)==(c.X-b.X)*(a.Y-b.Y)};d.ClipperBase.prototype.PointOnPolygon=
function(a,b,c){for(var e=b;;){if(this.PointOnLineSegment(a,e.Pt,e.Next.Pt,c))return!0;e=e.Next;if(e==b)break}return!1};d.ClipperBase.prototype.SlopesEqual=d.ClipperBase.SlopesEqual=function(){var a=arguments,b=a.length,c,e,f;if(3==b)return b=a[0],c=a[1],(a=a[2])?p.op_Equality(p.Int128Mul(b.Delta.Y,c.Delta.X),p.Int128Mul(b.Delta.X,c.Delta.Y)):d.Cast_Int64(b.Delta.Y*c.Delta.X)==d.Cast_Int64(b.Delta.X*c.Delta.Y);if(4==b)return b=a[0],c=a[1],e=a[2],(a=a[3])?p.op_Equality(p.Int128Mul(b.Y-c.Y,c.X-e.X),
p.Int128Mul(b.X-c.X,c.Y-e.Y)):0===d.Cast_Int64((b.Y-c.Y)*(c.X-e.X))-d.Cast_Int64((b.X-c.X)*(c.Y-e.Y));b=a[0];c=a[1];e=a[2];f=a[3];return(a=a[4])?p.op_Equality(p.Int128Mul(b.Y-c.Y,e.X-f.X),p.Int128Mul(b.X-c.X,e.Y-f.Y)):0===d.Cast_Int64((b.Y-c.Y)*(e.X-f.X))-d.Cast_Int64((b.X-c.X)*(e.Y-f.Y))};d.ClipperBase.SlopesEqual3=function(a,b,c){return c?p.op_Equality(p.Int128Mul(a.Delta.Y,b.Delta.X),p.Int128Mul(a.Delta.X,b.Delta.Y)):d.Cast_Int64(a.Delta.Y*b.Delta.X)==d.Cast_Int64(a.Delta.X*b.Delta.Y)};d.ClipperBase.SlopesEqual4=
function(a,b,c,e){return e?p.op_Equality(p.Int128Mul(a.Y-b.Y,b.X-c.X),p.Int128Mul(a.X-b.X,b.Y-c.Y)):0===d.Cast_Int64((a.Y-b.Y)*(b.X-c.X))-d.Cast_Int64((a.X-b.X)*(b.Y-c.Y))};d.ClipperBase.SlopesEqual5=function(a,b,c,e,f){return f?p.op_Equality(p.Int128Mul(a.Y-b.Y,c.X-e.X),p.Int128Mul(a.X-b.X,c.Y-e.Y)):0===d.Cast_Int64((a.Y-b.Y)*(c.X-e.X))-d.Cast_Int64((a.X-b.X)*(c.Y-e.Y))};d.ClipperBase.prototype.Clear=function(){this.DisposeLocalMinimaList();for(var a=0,b=this.m_edges.length;a<b;++a){for(var c=0,
e=this.m_edges[a].length;c<e;++c)this.m_edges[a][c]=null;d.Clear(this.m_edges[a])}d.Clear(this.m_edges);this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.prototype.DisposeLocalMinimaList=function(){for(;null!==this.m_MinimaList;){var a=this.m_MinimaList.Next;this.m_MinimaList=null;this.m_MinimaList=a}this.m_CurrentLM=null};d.ClipperBase.prototype.RangeTest=function(a,b){if(b.Value)(a.X>d.ClipperBase.hiRange||a.Y>d.ClipperBase.hiRange||-a.X>d.ClipperBase.hiRange||-a.Y>d.ClipperBase.hiRange)&&
d.Error("Coordinate outside allowed range in RangeTest().");else if(a.X>d.ClipperBase.loRange||a.Y>d.ClipperBase.loRange||-a.X>d.ClipperBase.loRange||-a.Y>d.ClipperBase.loRange)b.Value=!0,this.RangeTest(a,b)};d.ClipperBase.prototype.InitEdge=function(a,b,c,e){a.Next=b;a.Prev=c;a.Curr.X=e.X;a.Curr.Y=e.Y;a.OutIdx=-1};d.ClipperBase.prototype.InitEdge2=function(a,b){a.Curr.Y>=a.Next.Curr.Y?(a.Bot.X=a.Curr.X,a.Bot.Y=a.Curr.Y,a.Top.X=a.Next.Curr.X,a.Top.Y=a.Next.Curr.Y):(a.Top.X=a.Curr.X,a.Top.Y=a.Curr.Y,
a.Bot.X=a.Next.Curr.X,a.Bot.Y=a.Next.Curr.Y);this.SetDx(a);a.PolyTyp=b};d.ClipperBase.prototype.FindNextLocMin=function(a){for(var b;;){for(;d.IntPoint.op_Inequality(a.Bot,a.Prev.Bot)||d.IntPoint.op_Equality(a.Curr,a.Top);)a=a.Next;if(a.Dx!=d.ClipperBase.horizontal&&a.Prev.Dx!=d.ClipperBase.horizontal)break;for(;a.Prev.Dx==d.ClipperBase.horizontal;)a=a.Prev;for(b=a;a.Dx==d.ClipperBase.horizontal;)a=a.Next;if(a.Top.Y!=a.Prev.Bot.Y){b.Prev.Bot.X<a.Bot.X&&(a=b);break}}return a};d.ClipperBase.prototype.ProcessBound=
function(a,b){var c=a,e=a,f;a.Dx==d.ClipperBase.horizontal&&(f=b?a.Prev.Bot.X:a.Next.Bot.X,a.Bot.X!=f&&this.ReverseHorizontal(a));if(e.OutIdx!=d.ClipperBase.Skip)if(b){for(;e.Top.Y==e.Next.Bot.Y&&e.Next.OutIdx!=d.ClipperBase.Skip;)e=e.Next;if(e.Dx==d.ClipperBase.horizontal&&e.Next.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Prev.Dx==d.ClipperBase.horizontal;)f=f.Prev;f.Prev.Top.X==e.Next.Top.X?b||(e=f.Prev):f.Prev.Top.X>e.Next.Top.X&&(e=f.Prev)}for(;a!=e;)a.NextInLML=a.Next,a.Dx==d.ClipperBase.horizontal&&
a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a);e=e.Next}else{for(;e.Top.Y==e.Prev.Bot.Y&&e.Prev.OutIdx!=d.ClipperBase.Skip;)e=e.Prev;if(e.Dx==d.ClipperBase.horizontal&&e.Prev.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Next.Dx==d.ClipperBase.horizontal;)f=f.Next;f.Next.Top.X==e.Prev.Top.X?b||(e=f.Next):f.Next.Top.X>e.Prev.Top.X&&(e=f.Next)}for(;a!=e;)a.NextInLML=a.Prev,a.Dx==d.ClipperBase.horizontal&&
a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a),a=a.Prev;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a);e=e.Prev}if(e.OutIdx==d.ClipperBase.Skip){a=e;if(b){for(;a.Top.Y==a.Next.Bot.Y;)a=a.Next;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Prev}else{for(;a.Top.Y==a.Prev.Bot.Y;)a=a.Prev;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Next}a==e?e=b?a.Next:a.Prev:(a=b?e.Next:e.Prev,c=new d.LocalMinima,c.Next=null,c.Y=a.Bot.Y,c.LeftBound=null,c.RightBound=
a,c.RightBound.WindDelta=0,e=this.ProcessBound(c.RightBound,b),this.InsertLocalMinima(c))}return e};d.ClipperBase.prototype.AddPath=function(a,b,c){c||b!=d.PolyType.ptClip||d.Error("AddPath: Open paths must be subject.");var e=a.length-1;if(c)for(;0<e&&d.IntPoint.op_Equality(a[e],a[0]);)--e;for(;0<e&&d.IntPoint.op_Equality(a[e],a[e-1]);)--e;if(c&&2>e||!c&&1>e)return!1;for(var f=[],g=0;g<=e;g++)f.push(new d.TEdge);var h=!0;try{for(f[1].Curr.X=a[1].X,f[1].Curr.Y=a[1].Y,function(){var b={Value:this.m_UseFullRange},
c=this.RangeTest(a[0],b);this.m_UseFullRange=b.Value;return c}.call(this),function(){var b={Value:this.m_UseFullRange},c=this.RangeTest(a[e],b);this.m_UseFullRange=b.Value;return c}.call(this),this.InitEdge(f[0],f[1],f[e],a[0]),this.InitEdge(f[e],f[0],f[e-1],a[e]),g=e-1;1<=g;--g)(function(){var b={Value:this.m_UseFullRange},c=this.RangeTest(a[g],b);this.m_UseFullRange=b.Value;return c}).call(this),this.InitEdge(f[g],f[g+1],f[g-1],a[g])}catch(k){return!1}var n=f[0];c||(n.Prev.OutIdx=d.ClipperBase.Skip);
for(var m=n,l=n;;)if(d.IntPoint.op_Equality(m.Curr,m.Next.Curr)){if(m==m.Next)break;m==n&&(n=m.Next);l=m=this.RemoveEdge(m)}else{if(m.Prev==m.Next)break;else if(c&&d.ClipperBase.SlopesEqual(m.Prev.Curr,m.Curr,m.Next.Curr,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(m.Prev.Curr,m.Curr,m.Next.Curr))){m==n&&(n=m.Next);m=this.RemoveEdge(m);l=m=m.Prev;continue}m=m.Next;if(m==l)break}if(!c&&m==m.Next||c&&m.Prev==m.Next)return!1;c||(this.m_HasOpenPaths=!0);m=n;do this.InitEdge2(m,
b),m=m.Next,h&&m.Curr.Y!=n.Curr.Y&&(h=!1);while(m!=n);if(h){if(c)return!1;m.Prev.OutIdx=d.ClipperBase.Skip;m.Prev.Bot.X<m.Prev.Top.X&&this.ReverseHorizontal(m.Prev);b=new d.LocalMinima;b.Next=null;b.Y=m.Bot.Y;b.LeftBound=null;b.RightBound=m;b.RightBound.Side=d.EdgeSide.esRight;for(b.RightBound.WindDelta=0;m.Next.OutIdx!=d.ClipperBase.Skip;)m.NextInLML=m.Next,m.Bot.X!=m.Prev.Top.X&&this.ReverseHorizontal(m),m=m.Next;this.InsertLocalMinima(b);this.m_edges.push(f);return!0}this.m_edges.push(f);for(h=
null;;){m=this.FindNextLocMin(m);if(m==h)break;else null==h&&(h=m);b=new d.LocalMinima;b.Next=null;b.Y=m.Bot.Y;m.Dx<m.Prev.Dx?(b.LeftBound=m.Prev,b.RightBound=m,f=!1):(b.LeftBound=m,b.RightBound=m.Prev,f=!0);b.LeftBound.Side=d.EdgeSide.esLeft;b.RightBound.Side=d.EdgeSide.esRight;b.LeftBound.WindDelta=c?b.LeftBound.Next==b.RightBound?-1:1:0;b.RightBound.WindDelta=-b.LeftBound.WindDelta;m=this.ProcessBound(b.LeftBound,f);n=this.ProcessBound(b.RightBound,!f);b.LeftBound.OutIdx==d.ClipperBase.Skip?b.LeftBound=
null:b.RightBound.OutIdx==d.ClipperBase.Skip&&(b.RightBound=null);this.InsertLocalMinima(b);f||(m=n)}return!0};d.ClipperBase.prototype.AddPaths=function(a,b,c){for(var e=!1,d=0,g=a.length;d<g;++d)this.AddPath(a[d],b,c)&&(e=!0);return e};d.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3=function(a,b,c){return d.IntPoint.op_Equality(a,c)||d.IntPoint.op_Equality(a,b)||d.IntPoint.op_Equality(c,b)?!1:a.X!=c.X?b.X>a.X==b.X<c.X:b.Y>a.Y==b.Y<c.Y};d.ClipperBase.prototype.RemoveEdge=function(a){a.Prev.Next=a.Next;
a.Next.Prev=a.Prev;var b=a.Next;a.Prev=null;return b};d.ClipperBase.prototype.SetDx=function(a){a.Delta.X=a.Top.X-a.Bot.X;a.Delta.Y=a.Top.Y-a.Bot.Y;a.Dx=0===a.Delta.Y?d.ClipperBase.horizontal:a.Delta.X/a.Delta.Y};d.ClipperBase.prototype.InsertLocalMinima=function(a){if(null===this.m_MinimaList)this.m_MinimaList=a;else if(a.Y>=this.m_MinimaList.Y)a.Next=this.m_MinimaList,this.m_MinimaList=a;else{for(var b=this.m_MinimaList;null!==b.Next&&a.Y<b.Next.Y;)b=b.Next;a.Next=b.Next;b.Next=a}};d.ClipperBase.prototype.PopLocalMinima=
function(){null!==this.m_CurrentLM&&(this.m_CurrentLM=this.m_CurrentLM.Next)};d.ClipperBase.prototype.ReverseHorizontal=function(a){var b=a.Top.X;a.Top.X=a.Bot.X;a.Bot.X=b};d.ClipperBase.prototype.Reset=function(){this.m_CurrentLM=this.m_MinimaList;if(null!=this.m_CurrentLM)for(var a=this.m_MinimaList;null!=a;){var b=a.LeftBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,b.Side=d.EdgeSide.esLeft,b.OutIdx=d.ClipperBase.Unassigned);b=a.RightBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,b.Side=
d.EdgeSide.esRight,b.OutIdx=d.ClipperBase.Unassigned);a=a.Next}};d.Clipper=function(a){"undefined"==typeof a&&(a=0);this.m_PolyOuts=null;this.m_ClipType=d.ClipType.ctIntersection;this.m_IntersectNodeComparer=this.m_IntersectList=this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_ExecuteLocked=!1;this.m_SubjFillType=this.m_ClipFillType=d.PolyFillType.pftEvenOdd;this.m_GhostJoins=this.m_Joins=null;this.StrictlySimple=this.ReverseSolution=this.m_UsingPolyTree=!1;d.ClipperBase.call(this);
this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_IntersectList=[];this.m_IntersectNodeComparer=d.MyIntersectNodeSort.Compare;this.m_UsingPolyTree=this.m_ExecuteLocked=!1;this.m_PolyOuts=[];this.m_Joins=[];this.m_GhostJoins=[];this.ReverseSolution=0!==(1&a);this.StrictlySimple=0!==(2&a);this.PreserveCollinear=0!==(4&a)};d.Clipper.ioReverseSolution=1;d.Clipper.ioStrictlySimple=2;d.Clipper.ioPreserveCollinear=4;d.Clipper.prototype.Clear=function(){0!==this.m_edges.length&&(this.DisposeAllPolyPts(),
d.ClipperBase.prototype.Clear.call(this))};d.Clipper.prototype.DisposeScanbeamList=function(){for(;null!==this.m_Scanbeam;){var a=this.m_Scanbeam.Next;this.m_Scanbeam=null;this.m_Scanbeam=a}};d.Clipper.prototype.Reset=function(){d.ClipperBase.prototype.Reset.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.DisposeAllPolyPts();for(var a=this.m_MinimaList;null!==a;)this.InsertScanbeam(a.Y),a=a.Next};d.Clipper.prototype.InsertScanbeam=function(a){if(null===this.m_Scanbeam)this.m_Scanbeam=
new d.Scanbeam,this.m_Scanbeam.Next=null,this.m_Scanbeam.Y=a;else if(a>this.m_Scanbeam.Y){var b=new d.Scanbeam;b.Y=a;b.Next=this.m_Scanbeam;this.m_Scanbeam=b}else{for(var c=this.m_Scanbeam;null!==c.Next&&a<=c.Next.Y;)c=c.Next;a!=c.Y&&(b=new d.Scanbeam,b.Y=a,b.Next=c.Next,c.Next=b)}};d.Clipper.prototype.Execute=function(){var a=arguments,b=a.length,c=a[1]instanceof d.PolyTree;if(4!=b||c){if(4==b&&c){c=a[0];b=a[1];e=a[2];a=a[3];if(this.m_ExecuteLocked)return!1;this.m_ExecuteLocked=!0;this.m_SubjFillType=
e;this.m_ClipFillType=a;this.m_ClipType=c;this.m_UsingPolyTree=!0;(a=this.ExecuteInternal())&&this.BuildResult2(b);this.m_ExecuteLocked=!1;return a}if(2==b&&!c||2==b&&c)return c=a[0],b=a[1],this.Execute(c,b,d.PolyFillType.pftEvenOdd,d.PolyFillType.pftEvenOdd)}else{var c=a[0],b=a[1],e=a[2],a=a[3];if(this.m_ExecuteLocked)return!1;this.m_HasOpenPaths&&d.Error("Error: PolyTree struct is need for open path clipping.");this.m_ExecuteLocked=!0;d.Clear(b);this.m_SubjFillType=e;this.m_ClipFillType=a;this.m_ClipType=
c;this.m_UsingPolyTree=!1;(a=this.ExecuteInternal())&&this.BuildResult(b);this.m_ExecuteLocked=!1;return a}};d.Clipper.prototype.FixHoleLinkage=function(a){if(null!==a.FirstLeft&&(a.IsHole==a.FirstLeft.IsHole||null===a.FirstLeft.Pts)){for(var b=a.FirstLeft;null!==b&&(b.IsHole==a.IsHole||null===b.Pts);)b=b.FirstLeft;a.FirstLeft=b}};d.Clipper.prototype.ExecuteInternal=function(){try{this.Reset();if(null===this.m_CurrentLM)return!1;var a=this.PopScanbeam();do{this.InsertLocalMinimaIntoAEL(a);d.Clear(this.m_GhostJoins);
this.ProcessHorizontals(!1);if(null===this.m_Scanbeam)break;var b=this.PopScanbeam();if(!this.ProcessIntersections(a,b))return!1;this.ProcessEdgesAtTopOfScanbeam(b);a=b}while(null!==this.m_Scanbeam||null!==this.m_CurrentLM);for(var a=0,c=this.m_PolyOuts.length;a<c;a++){var e=this.m_PolyOuts[a];null===e.Pts||e.IsOpen||(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)}this.JoinCommonEdges();a=0;for(c=this.m_PolyOuts.length;a<c;a++)e=this.m_PolyOuts[a],null===e.Pts||e.IsOpen||
this.FixupOutPolygon(e);this.StrictlySimple&&this.DoSimplePolygons();return!0}finally{d.Clear(this.m_Joins),d.Clear(this.m_GhostJoins)}};d.Clipper.prototype.PopScanbeam=function(){var a=this.m_Scanbeam.Y;this.m_Scanbeam=this.m_Scanbeam.Next;return a};d.Clipper.prototype.DisposeAllPolyPts=function(){for(var a=0,b=this.m_PolyOuts.length;a<b;++a)this.DisposeOutRec(a);d.Clear(this.m_PolyOuts)};d.Clipper.prototype.DisposeOutRec=function(a){var b=this.m_PolyOuts[a];null!==b.Pts&&this.DisposeOutPts(b.Pts);
this.m_PolyOuts[a]=null};d.Clipper.prototype.DisposeOutPts=function(a){if(null!==a)for(a.Prev.Next=null;null!==a;)a=a.Next};d.Clipper.prototype.AddJoin=function(a,b,c){var e=new d.Join;e.OutPt1=a;e.OutPt2=b;e.OffPt.X=c.X;e.OffPt.Y=c.Y;this.m_Joins.push(e)};d.Clipper.prototype.AddGhostJoin=function(a,b){var c=new d.Join;c.OutPt1=a;c.OffPt.X=b.X;c.OffPt.Y=b.Y;this.m_GhostJoins.push(c)};d.Clipper.prototype.InsertLocalMinimaIntoAEL=function(a){for(;null!==this.m_CurrentLM&&this.m_CurrentLM.Y==a;){var b=
this.m_CurrentLM.LeftBound,c=this.m_CurrentLM.RightBound;this.PopLocalMinima();var e=null;null===b?(this.InsertEdgeIntoAEL(c,null),this.SetWindingCount(c),this.IsContributing(c)&&(e=this.AddOutPt(c,c.Bot))):(null==c?(this.InsertEdgeIntoAEL(b,null),this.SetWindingCount(b),this.IsContributing(b)&&(e=this.AddOutPt(b,b.Bot))):(this.InsertEdgeIntoAEL(b,null),this.InsertEdgeIntoAEL(c,b),this.SetWindingCount(b),c.WindCnt=b.WindCnt,c.WindCnt2=b.WindCnt2,this.IsContributing(b)&&(e=this.AddLocalMinPoly(b,c,
b.Bot))),this.InsertScanbeam(b.Top.Y));null!=c&&(d.ClipperBase.IsHorizontal(c)?this.AddEdgeToSEL(c):this.InsertScanbeam(c.Top.Y));if(null!=b&&null!=c){if(null!==e&&d.ClipperBase.IsHorizontal(c)&&0<this.m_GhostJoins.length&&0!==c.WindDelta)for(var f=0,g=this.m_GhostJoins.length;f<g;f++){var h=this.m_GhostJoins[f];this.HorzSegmentsOverlap(h.OutPt1.Pt,h.OffPt,c.Bot,c.Top)&&this.AddJoin(h.OutPt1,e,h.OffPt)}0<=b.OutIdx&&null!==b.PrevInAEL&&b.PrevInAEL.Curr.X==b.Bot.X&&0<=b.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(b.PrevInAEL,
b,this.m_UseFullRange)&&0!==b.WindDelta&&0!==b.PrevInAEL.WindDelta&&(f=this.AddOutPt(b.PrevInAEL,b.Bot),this.AddJoin(e,f,b.Top));if(b.NextInAEL!=c&&(0<=c.OutIdx&&0<=c.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(c.PrevInAEL,c,this.m_UseFullRange)&&0!==c.WindDelta&&0!==c.PrevInAEL.WindDelta&&(f=this.AddOutPt(c.PrevInAEL,c.Bot),this.AddJoin(e,f,c.Top)),e=b.NextInAEL,null!==e))for(;e!=c;)this.IntersectEdges(c,e,b.Curr,!1),e=e.NextInAEL}}};d.Clipper.prototype.InsertEdgeIntoAEL=function(a,b){if(null===
this.m_ActiveEdges)a.PrevInAEL=null,a.NextInAEL=null,this.m_ActiveEdges=a;else if(null===b&&this.E2InsertsBeforeE1(this.m_ActiveEdges,a))a.PrevInAEL=null,a.NextInAEL=this.m_ActiveEdges,this.m_ActiveEdges=this.m_ActiveEdges.PrevInAEL=a;else{null===b&&(b=this.m_ActiveEdges);for(;null!==b.NextInAEL&&!this.E2InsertsBeforeE1(b.NextInAEL,a);)b=b.NextInAEL;a.NextInAEL=b.NextInAEL;null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=a);a.PrevInAEL=b;b.NextInAEL=a}};d.Clipper.prototype.E2InsertsBeforeE1=function(a,
b){return b.Curr.X==a.Curr.X?b.Top.Y>a.Top.Y?b.Top.X<d.Clipper.TopX(a,b.Top.Y):a.Top.X>d.Clipper.TopX(b,a.Top.Y):b.Curr.X<a.Curr.X};d.Clipper.prototype.IsEvenOddFillType=function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_SubjFillType==d.PolyFillType.pftEvenOdd:this.m_ClipFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsEvenOddAltFillType=function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_ClipFillType==d.PolyFillType.pftEvenOdd:this.m_SubjFillType==d.PolyFillType.pftEvenOdd};
d.Clipper.prototype.IsContributing=function(a){var b,c;a.PolyTyp==d.PolyType.ptSubject?(b=this.m_SubjFillType,c=this.m_ClipFillType):(b=this.m_ClipFillType,c=this.m_SubjFillType);switch(b){case d.PolyFillType.pftEvenOdd:if(0===a.WindDelta&&1!=a.WindCnt)return!1;break;case d.PolyFillType.pftNonZero:if(1!=Math.abs(a.WindCnt))return!1;break;case d.PolyFillType.pftPositive:if(1!=a.WindCnt)return!1;break;default:if(-1!=a.WindCnt)return!1}switch(this.m_ClipType){case d.ClipType.ctIntersection:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==
a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>a.WindCnt2}case d.ClipType.ctUnion:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}case d.ClipType.ctDifference:if(a.PolyTyp==d.PolyType.ptSubject)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;
default:return 0<=a.WindCnt2}else switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>a.WindCnt2}case d.ClipType.ctXor:if(0===a.WindDelta)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}}return!0};d.Clipper.prototype.SetWindingCount=function(a){for(var b=a.PrevInAEL;null!==
b&&(b.PolyTyp!=a.PolyTyp||0===b.WindDelta);)b=b.PrevInAEL;if(null===b)a.WindCnt=0===a.WindDelta?1:a.WindDelta,a.WindCnt2=0,b=this.m_ActiveEdges;else{if(0===a.WindDelta&&this.m_ClipType!=d.ClipType.ctUnion)a.WindCnt=1;else if(this.IsEvenOddFillType(a))if(0===a.WindDelta){for(var c=!0,e=b.PrevInAEL;null!==e;)e.PolyTyp==b.PolyTyp&&0!==e.WindDelta&&(c=!c),e=e.PrevInAEL;a.WindCnt=c?0:1}else a.WindCnt=a.WindDelta;else 0>b.WindCnt*b.WindDelta?1<Math.abs(b.WindCnt)?a.WindCnt=0>b.WindDelta*a.WindDelta?b.WindCnt:
b.WindCnt+a.WindDelta:a.WindCnt=0===a.WindDelta?1:a.WindDelta:a.WindCnt=0===a.WindDelta?0>b.WindCnt?b.WindCnt-1:b.WindCnt+1:0>b.WindDelta*a.WindDelta?b.WindCnt:b.WindCnt+a.WindDelta;a.WindCnt2=b.WindCnt2;b=b.NextInAEL}if(this.IsEvenOddAltFillType(a))for(;b!=a;)0!==b.WindDelta&&(a.WindCnt2=0===a.WindCnt2?1:0),b=b.NextInAEL;else for(;b!=a;)a.WindCnt2+=b.WindDelta,b=b.NextInAEL};d.Clipper.prototype.AddEdgeToSEL=function(a){null===this.m_SortedEdges?(this.m_SortedEdges=a,a.PrevInSEL=null,a.NextInSEL=
null):(a.NextInSEL=this.m_SortedEdges,a.PrevInSEL=null,this.m_SortedEdges=this.m_SortedEdges.PrevInSEL=a)};d.Clipper.prototype.CopyAELToSEL=function(){var a=this.m_ActiveEdges;for(this.m_SortedEdges=a;null!==a;)a.PrevInSEL=a.PrevInAEL,a=a.NextInSEL=a.NextInAEL};d.Clipper.prototype.SwapPositionsInAEL=function(a,b){if(a.NextInAEL!=a.PrevInAEL&&b.NextInAEL!=b.PrevInAEL){if(a.NextInAEL==b){var c=b.NextInAEL;null!==c&&(c.PrevInAEL=a);var e=a.PrevInAEL;null!==e&&(e.NextInAEL=b);b.PrevInAEL=e;b.NextInAEL=
a;a.PrevInAEL=b;a.NextInAEL=c}else b.NextInAEL==a?(c=a.NextInAEL,null!==c&&(c.PrevInAEL=b),e=b.PrevInAEL,null!==e&&(e.NextInAEL=a),a.PrevInAEL=e,a.NextInAEL=b,b.PrevInAEL=a,b.NextInAEL=c):(c=a.NextInAEL,e=a.PrevInAEL,a.NextInAEL=b.NextInAEL,null!==a.NextInAEL&&(a.NextInAEL.PrevInAEL=a),a.PrevInAEL=b.PrevInAEL,null!==a.PrevInAEL&&(a.PrevInAEL.NextInAEL=a),b.NextInAEL=c,null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=b),b.PrevInAEL=e,null!==b.PrevInAEL&&(b.PrevInAEL.NextInAEL=b));null===a.PrevInAEL?this.m_ActiveEdges=
a:null===b.PrevInAEL&&(this.m_ActiveEdges=b)}};d.Clipper.prototype.SwapPositionsInSEL=function(a,b){if(null!==a.NextInSEL||null!==a.PrevInSEL)if(null!==b.NextInSEL||null!==b.PrevInSEL){if(a.NextInSEL==b){var c=b.NextInSEL;null!==c&&(c.PrevInSEL=a);var e=a.PrevInSEL;null!==e&&(e.NextInSEL=b);b.PrevInSEL=e;b.NextInSEL=a;a.PrevInSEL=b;a.NextInSEL=c}else b.NextInSEL==a?(c=a.NextInSEL,null!==c&&(c.PrevInSEL=b),e=b.PrevInSEL,null!==e&&(e.NextInSEL=a),a.PrevInSEL=e,a.NextInSEL=b,b.PrevInSEL=a,b.NextInSEL=
c):(c=a.NextInSEL,e=a.PrevInSEL,a.NextInSEL=b.NextInSEL,null!==a.NextInSEL&&(a.NextInSEL.PrevInSEL=a),a.PrevInSEL=b.PrevInSEL,null!==a.PrevInSEL&&(a.PrevInSEL.NextInSEL=a),b.NextInSEL=c,null!==b.NextInSEL&&(b.NextInSEL.PrevInSEL=b),b.PrevInSEL=e,null!==b.PrevInSEL&&(b.PrevInSEL.NextInSEL=b));null===a.PrevInSEL?this.m_SortedEdges=a:null===b.PrevInSEL&&(this.m_SortedEdges=b)}};d.Clipper.prototype.AddLocalMaxPoly=function(a,b,c){this.AddOutPt(a,c);0==b.WindDelta&&this.AddOutPt(b,c);a.OutIdx==b.OutIdx?
(a.OutIdx=-1,b.OutIdx=-1):a.OutIdx<b.OutIdx?this.AppendPolygon(a,b):this.AppendPolygon(b,a)};d.Clipper.prototype.AddLocalMinPoly=function(a,b,c){var e,f;d.ClipperBase.IsHorizontal(b)||a.Dx>b.Dx?(e=this.AddOutPt(a,c),b.OutIdx=a.OutIdx,a.Side=d.EdgeSide.esLeft,b.Side=d.EdgeSide.esRight,f=a,a=f.PrevInAEL==b?b.PrevInAEL:f.PrevInAEL):(e=this.AddOutPt(b,c),a.OutIdx=b.OutIdx,a.Side=d.EdgeSide.esRight,b.Side=d.EdgeSide.esLeft,f=b,a=f.PrevInAEL==a?a.PrevInAEL:f.PrevInAEL);null!==a&&0<=a.OutIdx&&d.Clipper.TopX(a,
c.Y)==d.Clipper.TopX(f,c.Y)&&d.ClipperBase.SlopesEqual(f,a,this.m_UseFullRange)&&0!==f.WindDelta&&0!==a.WindDelta&&(c=this.AddOutPt(a,c),this.AddJoin(e,c,f.Top));return e};d.Clipper.prototype.CreateOutRec=function(){var a=new d.OutRec;a.Idx=-1;a.IsHole=!1;a.IsOpen=!1;a.FirstLeft=null;a.Pts=null;a.BottomPt=null;a.PolyNode=null;this.m_PolyOuts.push(a);a.Idx=this.m_PolyOuts.length-1;return a};d.Clipper.prototype.AddOutPt=function(a,b){var c=a.Side==d.EdgeSide.esLeft;if(0>a.OutIdx){var e=this.CreateOutRec();
e.IsOpen=0===a.WindDelta;var f=new d.OutPt;e.Pts=f;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;f.Next=f;f.Prev=f;e.IsOpen||this.SetHoleState(a,e);a.OutIdx=e.Idx}else{var e=this.m_PolyOuts[a.OutIdx],g=e.Pts;if(c&&d.IntPoint.op_Equality(b,g.Pt))return g;if(!c&&d.IntPoint.op_Equality(b,g.Prev.Pt))return g.Prev;f=new d.OutPt;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;f.Next=g;f.Prev=g.Prev;f.Prev.Next=f;g.Prev=f;c&&(e.Pts=f)}return f};d.Clipper.prototype.SwapPoints=function(a,b){var c=new d.IntPoint(a.Value);a.Value.X=
b.Value.X;a.Value.Y=b.Value.Y;b.Value.X=c.X;b.Value.Y=c.Y};d.Clipper.prototype.HorzSegmentsOverlap=function(a,b,c,e){return a.X>c.X==a.X<e.X?!0:b.X>c.X==b.X<e.X?!0:c.X>a.X==c.X<b.X?!0:e.X>a.X==e.X<b.X?!0:a.X==c.X&&b.X==e.X?!0:a.X==e.X&&b.X==c.X?!0:!1};d.Clipper.prototype.InsertPolyPtBetween=function(a,b,c){var e=new d.OutPt;e.Pt.X=c.X;e.Pt.Y=c.Y;b==a.Next?(a.Next=e,b.Prev=e,e.Next=b,e.Prev=a):(b.Next=e,a.Prev=e,e.Next=a,e.Prev=b);return e};d.Clipper.prototype.SetHoleState=function(a,b){for(var c=
!1,e=a.PrevInAEL;null!==e;)0<=e.OutIdx&&0!=e.WindDelta&&(c=!c,null===b.FirstLeft&&(b.FirstLeft=this.m_PolyOuts[e.OutIdx])),e=e.PrevInAEL;c&&(b.IsHole=!0)};d.Clipper.prototype.GetDx=function(a,b){return a.Y==b.Y?d.ClipperBase.horizontal:(b.X-a.X)/(b.Y-a.Y)};d.Clipper.prototype.FirstIsBottomPt=function(a,b){for(var c=a.Prev;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Prev;for(var e=Math.abs(this.GetDx(a.Pt,c.Pt)),c=a.Next;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Next;for(var f=Math.abs(this.GetDx(a.Pt,
c.Pt)),c=b.Prev;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Prev;for(var g=Math.abs(this.GetDx(b.Pt,c.Pt)),c=b.Next;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Next;c=Math.abs(this.GetDx(b.Pt,c.Pt));return e>=g&&e>=c||f>=g&&f>=c};d.Clipper.prototype.GetBottomPt=function(a){for(var b=null,c=a.Next;c!=a;)c.Pt.Y>a.Pt.Y?(a=c,b=null):c.Pt.Y==a.Pt.Y&&c.Pt.X<=a.Pt.X&&(c.Pt.X<a.Pt.X?(b=null,a=c):c.Next!=a&&c.Prev!=a&&(b=c)),c=c.Next;if(null!==b)for(;b!=c;)for(this.FirstIsBottomPt(c,b)||(a=b),b=b.Next;d.IntPoint.op_Inequality(b.Pt,
a.Pt);)b=b.Next;return a};d.Clipper.prototype.GetLowermostRec=function(a,b){null===a.BottomPt&&(a.BottomPt=this.GetBottomPt(a.Pts));null===b.BottomPt&&(b.BottomPt=this.GetBottomPt(b.Pts));var c=a.BottomPt,e=b.BottomPt;return c.Pt.Y>e.Pt.Y?a:c.Pt.Y<e.Pt.Y?b:c.Pt.X<e.Pt.X?a:c.Pt.X>e.Pt.X?b:c.Next==c?b:e.Next==e?a:this.FirstIsBottomPt(c,e)?a:b};d.Clipper.prototype.Param1RightOfParam2=function(a,b){do if(a=a.FirstLeft,a==b)return!0;while(null!==a);return!1};d.Clipper.prototype.GetOutRec=function(a){for(a=
this.m_PolyOuts[a];a!=this.m_PolyOuts[a.Idx];)a=this.m_PolyOuts[a.Idx];return a};d.Clipper.prototype.AppendPolygon=function(a,b){var c=this.m_PolyOuts[a.OutIdx],e=this.m_PolyOuts[b.OutIdx],f;f=this.Param1RightOfParam2(c,e)?e:this.Param1RightOfParam2(e,c)?c:this.GetLowermostRec(c,e);var g=c.Pts,h=g.Prev,k=e.Pts,n=k.Prev;a.Side==d.EdgeSide.esLeft?(b.Side==d.EdgeSide.esLeft?(this.ReversePolyPtLinks(k),k.Next=g,g.Prev=k,h.Next=n,n.Prev=h,c.Pts=n):(n.Next=g,g.Prev=n,k.Prev=h,h.Next=k,c.Pts=k),g=d.EdgeSide.esLeft):
(b.Side==d.EdgeSide.esRight?(this.ReversePolyPtLinks(k),h.Next=n,n.Prev=h,k.Next=g,g.Prev=k):(h.Next=k,k.Prev=h,g.Prev=n,n.Next=g),g=d.EdgeSide.esRight);c.BottomPt=null;f==e&&(e.FirstLeft!=c&&(c.FirstLeft=e.FirstLeft),c.IsHole=e.IsHole);e.Pts=null;e.BottomPt=null;e.FirstLeft=c;f=a.OutIdx;h=b.OutIdx;a.OutIdx=-1;b.OutIdx=-1;for(k=this.m_ActiveEdges;null!==k;){if(k.OutIdx==h){k.OutIdx=f;k.Side=g;break}k=k.NextInAEL}e.Idx=c.Idx};d.Clipper.prototype.ReversePolyPtLinks=function(a){if(null!==a){var b,c;
b=a;do c=b.Next,b.Next=b.Prev,b=b.Prev=c;while(b!=a)}};d.Clipper.SwapSides=function(a,b){var c=a.Side;a.Side=b.Side;b.Side=c};d.Clipper.SwapPolyIndexes=function(a,b){var c=a.OutIdx;a.OutIdx=b.OutIdx;b.OutIdx=c};d.Clipper.prototype.IntersectEdges=function(a,b,c,e){var f=!e&&null===a.NextInLML&&a.Top.X==c.X&&a.Top.Y==c.Y;e=!e&&null===b.NextInLML&&b.Top.X==c.X&&b.Top.Y==c.Y;var g=0<=a.OutIdx,h=0<=b.OutIdx;if(0===a.WindDelta||0===b.WindDelta)0===a.WindDelta&&0===b.WindDelta?(f||e)&&g&&h&&this.AddLocalMaxPoly(a,
b,c):a.PolyTyp==b.PolyTyp&&a.WindDelta!=b.WindDelta&&this.m_ClipType==d.ClipType.ctUnion?0===a.WindDelta?h&&(this.AddOutPt(a,c),g&&(a.OutIdx=-1)):g&&(this.AddOutPt(b,c),h&&(b.OutIdx=-1)):a.PolyTyp!=b.PolyTyp&&(0!==a.WindDelta||1!=Math.abs(b.WindCnt)||this.m_ClipType==d.ClipType.ctUnion&&0!==b.WindCnt2?0!==b.WindDelta||1!=Math.abs(a.WindCnt)||this.m_ClipType==d.ClipType.ctUnion&&0!==a.WindCnt2||(this.AddOutPt(b,c),h&&(b.OutIdx=-1)):(this.AddOutPt(a,c),g&&(a.OutIdx=-1))),f&&(0>a.OutIdx?this.DeleteFromAEL(a):
d.Error("Error intersecting polylines")),e&&(0>b.OutIdx?this.DeleteFromAEL(b):d.Error("Error intersecting polylines"));else{if(a.PolyTyp==b.PolyTyp)if(this.IsEvenOddFillType(a)){var k=a.WindCnt;a.WindCnt=b.WindCnt;b.WindCnt=k}else a.WindCnt=0===a.WindCnt+b.WindDelta?-a.WindCnt:a.WindCnt+b.WindDelta,b.WindCnt=0===b.WindCnt-a.WindDelta?-b.WindCnt:b.WindCnt-a.WindDelta;else this.IsEvenOddFillType(b)?a.WindCnt2=0===a.WindCnt2?1:0:a.WindCnt2+=b.WindDelta,this.IsEvenOddFillType(a)?b.WindCnt2=0===b.WindCnt2?
1:0:b.WindCnt2-=a.WindDelta;var n,m,l;a.PolyTyp==d.PolyType.ptSubject?(n=this.m_SubjFillType,l=this.m_ClipFillType):(n=this.m_ClipFillType,l=this.m_SubjFillType);b.PolyTyp==d.PolyType.ptSubject?(m=this.m_SubjFillType,k=this.m_ClipFillType):(m=this.m_ClipFillType,k=this.m_SubjFillType);switch(n){case d.PolyFillType.pftPositive:n=a.WindCnt;break;case d.PolyFillType.pftNegative:n=-a.WindCnt;break;default:n=Math.abs(a.WindCnt)}switch(m){case d.PolyFillType.pftPositive:m=b.WindCnt;break;case d.PolyFillType.pftNegative:m=
-b.WindCnt;break;default:m=Math.abs(b.WindCnt)}if(g&&h)f||e||0!==n&&1!=n||0!==m&&1!=m||a.PolyTyp!=b.PolyTyp&&this.m_ClipType!=d.ClipType.ctXor?this.AddLocalMaxPoly(a,b,c):(this.AddOutPt(a,c),this.AddOutPt(b,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b));else if(g){if(0===m||1==m)this.AddOutPt(a,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(h){if(0===n||1==n)this.AddOutPt(b,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(!(0!==n&&1!=n||0!==m&&1!=
m||f||e)){switch(l){case d.PolyFillType.pftPositive:g=a.WindCnt2;break;case d.PolyFillType.pftNegative:g=-a.WindCnt2;break;default:g=Math.abs(a.WindCnt2)}switch(k){case d.PolyFillType.pftPositive:h=b.WindCnt2;break;case d.PolyFillType.pftNegative:h=-b.WindCnt2;break;default:h=Math.abs(b.WindCnt2)}if(a.PolyTyp!=b.PolyTyp)this.AddLocalMinPoly(a,b,c);else if(1==n&&1==m)switch(this.m_ClipType){case d.ClipType.ctIntersection:0<g&&0<h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctUnion:0>=g&&0>=
h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctDifference:(a.PolyTyp==d.PolyType.ptClip&&0<g&&0<h||a.PolyTyp==d.PolyType.ptSubject&&0>=g&&0>=h)&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctXor:this.AddLocalMinPoly(a,b,c)}else d.Clipper.SwapSides(a,b)}f!=e&&(f&&0<=a.OutIdx||e&&0<=b.OutIdx)&&(d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b));f&&this.DeleteFromAEL(a);e&&this.DeleteFromAEL(b)}};d.Clipper.prototype.DeleteFromAEL=function(a){var b=a.PrevInAEL,c=a.NextInAEL;if(null!==
b||null!==c||a==this.m_ActiveEdges)null!==b?b.NextInAEL=c:this.m_ActiveEdges=c,null!==c&&(c.PrevInAEL=b),a.NextInAEL=null,a.PrevInAEL=null};d.Clipper.prototype.DeleteFromSEL=function(a){var b=a.PrevInSEL,c=a.NextInSEL;if(null!==b||null!==c||a==this.m_SortedEdges)null!==b?b.NextInSEL=c:this.m_SortedEdges=c,null!==c&&(c.PrevInSEL=b),a.NextInSEL=null,a.PrevInSEL=null};d.Clipper.prototype.UpdateEdgeIntoAEL=function(a){null===a.Value.NextInLML&&d.Error("UpdateEdgeIntoAEL: invalid call");var b=a.Value.PrevInAEL,
c=a.Value.NextInAEL;a.Value.NextInLML.OutIdx=a.Value.OutIdx;null!==b?b.NextInAEL=a.Value.NextInLML:this.m_ActiveEdges=a.Value.NextInLML;null!==c&&(c.PrevInAEL=a.Value.NextInLML);a.Value.NextInLML.Side=a.Value.Side;a.Value.NextInLML.WindDelta=a.Value.WindDelta;a.Value.NextInLML.WindCnt=a.Value.WindCnt;a.Value.NextInLML.WindCnt2=a.Value.WindCnt2;a.Value=a.Value.NextInLML;a.Value.Curr.X=a.Value.Bot.X;a.Value.Curr.Y=a.Value.Bot.Y;a.Value.PrevInAEL=b;a.Value.NextInAEL=c;d.ClipperBase.IsHorizontal(a.Value)||
this.InsertScanbeam(a.Value.Top.Y)};d.Clipper.prototype.ProcessHorizontals=function(a){for(var b=this.m_SortedEdges;null!==b;)this.DeleteFromSEL(b),this.ProcessHorizontal(b,a),b=this.m_SortedEdges};d.Clipper.prototype.GetHorzDirection=function(a,b,c,e){a.Bot.X<a.Top.X?(c.Value=a.Bot.X,e.Value=a.Top.X,b.Value=d.Direction.dLeftToRight):(c.Value=a.Top.X,e.Value=a.Bot.X,b.Value=d.Direction.dRightToLeft)};d.Clipper.prototype.PrepareHorzJoins=function(a,b){var c=this.m_PolyOuts[a.OutIdx].Pts;a.Side!=d.EdgeSide.esLeft&&
(c=c.Prev);for(var e=0,f=this.m_GhostJoins.length;e<f;++e){var g=this.m_GhostJoins[e];this.HorzSegmentsOverlap(g.OutPt1.Pt,g.OffPt,a.Bot,a.Top)&&this.AddJoin(g.OutPt1,c,g.OffPt)}b&&(d.IntPoint.op_Equality(c.Pt,a.Top)?this.AddGhostJoin(c,a.Bot):this.AddGhostJoin(c,a.Top))};d.Clipper.prototype.ProcessHorizontal=function(a,b){var c,e,f;(function(){c={Value:c};e={Value:e};f={Value:f};var b=this.GetHorzDirection(a,c,e,f);c=c.Value;e=e.Value;f=f.Value;return b}).call(this);for(var g=a,h=null;null!==g.NextInLML&&
d.ClipperBase.IsHorizontal(g.NextInLML);)g=g.NextInLML;for(null===g.NextInLML&&(h=this.GetMaximaPair(g));;){for(var k=a==g,n=this.GetNextInAEL(a,c);null!==n&&!(n.Curr.X==a.Top.X&&null!==a.NextInLML&&n.Dx<a.NextInLML.Dx);){var m=this.GetNextInAEL(n,c);if(c==d.Direction.dLeftToRight&&n.Curr.X<=f||c==d.Direction.dRightToLeft&&n.Curr.X>=e){0<=a.OutIdx&&0!=a.WindDelta&&this.PrepareHorzJoins(a,b);if(n==h&&k){c==d.Direction.dLeftToRight?this.IntersectEdges(a,n,n.Top,!1):this.IntersectEdges(n,a,n.Top,!1);
0<=h.OutIdx&&d.Error("ProcessHorizontal error");return}if(c==d.Direction.dLeftToRight){var l=new d.IntPoint(n.Curr.X,a.Curr.Y);this.IntersectEdges(a,n,l,!0)}else l=new d.IntPoint(n.Curr.X,a.Curr.Y),this.IntersectEdges(n,a,l,!0);this.SwapPositionsInAEL(a,n)}else if(c==d.Direction.dLeftToRight&&n.Curr.X>=f||c==d.Direction.dRightToLeft&&n.Curr.X<=e)break;n=m}0<=a.OutIdx&&0!==a.WindDelta&&this.PrepareHorzJoins(a,b);if(null!==a.NextInLML&&d.ClipperBase.IsHorizontal(a.NextInLML))(function(){a={Value:a};
var b=this.UpdateEdgeIntoAEL(a);a=a.Value;return b}).call(this),0<=a.OutIdx&&this.AddOutPt(a,a.Bot),function(){c={Value:c};e={Value:e};f={Value:f};var b=this.GetHorzDirection(a,c,e,f);c=c.Value;e=e.Value;f=f.Value;return b}.call(this);else break}null!==a.NextInLML?0<=a.OutIdx?(g=this.AddOutPt(a,a.Top),function(){a={Value:a};var b=this.UpdateEdgeIntoAEL(a);a=a.Value;return b}.call(this),0!==a.WindDelta&&(h=a.PrevInAEL,m=a.NextInAEL,null!==h&&h.Curr.X==a.Bot.X&&h.Curr.Y==a.Bot.Y&&0!==h.WindDelta&&0<=
h.OutIdx&&h.Curr.Y>h.Top.Y&&d.ClipperBase.SlopesEqual(a,h,this.m_UseFullRange)?(m=this.AddOutPt(h,a.Bot),this.AddJoin(g,m,a.Top)):null!==m&&m.Curr.X==a.Bot.X&&m.Curr.Y==a.Bot.Y&&0!==m.WindDelta&&0<=m.OutIdx&&m.Curr.Y>m.Top.Y&&d.ClipperBase.SlopesEqual(a,m,this.m_UseFullRange)&&(m=this.AddOutPt(m,a.Bot),this.AddJoin(g,m,a.Top)))):function(){a={Value:a};var b=this.UpdateEdgeIntoAEL(a);a=a.Value;return b}.call(this):null!==h?0<=h.OutIdx?(c==d.Direction.dLeftToRight?this.IntersectEdges(a,h,a.Top,!1):
this.IntersectEdges(h,a,a.Top,!1),0<=h.OutIdx&&d.Error("ProcessHorizontal error")):(this.DeleteFromAEL(a),this.DeleteFromAEL(h)):(0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a))};d.Clipper.prototype.GetNextInAEL=function(a,b){return b==d.Direction.dLeftToRight?a.NextInAEL:a.PrevInAEL};d.Clipper.prototype.IsMinima=function(a){return null!==a&&a.Prev.NextInLML!=a&&a.Next.NextInLML!=a};d.Clipper.prototype.IsMaxima=function(a,b){return null!==a&&a.Top.Y==b&&null===a.NextInLML};d.Clipper.prototype.IsIntermediate=
function(a,b){return a.Top.Y==b&&null!==a.NextInLML};d.Clipper.prototype.GetMaximaPair=function(a){var b=null;d.IntPoint.op_Equality(a.Next.Top,a.Top)&&null===a.Next.NextInLML?b=a.Next:d.IntPoint.op_Equality(a.Prev.Top,a.Top)&&null===a.Prev.NextInLML&&(b=a.Prev);return null===b||-2!=b.OutIdx&&(b.NextInAEL!=b.PrevInAEL||d.ClipperBase.IsHorizontal(b))?b:null};d.Clipper.prototype.ProcessIntersections=function(a,b){if(null==this.m_ActiveEdges)return!0;try{this.BuildIntersectList(a,b);if(0==this.m_IntersectList.length)return!0;
if(1==this.m_IntersectList.length||this.FixupIntersectionOrder())this.ProcessIntersectList();else return!1}catch(c){this.m_SortedEdges=null,this.m_IntersectList.length=0,d.Error("ProcessIntersections error")}this.m_SortedEdges=null;return!0};d.Clipper.prototype.BuildIntersectList=function(a,b){if(null!==this.m_ActiveEdges){var c=this.m_ActiveEdges;for(this.m_SortedEdges=c;null!==c;)c.PrevInSEL=c.PrevInAEL,c.NextInSEL=c.NextInAEL,c.Curr.X=d.Clipper.TopX(c,b),c=c.NextInAEL;for(var e=!0;e&&null!==this.m_SortedEdges;){e=
!1;for(c=this.m_SortedEdges;null!==c.NextInSEL;){var f=c.NextInSEL,g=new d.IntPoint;c.Curr.X>f.Curr.X?(g={Value:g},e=this.IntersectPoint(c,f,g),g=g.Value,!e&&c.Curr.X>f.Curr.X+1&&d.Error("Intersection error"),g.Y>a&&(g.Y=a,Math.abs(c.Dx)>Math.abs(f.Dx)?g.X=d.Clipper.TopX(f,a):g.X=d.Clipper.TopX(c,a)),e=new d.IntersectNode,e.Edge1=c,e.Edge2=f,e.Pt.X=g.X,e.Pt.Y=g.Y,this.m_IntersectList.push(e),this.SwapPositionsInSEL(c,f),e=!0):c=f}if(null!==c.PrevInSEL)c.PrevInSEL.NextInSEL=null;else break}this.m_SortedEdges=
null}};d.Clipper.prototype.EdgesAdjacent=function(a){return a.Edge1.NextInSEL==a.Edge2||a.Edge1.PrevInSEL==a.Edge2};d.Clipper.IntersectNodeSort=function(a,b){return b.Pt.Y-a.Pt.Y};d.Clipper.prototype.FixupIntersectionOrder=function(){this.m_IntersectList.sort(this.m_IntersectNodeComparer);this.CopyAELToSEL();for(var a=this.m_IntersectList.length,b=0;b<a;b++){if(!this.EdgesAdjacent(this.m_IntersectList[b])){for(var c=b+1;c<a&&!this.EdgesAdjacent(this.m_IntersectList[c]);)c++;if(c==a)return!1;var e=
this.m_IntersectList[b];this.m_IntersectList[b]=this.m_IntersectList[c];this.m_IntersectList[c]=e}this.SwapPositionsInSEL(this.m_IntersectList[b].Edge1,this.m_IntersectList[b].Edge2)}return!0};d.Clipper.prototype.ProcessIntersectList=function(){for(var a=0,b=this.m_IntersectList.length;a<b;a++){var c=this.m_IntersectList[a];this.IntersectEdges(c.Edge1,c.Edge2,c.Pt,!0);this.SwapPositionsInAEL(c.Edge1,c.Edge2)}this.m_IntersectList.length=0};F=function(a){return 0>a?Math.ceil(a-0.5):Math.round(a)};G=
function(a){return 0>a?Math.ceil(a-0.5):Math.floor(a+0.5)};H=function(a){return 0>a?-Math.round(Math.abs(a)):Math.round(a)};I=function(a){if(0>a)return a-=0.5,-2147483648>a?Math.ceil(a):a|0;a+=0.5;return 2147483647<a?Math.floor(a):a|0};d.Clipper.Round=r?F:E?H:K?I:G;d.Clipper.TopX=function(a,b){return b==a.Top.Y?a.Top.X:a.Bot.X+d.Clipper.Round(a.Dx*(b-a.Bot.Y))};d.Clipper.prototype.IntersectPoint=function(a,b,c){c.Value=new d.IntPoint;var e,f;if(d.ClipperBase.SlopesEqual(a,b,this.m_UseFullRange)||
a.Dx==b.Dx)return b.Bot.Y>a.Bot.Y?(c.Value.X=b.Bot.X,c.Value.Y=b.Bot.Y):(c.Value.X=a.Bot.X,c.Value.Y=a.Bot.Y),!1;if(0===a.Delta.X)c.Value.X=a.Bot.X,d.ClipperBase.IsHorizontal(b)?c.Value.Y=b.Bot.Y:(f=b.Bot.Y-b.Bot.X/b.Dx,c.Value.Y=d.Clipper.Round(c.Value.X/b.Dx+f));else if(0===b.Delta.X)c.Value.X=b.Bot.X,d.ClipperBase.IsHorizontal(a)?c.Value.Y=a.Bot.Y:(e=a.Bot.Y-a.Bot.X/a.Dx,c.Value.Y=d.Clipper.Round(c.Value.X/a.Dx+e));else{e=a.Bot.X-a.Bot.Y*a.Dx;f=b.Bot.X-b.Bot.Y*b.Dx;var g=(f-e)/(a.Dx-b.Dx);c.Value.Y=
d.Clipper.Round(g);Math.abs(a.Dx)<Math.abs(b.Dx)?c.Value.X=d.Clipper.Round(a.Dx*g+e):c.Value.X=d.Clipper.Round(b.Dx*g+f)}if(c.Value.Y<a.Top.Y||c.Value.Y<b.Top.Y){if(a.Top.Y>b.Top.Y)return c.Value.Y=a.Top.Y,c.Value.X=d.Clipper.TopX(b,a.Top.Y),c.Value.X<a.Top.X;c.Value.Y=b.Top.Y;Math.abs(a.Dx)<Math.abs(b.Dx)?c.Value.X=d.Clipper.TopX(a,c.Value.Y):c.Value.X=d.Clipper.TopX(b,c.Value.Y)}return!0};d.Clipper.prototype.ProcessEdgesAtTopOfScanbeam=function(a){for(var b=this.m_ActiveEdges;null!==b;){var c=this.IsMaxima(b,
a);c&&(c=this.GetMaximaPair(b),c=null===c||!d.ClipperBase.IsHorizontal(c));if(c){var e=b.PrevInAEL;this.DoMaxima(b);b=null===e?this.m_ActiveEdges:e.NextInAEL}else this.IsIntermediate(b,a)&&d.ClipperBase.IsHorizontal(b.NextInLML)?(function(){b={Value:b};var a=this.UpdateEdgeIntoAEL(b);b=b.Value;return a}.call(this),0<=b.OutIdx&&this.AddOutPt(b,b.Bot),this.AddEdgeToSEL(b)):(b.Curr.X=d.Clipper.TopX(b,a),b.Curr.Y=a),this.StrictlySimple&&(e=b.PrevInAEL,0<=b.OutIdx&&0!==b.WindDelta&&null!==e&&0<=e.OutIdx&&
e.Curr.X==b.Curr.X&&0!==e.WindDelta&&(c=this.AddOutPt(e,b.Curr),e=this.AddOutPt(b,b.Curr),this.AddJoin(c,e,b.Curr))),b=b.NextInAEL}this.ProcessHorizontals(!0);for(b=this.m_ActiveEdges;null!==b;){if(this.IsIntermediate(b,a)){c=null;0<=b.OutIdx&&(c=this.AddOutPt(b,b.Top));(function(){b={Value:b};var a=this.UpdateEdgeIntoAEL(b);b=b.Value;return a}).call(this);var e=b.PrevInAEL,f=b.NextInAEL;null!==e&&e.Curr.X==b.Bot.X&&e.Curr.Y==b.Bot.Y&&null!==c&&0<=e.OutIdx&&e.Curr.Y>e.Top.Y&&d.ClipperBase.SlopesEqual(b,
e,this.m_UseFullRange)&&0!==b.WindDelta&&0!==e.WindDelta?(e=this.AddOutPt(e,b.Bot),this.AddJoin(c,e,b.Top)):null!==f&&f.Curr.X==b.Bot.X&&f.Curr.Y==b.Bot.Y&&null!==c&&0<=f.OutIdx&&f.Curr.Y>f.Top.Y&&d.ClipperBase.SlopesEqual(b,f,this.m_UseFullRange)&&0!==b.WindDelta&&0!==f.WindDelta&&(e=this.AddOutPt(f,b.Bot),this.AddJoin(c,e,b.Top))}b=b.NextInAEL}};d.Clipper.prototype.DoMaxima=function(a){var b=this.GetMaximaPair(a);if(null===b)0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a);else{for(var c=
a.NextInAEL;null!==c&&c!=b;)this.IntersectEdges(a,c,a.Top,!0),this.SwapPositionsInAEL(a,c),c=a.NextInAEL;-1==a.OutIdx&&-1==b.OutIdx?(this.DeleteFromAEL(a),this.DeleteFromAEL(b)):0<=a.OutIdx&&0<=b.OutIdx?this.IntersectEdges(a,b,a.Top,!1):0===a.WindDelta?(0<=a.OutIdx&&(this.AddOutPt(a,a.Top),a.OutIdx=-1),this.DeleteFromAEL(a),0<=b.OutIdx&&(this.AddOutPt(b,a.Top),b.OutIdx=-1),this.DeleteFromAEL(b)):d.Error("DoMaxima error")}};d.Clipper.ReversePaths=function(a){for(var b=0,c=a.length;b<c;b++)a[b].reverse()};
d.Clipper.Orientation=function(a){return 0<=d.Clipper.Area(a)};d.Clipper.prototype.PointCount=function(a){if(null===a)return 0;var b=0,c=a;do b++,c=c.Next;while(c!=a);return b};d.Clipper.prototype.BuildResult=function(a){d.Clear(a);for(var b=0,c=this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b];if(null!==e.Pts){var e=e.Pts.Prev,f=this.PointCount(e);if(!(2>f)){for(var g=Array(f),h=0;h<f;h++)g[h]=e.Pt,e=e.Prev;a.push(g)}}}};d.Clipper.prototype.BuildResult2=function(a){a.Clear();for(var b=0,c=
this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b],f=this.PointCount(e.Pts);if(!(e.IsOpen&&2>f||!e.IsOpen&&3>f)){this.FixHoleLinkage(e);var g=new d.PolyNode;a.m_AllPolys.push(g);e.PolyNode=g;g.m_polygon.length=f;for(var e=e.Pts.Prev,h=0;h<f;h++)g.m_polygon[h]=e.Pt,e=e.Prev}}b=0;for(c=this.m_PolyOuts.length;b<c;b++)e=this.m_PolyOuts[b],null!==e.PolyNode&&(e.IsOpen?(e.PolyNode.IsOpen=!0,a.AddChild(e.PolyNode)):null!==e.FirstLeft&&null!=e.FirstLeft.PolyNode?e.FirstLeft.PolyNode.AddChild(e.PolyNode):
a.AddChild(e.PolyNode))};d.Clipper.prototype.FixupOutPolygon=function(a){var b=null;a.BottomPt=null;for(var c=a.Pts;;){if(c.Prev==c||c.Prev==c.Next){this.DisposeOutPts(c);a.Pts=null;return}if(d.IntPoint.op_Equality(c.Pt,c.Next.Pt)||d.IntPoint.op_Equality(c.Pt,c.Prev.Pt)||d.ClipperBase.SlopesEqual(c.Prev.Pt,c.Pt,c.Next.Pt,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(c.Prev.Pt,c.Pt,c.Next.Pt)))b=null,c.Prev.Next=c.Next,c=c.Next.Prev=c.Prev;else if(c==b)break;else null===
b&&(b=c),c=c.Next}a.Pts=c};d.Clipper.prototype.DupOutPt=function(a,b){var c=new d.OutPt;c.Pt.X=a.Pt.X;c.Pt.Y=a.Pt.Y;c.Idx=a.Idx;b?(c.Next=a.Next,c.Prev=a,a.Next.Prev=c,a.Next=c):(c.Prev=a.Prev,c.Next=a,a.Prev.Next=c,a.Prev=c);return c};d.Clipper.prototype.GetOverlap=function(a,b,c,e,d,g){a<b?c<e?(d.Value=Math.max(a,c),g.Value=Math.min(b,e)):(d.Value=Math.max(a,e),g.Value=Math.min(b,c)):c<e?(d.Value=Math.max(b,c),g.Value=Math.min(a,e)):(d.Value=Math.max(b,e),g.Value=Math.min(a,c));return d.Value<g.Value};
d.Clipper.prototype.JoinHorz=function(a,b,c,e,f,g){var h=a.Pt.X>b.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;e=c.Pt.X>e.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;if(h==e)return!1;if(h==d.Direction.dLeftToRight){for(;a.Next.Pt.X<=f.X&&a.Next.Pt.X>=a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g&&a.Pt.X!=f.X&&(a=a.Next);b=this.DupOutPt(a,!g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,b=this.DupOutPt(a,!g))}else{for(;a.Next.Pt.X>=f.X&&a.Next.Pt.X<=a.Pt.X&&a.Next.Pt.Y==
f.Y;)a=a.Next;g||a.Pt.X==f.X||(a=a.Next);b=this.DupOutPt(a,g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,b=this.DupOutPt(a,g))}if(e==d.Direction.dLeftToRight){for(;c.Next.Pt.X<=f.X&&c.Next.Pt.X>=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g&&c.Pt.X!=f.X&&(c=c.Next);e=this.DupOutPt(c,!g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,e=this.DupOutPt(c,!g))}else{for(;c.Next.Pt.X>=f.X&&c.Next.Pt.X<=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g||c.Pt.X==f.X||(c=c.Next);e=this.DupOutPt(c,
g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,e=this.DupOutPt(c,g))}h==d.Direction.dLeftToRight==g?(a.Prev=c,c.Next=a,b.Next=e,e.Prev=b):(a.Next=c,c.Prev=a,b.Prev=e,e.Next=b);return!0};d.Clipper.prototype.JoinPoints=function(a,b,c){var e=a.OutPt1,f=new d.OutPt,g=a.OutPt2,h=new d.OutPt;if((h=a.OutPt1.Pt.Y==a.OffPt.Y)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt1.Pt)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt2.Pt)){for(f=a.OutPt1.Next;f!=e&&d.IntPoint.op_Equality(f.Pt,a.OffPt);)f=f.Next;f=
f.Pt.Y>a.OffPt.Y;for(h=a.OutPt2.Next;h!=g&&d.IntPoint.op_Equality(h.Pt,a.OffPt);)h=h.Next;if(f==h.Pt.Y>a.OffPt.Y)return!1;f?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0}if(h){for(f=e;e.Prev.Pt.Y==e.Pt.Y&&e.Prev!=f&&e.Prev!=g;)e=e.Prev;for(;f.Next.Pt.Y==f.Pt.Y&&f.Next!=e&&f.Next!=g;)f=f.Next;if(f.Next==e||f.Next==g)return!1;for(h=g;g.Prev.Pt.Y==g.Pt.Y&&
g.Prev!=h&&g.Prev!=f;)g=g.Prev;for(;h.Next.Pt.Y==h.Pt.Y&&h.Next!=g&&h.Next!=e;)h=h.Next;if(h.Next==g||h.Next==e)return!1;var k,n;k={Value:k};n={Value:n};b=this.GetOverlap(e.Pt.X,f.Pt.X,g.Pt.X,h.Pt.X,k,n);k=k.Value;n=n.Value;if(!b)return!1;b=new d.IntPoint;e.Pt.X>=k&&e.Pt.X<=n?(b.X=e.Pt.X,b.Y=e.Pt.Y,c=e.Pt.X>f.Pt.X):g.Pt.X>=k&&g.Pt.X<=n?(b.X=g.Pt.X,b.Y=g.Pt.Y,c=g.Pt.X>h.Pt.X):f.Pt.X>=k&&f.Pt.X<=n?(b.X=f.Pt.X,b.Y=f.Pt.Y,c=f.Pt.X>e.Pt.X):(b.X=h.Pt.X,b.Y=h.Pt.Y,c=h.Pt.X>g.Pt.X);a.OutPt1=e;a.OutPt2=g;
return this.JoinHorz(e,f,g,h,b,c)}for(f=e.Next;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Next;if(k=f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,f.Pt,a.OffPt,this.m_UseFullRange)){for(f=e.Prev;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Prev;if(f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,f.Pt,a.OffPt,this.m_UseFullRange))return!1}for(h=g.Next;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Next;if(n=h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange)){for(h=g.Prev;d.IntPoint.op_Equality(h.Pt,
g.Pt)&&h!=g;)h=h.Prev;if(h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange))return!1}if(f==e||h==g||f==h||b==c&&k==n)return!1;k?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0};d.Clipper.GetBounds=function(a){for(var b=0,c=a.length;b<c&&0==a[b].length;)b++;if(b==c)return new d.IntRect(0,0,0,0);var e=new d.IntRect;e.left=a[b][0].X;
e.right=e.left;e.top=a[b][0].Y;for(e.bottom=e.top;b<c;b++)for(var f=0,g=a[b].length;f<g;f++)a[b][f].X<e.left?e.left=a[b][f].X:a[b][f].X>e.right&&(e.right=a[b][f].X),a[b][f].Y<e.top?e.top=a[b][f].Y:a[b][f].Y>e.bottom&&(e.bottom=a[b][f].Y);return e};d.Clipper.prototype.GetBounds2=function(a){var b=a,c=new d.IntRect;c.left=a.Pt.X;c.right=a.Pt.X;c.top=a.Pt.Y;c.bottom=a.Pt.Y;for(a=a.Next;a!=b;)a.Pt.X<c.left&&(c.left=a.Pt.X),a.Pt.X>c.right&&(c.right=a.Pt.X),a.Pt.Y<c.top&&(c.top=a.Pt.Y),a.Pt.Y>c.bottom&&
(c.bottom=a.Pt.Y),a=a.Next;return c};d.ClipperBase.prototype.PointInPolygon=d.Clipper.prototype.PointInPolygon=function(){var a=arguments,b=a.length;if(2==b){for(var b=a[0],c=a[1],a=0,e=c;;){var d=c.Pt.X,g=c.Pt.Y,h=c.Next.Pt.X,k=c.Next.Pt.Y;if(k==b.Y&&(h==b.X||g==b.Y&&h>b.X==d<b.X))return-1;if(g<b.Y!=k<b.Y)if(d>=b.X)if(h>b.X)a=1-a;else{d=(d-b.X)*(k-b.Y)-(h-b.X)*(g-b.Y);if(0==d)return-1;0<d==k>g&&(a=1-a)}else if(h>b.X){d=(d-b.X)*(k-b.Y)-(h-b.X)*(g-b.Y);if(0==d)return-1;0<d==k>g&&(a=1-a)}c=c.Next;if(e==
c)break}return a}if(3==b){b=a[0];c=a[1];e=a[2];g=c;a=!1;if(e){do g.Pt.Y>b.Y!=g.Prev.Pt.Y>b.Y&&p.op_LessThan(new p(b.X-g.Pt.X),p.op_Division(p.Int128Mul(g.Prev.Pt.X-g.Pt.X,b.Y-g.Pt.Y),new p(g.Prev.Pt.Y-g.Pt.Y)))&&(a=!a),g=g.Next;while(g!=c)}else{do g.Pt.Y>b.Y!=g.Prev.Pt.Y>b.Y&&b.X-g.Pt.X<(g.Prev.Pt.X-g.Pt.X)*(b.Y-g.Pt.Y)/(g.Prev.Pt.Y-g.Pt.Y)&&(a=!a),g=g.Next;while(g!=c)}return a}};d.Clipper.prototype.Poly2ContainsPoly1=function(a,b){var c=a;do{var e=this.PointInPolygon(c.Pt,b);if(0<=e)return 0!=e;
c=c.Next}while(c!=a);return!0};d.Clipper.prototype.FixupFirstLefts1=function(a,b){for(var c=0,e=this.m_PolyOuts.length;c<e;c++){var d=this.m_PolyOuts[c];null!==d.Pts&&d.FirstLeft==a&&this.Poly2ContainsPoly1(d.Pts,b.Pts)&&(d.FirstLeft=b)}};d.Clipper.prototype.FixupFirstLefts2=function(a,b){for(var c=0,e=this.m_PolyOuts,d=e.length,g=e[c];c<d;c++,g=e[c])g.FirstLeft==a&&(g.FirstLeft=b)};d.Clipper.ParseFirstLeft=function(a){for(;null!=a&&null==a.Pts;)a=a.FirstLeft;return a};d.Clipper.prototype.JoinCommonEdges=
function(){for(var a=0,b=this.m_Joins.length;a<b;a++){var c=this.m_Joins[a],e=this.GetOutRec(c.OutPt1.Idx),f=this.GetOutRec(c.OutPt2.Idx);if(null!=e.Pts&&null!=f.Pts){var g;g=e==f?e:this.Param1RightOfParam2(e,f)?f:this.Param1RightOfParam2(f,e)?e:this.GetLowermostRec(e,f);if(this.JoinPoints(c,e,f))if(e==f){e.Pts=c.OutPt1;e.BottomPt=null;f=this.CreateOutRec();f.Pts=c.OutPt2;this.UpdateOutPtIdxs(f);if(this.m_UsingPolyTree){g=0;for(var h=this.m_PolyOuts.length;g<h-1;g++){var k=this.m_PolyOuts[g];null!=
k.Pts&&d.Clipper.ParseFirstLeft(k.FirstLeft)==e&&k.IsHole!=e.IsHole&&this.Poly2ContainsPoly1(k.Pts,c.OutPt2)&&(k.FirstLeft=f)}}this.Poly2ContainsPoly1(f.Pts,e.Pts)?(f.IsHole=!e.IsHole,f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,e),(f.IsHole^this.ReverseSolution)==0<this.Area(f)&&this.ReversePolyPtLinks(f.Pts)):this.Poly2ContainsPoly1(e.Pts,f.Pts)?(f.IsHole=e.IsHole,e.IsHole=!f.IsHole,f.FirstLeft=e.FirstLeft,e.FirstLeft=f,this.m_UsingPolyTree&&this.FixupFirstLefts2(e,f),(e.IsHole^this.ReverseSolution)==
0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)):(f.IsHole=e.IsHole,f.FirstLeft=e.FirstLeft,this.m_UsingPolyTree&&this.FixupFirstLefts1(e,f))}else f.Pts=null,f.BottomPt=null,f.Idx=e.Idx,e.IsHole=g.IsHole,g==f&&(e.FirstLeft=f.FirstLeft),f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,e)}}};d.Clipper.prototype.UpdateOutPtIdxs=function(a){var b=a.Pts;do b.Idx=a.Idx,b=b.Prev;while(b!=a.Pts)};d.Clipper.prototype.DoSimplePolygons=function(){for(var a=0;a<this.m_PolyOuts.length;){var b=this.m_PolyOuts[a++],
c=b.Pts;if(null!==c){do{for(var e=c.Next;e!=b.Pts;){if(d.IntPoint.op_Equality(c.Pt,e.Pt)&&e.Next!=c&&e.Prev!=c){var f=c.Prev,g=e.Prev;c.Prev=g;g.Next=c;e.Prev=f;f.Next=e;b.Pts=c;f=this.CreateOutRec();f.Pts=e;this.UpdateOutPtIdxs(f);this.Poly2ContainsPoly1(f.Pts,b.Pts)?(f.IsHole=!b.IsHole,f.FirstLeft=b):this.Poly2ContainsPoly1(b.Pts,f.Pts)?(f.IsHole=b.IsHole,b.IsHole=!f.IsHole,f.FirstLeft=b.FirstLeft,b.FirstLeft=f):(f.IsHole=b.IsHole,f.FirstLeft=b.FirstLeft);e=c}e=e.Next}c=c.Next}while(c!=b.Pts)}}};
d.Clipper.Area=function(a){var b=a.length;if(3>b)return 0;for(var c=0,e=0,d=b-1;e<b;++e)c+=(a[d].X+a[e].X)*(a[d].Y-a[e].Y),d=e;return 0.5*-c};d.Clipper.prototype.Area=function(a){var b=a.Pts;if(null==b)return 0;var c=0;do c+=(b.Prev.Pt.X+b.Pt.X)*(b.Prev.Pt.Y-b.Pt.Y),b=b.Next;while(b!=a.Pts);return 0.5*c};d.Clipper.SimplifyPolygon=function(a,b){var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPath(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.SimplifyPolygons=
function(a,b){"undefined"==typeof b&&(b=d.PolyFillType.pftEvenOdd);var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPaths(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.DistanceSqrd=function(a,b){var c=a.X-b.X,e=a.Y-b.Y;return c*c+e*e};d.Clipper.DistanceFromLineSqrd=function(a,b,c){var e=b.Y-c.Y;c=c.X-b.X;b=e*b.X+c*b.Y;b=e*a.X+c*a.Y-b;return b*b/(e*e+c*c)};d.Clipper.SlopesNearCollinear=function(a,b,c,e){return d.Clipper.DistanceFromLineSqrd(b,a,c)<e};d.Clipper.PointsAreClose=
function(a,b,c){var e=a.X-b.X;a=a.Y-b.Y;return e*e+a*a<=c};d.Clipper.ExcludeOp=function(a){var b=a.Prev;b.Next=a.Next;a.Next.Prev=b;b.Idx=0;return b};d.Clipper.CleanPolygon=function(a,b){"undefined"==typeof b&&(b=1.415);var c=a.length;if(0==c)return[];for(var e=Array(c),f=0;f<c;++f)e[f]=new d.OutPt;for(f=0;f<c;++f)e[f].Pt=a[f],e[f].Next=e[(f+1)%c],e[f].Next.Prev=e[f],e[f].Idx=0;f=b*b;for(e=e[0];0==e.Idx&&e.Next!=e.Prev;)d.Clipper.PointsAreClose(e.Pt,e.Prev.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):d.Clipper.PointsAreClose(e.Prev.Pt,
e.Next.Pt,f)?(d.Clipper.ExcludeOp(e.Next),e=d.Clipper.ExcludeOp(e),c-=2):d.Clipper.SlopesNearCollinear(e.Prev.Pt,e.Pt,e.Next.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):(e.Idx=1,e=e.Next);3>c&&(c=0);for(var g=Array(c),f=0;f<c;++f)g[f]=new d.IntPoint(e.Pt),e=e.Next;return g};d.Clipper.CleanPolygons=function(a,b){for(var c=Array(a.length),e=0,f=a.length;e<f;e++)c[e]=d.Clipper.CleanPolygon(a[e],b);return c};d.Clipper.Minkowski=function(a,b,c,e){var f=e?1:0,g=a.length,h=b.length;e=[];if(c)for(c=0;c<h;c++){for(var k=
Array(g),n=0,m=a.length,l=a[n];n<m;n++,l=a[n])k[n]=new d.IntPoint(b[c].X+l.X,b[c].Y+l.Y);e.push(k)}else for(c=0;c<h;c++){k=Array(g);n=0;m=a.length;for(l=a[n];n<m;n++,l=a[n])k[n]=new d.IntPoint(b[c].X-l.X,b[c].Y-l.Y);e.push(k)}a=[];for(c=0;c<=h-2+f;c++)for(n=0;n<=g-1;n++)b=[],b.push(e[c%h][n%g]),b.push(e[(c+1)%h][n%g]),b.push(e[(c+1)%h][(n+1)%g]),b.push(e[c%h][(n+1)%g]),d.Clipper.Orientation(b)||b.reverse(),a.push(b);f=new d.Clipper(0);f.AddPaths(a,d.PolyType.ptSubject,!0);f.Execute(d.ClipType.ctUnion,
e,d.PolyFillType.pftNonZero,d.PolyFillType.pftNonZero);return e};d.Clipper.MinkowskiSum=function(a,b,c){return d.Clipper.Minkowski(a,b,!0,c)};d.Clipper.MinkowskiDiff=function(a,b,c){return d.Clipper.Minkowski(a,b,!1,c)};d.Clipper.PolyTreeToPaths=function(a){var b=[];d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntAny,b);return b};d.Clipper.AddPolyNodeToPaths=function(a,b,c){var e=!0;switch(b){case d.Clipper.NodeType.ntOpen:return;case d.Clipper.NodeType.ntClosed:e=!a.IsOpen}0<a.m_polygon.length&&
e&&c.push(a.m_polygon);e=0;a=a.Childs();for(var f=a.length,g=a[e];e<f;e++,g=a[e])d.Clipper.AddPolyNodeToPaths(g,b,c)};d.Clipper.OpenPathsFromPolyTree=function(a){for(var b=new d.Paths,c=0,e=a.ChildCount();c<e;c++)a.Childs()[c].IsOpen&&b.push(a.Childs()[c].m_polygon);return b};d.Clipper.ClosedPathsFromPolyTree=function(a){var b=new d.Paths;d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntClosed,b);return b};L(d.Clipper,d.ClipperBase);d.Clipper.NodeType={ntAny:0,ntOpen:1,ntClosed:2};d.ClipperOffset=
function(a,b){"undefined"==typeof a&&(a=2);"undefined"==typeof b&&(b=d.ClipperOffset.def_arc_tolerance);this.m_destPolys=new d.Paths;this.m_srcPoly=new d.Path;this.m_destPoly=new d.Path;this.m_normals=[];this.m_StepsPerRad=this.m_miterLim=this.m_cos=this.m_sin=this.m_sinA=this.m_delta=0;this.m_lowest=new d.IntPoint;this.m_polyNodes=new d.PolyNode;this.MiterLimit=a;this.ArcTolerance=b;this.m_lowest.X=-1};d.ClipperOffset.two_pi=6.28318530717959;d.ClipperOffset.def_arc_tolerance=0.25;d.ClipperOffset.prototype.Clear=
function(){d.Clear(this.m_polyNodes.Childs());this.m_lowest.X=-1};d.ClipperOffset.Round=d.Clipper.Round;d.ClipperOffset.prototype.AddPath=function(a,b,c){var e=a.length-1;if(!(0>e)){var f=new d.PolyNode;f.m_jointype=b;f.m_endtype=c;if(c==d.EndType.etClosedLine||c==d.EndType.etClosedPolygon)for(;0<e&&d.IntPoint.op_Equality(a[0],a[e]);)e--;f.m_polygon.push(a[0]);var g=0;b=0;for(var h=1;h<=e;h++)d.IntPoint.op_Inequality(f.m_polygon[g],a[h])&&(g++,f.m_polygon.push(a[h]),a[h].Y>f.m_polygon[b].Y||a[h].Y==
f.m_polygon[b].Y&&a[h].X<f.m_polygon[b].X)&&(b=g);if(!(c==d.EndType.etClosedPolygon&&2>g||c!=d.EndType.etClosedPolygon&&0>g)&&(this.m_polyNodes.AddChild(f),c==d.EndType.etClosedPolygon))if(0>this.m_lowest.X)this.m_lowest=new d.IntPoint(0,b);else if(a=this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y],f.m_polygon[b].Y>a.Y||f.m_polygon[b].Y==a.Y&&f.m_polygon[b].X<a.X)this.m_lowest=new d.IntPoint(this.m_polyNodes.ChildCount()-1,b)}};d.ClipperOffset.prototype.AddPaths=function(a,b,
c){for(var e=0,d=a.length;e<d;e++)this.AddPath(a[e],b,c)};d.ClipperOffset.prototype.FixOrientations=function(){if(0<=this.m_lowest.X&&!d.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))for(var a=0;a<this.m_polyNodes.ChildCount();a++){var b=this.m_polyNodes.Childs()[a];(b.m_endtype==d.EndType.etClosedPolygon||b.m_endtype==d.EndType.etClosedLine&&d.Clipper.Orientation(b.m_polygon))&&b.m_polygon.reverse()}else for(a=0;a<this.m_polyNodes.ChildCount();a++)b=this.m_polyNodes.Childs()[a],
b.m_endtype!=d.EndType.etClosedLine||d.Clipper.Orientation(b.m_polygon)||b.m_polygon.reverse()};d.ClipperOffset.GetUnitNormal=function(a,b){var c=b.X-a.X,e=b.Y-a.Y;if(0==c&&0==e)return new d.DoublePoint(0,0);var f=1/Math.sqrt(c*c+e*e);return new d.DoublePoint(e*f,-(c*f))};d.ClipperOffset.prototype.DoOffset=function(a){this.m_destPolys=[];this.m_delta=a;if(d.ClipperBase.near_zero(a))for(var b=0;b<this.m_polyNodes.ChildCount();b++){var c=this.m_polyNodes.Childs()[b];c.m_endtype==d.EndType.etClosedPolygon&&
this.m_destPolys.push(c.m_polygon)}else{this.m_miterLim=2<this.MiterLimit?2/(this.MiterLimit*this.MiterLimit):0.5;var b=0>=this.ArcTolerance?d.ClipperOffset.def_arc_tolerance:this.ArcTolerance>Math.abs(a)*d.ClipperOffset.def_arc_tolerance?Math.abs(a)*d.ClipperOffset.def_arc_tolerance:this.ArcTolerance,e=3.14159265358979/Math.acos(1-b/Math.abs(a));this.m_sin=Math.sin(d.ClipperOffset.two_pi/e);this.m_cos=Math.cos(d.ClipperOffset.two_pi/e);this.m_StepsPerRad=e/d.ClipperOffset.two_pi;0>a&&(this.m_sin=
-this.m_sin);for(b=0;b<this.m_polyNodes.ChildCount();b++){c=this.m_polyNodes.Childs()[b];this.m_srcPoly=c.m_polygon;var f=this.m_srcPoly.length;if(!(0==f||0>=a&&(3>f||c.m_endtype!=d.EndType.etClosedPolygon))){this.m_destPoly=[];if(1==f)if(c.m_jointype==d.JoinType.jtRound)for(var c=1,f=0,g=1;g<=e;g++){this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a)));var h=c,c=c*this.m_cos-this.m_sin*f,f=h*this.m_sin+f*this.m_cos}else for(f=
c=-1,g=0;4>g;++g)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a))),0>c?c=1:0>f?f=1:c=-1;else{for(g=this.m_normals.length=0;g<f-1;g++)this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[g],this.m_srcPoly[g+1]));c.m_endtype==d.EndType.etClosedLine||c.m_endtype==d.EndType.etClosedPolygon?this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[f-1],this.m_srcPoly[0])):this.m_normals.push(new d.DoublePoint(this.m_normals[f-
2]));if(c.m_endtype==d.EndType.etClosedPolygon)for(h=f-1,g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);else if(c.m_endtype==d.EndType.etClosedLine){h=f-1;for(g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);this.m_destPolys.push(this.m_destPoly);this.m_destPoly=[];h=this.m_normals[f-1];for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-h.X,-h.Y);h=0;for(g=f-1;0<=g;g--)h=this.OffsetPoint(g,h,c.m_jointype)}else{h=
0;for(g=1;g<f-1;++g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(g=f-1,h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X+this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y+this.m_normals[g].Y*a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X-this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y-this.m_normals[g].Y*a)),this.m_destPoly.push(h)):(g=f-1,h=f-2,this.m_sinA=0,this.m_normals[g]=new d.DoublePoint(-this.m_normals[g].X,
-this.m_normals[g].Y),c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(g,h):this.DoRound(g,h));for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-this.m_normals[1].X,-this.m_normals[1].Y);h=f-1;for(g=h-1;0<g;--g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X-this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y-this.m_normals[0].Y*
a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+this.m_normals[0].Y*a)),this.m_destPoly.push(h)):(this.m_sinA=0,c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(0,1):this.DoRound(0,1))}}this.m_destPolys.push(this.m_destPoly)}}}};d.ClipperOffset.prototype.Execute=function(){var a=arguments;if(a[0]instanceof d.PolyTree)if(b=a[0],c=a[1],b.Clear(),this.FixOrientations(),this.DoOffset(c),a=new d.Clipper(0),
a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0),0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else if(c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path,e.push(new d.IntPoint(c.left-10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.top-10)),e.push(new d.IntPoint(c.left-10,c.top-10)),a.AddPath(e,d.PolyType.ptSubject,!0),a.ReverseSolution=!0,a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative),
1==b.ChildCount()&&0<b.Childs()[0].ChildCount())for(a=b.Childs()[0],b.Childs()[0]=a.Childs()[0],c=1;c<a.ChildCount();c++)b.AddChild(a.Childs()[c]);else b.Clear();else{var b=a[0],c=a[1];d.Clear(b);this.FixOrientations();this.DoOffset(c);a=new d.Clipper(0);a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0);if(0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else{var c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path;e.push(new d.IntPoint(c.left-10,c.bottom+
10));e.push(new d.IntPoint(c.right+10,c.bottom+10));e.push(new d.IntPoint(c.right+10,c.top-10));e.push(new d.IntPoint(c.left-10,c.top-10));a.AddPath(e,d.PolyType.ptSubject,!0);a.ReverseSolution=!0;a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative);0<b.length&&b.splice(0,1)}}};d.ClipperOffset.prototype.OffsetPoint=function(a,b,c){this.m_sinA=this.m_normals[b].X*this.m_normals[a].Y-this.m_normals[a].X*this.m_normals[b].Y;if(5E-5>this.m_sinA&&-5E-5<this.m_sinA)return b;
1<this.m_sinA?this.m_sinA=1:-1>this.m_sinA&&(this.m_sinA=-1);if(0>this.m_sinA*this.m_delta)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[b].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[b].Y*this.m_delta))),this.m_destPoly.push(new d.IntPoint(this.m_srcPoly[a])),this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*
this.m_delta)));else switch(c){case d.JoinType.jtMiter:c=1+(this.m_normals[a].X*this.m_normals[b].X+this.m_normals[a].Y*this.m_normals[b].Y);c>=this.m_miterLim?this.DoMiter(a,b,c):this.DoSquare(a,b);break;case d.JoinType.jtSquare:this.DoSquare(a,b);break;case d.JoinType.jtRound:this.DoRound(a,b)}return a};d.ClipperOffset.prototype.DoSquare=function(a,b){var c=Math.tan(Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y)/4);this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
this.m_delta*(this.m_normals[b].X-this.m_normals[b].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[b].Y+this.m_normals[b].X*c))));this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_delta*(this.m_normals[a].X+this.m_normals[a].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[a].Y-this.m_normals[a].X*c))))};d.ClipperOffset.prototype.DoMiter=function(a,b,c){c=this.m_delta/c;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
(this.m_normals[b].X+this.m_normals[a].X)*c),d.ClipperOffset.Round(this.m_srcPoly[a].Y+(this.m_normals[b].Y+this.m_normals[a].Y)*c)))};d.ClipperOffset.prototype.DoRound=function(a,b){for(var c=Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y),c=d.Cast_Int32(d.ClipperOffset.Round(this.m_StepsPerRad*Math.abs(c))),e=this.m_normals[b].X,f=this.m_normals[b].Y,g,h=0;h<c;++h)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+
e*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+f*this.m_delta))),g=e,e=e*this.m_cos-this.m_sin*f,f=g*this.m_sin+f*this.m_cos;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*this.m_delta)))};d.Error=function(a){try{throw Error(a);}catch(b){alert(b.message)}};d.JS={};d.JS.AreaOfPolygon=function(a,b){b||(b=1);return d.Clipper.Area(a)/(b*b)};d.JS.AreaOfPolygons=function(a,
b){b||(b=1);for(var c=0,e=0;e<a.length;e++)c+=d.Clipper.Area(a[e]);return c/(b*b)};d.JS.BoundsOfPath=function(a,b){return d.JS.BoundsOfPaths([a],b)};d.JS.BoundsOfPaths=function(a,b){b||(b=1);var c=d.Clipper.GetBounds(a);c.left/=b;c.bottom/=b;c.right/=b;c.top/=b;return c};d.JS.Clean=function(a,b){if(!(a instanceof Array))return[];var c=a[0]instanceof Array;a=d.JS.Clone(a);if("number"!=typeof b||null===b)return d.Error("Delta is not a number in Clean()."),a;if(0===a.length||1==a.length&&0===a[0].length||
0>b)return a;c||(a=[a]);for(var e=a.length,f,g,h,k,n,m,l,p=[],q=0;q<e;q++)if(g=a[q],f=g.length,0!==f)if(3>f)h=g,p.push(h);else{h=g;k=b*b;n=g[0];for(l=m=1;l<f;l++)(g[l].X-n.X)*(g[l].X-n.X)+(g[l].Y-n.Y)*(g[l].Y-n.Y)<=k||(h[m]=g[l],n=g[l],m++);n=g[m-1];(g[0].X-n.X)*(g[0].X-n.X)+(g[0].Y-n.Y)*(g[0].Y-n.Y)<=k&&m--;m<f&&h.splice(m,f-m);h.length&&p.push(h)}!c&&p.length?p=p[0]:c||0!==p.length?c&&0===p.length&&(p=[[]]):p=[];return p};d.JS.Clone=function(a){if(!(a instanceof Array)||0===a.length)return[];if(1==
a.length&&0===a[0].length)return[[]];var b=a[0]instanceof Array;b||(a=[a]);var c=a.length,e,d,g,h,k=Array(c);for(d=0;d<c;d++){e=a[d].length;h=Array(e);for(g=0;g<e;g++)h[g]={X:a[d][g].X,Y:a[d][g].Y};k[d]=h}b||(k=k[0]);return k};d.JS.Lighten=function(a,b){if(!(a instanceof Array))return[];if("number"!=typeof b||null===b)return d.Error("Tolerance is not a number in Lighten()."),d.JS.Clone(a);if(0===a.length||1==a.length&&0===a[0].length||0>b)return d.JS.Clone(a);a[0]instanceof Array||(a=[a]);var c,e,
f,g,h,k,l,m,p,q,r,s,t,u,v,y=a.length,z=b*b,x=[];for(c=0;c<y;c++)if(f=a[c],k=f.length,0!=k){for(g=0;1E6>g;g++){h=[];k=f.length;f[k-1].X!=f[0].X||f[k-1].Y!=f[0].Y?(r=1,f.push({X:f[0].X,Y:f[0].Y}),k=f.length):r=0;q=[];for(e=0;e<k-2;e++){l=f[e];p=f[e+1];m=f[e+2];u=l.X;v=l.Y;l=m.X-u;s=m.Y-v;if(0!==l||0!==s)t=((p.X-u)*l+(p.Y-v)*s)/(l*l+s*s),1<t?(u=m.X,v=m.Y):0<t&&(u+=l*t,v+=s*t);l=p.X-u;s=p.Y-v;m=l*l+s*s;m<=z&&(q[e+1]=1,e++)}h.push({X:f[0].X,Y:f[0].Y});for(e=1;e<k-1;e++)q[e]||h.push({X:f[e].X,Y:f[e].Y});
h.push({X:f[k-1].X,Y:f[k-1].Y});r&&f.pop();if(q.length)f=h;else break}k=h.length;h[k-1].X==h[0].X&&h[k-1].Y==h[0].Y&&h.pop();2<h.length&&x.push(h)}!(a[0]instanceof Array)&&(x=x[0]);"undefined"==typeof x&&(x=[[]]);return x};d.JS.PerimeterOfPath=function(a,b,c){if("undefined"==typeof a)return 0;var e=Math.sqrt,d=0,g,h,k=0,l=g=0;h=0;var m=a.length;if(2>m)return 0;b&&(a[m]=a[0],m++);for(;--m;)g=a[m],k=g.X,g=g.Y,h=a[m-1],l=h.X,h=h.Y,d+=e((k-l)*(k-l)+(g-h)*(g-h));b&&a.pop();return d/c};d.JS.PerimeterOfPaths=
function(a,b,c){c||(c=1);for(var e=0,f=0;f<a.length;f++)e+=d.JS.PerimeterOfPath(a[f],b,c);return e};d.JS.ScaleDownPath=function(a,b){var c,e;b||(b=1);for(c=a.length;c--;)e=a[c],e.X/=b,e.Y/=b};d.JS.ScaleDownPaths=function(a,b){var c,e,d;b||(b=1);for(c=a.length;c--;)for(e=a[c].length;e--;)d=a[c][e],d.X/=b,d.Y/=b};d.JS.ScaleUpPath=function(a,b){var c,d,f=Math.round;b||(b=1);for(c=a.length;c--;)d=a[c],d.X=f(d.X*b),d.Y=f(d.Y*b)};d.JS.ScaleUpPaths=function(a,b){var c,d,f,g=Math.round;b||(b=1);for(c=a.length;c--;)for(d=
a[c].length;d--;)f=a[c][d],f.X=g(f.X*b),f.Y=g(f.Y*b)};d.ExPolygons=function(){return[]};d.ExPolygon=function(){this.holes=this.outer=null};d.JS.AddOuterPolyNodeToExPolygons=function(a,b){var c=new d.ExPolygon;c.outer=a.Contour();var e=a.Childs(),f=e.length;c.holes=Array(f);var g,h,k,l,m;for(h=0;h<f;h++)for(g=e[h],c.holes[h]=g.Contour(),k=0,l=g.Childs(),m=l.length;k<m;k++)g=l[k],d.JS.AddOuterPolyNodeToExPolygons(g,b);b.push(c)};d.JS.ExPolygonsToPaths=function(a){var b,c,e,f,g=new d.Paths;b=0;for(e=
a.length;b<e;b++)for(g.push(a[b].outer),c=0,f=a[b].holes.length;c<f;c++)g.push(a[b].holes[c]);return g};d.JS.PolyTreeToExPolygons=function(a){var b=new d.ExPolygons,c,e,f;c=0;e=a.Childs();for(f=e.length;c<f;c++)a=e[c],d.JS.AddOuterPolyNodeToExPolygons(a,b);return b}})();
var createCindy = (function() {
            "use strict";

            var debugStartup = false;

            var waitCount = -1;

            var toStart = [];

            // waitFor returns a callback which will decrement the waitCount
            function waitFor(name) {
                if (waitCount === 0) {
                    console.error("Waiting for " + name + " after we finished waiting.");
                    return function() {};
                }
                if (waitCount < 0)
                    waitCount = 0;
                if (debugStartup)
                    console.log("Start waiting for " + name);
                ++waitCount;
                return function() {
                    if (debugStartup)
                        console.log("Done waiting for " + name);
                    --waitCount;
                    if (waitCount < 0) {
                        console.error("Wait count mismatch: " + name);
                    }
                    if (waitCount === 0) {
                        var i = 0,
                            n = toStart.length;
                        if (debugStartup)
                            console.log("Done waiting, starting " + n + " instances:");
                        while (i < n)
                            toStart[i++].startup();
                    }
                };
            }

            if (typeof document !== "undefined" && typeof window !== "undefined" &&
                typeof document.addEventListener !== "undefined" &&
                (typeof window.cindyDontWait === "undefined" ||
                    window.cindyDontWait !== true)) {
                document.addEventListener("DOMContentLoaded", waitFor("DOMContentLoaded"));
            }

            function createCindy(data) {
                var instance = createCindy.newInstance(data);
                if (waitCount <= 0) instance.startup();
                else if (data.autostart !== false) toStart.push(instance);
                return instance;
            }

            var baseDir = null;
            var cindyJsScriptElement = null;
            var waitingForLoad = {};

            createCindy.getBaseDir = function() {
                if (baseDir !== null)
                    return baseDir;
                var scripts = document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length; ++i) {
                    var script = scripts[i];
                    var src = script.src;
                    if (!src) continue;
                    var match = /Cindy\.js$/.exec(src);
                    if (match) {
                        baseDir = src.substr(0, match.index);
                        console.log("Will load extensions from " + baseDir);
                        cindyJsScriptElement = script;
                        return baseDir;
                    }
                }
                console.error("Could not find <script> tag for Cindy.js");
                baseDir = cindyJsScriptElement = false;
                return baseDir;
            };

            createCindy.addNewScript = function(path, onerror) {
                if (!onerror) onerror = console.error.bind(console);
                var baseDir = createCindy.getBaseDir();
                if (baseDir === false) {
                    return false;
                }
                var elt = document.createElement("script");
                elt.src = baseDir + path;
                var next = cindyJsScriptElement.nextSibling;
                var parent = cindyJsScriptElement.parentElement;
                if (next)
                    parent.insertBefore(elt, next);
                else
                    parent.appendChild(elt);
                return elt;
            };

            createCindy.loadScript = function(name, path, onload, onerror) {
                if (window[name]) {
                    onload();
                    return true;
                }
                if (!onerror) onerror = console.error.bind(console);
                var elt = waitingForLoad[name];
                if (!elt) {
                    elt = createCindy.addNewScript(path, onerror);
                    if (elt === false) {
                        onerror("Can't load additional components.");
                        return false;
                    }
                    waitingForLoad[name] = elt;
                }
                elt.addEventListener("load", onload);
                elt.addEventListener("error", onerror);
                return null;
            };

            createCindy._autoLoadingPlugin = {};

            createCindy.autoLoadPlugin = function(name, path, onload) {
                if (createCindy._pluginRegistry[name]) {
                    onload();
                    return true;
                }
                var listeners = createCindy._autoLoadingPlugin[name];
                if (!listeners) {
                    if (!path) path = name + "-plugin.js";
                    listeners = createCindy._autoLoadingPlugin[name] = [];
                    var elt = createCindy.addNewScript(path);
                    if (elt === false) {
                        return false;
                    }
                    elt.addEventListener("error", console.error.bind(console));
                }
                listeners.push(onload);
                return null;
            };

            createCindy.waitFor = waitFor;
            createCindy._pluginRegistry = {};
            createCindy.instances = [];
            createCindy.registerPlugin = function(apiVersion, pluginName, initCallback) {
                if (apiVersion !== 1) {
                    console.error("Plugin API version " + apiVersion + " not supported");
                    return false;
                }
                createCindy._pluginRegistry[pluginName] = initCallback;
                var listeners = createCindy._autoLoadingPlugin[pluginName] || [];
                listeners.forEach(function(callback) {
                    callback();
                });
            };
            createCindy.newInstance = function(instanceInvocationArguments) {
var createCindy = this; // since this will be turned into a method

var csconsole;
var cslib;

var cscompiled = {};

var csanimating = false;
var csstopped = true;
var csticking = false;
var csscale = 1;
var csgridsize = 0;
var csgridscript;
var cssnap = false;

function dump(a) {
    console.log(JSON.stringify(a));
}

function dumpcs(a) {
    console.log(niceprint(a));

    if (a.ctype !== "undefined") {
        csconsole.out(niceprint(a));
    }
}

function evalcs(a) {
    var prog = evaluator.parse$1([General.wrap(a)], []);
    var erg = evaluate(prog);
    dumpcs(erg);
}


function evokeCS(code) {
    var cscode = condense(code);

    var parsed = analyse(cscode, false);
    console.log(parsed);
    evaluate(parsed);
    updateCindy();
}


function initialTransformation(trafos) {
    if (trafos) {
        for (var i = 0; i < trafos.length; i++) {
            var trafo = trafos[i];
            var trname = Object.keys(trafo)[0];
            if (trname === "scale") {
                csscale = trafo.scale;
                csport[trname](trafo.scale);
            }
            if (trname === "translate") {
                csport[trname](trafo.translate[0], trafo.translate[1]);
            }
            if (trname === "scaleAndOrigin") {
                csscale = trafo[trname][0] / 25;
                csport[trname].apply(null, trafo[trname]);
            }
            if (trname === "visibleRect") {
                csport[trname].apply(null, trafo[trname]);
                csscale = csport.drawingstate.initialmatrix.a / 25;
            }
        }
        csport.createnewbackup();
    }
}

// hook to allow instrumented versions to replace or augment the canvas object
var haveCanvas = function(canvas) {
    return canvas;
};

var csmouse, csctx, csw, csh, csgeo, images;

function createCindyNow() {
    startupCalled = true;
    if (waitForPlugins !== 0) return;
    var data = instanceInvocationArguments;
    if (data.csconsole !== undefined)
        csconsole = data.csconsole;

    setupConsole();

    csmouse = [100, 100];
    var cscode;
    var c = null;
    var trafos = data.transform;
    if (data.ports) {
        if (data.ports.length > 0) {
            var port = data.ports[0];
            c = port.element;
            if (!c)
                c = document.getElementById(port.id);
            if (port.fill === "window") {
                c.setAttribute("width", window.innerWidth);
                c.setAttribute("height", window.innerHeight);
                // TODO: dynamic resizing on window change
            } else if (port.width && port.height) {
                c.setAttribute("width", port.width);
                c.setAttribute("height", port.height);
            }
            if (port.background)
                c.style.backgroundColor = port.background;
            if (port.transform !== undefined)
                trafos = port.transform;
        }
    }
    if (!c) {
        c = data.canvas;
        if (!c && typeof document !== "undefined")
            c = document.getElementById(data.canvasname);
    }
    if (c) {
        c = haveCanvas(c);
        csctx = c.getContext("2d");
        if (!csctx.setLineDash)
            csctx.setLineDash = function() {};
    }

    //Run initialscript
    cscode = condense(initialscript);
    var iscr = analyse(cscode, false);
    evaluate(iscr);

    //Setup the scripts
    var scripts = ["move", "keydown",
        "mousedown", "mouseup", "mousedrag",
        "init", "tick", "draw",
        "simulationstep", "cssimulationstart", "cssimulationstop"
    ];
    var scriptconf = data.scripts,
        scriptpat = null;
    if (typeof scriptconf === "string" && scriptconf.search(/\*/))
        scriptpat = scriptconf;
    if (typeof scriptconf !== "object")
        scriptconf = null;

    scripts.forEach(function(s) {
        var cscode;
        if (scriptconf !== null && scriptconf[s]) {
            cscode = scriptconf[s];
        } else {
            var sname = s + "script";
            if (data[sname]) {
                cscode = document.getElementById(data[sname]);
            } else if (scriptpat) {
                cscode = document.getElementById(scriptpat.replace(/\*/, s));
                if (!cscode)
                    return;
            } else {
                return;
            }
            cscode = cscode.text;
        }
        cscode = condense(cscode);
        cscode = analyse(cscode, false);
        if (cscode.ctype === "error") {
            console.error(
                "Error compiling " + s + " script: " +
                cscode.message
            );
        } else {
            cscompiled[s] = cscode;
        }
    });

    //Setup canvasstuff
    if (data.grid && data.grid !== 0) {
        csgridsize = data.grid;
        csgridscript = analyse('#drawgrid(' + csgridsize + ')', false);
    }
    if (data.snap) cssnap = data.snap;

    if (c) {
        csw = c.width;
        csh = c.height;
        initialTransformation(trafos);
        csport.drawingstate.matrix.ty = csport.drawingstate.matrix.ty - csh;
        csport.drawingstate.initialmatrix.ty = csport.drawingstate.initialmatrix.ty - csh;
        var devicePixelRatio = 1;
        if (typeof window !== "undefined" && window.devicePixelRatio)
            devicePixelRatio = window.devicePixelRatio;
        var backingStoreRatio =
            csctx.webkitBackingStorePixelRatio ||
            csctx.mozBackingStorePixelRatio ||
            csctx.msBackingStorePixelRatio ||
            csctx.oBackingStorePixelRatio ||
            csctx.backingStorePixelRatio ||
            1;
        if (devicePixelRatio !== backingStoreRatio) {
            var ratio = devicePixelRatio / backingStoreRatio;
            c.width = csw * ratio;
            c.height = csh * ratio;
            if (!c.style.width)
                c.style.width = csw + "px";
            if (!c.style.height)
                c.style.height = csh + "px";
            csctx.scale(ratio, ratio);
        }
    }

    csgeo = {};

    var i = 0;
    images = {};

    //Read Geometry
    if (!data.geometry) {
        data.geometry = [];
    }
    csinit(data.geometry);

    //Read Geometry
    if (!data.behavior) {
        data.behavior = [];
    }
    if (typeof csinitphys === 'function')
        csinitphys(data.behavior);

    //Read images: TODO ordentlich machen
    for (var k in data.images) {
        var name = data.images[k];
        images[k] = new Image();
        images[k].ready = false;
        /*jshint -W083 */
        images[k].onload = function() {
            images[k].ready = true;
            updateCindy();


        };
        /*jshint +W083 */
        images[k].src = name;
    }

    globalInstance.canvas = c;

    // Invoke oninit callback
    if (data.oninit)
        data.oninit(globalInstance);

    if (data.exclusive) {
        i = createCindy.instances.length;
        while (i > 0)
            createCindy.instances[--i].shutdown();
    }
    createCindy.instances.push(globalInstance);
    if (instanceInvocationArguments.use)
        instanceInvocationArguments.use.forEach(function(name) {
            evaluator.use$1([General.wrap(name)], {});
        });
    loadExtraModules();
    doneLoadingModule();
}

function loadExtraModules() {
    if (usedFunctions.convexhull3d$1)
        loadExtraPlugin("quickhull3d", "quickhull3d/quickhull3d.nocache.js");
}

var modulesToLoad = 1;

function loadExtraPlugin(name, path) {
    var cb = null;
    if (instanceInvocationArguments.plugins)
        cb = instanceInvocationArguments.plugins[name];
    if (!cb)
        cb = createCindy._pluginRegistry[name];
    if (cb) {
        evaluator.use$1([General.wrap(name)], {});
        return;
    }
    ++modulesToLoad;
    createCindy.autoLoadPlugin(name, path, function() {
        evaluator.use$1([General.wrap(name)], {});
        doneLoadingModule();
    });
}

function loadExtraModule(name, path) {
    ++modulesToLoad;
    createCindy.loadScript(name, path, doneLoadingModule, function() {
        console.error(
            "Failed to load " + path + ", can't start CindyJS instance");
        shutdown();
    });
}

function doneLoadingModule() {
    if (--modulesToLoad !== 0)
        return;

    //Evaluate Init script
    evaluate(cscompiled.init);

    if (instanceInvocationArguments.autoplay)
        csplay();

    if (globalInstance.canvas)
        setuplisteners(globalInstance.canvas, instanceInvocationArguments);
}

var backup = null;

function backupGeo() {
    var state = stateArrays.backup;
    state.set(stateIn);
    var speeds = {};
    for (var i = 0; i < csgeo.points.length; i++) {
        var el = csgeo.points[i];
        if (typeof(el.behavior) !== 'undefined') {
            speeds[el.name] = [
                el.behavior.vx,
                el.behavior.vy,
                el.behavior.vz
            ];
        }
    }
    backup = {
        state: state,
        speeds: speeds
    };
}


function restoreGeo() {
    if (backup === null)
        return;
    stateIn.set(backup.state);
    Object.keys(backup.speeds).forEach(function(name) {
        var el = csgeo.csnames[name];
        if (typeof(el.behavior) !== 'undefined') { //TODO Diese Physics Reset ist FALSCH
            var speed = backup.speeds[name];
            el.behavior.vx = speed[0];
            el.behavior.vy = speed[1];
            el.behavior.vz = speed[2];
            el.behavior.fx = 0;
            el.behavior.fy = 0;
            el.behavior.fz = 0;
        }
    });
    recalcAll();
}


function csplay() {
    if (!csanimating) { // stop or pause state
        if (csstopped) { // stop state
            backupGeo();
            csstopped = false;
        }
        if (typeof csinitphys === 'function') {
            if (csPhysicsInited) {
                csreinitphys(behaviors);
            }
        }

        csanimating = true;
        startit();
    }
}

function cspause() {
    if (csanimating) {
        csanimating = false;
    }
}

function csstop() {
    if (!csstopped) {
        csanimating = false; // might already be false
        csstopped = true;
        restoreGeo();
    }
}

var initialscript =
    '           #drawgrid(s):=(' +
    '              regional(b,xmin,xmax,ymin,ymax,nx,ny);' +
    '              b=screenbounds();' +
    '              xmin=b_4_1-s;' +
    '              xmax=b_2_1+s;' +
    '              ymin=b_4_2-s;' +
    '              ymax=b_2_2+s;' +
    '              nx=round((xmax-xmin)/s);' +
    '              ny=round((ymax-ymin)/s);' +
    '              xmin=floor(xmin/s)*s;' +
    '              ymin=floor(ymin/s)*s;' +
    '              repeat(nx,x,' +
    '                 draw((xmin+x*s,ymin),(xmin+x*s,ymax),color->(1,1,1)*.9,size->1);' +
    '              );' +
    '              repeat(ny,y,' +
    '                 draw((xmin,ymin+y*s),(xmax,ymin+y*s),color->(1,1,1)*.9,size->1);' +
    '              ) ' +
    '           );';

var shutdownHooks = [];
var isShutDown = false;

function shutdown() {
    if (isShutDown)
        return; // ignore multiple calls
    isShutDown = true;
    // console.log("Shutting down");

    // Remove this from the list of all running instances
    var n = createCindy.instances.length;
    while (n > 0) {
        if (createCindy.instances[--n] === globalInstance) {
            createCindy.instances.splice(n, 1);
            break;
        }
    }

    // Call hooks in reverse order
    n = shutdownHooks.length;
    while (n > 0) {
        try {
            shutdownHooks[--n]();
        } catch (e) {
            console.error(e);
        }
    }
}

// The following object will be returned from the public createCindy function.
// Its startup method will be called automatically unless specified otherwise.
var globalInstance = {
    "config": instanceInvocationArguments,
    "startup": createCindyNow,
    "shutdown": shutdown,
    "evokeCS": evokeCS,
    "play": csplay,
    "pause": cspause,
    "stop": csstop,
    "evalcs": function(code) {
        return evaluate(analyse(condense(code), false));
    },
    "niceprint": niceprint,
    "canvas": null, // will be set during startup
};

var startupCalled = false;
var waitForPlugins = 0;
if (instanceInvocationArguments.use) {
    instanceInvocationArguments.use.forEach(function(name) {
        var cb = null;
        if (instanceInvocationArguments.plugins)
            cb = instanceInvocationArguments.plugins[name];
        if (!cb)
            cb = createCindy._pluginRegistry[name];
        if (!cb) {
            ++waitForPlugins;
            console.log("Loading script for plugin " + name);
            createCindy.loadScript(name + "-plugin", name + "-plugin.js", function() {
                console.log("Successfully loaded plugin " + name);
                if (--waitForPlugins === 0 && startupCalled) createCindyNow();
            }, function() {
                console.error("Failed to auto-load plugin " + name);
                if (--waitForPlugins === 0 && startupCalled) createCindyNow();
            });
        }
    });
}

//
// CONSOLE
//
function setupConsole() {
    if (csconsole === null) {
        csconsole = new NullConsoleHandler();
    } else if (csconsole === true) {
        csconsole = new CindyConsoleHandler();
    } else if (typeof csconsole === "string") {
        csconsole = new ElementConsoleHandler(csconsole);
    } else if (typeof csconsole === "object" && typeof csconsole.appendChild === "function") {
        csconsole = new ElementConsoleHandler(csconsole);
    } else {
        // Default
        csconsole = new NullConsoleHandler();
    }
}

function GenericConsoleHandler(args) {

    this.in = function(s, preventNewline) {
        console.log(s);

        if (preventNewline) {
            this.append(this.createTextNode("span", "blue", s));

        } else {
            this.append(this.createTextNode("p", "blue", s));
        }
    };

    this.out = function(s, preventNewline) {
        console.log(s);

        if (preventNewline) {
            this.append(this.createTextNode("span", "red", s));

        } else {
            this.append(this.createTextNode("p", "red", s));
        }
    };

    this.err = function(s, preventNewline) {
        console.log(s);

        if (preventNewline) {
            this.append(this.createTextNode("span", "red", s));

        } else {
            this.append(this.createTextNode("p", "red", s));
        }
    };

    this.createTextNode = function(tagName, color, s) {
        if (typeof document !== "undefined") {
            var element = document.createElement(tagName);
            element.appendChild(document.createTextNode(s));
            element.style.color = color;

            return element;
        }

        return s + "\n";
    };
}

function CindyConsoleHandler() {

    var that = this;
    var cmd;
    var container = document.createElement("div");
    var log;

    container.innerHTML = (
        '<div id="console" style="border-top: 1px solid #333333; bottom: 0px; position: absolute; width: 100%;">' +
        '<div id="log" style="height: 150px; overflow-y: auto;"></div>' +
        '<input id="cmd" type="text" style="box-sizing: border-box; height: 30px; width: 100%;">' +
        '</div>'
    );

    document.body.appendChild(container);

    cmd = document.getElementById("cmd");
    log = document.getElementById("log");

    cmd.onkeydown = function(evt) {
        if (evt.keyCode !== 13 || cmd.value === "") {
            return;
        }

        that.in(cmd.value);

        evalcs(cmd.value);

        cmd.value = "";

        log.scrollTop = log.scrollHeight;
    };

    this.append = function(s) {
        log.appendChild(s);
    };

    this.clear = function() {
        log.innerHTML = "";
    };
}

CindyConsoleHandler.prototype = new GenericConsoleHandler();

function ElementConsoleHandler(idOrElement) {

    var element = idOrElement;
    if (typeof idOrElement === "string") {
        element = document.getElementById(idOrElement);
    }

    this.append = function(s) {
        element.appendChild(s);
    };

    this.clear = function() {
        element.innerHTML = "";
    };
}

ElementConsoleHandler.prototype = new GenericConsoleHandler();

function NullConsoleHandler() {

    this.append = function(s) {
        // Do nothing
    };

    this.clear = function() {
        // Do nothing
    };
}

NullConsoleHandler.prototype = new GenericConsoleHandler();
var mouse = {};
var move;

var cskey = "";
var cskeycode = 0;


function getmover(mouse) {
    var mov = null;
    var adist = 1000000;
    var diff;
    for (var i = 0; i < csgeo.free.length; i++) {
        var el = csgeo.free[i];
        if (el.pinned || el.visible === false)
            continue;

        var dx, dy, dist;
        var sc = csport.drawingstate.matrix.sdet;
        if (el.kind === "P") {
            var p = List.normalizeZ(el.homog);
            if (!List._helper.isAlmostReal(p))
                continue;
            dx = p.value[0].value.real - mouse.x;
            dy = p.value[1].value.real - mouse.y;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (el.narrow & dist > 20 / sc) dist = 10000;
        } else if (el.kind === "C") { //Must be CircleMr
            var mid = csgeo.csnames[el.args[0]];
            var rad = el.radius;
            var xx = CSNumber.div(mid.homog.value[0], mid.homog.value[2]).value.real;
            var yy = CSNumber.div(mid.homog.value[1], mid.homog.value[2]).value.real;
            dx = xx - mouse.x;
            dy = yy - mouse.y;
            var ref = Math.sqrt(dx * dx + dy * dy);
            dist = ref - rad.value.real;
            dx = 0;
            dy = 0;
            if (dist < 0) {
                dist = -dist;
            }
            dist = dist + 30 / sc;

        } else if (el.kind === "L") { //Must be ThroughPoint(Horizontal/Vertical not treated yet)
            var l = el.homog;
            var N = CSNumber;
            var nn = N.add(N.mult(l.value[0], N.conjugate(l.value[0])),
                N.mult(l.value[1], N.conjugate(l.value[1])));
            var ln = List.scaldiv(N.sqrt(nn), l);
            dist = ln.value[0].value.real * mouse.x + ln.value[1].value.real * mouse.y + ln.value[2].value.real;
            dx = -ln.value[0].value.real * dist;
            dy = -ln.value[1].value.real * dist;

            if (dist < 0) {
                dist = -dist;
            }
            dist = dist + 1;
        }

        if (dist < adist + 0.2 / sc) { //A bit a dirty hack, prefers new points
            adist = dist;
            mov = el;
            diff = {
                x: dx,
                y: dy
            };
        }
    }
    console.log("Moving " + (mov ? mov.name : "nothing"));
    if (mov === null)
        return null;
    return {
        mover: mov,
        offset: diff,
        prev: {
            x: mouse.x,
            y: mouse.y
        }
    };
}

function addAutoCleaningEventListener(target, type, listener, useCapture) {
    if (useCapture === undefined)
        useCapture = false;
    shutdownHooks.push(function() {
        target.removeEventListener(type, listener, useCapture);
    });
    target.addEventListener(type, listener, useCapture);
}

function setuplisteners(canvas, data) {

    var MO = null;
    if (typeof MutationObserver !== "undefined")
        MO = MutationObserver;
    if (!MO && typeof WebKitMutationObserver !== "undefined")
        MO = WebKitMutationObserver; // jshint ignore: line
    if (MO) {
        MO = new MO(function(mutations) {
            // Browsers which support MutationObserver likely support contains
            if (!document.body.contains(canvas))
                shutdown();
        });
        MO.observe(document.documentElement, {
            "childList": true,
            "subtree": true
        });
        shutdownHooks.push(function() {
            MO.disconnect();
        });
    } else {
        addAutoCleaningEventListener(canvas, "DOMNodeRemovedFromDocument", shutdown);
        addAutoCleaningEventListener(canvas, "DOMNodeRemoved", shutdown);
    }

    function updatePostition(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left - canvas.clientLeft + 0.5;
        var y = event.clientY - rect.top - canvas.clientTop + 0.5;
        var pos = csport.to(x, y);
        mouse.prevx = mouse.x;
        mouse.prevy = mouse.y;
        mouse.x = pos[0];
        mouse.y = pos[1];
        csmouse[0] = mouse.x;
        csmouse[1] = mouse.y;
        mouse.moved = true;
    }

    if (data.keylistener === true) {
        addAutoCleaningEventListener(document, "keydown", function(e) {
            cs_keypressed(e);
            return false;
        });
    } else if (cscompiled.keydown) {
        canvas.setAttribute("tabindex", "0");
        addAutoCleaningEventListener(canvas, "mousedown", function() {
            canvas.focus();
        });
        addAutoCleaningEventListener(canvas, "keydown", function(e) {
            // console.log("Got key " + e.charCode + " / " + e.keyCode);
            if (e.keyCode !== 9 /* tab */ ) {
                cs_keypressed(e);
                e.preventDefault();
            }
        });
    }

    addAutoCleaningEventListener(canvas, "mousedown", function(e) {
        mouse.button = e.which;
        updatePostition(e);
        cs_mousedown();
        move = getmover(mouse);
        startit(); //starts d3-timer

        mouse.down = true;
        e.preventDefault();
    });

    addAutoCleaningEventListener(canvas, "mouseup", function(e) {
        mouse.down = false;
        cindy_cancelmove();
        stateContinueFromHere();
        cs_mouseup();
        updateCindy();
        e.preventDefault();
    });

    addAutoCleaningEventListener(canvas, "mousemove", function(e) {
        updatePostition(e);
        if (mouse.down) {
            cs_mousedrag();
        } else {
            cs_mousemove();
        }
        e.preventDefault();
    });


    function touchMove(e) {
        updatePostition(e.targetTouches[0]);
        if (mouse.down) {
            cs_mousedrag();
        } else {
            cs_mousemove();
        }
        e.preventDefault();
    }

    function touchDown(e) {
        updatePostition(e.targetTouches[0]);
        cs_mousedown();
        mouse.down = true;
        move = getmover(mouse);
        startit();
        e.preventDefault();
    }

    function touchUp(e) {
        mouse.down = false;
        cindy_cancelmove();
        stateContinueFromHere();
        updateCindy();
        cs_mouseup();
        e.preventDefault();
    }

    addAutoCleaningEventListener(canvas, "touchstart", touchDown, false);
    addAutoCleaningEventListener(canvas, "touchmove", touchMove, true);
    addAutoCleaningEventListener(canvas, "touchend", touchUp, false);
    if (typeof document !== "undefined" && document.body) {
        addAutoCleaningEventListener(document.body, "touchcancel", touchUp, false);
        // addAutoCleaningEventListener(document.body, "mouseup", mouseUp, false);
    }

    updateCindy();
}


var requestAnimFrame;
if (instanceInvocationArguments.isNode) {
    requestAnimFrame = process.nextTick; // jshint ignore:line
} else {
    requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            //                window.setTimeout(callback, 1000 / 60);
            window.setTimeout(callback, 0);
        };
}

function doit() { //Callback for d3-timer
    if (isShutDown) return true;
    if (csanimating) {
        cs_tick();
    }
    if (csanimating || mouse.moved) {
        mouse.moved = false;
        updateCindy();
    }
    csticking = csanimating || mouse.down;
    return !csticking;
}

function startit() {
    if (!csticking) {
        csticking = true;
        d3.timer(doit);
    }
}

function updateCindy() {
    csport.reset();
    csctx.save();
    csctx.clearRect(0, 0, csw, csh);
    if (csgridsize !== 0)
        evaluate(csgridscript);
    traceMouseAndScripts();
    //   console.log("NOW UPDATING");
    //  drawgrid();
    csport.greset();
    draw_traces();
    render();
    csctx.restore();
}

function update() {
    if (isShutDown) return;
    updateCindy();
    if (mouse.down)
        requestAnimFrame(update);
}


function cs_keypressed(e) {
    var evtobj = window.event ? event : e;
    var unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;
    var actualkey = String.fromCharCode(unicode);
    cskey = actualkey;
    cskeycode = unicode;


    evaluate(cscompiled.keydown);
    updateCindy();

}

function cs_mousedown(e) {
    evaluate(cscompiled.mousedown);

}

function cs_mouseup(e) {
    evaluate(cscompiled.mouseup);

}


function cs_mousedrag(e) {
    evaluate(cscompiled.mousedrag);

}


function cs_mousemove(e) {
    evaluate(cscompiled.mousemove);

}

function cs_tick(e) {
    if (csPhysicsInited) { //TODO: Check here if physics is required
        if (typeof(lab) !== 'undefined') {
            lab.tick();
        }
    }
    if (csanimating) {
        evaluate(cscompiled.tick);
    }

}

function cs_simulationstep(e) {
    evaluate(cscompiled.simulationstep);
}

function cs_simulationstart(e) {
    evaluate(cscompiled.simulationstart);
}

function cs_simulationstop(e) {
    evaluate(cscompiled.simulationstop);
}


function cindy_cancelmove() {
    move = undefined;
}
var d3_arraySlice = [].slice,
    d3_window,
    d3_array = function(list) {
        return d3_arraySlice.call(list);
    };


if (!instanceInvocationArguments.isNode) {
    var d3_document = document,
        d3_documentElement = d3_document.documentElement;
    d3_window = window;

    // Redefine d3_array if the browser doesn’t support slice-based conversion.
    try {
        d3_array(d3_documentElement.childNodes)[0].nodeType; // jshint ignore:line
    } catch (e) {
        d3_array = function(list) {
            var i = list.length,
                array = new Array(i);
            while (i--) array[i] = list[i];
            return array;
        };
    }
}


function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.substring(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
        var prefixName = d3_vendorPrefixes[i] + name;
        if (prefixName in object) return prefixName;
    }
}

var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];

var d3 = {};

var d3_timer_queueHead,
    d3_timer_queueTail,
    d3_timer_interval, // is an interval (or frame) active?
    d3_timer_timeout, // is a timeout active?
    d3_timer_active, // active timer object
    d3_timer_frame = (!instanceInvocationArguments.isNode && d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")]) || function(callback) {
        setTimeout(callback, 17);
    };

// The timer will continue to fire until callback returns true.
d3.timer = function(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();

    // Add the callback to the tail of the queue.
    var time = then + delay,
        timer = {
            c: callback,
            t: time,
            f: false,
            n: null
        };
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer;
    else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;

    // Start animatin'!
    if (!d3_timer_interval) {
        d3_timer_timeout = clearTimeout(d3_timer_timeout);
        d3_timer_interval = 1;
        d3_timer_frame(d3_timer_step);
    }
};

function d3_timer_step() {
    var now = d3_timer_mark(),
        delay = d3_timer_sweep() - now;
    if (delay > 24) {
        if (isFinite(delay)) {
            clearTimeout(d3_timer_timeout);
            d3_timer_timeout = setTimeout(d3_timer_step, delay);
        }
        d3_timer_interval = 0;
    } else {
        d3_timer_interval = 1;
        d3_timer_frame(d3_timer_step);
    }
}

d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
};

function d3_timer_mark() {
    var now = Date.now();
    d3_timer_active = d3_timer_queueHead;
    while (d3_timer_active) {
        if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);
        d3_timer_active = d3_timer_active.n;
    }
    return now;
}

// Flush after callbacks to avoid concurrent queue modification.
// Returns the time of the earliest active timer, post-sweep.
function d3_timer_sweep() {
    var t0,
        t1 = d3_timer_queueHead,
        time = Infinity;
    while (t1) {
        if (t1.f) {
            t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
        } else {
            if (t1.t < time) time = t1.t;
            t1 = (t0 = t1).n;
        }
    }
    d3_timer_queueTail = t0;
    return time;
}
//==========================================
//      Namespace and Vars
//==========================================


/** @constructor */
function Nada() {
    this.ctype = 'undefined';
}
/** @constructor */
function Void() {
    this.ctype = 'void';
}
/** @constructor */
function CError(msg) {
    this.ctype = 'error';
    this.message = msg;
}
var nada = new Nada();
var unset = new Nada(); // to distinguish variables set to nada from those which were never set

/** @constructor */
function Namespace() {
    this.vars = {
        'pi': {
            'ctype': 'variable',
            'stack': [{
                'ctype': 'number',
                'value': {
                    'real': Math.PI,
                    'imag': 0
                }
            }],
            'name': 'pi'
        },
        'i': {
            'ctype': 'variable',
            'stack': [{
                'ctype': 'number',
                'value': {
                    'real': 0,
                    'imag': 1
                }
            }],
            'name': 'i'
        },
        'true': {
            'ctype': 'variable',
            'stack': [{
                'ctype': 'boolean',
                'value': true
            }],
            'name': 'true'
        },
        'false': {
            'ctype': 'variable',
            'stack': [{
                'ctype': 'boolean',
                'value': false
            }],
            'name': 'false'
        },
        '#': {
            'ctype': 'variable',
            'stack': [nada],
            'name': '#'
        }
    };
    this.isVariable = function(a) {
        return this.vars[a] !== undefined;

    };

    this.isVariableName = function(a) { //TODO will man das so? Den ' noch dazu machen

        if (a === '#') return true;
        if (a === '#1') return true;
        if (a === '#2') return true;

        var b0 = /^[a-z,A-Z]+$/.test(a[0]);
        var b1 = /^[0-9,a-z,A-Z]+$/.test(a);
        return b0 && b1;
    };

    this.create = function(code) {
        var v = {
            'ctype': 'variable',
            'stack': [unset],
            'name': code
        };
        this.vars[code] = v;
        return v;
    };

    this.newvar = function(code) {
        var v = this.vars[code];
        v.stack.push(nada); // nada not unset for deeper levels
        return v;
    };

    this.removevar = function(code) {
        var stack = this.vars[code].stack;
        if (stack.length === 0) console.error("Removing non-existing " + code);
        stack.pop();
        if (stack.length === 0) console.warn("Removing last " + code);
    };


    this.setvar = function(code, val) {
        var stack = this.vars[code].stack;
        if (stack.length === 0) console.error("Setting non-existing variable " + code);
        if (val === undefined) {
            console.error("Setting variable " + code + " to undefined value");
            val = nada;
        }
        if (val.ctype === 'undefined') {
            stack[stack.length - 1] = val;
            return;
        }
        var erg = val;
        if (erg === unset) erg = nada; // explicite setting does lift unset state
        stack[stack.length - 1] = erg;
    };

    /* // Apparently unused
    this.setvarnocopy= function(code,val) {
        var stack=this.vars[code].stack;
        if (stack.length === 0) console.error("Setting non-existing variable " + code);
        stack[stack.length-1]=val;
    };
    */

    this.undefinedWarning = {};

    this.getvar = function(code) {

        var stack = this.vars[code].stack;
        if (stack.length === 0) console.error("Getting non-existing variable " + code);
        var erg = stack[stack.length - 1];
        if (erg === unset) {
            if (csgeo.csnames[code] !== undefined) {
                return {
                    'ctype': 'geo',
                    'value': csgeo.csnames[code]
                };
            } else {
                if (console && console.log && this.undefinedWarning[code] === undefined) {
                    this.undefinedWarning[code] = true;
                    console.log("Warning: Accessing undefined variable: " + code);
                }
            }
            return nada;
        }
        return erg;
    };

    this.dump = function(code) {
        var stack = this.vars[code].stack;
        console.log("*** Dump " + code);

        for (var i = 0; i < stack.length; i++) {
            console.log(i + ":> " + niceprint(stack[i]));

        }

    };

    this.vstack = [];

    this.pushVstack = function(v) {
        this.vstack.push(v);

    };
    this.popVstack = function() {
        this.vstack.pop();
    };

    this.cleanVstack = function() {
        var st = this.vstack;
        while (st.length > 0 && st[st.length - 1] !== "*") {
            this.removevar(st[st.length - 1]);
            st.pop();
        }
        if (st.length > 0) {
            st.pop();
        }
    };


}

var namespace = new Namespace();
//*************************************************************
// and here are the accessors for properties and elements
//*************************************************************

var Accessor = {};

Accessor.generalFields = { //Übersetungstafel der Feldnamen 
    color: "color",
    colorhsb: "",
    size: "size",
    alpha: "alpha",
    isshowing: "isshowing",
    visible: "visible",
    name: "name",
    caption: "caption",
    trace: "trace",
    tracelength: "",
    selected: ""
};

Accessor.getGeoField = function(geoname, field) {
    if (typeof csgeo.csnames[geoname] !== 'undefined') {
        return Accessor.getField(csgeo.csnames[geoname], field);
    }
    return nada;
};


Accessor.setGeoField = function(geoname, field, value) {
    if (typeof csgeo.csnames[geoname] !== 'undefined') {
        return Accessor.setField(csgeo.csnames[geoname], field, value);
    }
    return nada;
};


Accessor.getField = function(geo, field) {
    var erg;
    if (geo.kind === "P") {
        if (field === "xy") {
            var xx = CSNumber.div(geo.homog.value[0], geo.homog.value[2]);
            var yy = CSNumber.div(geo.homog.value[1], geo.homog.value[2]);
            erg = List.turnIntoCSList([xx, yy]);
            return General.withUsage(erg, "Point");
        }

        if (field === "homog") {
            return General.withUsage(geo.homog, "Point");
        }


        if (field === "x") {
            return CSNumber.div(geo.homog.value[0], geo.homog.value[2]);
        }

        if (field === "y") {
            return CSNumber.div(geo.homog.value[1], geo.homog.value[2]);
        }
    }
    if (geo.kind === "L") {
        if (field === "homog") {
            return General.withUsage(geo.homog, "Line");
        }
        if (field === "angle") {
            erg = List.eucangle(List.ey, geo.homog);
            return General.withUsage(erg, "Angle");
        }

    }
    if (geo.kind === "Tr") {
        if (field === "matrix") {
            return geo.matrix;
        }
    }
    if (geo.kind === "C") {
        if (field === "radius") { //Assumes that we have a circle
            var s = geo.matrix;
            var ax = s.value[0].value[0];
            var az = s.value[0].value[2];
            var bz = s.value[1].value[2];
            var cz = s.value[2].value[2];


            var n = CSNumber.mult(ax, ax);
            var aa = CSNumber.div(az, ax);
            var bb = CSNumber.div(bz, ax);
            var cc = CSNumber.div(cz, ax);
            erg = CSNumber.sqrt(CSNumber.sub(CSNumber.add(CSNumber.mult(aa, aa),
                    CSNumber.mult(bb, bb)),
                cc));

            return erg;
        }
    }

    if (Accessor.generalFields[field]) { //must be defined an an actual string
        erg = geo[Accessor.generalFields[field]];
        if (erg) {
            return erg;
        } else
            return nada;
    }
    //Accessors for masses
    if (geo.behavior) {
        if (field === "mass" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.mass);
        }
        if (field === "radius" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.radius);
        }
        if (field === "charge" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.charge);
        }
        if (field === "friction" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.friction);
        }
        if (field === "vx" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.vx);
        }
        if (field === "vy" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.vy);
        }
        if (field === "v" && geo.behavior.type === "Mass") {
            return List.realVector([geo.behavior.vx, geo.behavior.vy]);
        }
        if (field === "fx" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.fx);
        }
        if (field === "fy" && geo.behavior.type === "Mass") {
            return CSNumber.real(geo.behavior.fy);
        }
        if (field === "f" && geo.behavior.type === "Mass") {
            return List.realVector([geo.behavior.fx, geo.behavior.fy]);
        }

    }
    return nada;


};

Accessor.setField = function(geo, field, value) {

    if (field === "color") {
        geo.color = value;
    }
    if (field === "size") {
        geo.size = value;
    }
    if (field === "alpha") {
        geo.alpha = value;
    }
    if (field === "visible") {
        if (value.ctype === "boolean") {
            geo.visible = value.value;
        }
    }
    if (field === "pinned") {
        if (value.ctype === "boolean") {
            geo.pinned = value.value;
        }
    }
    if (field === "printlabel") {
        geo.printname = niceprint(value);
    }

    if (field === "xy" && geo.kind === "P" && geo.movable && List._helper.isNumberVecN(value, 2)) {
        movepointscr(geo, List.turnIntoCSList([value.value[0], value.value[1], CSNumber.real(1)]), "homog");
    }

    if (field === "x" && geo.kind === "P" && geo.movable && value.ctype === "number") {
        movepointscr(geo, List.turnIntoCSList([CSNumber.mult(value, geo.homog.value[2]), geo.homog.value[1], geo.homog.value[2]]), "homog");
    }

    if (field === "y" && geo.kind === "P" && geo.movable && value.ctype === "number") {
        movepointscr(geo, List.turnIntoCSList([geo.homog.value[0], CSNumber.mult(value, geo.homog.value[2]), geo.homog.value[2]]), "homog");
    }


    if (field === "homog" && geo.kind === "P" && geo.movable && List._helper.isNumberVecN(value, 3)) {
        movepointscr(geo, value, "homog");
    }

    if (field === "angle" && geo.type === "Through") {
        var cc = CSNumber.cos(value);
        var ss = CSNumber.sin(value);
        var dir = List.turnIntoCSList([cc, ss, CSNumber.real(0)]);
        movepointscr(geo, dir, "dir");
    }
    if (geo.behavior) {
        if (field === "mass" && geo.behavior.type === "Mass" && value.ctype === "number") {
            geo.behavior.mass = value.value.real;
        }
        if (field === "mass" && geo.behavior.type === "Sun" && value.ctype === "number") {
            geo.behavior.mass = value.value.real;
        }
        if (field === "friction" && geo.behavior.type === "Mass" && value.ctype === "number") {
            geo.behavior.friction = value.value.real;
        }
        if (field === "charge" && geo.behavior.type === "Mass" && value.ctype === "number") {
            geo.behavior.charge = value.value.real;
        }
        if (field === "radius" && geo.behavior.type === "Mass" && value.ctype === "number") {
            geo.behavior.radius = value.value.real;
        }
        if (field === "vx" && geo.behavior.type === "Mass" && value.ctype === "number") {
            geo.behavior.vx = value.value.real;
        }
        if (field === "vy" && geo.behavior.type === "Mass" && value.ctype === "number") {
            geo.behavior.vy = value.value.real;
        }
        if (field === "v" && geo.behavior.type === "Mass" && List._helper.isNumberVecN(value, 2)) {
            geo.behavior.vx = value.value[0].value.real;
            geo.behavior.vy = value.value[1].value.real;
        }
    }


};
//==========================================
//      Complex Numbers
//==========================================
var CSNumber = {};
CSNumber._helper = {};
CSNumber._helper.roundingfactor = 1e4;

CSNumber._helper.niceround = function(a) {
    return Math.round(a * CSNumber._helper.roundingfactor) /
        CSNumber._helper.roundingfactor;
};

CSNumber.niceprint = function(a) {
    if (a.usage === "Angle") {
        return CSNumber._helper.niceangle(a);
    }
    var real = CSNumber._helper.niceround(a.value.real);
    var imag = CSNumber._helper.niceround(a.value.imag);
    if (imag === 0) {
        return "" + real;
    }

    if (imag > 0) {
        return "" + real + " + i*" + imag;
    } else {
        return "" + real + " - i*" + (-imag);
    }
};

var angleUnit = instanceInvocationArguments.angleUnit || "°";
var angleUnitName = angleUnit.replace(/\s+/g, ""); // unit may contain space
var TWOPI = Math.PI * 2;
var PERTWOPI = 1 / TWOPI;
var angleUnits = {
    "rad": TWOPI,
    "°": 360,
    "deg": 360,
    "degree": 360,
    "gra": 400,
    "grad": 400,
    "turn": 1,
    "cyc": 1,
    "rev": 1,
    "rot": 1,
    "π": 2,
    "pi": 2,
    "quad": 4,
};

CSNumber._helper.niceangle = function(a) {
    var unit = angleUnits[angleUnitName];
    if (!unit)
        return CSNumber.niceprint(General.withUsage(a, null));
    if (typeof unit === "function")
        return unit(a);
    var num = CSNumber.niceprint(CSNumber.realmult(unit * PERTWOPI, a));
    if (num.indexOf("i*") === -1)
        return num + angleUnit;
    return "(" + num + ")" + angleUnit;
};

CSNumber.complex = function(r, i) {
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };
};

CSNumber.real = function(r) {
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': 0
        }
    };
};

CSNumber.zero = CSNumber.real(0);

CSNumber.one = CSNumber.real(1);

CSNumber._helper.input = function(a) {
    if (typeof a === "object")
        return CSNumber.complex(+a.r, +a.i);
    else
        return CSNumber.real(+a);
};

CSNumber.argmax = function(a, b) {
    var n1 = a.value.real * a.value.real + a.value.imag * a.value.imag;
    var n2 = b.value.real * b.value.real + b.value.imag * b.value.imag;
    return (n1 < n2 ? b : a);
};


CSNumber.max = function(a, b) {
    return {
        "ctype": "number",
        "value": {
            'real': Math.max(a.value.real, b.value.real),
            'imag': Math.max(a.value.imag, b.value.imag)
        }
    };
};


CSNumber.min = function(a, b) {
    return {
        "ctype": "number",
        "value": {
            'real': Math.min(a.value.real, b.value.real),
            'imag': Math.min(a.value.imag, b.value.imag)
        }
    };
};


CSNumber.add = function(a, b) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real + b.value.real,
            'imag': a.value.imag + b.value.imag
        }
    };
};

CSNumber.sub = function(a, b) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real - b.value.real,
            'imag': a.value.imag - b.value.imag
        }
    };
};

CSNumber.neg = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': -a.value.real,
            'imag': -a.value.imag
        }
    };
};


CSNumber.re = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real,
            'imag': 0
        }
    };
};

CSNumber.im = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.imag,
            'imag': 0
        }
    };
};

CSNumber.conjugate = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real,
            'imag': -a.value.imag
        }
    };
};


CSNumber.round = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': Math.round(a.value.real),
            'imag': Math.round(a.value.imag)
        }
    };
};

CSNumber.ceil = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': Math.ceil(a.value.real),
            'imag': Math.ceil(a.value.imag)
        }
    };
};

CSNumber.floor = function(a) {
    return {
        "ctype": "number",
        "value": {
            'real': Math.floor(a.value.real),
            'imag': Math.floor(a.value.imag)
        }
    };
};


CSNumber.mult = function(a, b) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real * b.value.real - a.value.imag * b.value.imag,
            'imag': a.value.real * b.value.imag + a.value.imag * b.value.real
        }
    };
};

CSNumber.realmult = function(r, c) {
    return {
        "ctype": "number",
        "value": {
            'real': r * c.value.real,
            'imag': r * c.value.imag
        }
    };
};

CSNumber.multiMult = function(arr) {
    var erg = arr[0];
    if (erg.ctype !== "number") return nada;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i].ctype !== "number") {
            return nada;
        }
        erg = CSNumber.mult(erg, arr[i]);
    }

    return erg;
};

// BUG?
// why do we have two argument but throw away the second argument?
CSNumber.abs2 = function(a, b) {
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real * a.value.real + a.value.imag * a.value.imag,
            'imag': 0
        }
    };
};

CSNumber.abs = function(a1) {
    return CSNumber.sqrt(CSNumber.abs2(a1));
};


CSNumber.inv = function(a) {
    var s = a.value.real * a.value.real + a.value.imag * a.value.imag;
    // BUG?
    // perhaps we should not only check for 0
    // if(Math.abs(s) < 1e32) {
    if (s === 0) {
        console.error("DIVISION BY ZERO");
        //        halt=immediately;

    }
    return {
        "ctype": "number",
        "value": {
            'real': a.value.real / s,
            'imag': -a.value.imag / s
        }
    };
};


CSNumber.div = function(a, b) {
    return CSNumber.mult(a, CSNumber.inv(b));
};

CSNumber.eps = 0.0000001;

CSNumber.snap = function(a) {
    var r = a.value.real;
    var i = a.value.imag;
    if (Math.floor(r + CSNumber.eps) !== Math.floor(r - CSNumber.eps)) {
        r = Math.round(r);
    }
    if (Math.floor(i + CSNumber.eps) !== Math.floor(i - CSNumber.eps)) {
        i = Math.round(i);
    }
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };

};

CSNumber.exp = function(a) {
    var n = Math.exp(a.value.real);
    var r = n * Math.cos(a.value.imag);
    var i = n * Math.sin(a.value.imag);
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };
};

CSNumber.cos = function(a) {
    var rr = a.value.real;
    var ii = a.value.imag;
    var n = Math.exp(ii);
    var imag1 = n * Math.sin(-rr);
    var real1 = n * Math.cos(-rr);
    n = Math.exp(-ii);
    var imag2 = n * Math.sin(rr);
    var real2 = n * Math.cos(rr);
    var i = (imag1 + imag2) / 2.0;
    var r = (real1 + real2) / 2.0;
    //  if (i * i < 1E-30) i = 0;
    //  if (r * r < 1E-30) r = 0;
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };
};

CSNumber.sin = function(a) {
    var rr = a.value.real;
    var ii = a.value.imag;
    var n = Math.exp(ii);
    var imag1 = n * Math.sin(-rr);
    var real1 = n * Math.cos(-rr);
    n = Math.exp(-ii);
    var imag2 = n * Math.sin(rr);
    var real2 = n * Math.cos(rr);
    var r = -(imag1 - imag2) / 2.0;
    var i = (real1 - real2) / 2.0;
    //  if (i * i < 1E-30) i = 0;
    //  if (r * r < 1E-30) r = 0;
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };
};

CSNumber.tan = function(a) {
    var s = CSNumber.sin(a);
    var c = CSNumber.cos(a);
    return CSNumber.div(s, c);
};

CSNumber.arccos = function(a) { //OK hässlich aber tuts.
    var t2 = CSNumber.mult(a, CSNumber.neg(a));
    var tmp = CSNumber.sqrt(CSNumber.add(CSNumber.real(1), t2));
    var tmp1 = CSNumber.add(CSNumber.mult(a, CSNumber.complex(0, 1)), tmp);
    var erg = CSNumber.add(CSNumber.mult(CSNumber.log(tmp1), CSNumber.complex(0, 1)), CSNumber.real(Math.PI * 0.5));
    return General.withUsage(erg, "Angle");
};

CSNumber.arcsin = function(a) { //OK hässlich aber tuts.
    var t2 = CSNumber.mult(a, CSNumber.neg(a));
    var tmp = CSNumber.sqrt(CSNumber.add(CSNumber.real(1), t2));
    var tmp1 = CSNumber.add(CSNumber.mult(a, CSNumber.complex(0, 1)), tmp);
    var erg = CSNumber.mult(CSNumber.log(tmp1), CSNumber.complex(0, -1));
    return General.withUsage(erg, "Angle");
};

CSNumber.arctan = function(a) { //OK hässlich aber tuts.
    var t1 = CSNumber.log(CSNumber.add(CSNumber.mult(a, CSNumber.complex(0, -1)), CSNumber.real(1)));
    var t2 = CSNumber.log(CSNumber.add(CSNumber.mult(a, CSNumber.complex(0, 1)), CSNumber.real(1)));
    var erg = CSNumber.mult(CSNumber.sub(t1, t2), CSNumber.complex(0, 0.5));
    return General.withUsage(erg, "Angle");
};


//Das ist jetzt genau so wie in Cindy.
//Da wurde das aber niemals voll auf complexe Zahlen umgestellt
//Bei Beiden Baustellen machen!!!
CSNumber.arctan2 = function(a, b) { //OK
    var erg = CSNumber.real(Math.atan2(b.value.real, a.value.real));
    return General.withUsage(erg, "Angle");
};


CSNumber.sqrt = function(a) {
    var rr = a.value.real;
    var ii = a.value.imag;
    var n = Math.sqrt(Math.sqrt(rr * rr + ii * ii));
    var w = Math.atan2(ii, rr);
    var i = n * Math.sin(w / 2);
    var r = n * Math.cos(w / 2);
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };
};

CSNumber.pow2 = function(a, b) {
    var rr = a.value.real;
    var ii = a.value.imag;
    var n = Math.pow(Math.sqrt(rr * rr + ii * ii), b);
    var w = Math.atan2(ii, rr);
    var i = n * Math.sin(w * b);
    var r = n * Math.cos(w * b);
    return {
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    };
};

CSNumber.log = function(a) {
    var re = a.value.real;
    var im = a.value.imag;
    var s = Math.sqrt(re * re + im * im);
    var i = im;


    var imag = Math.atan2(im, re);
    if (i < 0) {
        imag += (2 * Math.PI);
    }
    if (i === 0 && re < 0) {
        imag = Math.PI;
    }
    if (imag > Math.PI) {
        imag -= (2 * Math.PI);
    }
    var real = Math.log(s);

    return CSNumber.snap({
        "ctype": "number",
        "value": {
            'real': real,
            'imag': imag
        }
    });
};


CSNumber.pow = function(a, b) {

    //    if(a.value.real === 0 && a.value.imag === 0){
    //        return CSNumber.real(0);
    //    };

    if (b.value.real === Math.round(b.value.real) && b.value.imag === 0) { //TODO später mal effizienter machen
        var erg = {
            "ctype": "number",
            "value": {
                'real': 1,
                'imag': 0
            }
        };
        for (var i = 0; i < Math.abs(b.value.real); i++) {
            erg = CSNumber.mult(erg, a);
        }
        if (b.value.real < 0) {
            return CSNumber.inv(erg);
        }
        return (erg);

    }
    var res = CSNumber.exp(CSNumber.mult(CSNumber.log(a), b));
    return res;
};


CSNumber.mod = function(a, b) {
    var a1 = a.value.real;
    var a2 = b.value.real;
    var b1 = a.value.imag;
    var b2 = b.value.imag;


    var r = a1 - Math.floor(a1 / a2) * a2;
    var i = b1 - Math.floor(b1 / b2) * b2;
    if (a2 === 0) r = 0;
    if (b2 === 0) i = 0;

    return CSNumber.snap({
        "ctype": "number",
        "value": {
            'real': r,
            'imag': i
        }
    });
};


CSNumber._helper.seed = 'NO';
CSNumber.eps = 0.0000000001;
CSNumber.epsbig = 0.000001;

CSNumber._helper.seedrandom = function(a) {
    a = a - Math.floor(a);
    a = a * 0.8 + 0.1;
    CSNumber._helper.seed = a;
};

CSNumber._helper.rand = function() {
    if (CSNumber._helper.seed === 'NO') {
        return Math.random();
    }
    var a = CSNumber._helper.seed;
    a = Math.sin(1000 * a) * 1000;
    a = a - Math.floor(a);
    CSNumber._helper.seed = a;
    return a;
};

CSNumber._helper.randnormal = function() {
    var a = CSNumber._helper.rand();
    var b = CSNumber._helper.rand();
    return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b);
};


CSNumber._helper.isEqual = function(a, b) {
    return (a.value.real === b.value.real) && (a.value.imag === b.value.imag);
};

CSNumber._helper.isLessThan = function(a, b) {

    return (a.value.real < b.value.real ||
        (a.value.real === b.value.real && a.value.imag < b.value.imag));
};

CSNumber._helper.compare = function(a, b) {
    if (CSNumber._helper.isLessThan(a, b)) {
        return -1;
    }
    if (CSNumber._helper.isEqual(a, b)) {
        return 0;
    }
    return 1;
};

CSNumber._helper.isAlmostEqual = function(a, b, preci) {
    var eps = CSNumber.eps;
    if (typeof(preci) !== 'undefined') {
        eps = preci;
    }
    var r = a.value.real - b.value.real;
    var i = a.value.imag - b.value.imag;
    return (r < eps) && (r > -eps) && (i < eps) && (i > -eps);
};

CSNumber._helper.isZero = function(a) {
    return (a.value.real === 0) && (a.value.imag === 0);
};

CSNumber._helper.isAlmostZero = function(a) {
    var r = a.value.real;
    var i = a.value.imag;
    return (r < CSNumber.eps) && (r > -CSNumber.eps) && (i < CSNumber.eps) && (i > -CSNumber.eps);
};


CSNumber._helper.isReal = function(a) {
    return (a.value.imag === 0);
};

CSNumber._helper.isAlmostReal = function(a) {
    var i = a.value.imag;
    return (i < CSNumber.epsbig) && (i > -CSNumber.epsbig); //So gemacht wie in Cindy
};

CSNumber._helper.isNaN = function(a) {
    return (isNaN(a.value.real)) || (isNaN(a.value.imag));
};

CSNumber._helper.isFinite = function(z) {
    return isFinite(z.value.real) && isFinite(z.value.imag);
};


CSNumber._helper.isAlmostImag = function(a) {
    var r = a.value.real;
    return (r < CSNumber.epsbig) && (r > -CSNumber.epsbig); //So gemacht wie in Cindy
};

CSNumber._helper.z3a = CSNumber.complex(-0.5, 0.5 * Math.sqrt(3));
CSNumber._helper.z3b = CSNumber.complex(-0.5, -0.5 * Math.sqrt(3));
CSNumber._helper.cub1 = {
    "ctype": "list",
    "value": [CSNumber.one, CSNumber.one, CSNumber.one]
};
CSNumber._helper.cub2 = {
    "ctype": "list",
    "value": [CSNumber._helper.z3a, CSNumber.one, CSNumber._helper.z3b]
};
CSNumber._helper.cub3 = {
    "ctype": "list",
    "value": [CSNumber._helper.z3b, CSNumber.one, CSNumber._helper.z3a]
};

/* Solve the cubic equation ax^3 + bx^2 + cx + d = 0.
 * The result is a JavaScript array of three complex numbers satisfying that equation.
 */
CSNumber.solveCubic = function(a, b, c, d) {
    var help = CSNumber._helper.solveCubicHelper(a, b, c, d);
    return [
        List.scalproduct(CSNumber._helper.cub1, help),
        List.scalproduct(CSNumber._helper.cub2, help),
        List.scalproduct(CSNumber._helper.cub3, help)
    ];
};

/* Helps solving the cubic equation ax^3 + bx^2 + cx + d = 0.
 * The returned values are however NOT the solution itself.
 * If this function returns [y1, y2, y3] then the actual solutions are
 * x = z*y1 + y2 + z^2*y3 where z^3 = 1 i.e. z is any of three roots of unity
 */
CSNumber._helper.solveCubicHelper = function(a, b, c, d) {
    // mostly adapted from the cinderella2 source code

    var ar = a.value.real;
    var ai = a.value.imag;
    var br = b.value.real;
    var bi = b.value.imag;
    var cr = c.value.real;
    var ci = c.value.imag;
    var dr = d.value.real;
    var di = d.value.imag;

    var c1 = 1.25992104989487316476721060727822835057025; //2^(1/3)
    var c2 = 1.58740105196819947475170563927230826039149; //2^(2/3)

    // t1 = (4ac - b^2)

    var acr = ar * cr - ai * ci;
    var aci = ar * ci + ai * cr;

    var t1r = 4 * acr - (br * br - bi * bi);
    var t1i = 4 * aci - 2 * br * bi;

    // ab = ab
    var abr = ar * br - ai * bi;
    var abi = ar * bi + ai * br;

    // t3 = t1 *c - 18 ab * d = (4 ac - b*b)*c - 18 abd
    var t3r = t1r * cr - t1i * ci - 18 * (abr * dr - abi * di);
    var t3i = (t1r * ci + t1i * cr) - 18 * (abr * di + abi * dr);

    // aa = 27  a*a
    var aar = 27 * (ar * ar - ai * ai);
    var aai = 54 * (ai * ar);

    // aad =  aa *d = 27 aad
    var aadr = aar * dr - aai * di;
    var aadi = aar * di + aai * dr;

    // t1 = b^2
    var bbr = br * br - bi * bi;
    var bbi = 2 * br * bi;

    // w = b^3
    var wr = bbr * br - bbi * bi;
    var wi = bbr * bi + bbi * br;

    // t2 = aad + 4w = 27aad + 4bbb
    var t2r = aadr + 4 * wr;
    var t2i = aadi + 4 * wi;

    // t1 = 27 *(t3 * c + t2 *d)
    t1r = t3r * cr - t3i * ci + t2r * dr - t2i * di;
    t1i = t3r * ci + t3i * cr + t2r * di + t2i * dr;

    // DIS OK!!

    // w = -2 b^3
    wr *= -2;
    wi *= -2;

    // w = w + 9 a b c
    wr += 9 * (abr * cr - abi * ci);
    wi += 9 * (abr * ci + abi * cr);

    // w = w + -27 a*a d
    wr -= aadr;
    wi -= aadi;

    // t1 = (27 dis).Sqrt()
    t1r *= 27;
    t1i *= 27;
    t2r = Math.sqrt(Math.sqrt(t1r * t1r + t1i * t1i));
    t2i = Math.atan2(t1i, t1r);
    t1i = t2r * Math.sin(t2i / 2);
    t1r = t2r * Math.cos(t2i / 2);

    // w = w + a * dis // sqrt war schon oben
    wr += t1r * ar - t1i * ai;
    wi += t1r * ai + t1i * ar;

    // w ausgerechnet. Jetz w1 und w2
    //     w1.assign(wr,wi);
    //     w2.assign(wr,wi);
    //     w1.sqrt1_3();
    //     w2.sqrt2_3();
    var radius = Math.exp(Math.log(Math.sqrt(wr * wr + wi * wi)) / 3.0);
    var phi = Math.atan2(wi, wr);
    var w1i = radius * Math.sin(phi / 3);
    var w1r = radius * Math.cos(phi / 3);

    radius *= radius;
    phi *= 2;

    var w2i = radius * Math.sin(phi / 3);
    var w2r = radius * Math.cos(phi / 3);

    // x = 2 b^2
    // x = x - 6 ac
    var xr = 2 * bbr - 6 * acr;
    var xi = 2 * bbi - 6 * aci;

    //y.assign(-c2).mul(b).mul(w1);
    var yr = -c2 * (br * w1r - bi * w1i);
    var yi = -c2 * (br * w1i + bi * w1r);

    //    z.assign(c1).mul(w2);
    var zr = c1 * w2r;
    var zi = c1 * w2i;

    //w1.mul(a).mul(3).mul(c2);
    t1r = c2 * 3 * (w1r * ar - w1i * ai);
    t1i = c2 * 3 * (w1r * ai + w1i * ar);

    var s = t1r * t1r + t1i * t1i;

    t2r = (xr * t1r + xi * t1i) / s;
    t2i = (-xr * t1i + xi * t1r) / s;
    xr = t2r;
    xi = t2i;

    t2r = (yr * t1r + yi * t1i) / s;
    t2i = (-yr * t1i + yi * t1r) / s;
    yr = t2r;
    yi = t2i;

    t2r = (zr * t1r + zi * t1i) / s;
    t2i = (-zr * t1i + zi * t1r) / s;
    zr = t2r;
    zi = t2i;

    return List.turnIntoCSList([
        CSNumber.complex(xr, xi),
        CSNumber.complex(yr, yi),
        CSNumber.complex(zr, zi)
    ]);
};


//CSNumber._helper.solveCubicBlinn = function(alpha, beta, gamma, delta) {
//    // Blinn
//    var beta2 = CSNumber.mult(beta,beta);
//    var beta3 = CSNumber.mult(beta2,beta);
//    var gamma2 = CSNumber.mult(gamma,gamma);
//    var gamma3 = CSNumber.mult(gamma2,gamma);
//
//    var d1 = CSNumber.mult(alpha,gamma);
//    d1 = CSNumber.sub(d1, beta2);
//
//    var d2 = CSNumber.mult(alpha,delta);
//    d2 = CSNumber.sub(d2, CSNumber.mult(beta,gamma));
//
//    var d3 = CSNumber.mult(beta,delta);
//    d3 = CSNumber.sub(d3, gamma2);
//
//    var ldel = CSNumber.multiMult([CSNumber.real(4), d1, d3]);
//    ldel = CSNumber.sub(ldel, CSNumber.mult(d2,d2));
//
//    console.log("ldel", ldel.value.real);
//
//    var lambda, mu;
//    // large if else switch in paper
//    if(ldel.value.real < 0){
//        console.log("ldel value real < 0 true");
//        var abar;
//        var dbar;
//        var bbar;
//        var gbar;
//    
//        var ifone = CSNumber.sub(CSNumber.mult(beta3, delta), CSNumber.mult(alpha,gamma3));
//        //console.log("ifone", ifone);
//        if(ifone.value.real >= 0){
//        console.log("ifone value real >= 0 true");
//            abar = CSNumber.clone(alpha);
//            gbar = CSNumber.clone(d1);
//            dbar = CSNumber.add(CSNumber.multiMult([CSNumber.real(-2), beta,d1]), CSNumber.mult(alpha,d2));
//        }
//        else{
//        console.log("ifone value real >= 0 false");
//            abar = delta;
//            gbar = d3;
//            dbar = CSNumber.add(CSNumber.multiMult([CSNumber.real(-1), delta, d2]), CSNumber.multiMult([CSNumber.real(2), gamma, d3]));
//        }
//    
//        var signum = function(a){
//            if(a.value.real > 0) return CSNumber.real(1);
//            else return CSNumber.real(-1);
//        }
//    
//        var T0 = CSNumber.multiMult([CSNumber.real(-1), signum(dbar), CSNumber.abs(abar), CSNumber.sqrt(CSNumber.mult(CSNumber.real(-1), ldel))]);
//        var T1 = CSNumber.add(CSNumber.mult(CSNumber.real(-1), dbar), T0);
//    
//        var pp = CSNumber.pow2(CSNumber.mult(T1, CSNumber.real(0.5)), 1/3);
//    
//        var qq;
//        if(CSNumber.abs(T1, T0).value.real < 0.00000001){
//            console.log("p = -q");
//            qq = CSNumber.mult(CSNumber.real(-1), pp);
//        }
//        else {
//            console.log("p !!!!= -q");
//            qq = CSNumber.div(CSNumber.mult(CSNumber.real(-1),gbar), pp);
//        }
//    
//        var x1;
//        if(gbar.value.real <= 0){ 
//            console.log("gbar.value.real <= 0 true");
//            x1 = CSNumber.add(pp,qq);}
//        else {
//            console.log("gbar.value.real <= 0 false");
//            x1 = CSNumber.mult(CSNumber.real(-1), dbar);
//            var tmp = CSNumber.add(CSNumber.mult(pp,pp), CSNumber.mult(qq,qq));
//            tmp = CSNumber.add(tmp,gbar);
//            x1 = CSNumber.mult(x1, CSNumber.inv(tmp));
//        }
//    
//        var res1;
//        if(ifone.value.real >= 0) {
//            console.log("ifone.value.real >= 0 true")
//            res1 = [CSNumber.sub(x1, beta), alpha];
//        }
//        else {
//            console.log("ifone.value.real >= 0 false")
//            res1 = [CSNumber.mult(CSNumber.real(-1),delta), CSNumber.add(x1, gamma)];
//        }
//    
//        //console.log("res1", res1);
//        lambda = res1[0];
//        mu = res1[1];
//    }   //  if(ldel.value.real < 0)
//    else{
//console.log("ldel.value.real < 0 false");
//        // left side of Blinn's paper
//        //
//        var DAbar = CSNumber.add(CSNumber.multiMult([CSNumber.real(-2), beta, d1]), CSNumber.mult(alpha,d2));
//        var CAbar = CSNumber.clone(d1);
//
//        var sigA = CSNumber.arctan2(CSNumber.mult(alpha, CSNumber.sqrt(ldel)), CSNumber.mult(CSNumber.real(-1), DAbar));
//        sigA = CSNumber.mult(CSNumber.real(1/3), CSNumber.abs(sigA));
//
//        var CAsqrt = CSNumber.multiMult([CSNumber.real(2), CSNumber.sqrt(CSNumber.mult(CSNumber.real(-1), CAbar))]);
//
//        var x1A = CSNumber.mult(CAsqrt, CSNumber.cos(sigA));
//        var x3A = CSNumber.clone(CAsqrt);
//        var x3Ainner = CSNumber.mult(CSNumber.real(-0.5), CSNumber.cos(sigA));
//        // cos - sin
//        x3Ainner = CSNumber.add(x3Ainner, CSNumber.multiMult([CSNumber.real(-0.5), CSNumber.sqrt(CSNumber.real(3)), CSNumber.sin(sigA)]));
//        x3A = CSNumber.mult(CAsqrt, x3Ainner);
//
////        console.log("x1A, x3A, x3Ainner", x1A, x3A,x3Ainner);
//        var ifxa = CSNumber.sub(CSNumber.add(x1A, x3A), CSNumber.mult(CSNumber.real(2), beta));
//
//        var xL;
//        if(ifxa.value.real > 0){
//            console.log( "ifxa.value.real > 0 true");
//            xL = x1A;
//        }
//        else{
//            console.log( "ifxa.value.real > 0 false");
//            xL = x3A;
//        }
//
//        var resL = [CSNumber.sub(xL, beta), alpha];
//
//        // right side of Blinn's paper
//        //
//        var DDbar = CSNumber.add(CSNumber.multiMult([CSNumber.real(-1), delta, d2]), CSNumber.multiMult([CSNumber.real(2),gamma,d3]));
//        var CDbar = CSNumber.clone(d3);
//        var sigD = CSNumber.arctan2(CSNumber.mult(delta, CSNumber.sqrt(ldel)), CSNumber.mult(CSNumber.real(-1), DDbar));
//        sigD = CSNumber.mult(CSNumber.real(1/3), CSNumber.abs(sigD));
//
//        var CDsqrt = CSNumber.multiMult([CSNumber.real(2), CSNumber.sqrt(CSNumber.mult(CSNumber.real(-1), CDbar))]);
//
//        var x1D = CSNumber.mult(CDsqrt, CSNumber.cos(sigD));
//        var x3D = CSNumber.clone(CDsqrt);
//        // cos - sin
//        var x3Dinner = CSNumber.mult(CSNumber.real(-0.5), CSNumber.cos(sigD));
//        x3Dinner = CSNumber.add(x3Dinner, CSNumber.multiMult([CSNumber.real(-0.5), CSNumber.sqrt(CSNumber.real(3)), CSNumber.sin(sigA)]));
//        x3D = CSNumber.mult(CAsqrt,x3Dinner);
//
//        console.log("x1D, x3d, x3Dinner", x1D, x3D, x3Dinner);
//
//        var ifxs = CSNumber.sub(CSNumber.add(x1D, x3D), CSNumber.mult(CSNumber.real(2), gamma));
//
//        var xS;
//        if(ifxa.value.real < 0){
//            console.log("ifxa.value.real < 0 true");
//            xS = x1D;
//        }
//        else{
//            console.log("ifxa.value.real < 0 false");
//            xS = x3D;
//        }
//
//        var resS = [CSNumber.mult(CSNumber.real(-1), delta), CSNumber.add(xS, gamma)];
//
//
////        console.log("resL, resS", resL, resS);
//        // combine both -- lower end of Blinn's paper
//        var EE = CSNumber.mult(resL[1], resS[1]);
//        var FF = CSNumber.multiMult([CSNumber.real(-1), resL[0], resS[1]]);
//        FF = CSNumber.sub(FF, CSNumber.mult(resL[1], resS[0]));
//        var GG = CSNumber.mult(resL[0], resS[0]);
//
// //       console.log("ee, ff, gg", EE, FF, GG);
//        var resg1 = CSNumber.sub(CSNumber.mult(gamma, FF), CSNumber.mult(beta, GG));
//        var resg2 = CSNumber.sub(CSNumber.mult(gamma, EE), CSNumber.mult(beta, FF));
////        var regGes = [resg1, resg2];
//        lambda = resg1;
//        mu = resg2;
//
//        return [lambda, mu];
//
//    } // end else
//};
//==========================================
//      Lists
//==========================================
var List = {};
List._helper = {};

List.turnIntoCSList = function(l) {
    return {
        'ctype': 'list',
        'value': l
    };
};

List.realVector = function(l) {
    var erg = [];
    for (var i = 0; i < l.length; i++) {
        erg[i] = {
            "ctype": "number",
            "value": {
                'real': l[i],
                'imag': 0
            }
        };
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

// return n'th unitvector in C^d
List._helper.unitvector = function(d, n) {
    var res = List.zerovector(d);
    res.value[Math.floor(n.value.real - 1)] = CSNumber.real(1);
    return res;
};

List.idMatrix = function(n) {
    var erg = List.zeromatrix(n, n);
    var one = CSNumber.real(1);
    for (var i = 0; i < n.value.real; i++) erg.value[i].value[i] = one;
    return erg;
};


List._helper.flippedidMatrix = function(n) {
    var erg = List.zeromatrix(n, n);
    var one = CSNumber.real(1);
    for (var i = 0; i < n.value.real; i++) erg.value[i].value[n.value.real - i - 1] = one;

    return erg;
};

List.println = function(l) {
    var erg = [];
    for (var i = 0; i < l.value.length; i++) {
        if (l.value[i].ctype === "number") {
            erg[i] = CSNumber.niceprint(l.value[i]);
        } else if (l.value[i].ctype === "list") {
            List.println(l.value[i]);
        } else return nada;
    }

    if (l.value[0].ctype === "number")
        console.log(erg);
};

List.matrix = function(l) {
    return List.turnIntoCSList(l.map(List.turnIntoCSList));
};

List.realMatrix = function(l) {
    var len = l.length;
    var erg = new Array(len);
    for (var i = 0; i < len; i++) {
        erg[i] = List.realVector(l[i]);
    }
    return List.turnIntoCSList(erg);
};

List.ex = List.realVector([1, 0, 0]);
List.ey = List.realVector([0, 1, 0]);
List.ez = List.realVector([0, 0, 1]);


List.linfty = List.realVector([0, 0, 1]);

List.ii = List.turnIntoCSList([CSNumber.complex(1, 0),
    CSNumber.complex(0, 1),
    CSNumber.complex(0, 0)
]);

List.jj = List.turnIntoCSList([CSNumber.complex(1, 0),
    CSNumber.complex(0, -1),
    CSNumber.complex(0, 0)
]);


List.fundDual = List.realMatrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
]);
List.fund = List.realMatrix([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 1]
]);


List.sequence = function(a, b) {
    var erg = [];
    var ct = 0;
    for (var i = Math.round(a.value.real); i < Math.round(b.value.real) + 1; i++) {
        erg[ct] = {
            "ctype": "number",
            "value": {
                'real': i,
                'imag': 0
            }
        };
        ct++;
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

List.pairs = function(a) {
    var erg = [];
    for (var i = 0; i < a.value.length - 1; i++) {
        for (var j = i + 1; j < a.value.length; j++) {
            erg.push({
                'ctype': 'list',
                'value': [a.value[i], a.value[j]]
            });
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

List.triples = function(a) {
    var erg = [];
    for (var i = 0; i < a.value.length - 2; i++) {
        for (var j = i + 1; j < a.value.length - 1; j++) {
            for (var k = j + 1; k < a.value.length; k++) {
                erg.push({
                    'ctype': 'list',
                    'value': [a.value[i], a.value[j], a.value[k]]
                });
            }
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

List.cycle = function(a) {
    var erg = [];
    for (var i = 0; i < a.value.length - 1; i++) {
        erg[i] = {
            'ctype': 'list',
            'value': [a.value[i], a.value[i + 1]]
        };
    }
    erg.push({
        'ctype': 'list',
        'value': [a.value[a.value.length - 1], a.value[0]]
    });

    return {
        'ctype': 'list',
        'value': erg
    };
};

List.consecutive = function(a) {
    var erg = [];
    for (var i = 0; i < a.value.length - 1; i++) {
        erg[i] = {
            'ctype': 'list',
            'value': [a.value[i], a.value[i + 1]]
        };
    }

    return {
        'ctype': 'list',
        'value': erg
    };
};

List.reverse = function(a) {
    var erg = [];
    for (var i = a.value.length - 1; i >= 0; i--) {
        erg.push(a.value[i]);
    }

    return {
        'ctype': 'list',
        'value': erg
    };
};


List.directproduct = function(a, b) {
    var erg = [];
    for (var i = 0; i < a.value.length; i++) {
        for (var j = 0; j < b.value.length; j++) {
            erg.push({
                'ctype': 'list',
                'value': [a.value[i], b.value[j]]
            });
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.concat = function(a, b) {
    var erg = [];
    for (var i = 0; i < a.value.length; i++) {
        erg.push(a.value[i]);
    }
    for (var j = 0; j < b.value.length; j++) {
        erg.push(b.value[j]);
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.prepend = function(b, a) {
    var erg = [];
    erg[0] = b;

    for (var i = 0; i < a.value.length; i++) {
        erg[i + 1] = a.value[i];
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

List.append = function(a, b) {
    var erg = [];
    for (var i = 0; i < a.value.length; i++) {
        erg[i] = a.value[i];
    }
    erg.push(b);
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.contains = function(a, b) {
    var erg = [];
    var bb = false;
    for (var i = 0; i < a.value.length; i++) {
        var cc = a.value[i];
        if ((eval_helper.equals(cc, b)).value) {
            return {
                'ctype': 'boolean',
                'value': true
            };

        }
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


List.common = function(a, b) {
    var erg = [];
    var ct = 0;
    for (var i = 0; i < a.value.length; i++) {
        var bb = false;
        var cc = a.value[i];
        for (var j = 0; j < b.value.length; j++) {
            bb = bb || (eval_helper.equals(cc, b.value[j])).value;
        }
        if (bb) {
            erg[ct] = a.value[i];
            ct++;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

List.remove = function(a, b) {
    var erg = [];
    var ct = 0;
    for (var i = 0; i < a.value.length; i++) {
        var bb = false;
        var cc = a.value[i];
        for (var j = 0; j < b.value.length; j++) {
            bb = bb || (eval_helper.equals(cc, b.value[j])).value;
        }
        if (!bb) {
            erg[ct] = a.value[i];
            ct++;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};

List.sort1 = function(a) {
    var erg = a.value.slice();
    erg.sort(General.compare);
    return List.turnIntoCSList(erg);
};

List._helper.isEqual = function(a1, a2) {
    return List.equals(a1, a2).value;
};

List._helper.isLessThan = function(a, b) {

    var s1 = a.value.length;
    var s2 = b.value.length;
    var i = 0;

    while (!(i >= s1 || i >= s2 || !General.isEqual(a.value[i], b.value[i]))) {
        i++;
    }
    if (i === s1 && i < s2) return true;
    if (i === s2 && i < s1) return false;
    if (i === s1 && i === s2) return false;
    return General.isLessThan(a.value[i], b.value[i]);

};


List._helper.compare = function(a, b) {
    if (List._helper.isLessThan(a, b)) return -1;
    if (List._helper.isEqual(a, b)) return 0;
    return 1;
};

List.equals = function(a1, a2) {
    if (a1.value.length !== a2.value.length) {
        return {
            'ctype': 'boolean',
            'value': false
        };
    }
    var erg = true;
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];

        if (av1.ctype === 'list' && av2.ctype === 'list') {
            erg = erg && List.equals(av1, av2).value;
        } else {
            erg = erg && comp_equals([av1, av2], []).value;

        }
    }
    return {
        'ctype': 'boolean',
        'value': erg
    };
};

List.almostequals = function(a1, a2) {

    if (a1.value.length !== a2.value.length) {
        return {
            'ctype': 'boolean',
            'value': false
        };
    }
    var erg = true;
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];

        if (av1.ctype === 'list' && av2.ctype === 'list') {
            erg = erg && List.comp_almostequals(av1, av2).value;
        } else {
            erg = erg && comp_almostequals([av1, av2], []).value;

        }
    }
    return {
        'ctype': 'boolean',
        'value': erg
    };
};

List._helper.isAlmostReal = function(a1) {
    var erg = true;
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];

        if (av1.ctype === 'list') {
            erg = erg && List._helper.isAlmostReal(av1);
        } else {
            erg = erg && CSNumber._helper.isAlmostReal(av1);
        }
    }
    return erg;
};

List._helper.isAlmostZero = function(lst) {
    for (var i = 0; i < lst.value.length; i++) {
        var elt = lst.value[i];
        if (elt.ctype === 'list') {
            if (!List._helper.isAlmostZero(elt))
                return false;
        } else {
            if (!CSNumber._helper.isAlmostZero(elt))
                return false;
        }
    }
    return true;
};

List._helper.isNaN = function(a1) {
    var erg = false;
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];

        if (av1.ctype === 'list') {
            erg = erg || List._helper.isNaN(av1);
        } else {
            erg = erg || CSNumber._helper.isNaN(av1);
        }
    }
    return erg;
};


List.set = function(a1) {
    var erg = [];
    var ct = 0;

    var erg1 = a1.value.slice();
    erg1.sort(General.compare);

    for (var i = 0; i < erg1.length; i++) {
        if (i === 0 || !(comp_equals([erg[erg.length - 1], erg1[i]], [])).value) {
            erg[ct] = erg1[i];
            ct++;

        }

    }

    return {
        'ctype': 'list',
        'value': erg
    };

};


///////////////////////////


List.maxval = function(a) { //Only for Lists or Lists of Lists that contain numbers
    //Used for Normalize max
    var erg = CSNumber.zero;
    for (var i = 0; i < a.value.length; i++) {
        var v = a.value[i];
        if (v.ctype === "number") {
            erg = CSNumber.argmax(erg, v);
        }
        if (v.ctype === "list") {
            erg = CSNumber.argmax(erg, List.maxval(v));
        }
    }
    return erg;
};

/**
 * Return the index associated with the entry of maximal value
 * @param lst  a List to be iterated over, must not be empty
 * @param fun  a function to apply to each list element, must return a real value
 * @param startIdx start search from here
 * @return the index of the maximal element as a JavaScript number
 */
List.maxIndex = function(lst, fun, startIdx) {
    var sIdx = 0;
    if (startIdx !== undefined) sIdx = startIdx;

    var bestIdx = sIdx;
    var bestVal = fun(lst.value[sIdx]).value.real;
    for (var i = sIdx; i < lst.value.length; ++i) {
        var v = fun(lst.value[i]).value.real;
        if (v > bestVal) {
            bestIdx = i;
            bestVal = v;
        }
    }
    return bestIdx;
};

List.normalizeMax = function(a) {
    var s = CSNumber.inv(List.maxval(a));
    if (!CSNumber._helper.isFinite(s)) return a;
    return List.scalmult(s, a);
};

List.normalizeZ = function(a) {
    var s = CSNumber.inv(a.value[2]);
    return List.scalmult(s, a);
};

List.normalizeAbs = function(a) {
    var s = CSNumber.inv(List.abs(a));
    return List.scalmult(s, a);
};

List.max = function(a1, a2) {

    if (a1.value.length !== a2.value.length) {
        return nada;
    }
    var erg = [];
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];
        erg[i] = General.max(av1, av2);
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.min = function(a1, a2) {

    if (a1.value.length !== a2.value.length) {
        return nada;
    }
    var erg = [];
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];
        erg[i] = General.min(av1, av2);
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.scaldiv = function(a1, a2) {
    if (a1.ctype !== 'number') {
        return nada;
    }
    var erg = [];
    for (var i = 0; i < a2.value.length; i++) {
        var av2 = a2.value[i];
        if (av2.ctype === 'number') {
            erg[i] = General.div(av2, a1);
        } else if (av2.ctype === 'list') {
            erg[i] = List.scaldiv(a1, av2);
        } else {
            erg[i] = nada;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.scalmult = function(a1, a2) {
    if (a1.ctype !== 'number') {
        return nada;
    }
    var erg = [];
    for (var i = 0; i < a2.value.length; i++) {
        var av2 = a2.value[i];
        if (av2.ctype === 'number') {
            erg[i] = General.mult(av2, a1);
        } else if (av2.ctype === 'list') {
            erg[i] = List.scalmult(a1, av2);
        } else {
            erg[i] = nada;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.add = function(a1, a2) {

    if (a1.value.length !== a2.value.length) {
        return nada;
    }
    var erg = [];
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];
        if (av1.ctype === 'number' && av2.ctype === 'number') {
            erg[i] = General.add(av1, av2);
        } else if (av1.ctype === 'list' && av2.ctype === 'list') {
            erg[i] = List.add(av1, av2);
        } else {
            erg[i] = nada;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.sub = function(a1, a2) {

    if (a1.value.length !== a2.value.length) {
        return nada;
    }
    var erg = [];
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];
        if (av1.ctype === 'number' && av2.ctype === 'number') {
            erg[i] = CSNumber.sub(av1, av2);
        } else if (av1.ctype === 'list' && av2.ctype === 'list') {
            erg[i] = List.sub(av1, av2);
        } else {
            erg[i] = nada;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


List.abs2 = function(a1) {

    var erg = 0;
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = a1.value[i];
        if (av1.ctype === 'number') {
            erg += CSNumber.abs2(av1).value.real;
        } else if (av1.ctype === 'list') {
            erg += List.abs2(av1).value.real;
        } else {
            return nada;
        }
    }

    return {
        "ctype": "number",
        "value": {
            'real': erg,
            'imag': 0
        }
    };
};

List.abs = function(a1) {
    return CSNumber.sqrt(List.abs2(a1));
};


List.normalizeMaxXX = function(a) { //Assumes that list is a number Vector
    var maxv = -10000;
    var nn = CSNumber.real(1);
    for (var i = 0; i < a.value.length; i++) {
        var v = CSNumber.abs(a.value[i]);
        if (v.value.real > maxv) {
            nn = a.value[i];
            maxv = v.value.real;
        }
    }
    return List.scaldiv(nn, a);

};


List.recursive = function(a1, op) {
    var erg = [];
    for (var i = 0; i < a1.value.length; i++) {
        var av1 = evaluateAndVal(a1.value[i]); //Will man hier evaluieren
        if (av1.ctype === 'number') {
            erg[i] = CSNumber[op](av1);
        } else if (av1.ctype === 'list') {
            erg[i] = List[op](av1);
        } else {
            erg[i] = nada;
        }
    }
    return {
        'ctype': 'list',
        'value': erg
    };

};

List.re = function(a) {
    return List.recursive(a, "re");
};


List.neg = function(a) {
    return List.recursive(a, "neg");
};

List.im = function(a) {
    return List.recursive(a, "im");
};

List.conjugate = function(a) {
    return List.recursive(a, "conjugate");
};

List.transjugate = function(a) {
    return List.transpose(List.conjugate(a));
};


List.round = function(a) {
    return List.recursive(a, "round");
};


List.ceil = function(a) {
    return List.recursive(a, "ceil");
};


List.floor = function(a) {
    return List.recursive(a, "floor");
};


List._helper.colNumb = function(a) {
    if (a.ctype !== 'list') {
        return -1;
    }
    var ind = -1;
    for (var i = 0; i < a.value.length; i++) {
        if ((a.value[i]).ctype !== 'list') {
            return -1;
        }
        if (i === 0) {
            ind = (a.value[i]).value.length;
        } else {
            if (ind !== (a.value[i]).value.length)
                return -1;
        }
    }
    return ind;
};

List._helper.isNumberVecN = function(a, n) {

    if (a.ctype !== 'list') {
        return false;
    }
    if (a.value.length !== n) {
        return false;
    }

    for (var i = 0; i < a.value.length; i++) {
        if ((a.value[i]).ctype !== 'number') {
            return false;
        }
    }
    return true;

};


List.isNumberVector = function(a) {
    if (a.ctype !== 'list') {
        return {
            'ctype': 'boolean',
            'value': false
        };
    }
    for (var i = 0; i < a.value.length; i++) {
        if ((a.value[i]).ctype !== 'number') {
            return {
                'ctype': 'boolean',
                'value': false
            };
        }
    }
    return {
        'ctype': 'boolean',
        'value': true
    };

};


List.isNumberVectorN = function(a, n) {
    if (a.ctype !== 'list') {
        return {
            'ctype': 'boolean',
            'value': false
        };
    }
    if (a.value)
        for (var i = 0; i < a.value.length; i++) {
            if ((a.value[i]).ctype !== 'number') {
                return {
                    'ctype': 'boolean',
                    'value': false
                };
            }
        }
    return {
        'ctype': 'boolean',
        'value': true
    };

};


List.isNumberMatrix = function(a) {
    if (List._helper.colNumb(a) === -1) {
        return {
            'ctype': 'boolean',
            'value': false
        };
    }

    for (var i = 0; i < a.value.length; i++) {
        if (!List.isNumberVector((a.value[i])).value) {
            return {
                'ctype': 'boolean',
                'value': false
            };
        }
    }
    return {
        'ctype': 'boolean',
        'value': true
    };

};


List.scalproduct = function(a1, a2) {
    if (a1.value.length !== a2.value.length) {
        return nada;
    }
    var erg = {
        'ctype': 'number',
        'value': {
            'real': 0,
            'imag': 0
        }
    };
    for (var i = 0; i < a2.value.length; i++) {
        var av1 = a1.value[i];
        var av2 = a2.value[i];
        if (av1.ctype === 'number' && av2.ctype === 'number') {
            erg = CSNumber.add(CSNumber.mult(av1, av2), erg);
        } else {
            return nada;
        }
    }

    return erg;
};

List.sesquilinearproduct = function(a1, a2) {
    if (a1.value.length !== a2.value.length) {
        return nada;
    }
    var real = 0;
    var imag = 0;
    for (var i = 0; i < a2.value.length; i++) {
        var av1 = a1.value[i].value;
        var av2 = a2.value[i].value;
        real += av1.real * av2.real + av1.imag * av2.imag;
        imag += av1.real * av2.imag - av1.imag * av2.real;
    }
    return CSNumber.complex(real, imag);
};

List.normSquared = function(a) {
    var erg = 0;
    for (var i = 0; i < a.value.length; i++) {
        var av = a.value[i].value;
        erg += av.real * av.real + av.imag * av.imag;
    }
    return CSNumber.real(erg);
};

List.productMV = function(a, b) {
    if (a.value[0].value.length !== b.value.length) {
        return nada;
    }
    var li = [];
    for (var j = 0; j < a.value.length; j++) {
        var erg = {
            'ctype': 'number',
            'value': {
                'real': 0,
                'imag': 0
            }
        };
        var a1 = a.value[j];
        for (var i = 0; i < b.value.length; i++) {
            var av1 = a1.value[i];
            var av2 = b.value[i];

            if (av1.ctype === 'number' && av2.ctype === 'number') {
                erg = CSNumber.add(CSNumber.mult(av1, av2), erg);
            } else {
                return nada;
            }
        }
        li[j] = erg;
    }
    return List.turnIntoCSList(li);

};


List.productVM = function(a, b) {
    if (a.value.length !== b.value.length) {
        return nada;
    }
    var li = [];
    for (var j = 0; j < b.value[0].value.length; j++) {
        var erg = {
            'ctype': 'number',
            'value': {
                'real': 0,
                'imag': 0
            }
        };
        for (var i = 0; i < a.value.length; i++) {
            var av1 = a.value[i];
            var av2 = b.value[i].value[j];

            if (av1.ctype === 'number' && av2.ctype === 'number') {
                erg = CSNumber.add(CSNumber.mult(av1, av2), erg);
            } else {
                return nada;
            }
        }
        li[j] = erg;
    }
    return List.turnIntoCSList(li);

};

List.productMM = function(a, b) {
    if (a.value[0].value.length !== b.value.length) {
        return nada;
    }
    var li = [];
    for (var j = 0; j < a.value.length; j++) {
        var aa = a.value[j];
        var erg = List.productVM(aa, b);
        li[j] = erg;
    }
    return List.turnIntoCSList(li);
};


List.mult = function(a, b) {

    if (a.value.length === b.value.length && List.isNumberVector(a).value && List.isNumberVector(b).value) {
        return List.scalproduct(a, b);
    }

    if (List.isNumberMatrix(a).value && b.value.length === a.value[0].value.length && List.isNumberVector(b).value) {
        return List.productMV(a, b);
    }

    if (List.isNumberMatrix(b).value && a.value.length === b.value.length && List.isNumberVector(a).value) {
        return List.productVM(a, b);
    }

    if (List.isNumberMatrix(a).value && List.isNumberMatrix(b) && b.value.length === a.value[0].value.length) {
        return List.productMM(a, b);
    }

    return nada;


};

List.projectiveDistMinScal = function(a, b) {
    var sa = List.abs(a);
    var sb = List.abs(b);

    if (sa.value.real === 0 || sb.value.real === 0)
        return 0;
    var cb = List.conjugate(b);
    var p = List.scalproduct(a, cb);

    // 1 here is derived from cinderella src -- Martin and i are not sure why this is 1 and not infinity
    var np = CSNumber._helper.isAlmostZero(p) ? CSNumber.real(1) : CSNumber.div(p, CSNumber.abs(p));


    var na = List.scaldiv(sa, a);
    var nb = List.scaldiv(sb, b);
    nb = List.scalmult(np, nb);

    var d1 = List.abs(List.add(na, nb));
    var d2 = List.abs(List.sub(na, nb));
    return Math.min(d1.value.real, d2.value.real);

};

function conicMat2Vec(m) {
    var v = m.value;
    var r0 = v[0].value;
    var r1 = v[1].value;
    var r2 = v[2].value;
    return List.turnIntoCSList([
        r0[0],
        CSNumber.add(r0[1], r1[0]),
        CSNumber.add(r0[2], r2[0]),
        r1[1],
        CSNumber.add(r1[2], r2[1]),
        r2[2]
    ]);
}

List.conicDist = function(mat1, mat2) {
    var vec1 = conicMat2Vec(mat1);
    var vec2 = conicMat2Vec(mat2);
    console.log(niceprint(vec1), niceprint(vec2));
    return List.projectiveDistMinScal(vec1, vec2);
};

List.crossOperator = function(a) {

    var x = a.value[0];
    var y = a.value[1];
    var z = a.value[2];
    return List.turnIntoCSList([
        List.turnIntoCSList([CSNumber.zero, CSNumber.neg(z), y]),
        List.turnIntoCSList([z, CSNumber.zero, CSNumber.neg(x)]),
        List.turnIntoCSList([CSNumber.neg(y), x, CSNumber.zero])
    ]);

};

List.cross = function(a, b) { //Assumes that a is 3-Vector
    var x = CSNumber.sub(CSNumber.mult(a.value[1], b.value[2]), CSNumber.mult(a.value[2], b.value[1]));
    var y = CSNumber.sub(CSNumber.mult(a.value[2], b.value[0]), CSNumber.mult(a.value[0], b.value[2]));
    var z = CSNumber.sub(CSNumber.mult(a.value[0], b.value[1]), CSNumber.mult(a.value[1], b.value[0]));
    return List.turnIntoCSList([x, y, z]);
};

List.crossratio3harm = function(a, b, c, d, x) {
    var acx = List.det3(a, c, x);
    var bdx = List.det3(b, d, x);
    var adx = List.det3(a, d, x);
    var bcx = List.det3(b, c, x);
    var numer = CSNumber.mult(acx, bdx);
    var denom = CSNumber.mult(adx, bcx);
    return List.turnIntoCSList([numer, denom]);
};

List.crossratio3 = function(a, b, c, d, x) {
    var cr = List.crossratio3harm(a, b, c, d, x);
    return CSNumber.div(cr.value[0], cr.value[1]);
};

List.veronese = function(a) { //Assumes that a is 3-Vector
    var xx = CSNumber.mult(a.value[0], a.value[0]);
    var yy = CSNumber.mult(a.value[1], a.value[1]);
    var zz = CSNumber.mult(a.value[2], a.value[2]);
    var xy = CSNumber.mult(a.value[0], a.value[1]);
    var xz = CSNumber.mult(a.value[0], a.value[2]);
    var yz = CSNumber.mult(a.value[1], a.value[2]);
    return List.turnIntoSCList([xx, yy, zz, xy, xz, yz]);
};

List.matrixFromVeronese = function(a) { //Assumes that a is 6-Vector
    var xx = a.value[0];
    var yy = a.value[1];
    var zz = a.value[2];
    var xy = CSNumber.realmult(0.5, a.value[3]);
    var xz = CSNumber.realmult(0.5, a.value[4]);
    var yz = CSNumber.realmult(0.5, a.value[5]);
    return List.turnIntoCSList([
        List.turnIntoCSList([xx, xy, xz]),
        List.turnIntoCSList([xy, yy, yz]),
        List.turnIntoCSList([xz, yz, zz])
    ]);

};

List.det2 = function(R1, R2) {
    var tmp = CSNumber.mult(R1.value[0], R2.value[1]);
    tmp = CSNumber.sub(tmp, CSNumber.mult(R1.value[1], R2.value[0]));
    return tmp;
};

List.det3 = function(p, q, r) { //Assumes that a,b,c are 3-Vectors
    //Keine Ahnung ob man das so inlinen will (hab das grad mal so übernommen)

    var re = p.value[0].value.real * q.value[1].value.real * r.value[2].value.real - p.value[0].value.imag * q.value[1].value.imag * r.value[2].value.real - p.value[0].value.imag * q.value[1].value.real * r.value[2].value.imag - p.value[0].value.real * q.value[1].value.imag * r.value[2].value.imag + p.value[2].value.real * q.value[0].value.real * r.value[1].value.real - p.value[2].value.imag * q.value[0].value.imag * r.value[1].value.real - p.value[2].value.imag * q.value[0].value.real * r.value[1].value.imag - p.value[2].value.real * q.value[0].value.imag * r.value[1].value.imag + p.value[1].value.real * q.value[2].value.real * r.value[0].value.real - p.value[1].value.imag * q.value[2].value.imag * r.value[0].value.real - p.value[1].value.imag * q.value[2].value.real * r.value[0].value.imag - p.value[1].value.real * q.value[2].value.imag * r.value[0].value.imag - p.value[0].value.real * q.value[2].value.real * r.value[1].value.real + p.value[0].value.imag * q.value[2].value.imag * r.value[1].value.real + p.value[0].value.imag * q.value[2].value.real * r.value[1].value.imag + p.value[0].value.real * q.value[2].value.imag * r.value[1].value.imag - p.value[2].value.real * q.value[1].value.real * r.value[0].value.real + p.value[2].value.imag * q.value[1].value.imag * r.value[0].value.real + p.value[2].value.imag * q.value[1].value.real * r.value[0].value.imag + p.value[2].value.real * q.value[1].value.imag * r.value[0].value.imag - p.value[1].value.real * q.value[0].value.real * r.value[2].value.real + p.value[1].value.imag * q.value[0].value.imag * r.value[2].value.real + p.value[1].value.imag * q.value[0].value.real * r.value[2].value.imag + p.value[1].value.real * q.value[0].value.imag * r.value[2].value.imag;

    var im = -p.value[0].value.imag * q.value[1].value.imag * r.value[2].value.imag + p.value[0].value.imag * q.value[1].value.real * r.value[2].value.real + p.value[0].value.real * q.value[1].value.real * r.value[2].value.imag + p.value[0].value.real * q.value[1].value.imag * r.value[2].value.real - p.value[2].value.imag * q.value[0].value.imag * r.value[1].value.imag + p.value[2].value.imag * q.value[0].value.real * r.value[1].value.real + p.value[2].value.real * q.value[0].value.real * r.value[1].value.imag + p.value[2].value.real * q.value[0].value.imag * r.value[1].value.real - p.value[1].value.imag * q.value[2].value.imag * r.value[0].value.imag + p.value[1].value.imag * q.value[2].value.real * r.value[0].value.real + p.value[1].value.real * q.value[2].value.real * r.value[0].value.imag + p.value[1].value.real * q.value[2].value.imag * r.value[0].value.real + p.value[0].value.imag * q.value[2].value.imag * r.value[1].value.imag - p.value[0].value.imag * q.value[2].value.real * r.value[1].value.real - p.value[0].value.real * q.value[2].value.real * r.value[1].value.imag - p.value[0].value.real * q.value[2].value.imag * r.value[1].value.real + p.value[2].value.imag * q.value[1].value.imag * r.value[0].value.imag - p.value[2].value.imag * q.value[1].value.real * r.value[0].value.real - p.value[2].value.real * q.value[1].value.real * r.value[0].value.imag - p.value[2].value.real * q.value[1].value.imag * r.value[0].value.real + p.value[1].value.imag * q.value[0].value.imag * r.value[2].value.imag - p.value[1].value.imag * q.value[0].value.real * r.value[2].value.real - p.value[1].value.real * q.value[0].value.real * r.value[2].value.imag - p.value[1].value.real * q.value[0].value.imag * r.value[2].value.real;


    return CSNumber.complex(re, im);
};

List.det4m = function(m) {
    // auto-generated code, see detgen.js
    var body = m.value;
    var row = body[0].value;
    var elt = row[0].value;
    var m00r = +elt.real;
    var m00i = +elt.imag;
    elt = row[1].value;
    var m01r = +elt.real;
    var m01i = +elt.imag;
    elt = row[2].value;
    var m02r = +elt.real;
    var m02i = +elt.imag;
    elt = row[3].value;
    var m03r = +elt.real;
    var m03i = +elt.imag;
    row = body[1].value;
    elt = row[0].value;
    var m10r = +elt.real;
    var m10i = +elt.imag;
    elt = row[1].value;
    var m11r = +elt.real;
    var m11i = +elt.imag;
    elt = row[2].value;
    var m12r = +elt.real;
    var m12i = +elt.imag;
    elt = row[3].value;
    var m13r = +elt.real;
    var m13i = +elt.imag;
    var a01r = m00r * m11r - m00i * m11i - m01r * m10r + m01i * m10i;
    var a01i = m00r * m11i + m00i * m11r - m01r * m10i - m01i * m10r;
    var a02r = m00r * m12r - m00i * m12i - m02r * m10r + m02i * m10i;
    var a02i = m00r * m12i + m00i * m12r - m02r * m10i - m02i * m10r;
    var a03r = m00r * m13r - m00i * m13i - m03r * m10r + m03i * m10i;
    var a03i = m00r * m13i + m00i * m13r - m03r * m10i - m03i * m10r;
    var a12r = m01r * m12r - m01i * m12i - m02r * m11r + m02i * m11i;
    var a12i = m01r * m12i + m01i * m12r - m02r * m11i - m02i * m11r;
    var a13r = m01r * m13r - m01i * m13i - m03r * m11r + m03i * m11i;
    var a13i = m01r * m13i + m01i * m13r - m03r * m11i - m03i * m11r;
    var a23r = m02r * m13r - m02i * m13i - m03r * m12r + m03i * m12i;
    var a23i = m02r * m13i + m02i * m13r - m03r * m12i - m03i * m12r;
    row = body[2].value;
    elt = row[0].value;
    m00r = +elt.real;
    m00i = +elt.imag;
    elt = row[1].value;
    m01r = +elt.real;
    m01i = +elt.imag;
    elt = row[2].value;
    m02r = +elt.real;
    m02i = +elt.imag;
    elt = row[3].value;
    m03r = +elt.real;
    m03i = +elt.imag;
    row = body[3].value;
    elt = row[0].value;
    m10r = +elt.real;
    m10i = +elt.imag;
    elt = row[1].value;
    m11r = +elt.real;
    m11i = +elt.imag;
    elt = row[2].value;
    m12r = +elt.real;
    m12i = +elt.imag;
    elt = row[3].value;
    m13r = +elt.real;
    m13i = +elt.imag;
    var b01r = m00r * m11r - m00i * m11i - m01r * m10r + m01i * m10i;
    var b01i = m00r * m11i + m00i * m11r - m01r * m10i - m01i * m10r;
    var b02r = m00r * m12r - m00i * m12i - m02r * m10r + m02i * m10i;
    var b02i = m00r * m12i + m00i * m12r - m02r * m10i - m02i * m10r;
    var b03r = m00r * m13r - m00i * m13i - m03r * m10r + m03i * m10i;
    var b03i = m00r * m13i + m00i * m13r - m03r * m10i - m03i * m10r;
    var b12r = m01r * m12r - m01i * m12i - m02r * m11r + m02i * m11i;
    var b12i = m01r * m12i + m01i * m12r - m02r * m11i - m02i * m11r;
    var b13r = m01r * m13r - m01i * m13i - m03r * m11r + m03i * m11i;
    var b13i = m01r * m13i + m01i * m13r - m03r * m11i - m03i * m11r;
    var b23r = m02r * m13r - m02i * m13i - m03r * m12r + m03i * m12i;
    var b23i = m02r * m13i + m02i * m13r - m03r * m12i - m03i * m12r;
    return CSNumber.complex(
        a01r * b23r - a01i * b23i -
        a02r * b13r + a02i * b13i +
        a03r * b12r - a03i * b12i +
        a12r * b03r - a12i * b03i -
        a13r * b02r + a13i * b02i +
        a23r * b01r - a23i * b01i,
        a01r * b23i + a01i * b23r -
        a02r * b13i - a02i * b13r +
        a03r * b12i + a03i * b12r +
        a12r * b03i + a12i * b03r -
        a13r * b02i - a13i * b02r +
        a23r * b01i + a23i * b01r);
};

List.eucangle = function(a, b) {
    var tmp1 = List.cross(a, List.linfty);
    var tmp2 = List.cross(b, List.linfty);
    var ca = List.det3(List.ez, tmp1, List.ii);
    var cb = List.det3(List.ez, tmp1, List.jj);
    var cc = List.det3(List.ez, tmp2, List.ii);
    var cd = List.det3(List.ez, tmp2, List.jj);
    var dv = CSNumber.div(CSNumber.mult(ca, cd), CSNumber.mult(cc, cb));
    var ang = CSNumber.log(dv);
    ang = CSNumber.mult(ang, CSNumber.complex(0, 0.5));
    return ang;
};


List.zerovector = function(a) {
    var len = Math.floor(a.value.real);
    var erg = new Array(len);
    for (var i = 0; i < len; i++) {
        erg[i] = 0;
    }
    return List.realVector(erg);
};


List.zeromatrix = function(a, b) {
    var len = Math.floor(a.value.real);
    var erg = new Array(len);
    for (var i = 0; i < len; i++) {
        erg[i] = List.zerovector(b);
    }
    return List.turnIntoCSList(erg);
};

List.vandermonde = function(a) {
    var len = a.value.length;
    var erg = List.zeromatrix(len, len);

    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++)
            erg.value[i].value[j] = CSNumber.pow(a.value[i], CSNumber.real(j - 1));
    }
    return erg;
};


List.transpose = function(a) {
    var erg = [];
    var n = a.value[0].value.length;
    var m = a.value.length;
    for (var i = 0; i < n; i++) {
        var li = [];
        for (var j = 0; j < m; j++) {
            li[j] = a.value[j].value[i];
        }
        erg[i] = List.turnIntoCSList(li);
    }
    return List.turnIntoCSList(erg);
};


List.column = function(a, b) {
    var erg = [];
    var n = a.value.length;
    var i = Math.floor(b.value.real - 1);
    for (var j = 0; j < n; j++) {
        erg[j] = a.value[j].value[i];
    }

    return List.turnIntoCSList(erg);
};


List.row = function(a, b) {
    var erg = [];
    var n = a.value[0].value.length;
    var i = Math.floor(b.value.real - 1);
    for (var j = 0; j < n; j++) {
        erg[j] = a.value[i].value[j];
    }

    return List.turnIntoCSList(erg);
};

List.adjoint2 = function(AA) {
    var a = AA.value[0].value[0];
    var b = AA.value[0].value[1];
    var c = AA.value[1].value[0];
    var d = AA.value[1].value[1];

    var erg = new Array(2);
    erg[0] = List.turnIntoCSList([d, CSNumber.neg(b)]);
    erg[1] = List.turnIntoCSList([CSNumber.neg(c), a]);
    erg = List.turnIntoCSList(erg);
    return erg;
};


List.adjoint3 = function(a) {
    var row, elt,
        r11, i11, r12, i12, r13, i13,
        r21, i21, r22, i22, r23, i23,
        r31, i31, r32, i32, r33, i33;
    row = a.value[0].value;
    elt = row[0].value;
    r11 = elt.real;
    i11 = elt.imag;
    elt = row[1].value;
    r12 = elt.real;
    i12 = elt.imag;
    elt = row[2].value;
    r13 = elt.real;
    i13 = elt.imag;
    row = a.value[1].value;
    elt = row[0].value;
    r21 = elt.real;
    i21 = elt.imag;
    elt = row[1].value;
    r22 = elt.real;
    i22 = elt.imag;
    elt = row[2].value;
    r23 = elt.real;
    i23 = elt.imag;
    row = a.value[2].value;
    elt = row[0].value;
    r31 = elt.real;
    i31 = elt.imag;
    elt = row[1].value;
    r32 = elt.real;
    i32 = elt.imag;
    elt = row[2].value;
    r33 = elt.real;
    i33 = elt.imag;
    return {
        'ctype': 'list',
        'value': [{
            'ctype': 'list',
            'value': [{
                'ctype': 'number',
                'value': {
                    'real': r22 * r33 - r23 * r32 - i22 * i33 + i23 * i32,
                    'imag': r22 * i33 - r23 * i32 - r32 * i23 + r33 * i22
                }
            }, {
                'ctype': 'number',
                'value': {
                    'real': -r12 * r33 + r13 * r32 + i12 * i33 - i13 * i32,
                    'imag': -r12 * i33 + r13 * i32 + r32 * i13 - r33 * i12
                }
            }, {
                'ctype': 'number',
                'value': {
                    'real': r12 * r23 - r13 * r22 - i12 * i23 + i13 * i22,
                    'imag': r12 * i23 - r13 * i22 - r22 * i13 + r23 * i12
                }
            }]
        }, {
            'ctype': 'list',
            'value': [{
                'ctype': 'number',
                'value': {
                    'real': -r21 * r33 + r23 * r31 + i21 * i33 - i23 * i31,
                    'imag': -r21 * i33 + r23 * i31 + r31 * i23 - r33 * i21
                }
            }, {
                'ctype': 'number',
                'value': {
                    'real': r11 * r33 - r13 * r31 - i11 * i33 + i13 * i31,
                    'imag': r11 * i33 - r13 * i31 - r31 * i13 + r33 * i11
                }
            }, {
                'ctype': 'number',
                'value': {
                    'real': -r11 * r23 + r13 * r21 + i11 * i23 - i13 * i21,
                    'imag': -r11 * i23 + r13 * i21 + r21 * i13 - r23 * i11
                }
            }]
        }, {
            'ctype': 'list',
            'value': [{
                'ctype': 'number',
                'value': {
                    'real': r21 * r32 - r22 * r31 - i21 * i32 + i22 * i31,
                    'imag': r21 * i32 - r22 * i31 - r31 * i22 + r32 * i21
                }
            }, {
                'ctype': 'number',
                'value': {
                    'real': -r11 * r32 + r12 * r31 + i11 * i32 - i12 * i31,
                    'imag': -r11 * i32 + r12 * i31 + r31 * i12 - r32 * i11
                }
            }, {
                'ctype': 'number',
                'value': {
                    'real': r11 * r22 - r12 * r21 - i11 * i22 + i12 * i21,
                    'imag': r11 * i22 - r12 * i21 - r21 * i12 + r22 * i11
                }
            }]
        }]
    };
};

List.inverse = function(a) {
    var len = a.value.length;
    if (len !== a.value[0].value.length) {
        console.log("Inverse works only for square matrices");
        return nada;
    }
    if (len === 2) return List.scaldiv(List.det(a), List.adjoint2(a));
    if (len === 3) return List.scaldiv(List.det(a), List.adjoint3(a));

    var LUP = List.LUdecomp(a);
    var n = a.value.length;

    var zero = CSNumber.real(0);
    var one = CSNumber.real(1);

    var ei = List.zerovector(CSNumber.real(n));
    ei.value[0] = one;

    var erg = new Array(n);
    for (var i = 0; i < n; i++) {
        erg[i] = List._helper.LUsolve(LUP, ei);
        ei.value[i] = zero;
        ei.value[i + 1] = one;
    }

    erg = List.turnIntoCSList(erg);
    erg = List.transpose(erg);
    return erg;
};


List.linearsolve = function(a, bb) {
    if (a.value.length === 2) return List.linearsolveCramer2(a, bb);
    else if (a.value.length === 3) return List.linearsolveCramer3(a, bb);
    else return List.LUsolve(a, bb);
};

List.getDiag = function(A) {
    if (A.value.length !== A.value[0].value.length) return nada;
    var erg = new Array(A.value.length);
    for (var i = 0; i < A.value.length; i++) erg[i] = A.value[i].value[i];

    return List.turnIntoCSList(erg);
};


List.getSubDiag = function(A) {
    if (A.value.length !== A.value[0].value.length) return nada;
    var erg = new Array(A.value.length - 1);
    for (var i = 0; i < A.value.length - 1; i++) erg[i] = A.value[i + 1].value[i];

    return List.turnIntoCSList(erg);
};


// get eigenvalues of a 2x2 matrix
List.eig2 = function(AA) {
    var trace = CSNumber.add(AA.value[0].value[0], AA.value[1].value[1]);
    var bdet = List.det2(AA.value[0], AA.value[1]);

    var trace2 = CSNumber.mult(trace, trace);

    var L1 = CSNumber.mult(trace, CSNumber.real(0.5));
    var L2 = L1;

    var mroot = CSNumber.sqrt(CSNumber.sub(CSNumber.div(trace2, CSNumber.real(4)), bdet));


    L1 = CSNumber.add(L1, mroot);
    L2 = CSNumber.sub(L2, mroot);

    return List.turnIntoCSList([L1, L2]);
};

List.eig = function(A, getEigenvectors) {
    var getEv = getEigenvectors || true;

    var i, j;
    var AA = A;
    var cslen = CSNumber.real(AA.value.length);
    var len = cslen.value.real;
    var zero = CSNumber.real(0);

    // the code is not well tested -- perhaps we can use it later
    var useHess = false;
    if (useHess) {
        var Hess = List._helper.toHessenberg(A);
        AA = Hess[1];
    }

    var QRRes = List._helper.QRIteration(AA);
    AA = QRRes[0];

    var QQ = QRRes[1];

    var eigvals = List.getDiag(AA);
    eigvals = List.sort1(eigvals);

    var ID = List.idMatrix(cslen, cslen);


    var eigenvecs = new Array(len);
    eigenvecs = List.turnIntoCSList(eigenvecs);
    if (getEv) {

        // calc eigenvecs
        //
        // if we have a normal matrix QQ holds already the eigenvecs
        //    if( false && List._helper.isNormalMatrix(AA)){
        //        console.log("is normal matrix return QQ");
        //        var QQQ = List.transpose(QQ);
        //        for(i = 0; i < len; i++)
        //        eigenvecs.value[i] = QQQ.value[i];
        //    }
        //    else{
        var useInverseIteration = false; // inverse iteration or nullspace method to obtain eigenvecs

        var MM, xx, nullS, qq;
        if (useInverseIteration) {
            for (qq = 0; qq < len; qq++) {
                xx = List._helper.inverseIteration(AA, eigvals.value[qq]);
                xx = General.mult(QQ, xx);
                eigenvecs.value[qq] = xx;
            }
        } else {
            var ceigval, oeigval, lastevec;
            var count = 0;
            var sameEigVal = false;
            for (qq = 0; qq < len; qq++) {
                if (sameEigVal) {
                    xx = nullS.value[count];
                } else {
                    ceigval = eigvals.value[qq];
                    MM = List.sub(A, List.scalmult(ceigval, ID));
                    nullS = List.nullSpace(MM);
                    xx = nullS.value[0];
                    if (xx !== undefined) lastevec = xx; // if we found a eigenvector != [0...0] may need it again
                }

                // check if we got nothing from nullspace
                if (xx === undefined) {
                    xx = lastevec;
                }
                if (List.abs(xx).value.real < 1e-8 && count === 0) { // couldnt find a vector in nullspace -- should not happen
                    xx = List._helper.inverseIteration(A, eigvals.value[qq]);
                }
                eigenvecs.value[qq] = List._helper.isAlmostZeroVec(xx) ? xx : List.scaldiv(List.abs(xx), xx);


                if (qq < len - 1) {
                    sameEigVal = CSNumber.abs(CSNumber.sub(eigvals.value[qq], eigvals.value[qq + 1])).value.real < 1e-6;
                    if (sameEigVal) count++;
                    else count = 0;
                }
            }

        }

        //} // end else from normal matrices
        eigenvecs = List.transpose(eigenvecs);
    } // end getEv

    return List.turnIntoCSList([eigvals, eigenvecs]);
};

List._helper.isNormalMatrix = function(A) {
    return List.abs(List.sub(A, List.transjugate(A))).value.real < 1e-10;
};

List._helper.QRIteration = function(A, maxIter) {
    var i;
    var AA = A;
    var cslen = CSNumber.real(AA.value.length);
    var Alen = cslen.value.real; // does not change
    var len = cslen.value.real; // changes
    var zero = CSNumber.real(0);
    var Id = List.idMatrix(cslen, cslen);
    var erg = List.zeromatrix(cslen, cslen);
    var QQ = List.idMatrix(cslen, cslen);
    var mIter = maxIter ? maxIter : 2500;

    var QR, kap, shiftId, block, L1, L2, blockeigs, ann, dist1, dist2;
    var numDeflations = 0;
    var eigvals = new Array(len);
    for (i = 0; i < mIter; i++) {

        block = List._helper.getBlock(AA, [len - 2, len - 1], [len - 2, len - 1]);
        blockeigs = List.eig2(block);
        L1 = blockeigs.value[0];
        L2 = blockeigs.value[1];

        var l1n = List.abs(L1).value.real;
        var l2n = List.abs(L2).value.real;


        ann = AA.value[len - 1].value[len - 1];
        dist1 = CSNumber.abs(CSNumber.sub(ann, L1)).value.real;
        dist2 = CSNumber.abs(CSNumber.sub(ann, L2)).value.real;
        kap = dist1 < dist2 ? L1 : L2;

        Id = List.idMatrix(CSNumber.real(len), CSNumber.real(len));
        shiftId = List.scalmult(kap, Id);


        QR = List.QRdecomp(List.sub(AA, shiftId)); // shift


        AA = General.mult(QR.R, QR.Q);
        AA = List.add(AA, shiftId);

        QR.Q = List._helper.buildBlockMatrix(QR.Q, List.idMatrix(CSNumber.real(numDeflations), CSNumber.real(numDeflations)));
        QQ = General.mult(QQ, QR.Q);
        if (CSNumber.abs2(AA.value[AA.value.length - 1].value[AA.value[0].value.length - 2]).value.real < 1e-48 && len > 1) {

            eigvals[Alen - numDeflations - 1] = AA.value[len - 1].value[len - 1]; // get Eigenvalue

            // copy shortening to erg
            for (i = 0; i < len; i++) {
                erg.value[len - 1].value[i] = AA.value[len - 1].value[i];
                erg.value[i].value[len - 1] = AA.value[i].value[len - 1];
            }

            // shorten Matrix AA
            AA = List._helper.getBlock(AA, [0, len - 2], [0, len - 2]);


            numDeflations++;
            len--;
        }

        // break if we have only 1x1 matrix
        if (len === 1) {
            erg.value[0].value[0] = AA.value[0].value[0];
            break;
        }

        if (List._helper.isUpperTriangular(AA)) {
            for (i = 0; i < len; i++) {
                erg.value[i].value[i] = AA.value[i].value[i];
            }
            break;
        }
    }
    return [erg, QQ];
};

// return rank of a square matrix
List.rank = function(A, preci) {
    var QR = List.RRQRdecomp(A, preci);
    return QR.rank;
};

List._helper.isAlmostZeroVec = function(A) {

    var len = A.value.length;
    for (var i = 0; i < len; i++)
        if (!CSNumber._helper.isAlmostZero(A.value[i])) return false;

    return true;
};

List._helper.isLowerTriangular = function(A) {
    var leni = A.value.length;
    var lenj = A.value[0].value.length;
    for (var i = 0; i < leni; i++)
        for (var j = i + 1; j < lenj; j++) {
            if (!CSNumber._helper.isAlmostZero(A.value[i].value[j])) return false;
        }

    return true;
};


List._helper.isUpperTriangular = function(A) {
    return List._helper.isLowerTriangular(List.transpose(A));
};

List._helper.isAlmostId = function(AA) {
    var A = AA;
    var len = A.value.length;
    var cslen = CSNumber.real(len);
    if (len !== A.value[0].value.length) return false;

    var erg = List.sub(A, List.idMatrix(cslen), cslen);
    for (var i = 0; i < len; i++)
        for (var j = 0; j < len; j++) {
            if (CSNumber.abs(erg.value[i].value[j]).value.real > 1e-16) return false;
        }

    return true;
};

List.nullSpace = function(A, precision) {
    var len = A.value.length;
    var QR = List.RRQRdecomp(List.transjugate(A), precision); // QQ of QR is Nullspace of A^H
    var QQ = List.transpose(QR.Q); // transpose makes it easier to handle the vectors
    var nullRank = len - QR.rank.value.real;

    var erg = new Array(nullRank);
    QQ.value.reverse(); // the last vectors are the nullspace vectors

    // get nullVectors
    var vec, tmp;
    for (var i = 0; i < nullRank; i++) {
        vec = QQ.value[i];
        erg[i] = (List.scaldiv(List.abs(vec), vec));
    }


    erg = List.turnIntoCSList(erg);
    if (erg.value.length > 0) return erg;
    else return List.turnIntoCSList([List.zerovector(CSNumber.real(len))]);
};


List._helper.isAlmostDiagonal = function(AA) {
    var erg = AA;
    var len = AA.value.length;
    var cslen = CSNumber.real(len);
    var zero = CSNumber.real(0);
    if (len !== AA.value[0].value.length) return false;


    for (var i = 0; i < len; i++)
        for (var j = 0; j < len; j++) {
            if (i === j) continue;
            if (CSNumber.abs(erg.value[i].value[j]).value.real > 1e-16) return false;
        }

    return true;
};


List._helper.inverseIteration = function(A, shiftinit) {
    console.log("warning: code untested");
    var len = A.value.length;

    // random vector
    var xx = new Array(len);
    for (var i = 0; i < len; i++) {
        xx[i] = 2 * Math.random() - 0.5;
    }
    xx = List.realVector(xx);

    var qk = xx;
    var ID = List.idMatrix(CSNumber.real(len), CSNumber.real(len));

    var shift = shiftinit;
    shift = CSNumber.add(shift, CSNumber.real(0.1 * Math.random() - 0.5)); // add rand to make get a full rank matrix
    for (var ii = 0; ii < 100; ii++) {
        qk = List.scaldiv(List.abs(xx), xx);
        xx = List.LUsolve(List.sub(A, List.scalmult(shift, ID)), JSON.parse(JSON.stringify(qk))); // TODO Use triangular form
    }


    return List.scaldiv(List.abs(xx), xx);
};


// return Hessenberg Matrix H of A and tansformationmatrix QQ
List._helper.toHessenberg = function(A) {
    var AA = JSON.parse(JSON.stringify(A));
    var len = AA.value.length;
    var cslen = CSNumber.real(len - 1);
    var cslen2 = CSNumber.real(len);
    var one = CSNumber.real(1);


    if (List._helper.isUpperTriangular(AA)) return [List.idMatrix(cslen, cslen), A];

    var xx, uu, vv, alpha, e1, Qk, ww, erg;
    var QQ = List.idMatrix(cslen2, cslen2);
    var absxx;
    for (var k = 1; k < len - 1; k++) {

        //xx = List.tranList._helper.getBlock(AA, [k, len+1], [k,k]);
        xx = List.column(AA, CSNumber.real(k));
        xx.value = xx.value.splice(k);
        absxx = List.abs2(xx).value.real;
        if (absxx > 1e-16) {
            Qk = List._helper.getHouseHolder(xx);
            QQ = General.mult(QQ, Qk);

            AA = General.mult(General.mult(Qk, AA), Qk);
        }

        // book keeping
        cslen.value.real--;
    }

    return [QQ, AA];
};

// swap an element in js or cs array
List._helper.swapEl = function(arr, i, j) {
    var tmp;
    if (Object.prototype.toString.call(arr) === '[object Array]') {
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        return;
    }
    if (arr.ctype === "list") {
        tmp = arr.value[i];
        arr.value[i] = arr.value[j];
        arr.value[j] = tmp;
        return;
    }
    return;
};

// rank revealing QR decomposition
// see Golub, van Loan -- Matrix Computations - p. 302
List.RRQRdecomp = function(A, precision) {
    var preci = Math.sqrt(CSNumber.eps); // sane default
    if (precision !== undefined) preci = 0.1 * precision.value.real; // 0.1 is a workaround
    var preci2 = preci * preci; // we are working work abs()^2 later on

    var i;
    var AA;
    var len = A.value.length;
    var cslen = CSNumber.real(len);
    var one = CSNumber.real(1);

    var e1 = List._helper.unitvector(CSNumber.real(A.value.length), one);

    var xx, alpha, uu, vv, ww, Qk;
    // QQ is the the normal matrix Q
    var QQ = List.idMatrix(cslen, cslen);

    // this will be the updated matrix
    var AAA = JSON.parse(JSON.stringify(A));


    // get column norms
    var tA = List.transpose(A);
    var norms = new Array(len);
    for (i = 0; i < len; i++) norms[i] = List.abs2(tA.value[i]);
    norms = List.turnIntoCSList(norms);


    var piv = new Array(len);
    for (i = 0; i < len; i++) piv[i] = i;


    var maxIdx = List.maxIndex(norms, CSNumber.abs);
    var tau = norms.value[maxIdx];
    var rank = 0;
    var normxx;
    for (var k = 0; CSNumber.abs2(tau).value.real > 1e-16; k++) {
        rank++;
        List._helper.swapColumn(AAA, k, maxIdx);
        List._helper.swapEl(norms, k, maxIdx);
        List._helper.swapEl(piv, k, maxIdx);
        AA = List._helper.getBlock(AAA, [k, ], [k, ]);
        xx = List.column(AA, one);
        normxx = List.abs2(xx).value.real;
        if (normxx > 1e-8) {
            Qk = List._helper.getHouseHolder(xx);
            // fix dimension
            Qk = List._helper.buildBlockMatrix(List.idMatrix(CSNumber.real(k), CSNumber.real(k)), Qk);
            QQ = General.mult(QQ, List.transjugate(Qk));
            AAA = General.mult(Qk, AAA);
        }

        // update norms 
        for (i = k + 1; i < len; i++) {
            norms.value[i] = CSNumber.sub(norms.value[i], CSNumber.mult(AAA.value[k].value[i], CSNumber.conjugate(AAA.value[k].value[i])));
        }


        maxIdx = List.maxIndex(norms, CSNumber.abs2, k + 1);
        tau = norms.value[maxIdx];

        // after k+2 steps we are done
        if (k + 2 === len) {
            //if (!CSNumber._helper.isAlmostZero(tau)) rank++; // if tau !=0 we have rank + 1
            if (CSNumber.abs(tau).value.real > preci2) rank++; // if tau !=0 we have rank + 1
            break;
        }

        // book keeping
        cslen = CSNumber.sub(cslen, one);
        e1.value = e1.value.splice(0, e1.value.length - 1);
    }

    var R = AAA; //General.mult(List.transjugate(QQ), A);

    return {
        Q: QQ,
        R: R,
        P: List.turnIntoCSList(piv),
        rank: CSNumber.real(rank)
    };
};

List._helper.getHouseHolder = function(xx) {
    var cslen = CSNumber.real(xx.value.length);
    if (List.abs2(xx) < 1e-16) return List.idMatrix(cslen, cslen);

    var alpha, uu, vv, ww, Qk;
    var one = CSNumber.real(1);
    var e1 = List._helper.unitvector(CSNumber.real(xx.value.length), one);

    alpha = List._helper.QRgetAlpha(xx, 0);

    uu = List.sub(xx, List.scalmult(alpha, e1));
    vv = List.scaldiv(List.abs(uu), uu);
    ww = CSNumber.div(List.sesquilinearproduct(xx, vv), List.sesquilinearproduct(vv, xx));

    Qk = List.idMatrix(cslen, cslen);
    Qk = List.sub(Qk, List.scalmult(CSNumber.add(one, ww), List._helper.transposeMult(vv, List.conjugate(vv))));

    return Qk;
};

// reorder matrix by pivots -- used in RRQRdecomp
List._helper.reOrderbyPivots = function(A, piv) {
    var len = A.value.length.length;
    var tA = List.transpose(A);
    var Rerg = new Array(len);
    for (var i = 0; i < piv.length; i++) Rerg[piv[i]] = tA.value[i];
    Rerg = List.turnIntoCSList(Rerg);
    return List.transpose(Rerg);
};

List.QRdecomp = function(A) {
    var AA;
    var len = A.value.length;
    var cslen = CSNumber.real(len);

    if (List._helper.isUpperTriangular(A)) {
        return {
            Q: List.idMatrix(cslen, cslen),
            R: A,
        };
    }

    var one = CSNumber.real(1);

    var e1 = List._helper.unitvector(CSNumber.real(A.value.length), one);

    var xx, alpha, uu, vv, ww, Qk, normxx;
    // QQ is the the normal matrix Q
    var QQ = List.idMatrix(cslen, cslen);

    // this will be the updated matrix
    var AAA = JSON.parse(JSON.stringify(A));
    for (var k = 0;; k++) {
        AA = List._helper.getBlock(AAA, [k, ], [k, ]);

        xx = List.column(AA, one);
        normxx = List.abs2(xx).value.real;
        if (normxx > 1e-8) { // otherwise we already have the desired vector
            Qk = List._helper.getHouseHolder(xx);
            // update QQ
            // fix dimension
            Qk = List._helper.buildBlockMatrix(List.idMatrix(CSNumber.real(k), CSNumber.real(k)), Qk);
            QQ = General.mult(QQ, List.transjugate(Qk));
            AAA = General.mult(Qk, AAA);
        }

        // after k+2 steps we are done
        if (k + 2 === len) {
            break;
        }

        // book keeping
        cslen = CSNumber.sub(cslen, one);
        e1.value = e1.value.splice(0, e1.value.length - 1);
    }

    var R = AAA; //General.mult(List.transjugate(QQ), A);
    return {
        Q: QQ,
        R: R,
    };

};


List._helper.swapColumn = function(A, l, m) {
    var tmp;
    for (var i = 0; i < A.value.length; i++) {
        tmp = A.value[i].value[l];
        A.value[i].value[l] = A.value[i].value[m];
        A.value[i].value[m] = tmp;
    }
};

// build matrices of form
//      A 0
//      0 B
List._helper.buildBlockMatrix = function(A, B) {
    if (A.value.length === 0) return B;
    if (B.value.length === 0) return A;

    var mA = A.value.length;
    var mB = B.value.length;
    var m = mA + mB;

    var nA = A.value[0].value.length;
    var nB = B.value[0].value.length;
    var n = nA + nB;

    var erg = List.zeromatrix(CSNumber.real(m), CSNumber.real(n));

    for (var i = 0; i < A.value.length; i++)
        for (var j = 0; j < A.value[0].value.length; j++)
            erg.value[i].value[j] = A.value[i].value[j];


    for (var ii = 0; ii < B.value.length; ii++)
        for (var jj = 0; jj < B.value[0].value.length; jj++)
            erg.value[mA + ii].value[nA + jj] = B.value[ii].value[jj];

    return erg;
};

List._helper.getBlock = function(A, m, n) {
    var AA = JSON.parse(JSON.stringify(A));
    var m0 = m[0],
        m1;
    var n0 = n[0],
        n1;


    if (m[1] === undefined) m1 = AA.value.length;
    else m1 = m[1];

    if (n[1] === undefined) n1 = AA.value[0].value.length;
    else n1 = n[1];

    // slice does not include end
    m1++;
    n1++;


    AA.value = AA.value.slice(m0, m1);
    for (var i = 0; i < AA.value.length; i++) AA.value[i].value = AA.value[i].value.slice(n0, n1);


    return AA;
};


// return a copy of A with a Block B placed at position pos = [m, n]
List._helper.setBlock = function(A, B, pos) {
    var AA = JSON.parse(JSON.stringify(A));
    var m0 = pos[0];
    var n0 = pos[1];

    var m1 = B.value.length;
    var n1 = B.value[0].value.length;

    for (var i = 0; i < m1; i++)
        for (var j = 0; j < n1; j++) {
            AA.value[m0 + i].value[n0 + j] = B.value[i].value[j];
        }

    return AA;
};

// return u v^T Matrix
List._helper.transposeMult = function(u, v) {
    if (u.value.length !== v.value.length) return nada;
    var len = u.value.length;

    var erg = new Array(len);

    for (var i = 0; i < len; i++) {
        erg[i] = List.scalmult(u.value[i], v);
    }

    return List.turnIntoCSList(erg);

};

List._helper.QRgetAlpha = function(x, k) {
    //    var xx = List.scaldiv(List.abs(x), x);
    //    var atan = CSNumber.real(Math.atan2(xx.value[k].value.real, xx.value[k].value.imag));
    //    var alpha = CSNumber.neg(List.abs(xx));
    //    var expo = CSNumber.exp(CSNumber.mult(atan, CSNumber.complex(0, 1)));
    //    alpha = CSNumber.mult(alpha, expo);
    //    return alpha;

    // real version
    if (x.value[k].value.real < 0) return List.abs(x);
    return CSNumber.neg(List.abs(x));
};

List.LUdecomp = function(AA) {
    //    if(List._helper.isUpperTriangular){
    //        var len = AA.value.length;
    //
    //        var PP =  new Array(len);
    //        for(var ii = 0; ii < len; ii++) PP[ii] =ii;
    //        return {
    //            LU: AA,
    //            P: PP,
    //            TransPos: 0 
    //        };
    //    }
    var A = JSON.parse(JSON.stringify(AA)); // TODO: get rid of this cloning
    var i, j, k, absAjk, Akk, Ak, Pk, Ai;
    var tpos = 0;
    var max;
    var n = A.value.length,
        n1 = n - 1;
    var P = new Array(n);
    for (k = 0; k < n; ++k) {
        Pk = k;
        Ak = A.value[k];
        max = CSNumber.abs(Ak.value[k]).value.real;
        for (j = k + 1; j < n; ++j) {
            absAjk = CSNumber.abs(A.value[j].value[k]);
            if (max < absAjk.value.real) {
                max = absAjk.value.real;
                Pk = j;
            }
        }
        if (max < CSNumber.eps) console.log("Warning: singular matrix!");

        P[k] = Pk;

        if (Pk !== k) {
            A.value[k] = A.value[Pk];
            A.value[Pk] = Ak;
            Ak = A.value[k];
            tpos++;
        }

        Akk = Ak.value[k];

        for (i = k + 1; i < n; ++i) {
            A.value[i].value[k] = CSNumber.div(A.value[i].value[k], Akk);
        }

        for (i = k + 1; i < n; ++i) {
            Ai = A.value[i];
            for (j = k + 1; j < n1; ++j) {
                Ai.value[j] = CSNumber.sub(Ai.value[j], CSNumber.mult(Ai.value[k], Ak.value[j]));
                ++j;
                Ai.value[j] = CSNumber.sub(Ai.value[j], CSNumber.mult(Ai.value[k], Ak.value[j]));
            }
            if (j === n1) Ai.value[j] = CSNumber.sub(Ai.value[j], CSNumber.mult(Ai.value[k], Ak.value[j]));
        }
    }

    return {
        LU: A,
        P: P,
        TransPos: tpos
    };
};

List.LUsolve = function(A, b) {
    var LUP = List.LUdecomp(A);
    return List._helper.LUsolve(LUP, b);
};

List._helper.LUsolve = function(LUP, bb) {
    var b = JSON.parse(JSON.stringify(bb)); // TODO: get rid of this cloning
    var i, j;
    var LU = LUP.LU;
    var n = LU.value.length;
    var x = JSON.parse(JSON.stringify(b));

    var P = LUP.P;
    var Pi, LUi, LUii, tmp;

    for (i = n - 1; i !== -1; --i) x.value[i] = b.value[i];
    for (i = 0; i < n; ++i) {
        Pi = P[i];
        if (P[i] !== i) {
            tmp = x.value[i];
            x.value[i] = x.value[Pi];
            x.value[Pi] = tmp;
        }

        LUi = LU.value[i];
        for (j = 0; j < i; ++j) {
            x.value[i] = CSNumber.sub(x.value[i], CSNumber.mult(x.value[j], LUi.value[j]));
        }
    }

    for (i = n - 1; i >= 0; --i) {
        LUi = LU.value[i];
        for (j = i + 1; j < n; ++j) {
            x.value[i] = CSNumber.sub(x.value[i], CSNumber.mult(x.value[j], LUi.value[j]));
        }

        x.value[i] = CSNumber.div(x.value[i], LUi.value[i]);
    }

    return x;
};


// currently not working because of bug in RRQR 

/*
List.linearsolveQR = function(a,bb){
    // QR solve
    var m = a.value.length;
    var n = a.value[0].value.length;
    if(m !== n) console.log("Warning: only implemented for square matrices!");
    var res = List.RRQRdecomp(a);
    if(res.rank.value.real !== m) console.log("Warning: matrix is singular!");
    var RR = res.R;
    var pivs = res.P.value;

    console.log("Q", niceprint(res.Q));
    console.log("R", niceprint(res.R));
    console.log("pivs", pivs);
    console.log("Q*R", niceprint(General.mult(res.Q,RR)));

    // switch by pivots
    var zz = General.mult(List.transjugate(res.Q), bb);


    // backsubstitution
    var xx, resvec = [];
   for(var i = m - 1; i >=0; i--){
       resvec[i] = zz.value[i];

       for(var j = m-1; j > i; j--){
           resvec[i] = CSNumber.sub(resvec[i] , CSNumber.mult(RR.value[i].value[j],resvec[j]));
       }
        resvec[i] = CSNumber.div(resvec[i], RR.value[i].value[i]);
   }

   // reorder pivots
   var ges = new Array(m);
   
   for(var k = 0; k < m; k++){
       ges[k] = resvec[pivs[k]];
   }
   ges = List.turnIntoCSList(ges);

   return ges;
};
*/

List.linearsolveCramer2 = function(A, b) {
    var A1 = List.column(A, CSNumber.real(1));
    var A2 = List.column(A, CSNumber.real(2));

    var detA = List.det2(A1, A2);
    if (CSNumber._helper.isZero(detA)) console.log("A is not regular!");

    var x1 = List.det2(b, A2);
    x1 = CSNumber.div(x1, detA);
    var x2 = List.det2(A1, b);
    x2 = CSNumber.div(x2, detA);

    var res = List.turnIntoCSList([x1, x2]);
    return res;
};

List.linearsolveCramer3 = function(A, b) {
    var A1 = List.column(A, CSNumber.real(1));
    var A2 = List.column(A, CSNumber.real(2));
    var A3 = List.column(A, CSNumber.real(3));

    var detA = List.det3(A1, A2, A3);
    if (CSNumber._helper.isZero(detA)) console.log("A is not regular!");

    var x1 = List.det3(b, A2, A3);
    var x2 = List.det3(A1, b, A3);
    var x3 = List.det3(A1, A2, b);

    var res = List.turnIntoCSList([x1, x2, x3]);
    res = List.scaldiv(detA, res);

    return res;
};

// solve general linear system A*x=b by transforming A to sym. pos. definite
List.linearsolveCGNR = function(AA, bb) {
    var transA = List.transpose(AA);
    var A = General.mult(transA, AA);
    var b = General.mult(transA, bb);

    return List.linearsolveCG(A, b);
};

// only for sym. pos. definite matrices!
List.linearsolveCG = function(A, b) {
    var r, p, alp, x, bet, Ap, rback;

    x = b;
    r = List.sub(b, General.mult(A, b));
    p = r;

    var maxIter = Math.ceil(1.2 * A.value.length);
    var count = 0;
    while (count < maxIter) {
        count++;
        Ap = General.mult(A, p);

        alp = List.scalproduct(r, r);
        rback = alp;
        alp = CSNumber.div(alp, List.scalproduct(p, Ap));

        x = List.add(x, General.mult(alp, p));
        r = List.sub(r, General.mult(alp, Ap));

        if (List.abs(r).value.real < CSNumber.eps) break;

        bet = List.scalproduct(r, r);
        bet = CSNumber.div(bet, rback);
        p = List.add(r, General.mult(bet, p));
    }
    if (count >= maxIter) console.log("CG did not converge");

    return x;
};


List.det = function(a) {
    if (a.value.length === 1) return a.value[0].value[0];
    if (a.value.length === 2) return List.det2(a.value[0], a.value[1]);
    if (a.value.length === 3) {
        return List.det3(a.value[0], a.value[1], a.value[2]);
    }
    if (a.value.length === 4) {
        return List.det4m(a);
    }

    var n = a.value.length,
        ret = CSNumber.real(1),
        i, j, k, A = JSON.parse(JSON.stringify(a)),
        Aj, Ai, alpha, temp, k1, k2, k3;
    for (j = 0; j < n - 1; j++) {
        k = j;
        for (i = j + 1; i < n; i++) {
            if (CSNumber.abs(A.value[i].value[j]).value.real > CSNumber.abs(A.value[k].value[j]).value.real) {
                k = i;
            }
        }
        if (k !== j) {
            temp = A.value[k];
            A.value[k] = A.value[j];
            A.value[j] = temp;
            ret = CSNumber.neg(ret);
        }
        Aj = A.value[j];
        for (i = j + 1; i < n; i++) {
            Ai = A.value[i];
            alpha = CSNumber.div(Ai.value[j], Aj.value[j]);
            for (k = j + 1; k < n - 1; k += 2) {
                k1 = k + 1;
                Ai.value[k] = CSNumber.sub(Ai.value[k], CSNumber.mult(Aj.value[k], alpha));
                Ai.value[k1] = CSNumber.sub(Ai.value[k1], CSNumber.mult(Aj.value[k1], alpha));
            }
            if (k !== n) {
                Ai.value[k] = CSNumber.sub(Ai.value[k], CSNumber.mult(Aj.value[k], alpha));
            }
        }
        if (CSNumber._helper.isZero(Aj.value[j])) {
            return CSNumber.real(0);
        }
        ret = CSNumber.mult(ret, Aj.value[j]);
    }
    var result = CSNumber.mult(ret, A.value[j].value[j]);
    return result;
};

List.LUdet = function(a) {
    var LUP = List.LUdecomp(a);
    var LU = LUP.LU;

    var len = LU.value.length;

    var det = LU.value[0].value[0];
    for (var i = 1; i < len; i++) det = CSNumber.mult(det, LU.value[i].value[i]);

    // take care of sign
    if (LUP.TransPos % 2 === 1) det = CSNumber.neg(det);

    return det;
};


///Feldzugriff
///TODO Will man das in list haben??

List.getField = function(li, key) {
    var n;

    if (key === "homog") {
        if (List._helper.isNumberVecN(li, 3)) {
            return li;
        }
        if (List._helper.isNumberVecN(li, 2)) {
            return List.turnIntoCSList([
                li.value[0], li.value[1], CSNumber.real(1)
            ]);
        }
    }

    if (key === "xy") {
        if (List._helper.isNumberVecN(li, 2)) {
            return li;
        }
        if (List._helper.isNumberVecN(li, 3)) {
            return List.turnIntoCSList([
                CSNumber.div(li.value[0], li.value[2]),
                CSNumber.div(li.value[1], li.value[2])
            ]);
        }
    }

    if (key === "x") {
        if (List.isNumberVector(li)) {
            n = li.value.length;
            if (n > 0 && n !== 3) {
                return li.value[0];
            }
            if (n === 3) {
                if (li.usage === "Point") {
                    return CSNumber.div(li.value[0], li.value[2]);
                } else {
                    return li.value[0];
                }
            }
        }
    }

    if (key === "y") {
        if (List.isNumberVector(li)) {
            n = li.value.length;
            if (n > 1 && n !== 3) {
                return li.value[1];
            }
            if (n === 3) {
                if (li.usage === "Point") {
                    return CSNumber.div(li.value[1], li.value[2]);
                } else {
                    return li.value[1];
                }
            }
        }
    }

    if (key === "z") {
        if (List.isNumberVector(li)) {
            n = li.value.length;
            if (n > 2) {
                return li.value[2];
            }
        }
    }

    return nada;

};
/*jshint -W069 */

var operators = {};
operators[':'] = 20; //Colon: Feldzugriff auf Selbstdefinierte Felder
operators['.'] = 25; //Dot: Feldzugriff
operators['\u00b0'] = 25; //Degree
operators['_'] = 50; //x_i i-tes Element von x
operators['^'] = 50; //hoch
operators['*'] = 100; //Multiplikation (auch für Vectoren, Scalarmul)
operators['/'] = 100; //Division (auch für Vectoren, Scalerdiv)
operators['+'] = 200; //Addition (auch für Vectoren, Vectorsumme)
operators['-'] = 200; //Subtraktion (auch für Vectoren, Vectordiff)
operators['!'] = 200; //Logisches Not (einstellig)
operators['=='] = 300; //Equals
operators['~='] = 300; //approx Equals
operators['~<'] = 300; //approx smaller
operators['~>'] = 300; //approx greater
operators['=:='] = 300; //Equals after evaluation
operators['>='] = 300; //Größergleich
operators['<='] = 300; //Kleinergleich
operators['~>='] = 300; //ungefähr Größergleich
operators['~<='] = 300; //ungefähr Kleinergleich
operators['>'] = 300; //Größer
operators['<'] = 300; //Kleiner
operators['<>'] = 300; //Ungleich
operators['&'] = 350; //Logisches Und
operators['%'] = 350; //Logisches Oder
operators['!='] = 350; //Ungleich
operators['~!='] = 350; //ungefähr Ungleich
operators['..'] = 350; //Aufzählung 1..5=(1,2,3,4,5)
operators['++'] = 370; //Listen Aneinanderhängen
operators['--'] = 370; //Listen wegnehmen
operators['~~'] = 370; //Gemeinsame Elemente
operators[':>'] = 370; //Append List
operators['<:'] = 370; //Prepend List
operators['='] = 400; //Zuweisung
operators[':='] = 400; //Definition
operators[':=_'] = 400; //Definition
operators['::='] = 400; //Definition
operators['->'] = 400; //Modifier
operators[','] = 500; //Listen und Vektoren Separator
operators[';'] = 500; //Befehlsseparator


var infixmap = {};
infixmap['+'] = infix_add;
infixmap['-'] = infix_sub;
infixmap['*'] = infix_mult;
infixmap['/'] = infix_div;
infixmap['^'] = infix_pow;
infixmap['°'] = postfix_numb_degree;
infixmap[';'] = infix_semicolon;
infixmap['='] = infix_assign;
infixmap['..'] = infix_sequence;
infixmap[':='] = infix_define;
infixmap['=='] = comp_equals;
infixmap['!='] = comp_notequals;
infixmap['~='] = comp_almostequals;
infixmap['~!='] = comp_notalmostequals;
infixmap['>'] = comp_gt;
infixmap['<'] = comp_lt;
infixmap['>='] = comp_ge;
infixmap['<='] = comp_le;
infixmap['~>'] = comp_ugt;
infixmap['~<'] = comp_ult;
infixmap['~>='] = comp_uge;
infixmap['~<='] = comp_ule;
infixmap['&'] = infix_and;
infixmap['%'] = infix_or;
infixmap['!'] = prefix_not;
infixmap['_'] = infix_take;
infixmap['++'] = infix_concat;
infixmap['~~'] = infix_common;
infixmap['--'] = infix_remove;
infixmap[':>'] = infix_append;
infixmap['<:'] = infix_prepend;

/*jshint +W069 */


//****************************************************************
// this function is responsible for evaluation an expression tree
//****************************************************************

function niceprint(a) {
    if (typeof a === 'undefined') {
        return '_??_';
    }
    if (a.ctype === 'undefined') {
        return '_?_';
    }
    if (a.ctype === 'number') {
        return CSNumber.niceprint(a);
    }
    if (a.ctype === 'string') {
        return a.value;
    }
    if (a.ctype === 'boolean') {
        return a.value;
    }
    if (a.ctype === 'list') {
        var erg = "[";
        for (var i = 0; i < a.value.length; i++) {
            erg = erg + niceprint(evaluate(a.value[i]));
            if (i !== a.value.length - 1) {
                erg = erg + ', ';
            }

        }
        return erg + "]";
    }
    if (a.ctype === 'function') {
        return 'FUNCTION';

    }
    if (a.ctype === 'infix') {
        return 'INFIX';
    }
    if (a.ctype === 'modifier') {
        return a.key + '->' + niceprint(a.value);
    }
    if (a.ctype === 'shape') {
        return a.type;
    }

    if (a.ctype === 'error') {
        return "Error: " + a.message;
    }
    if (a.ctype === 'variable') {
        console.log("HALLO");
        return niceprint(a.stack[length.stack]);
    }

    if (a.ctype === 'geo') {
        return a.value.name;
    }


    return "__";

}


//TODO Eventuell auslagern
//*******************************************************
//this is the container for self-defined functions
//Distinct form evaluator for code clearness :-)
//*******************************************************
function myfunctions(name, args, modifs) {
    var tt = myfunctions[name];
    if (tt === undefined) {
        return nada;
    }

    var set = [],
        i;

    for (i = 0; i < tt.arglist.length; i++) {
        set[i] = evaluate(args[i]);
    }
    for (i = 0; i < tt.arglist.length; i++) {
        namespace.newvar(tt.arglist[i].name);
        namespace.setvar(tt.arglist[i].name, set[i]);
    }
    namespace.pushVstack("*");
    var erg = evaluate(tt.body);
    namespace.cleanVstack();
    for (i = 0; i < tt.arglist.length; i++) {
        namespace.removevar(tt.arglist[i].name);
    }
    return erg;
    //                    return tt(args,modifs);
}

//*******************************************************
//this function evaluates a concrete function
//*******************************************************
var evaluator = {};
var eval_helper = {};

eval_helper.evaluate = function(name, args, modifs) {
    if (myfunctions.hasOwnProperty(name))
        return myfunctions(name, args, modifs);
    var f = evaluator[name];
    if (f)
        return f(args, modifs);
    // This following is legacy code, and should be removed
    // once all functions are converted to their arity-aware form.
    // Unless we introduce something like variadic functions.
    var n = name.lastIndexOf("$");
    if (n !== -1) {
        n = name.substr(0, n);
        f = evaluator[n];
        if (f)
            return f(args, modifs);
    }
    csconsole.err("Called undefined function " + n + " (as " + name + ")");
    return nada;
};


eval_helper.equals = function(v0, v1) { //Und nochmals un-OO
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return {
            'ctype': 'boolean',
            'value': (v0.value.real === v1.value.real) &&
                (v0.value.imag === v1.value.imag)
        };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value === v1.value)
        };
    }
    if (v0.ctype === 'boolean' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (v0.value === v1.value)
        };
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        var erg = List.equals(v0, v1);
        return erg;
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};
//==========================================
//      Things that apply to several types
//==========================================
var General = {};
General._helper = {};

General.order = {
    undefined: 0,
    boolean: 1,
    number: 2,
    term: 3,
    atomic: 4,
    variable: 5,
    geo: 6,
    string: 7,
    list: 8
};

General.string = function(s) {
    return {
        ctype: "string",
        value: s
    };
};

General.bool = function(b) {
    return {
        ctype: "boolean",
        value: b
    };
};

General.not = function(v) {
    return General.bool(!v.value);
};

General.isLessThan = function(a, b) {
    return General.compare(a, b) === -1;

};


General.isEqual = function(a, b) {
    return General.compare(a, b) === 0;

};


General.compareResults = function(a, b) {
    return General.compare(a.result, b.result);
};

General.compare = function(a, b) {
    if (a.ctype !== b.ctype) {
        return (General.order[a.ctype] - General.order[b.ctype]);
    }
    if (a.ctype === 'number') {
        return CSNumber._helper.compare(a, b);
    }
    if (a.ctype === 'list') {
        return List._helper.compare(a, b);
    }
    if (a.ctype === 'string') {
        if (a.value === b.value) {
            return 0;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 1;
    }
    if (a.ctype === 'boolean') {
        if (a.value === b.value) {
            return 0;
        }
        if (a.value === false) {
            return -1;
        }
        return 1;
    }

};

General.add = function(v0, v1) {
    if (v0.ctype === 'void' && v1.ctype === 'number') { //Monadisches Plus
        return v1;
    }

    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.add(v0, v1);
    }
    if (v0.ctype === 'string' || v1.ctype === 'string') {
        return {
            "ctype": "string",
            "value": niceprint(v0) + niceprint(v1)
        };
    }

    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.add(v0, v1);
    }
    return nada;
};

General.sub = function(v0, v1) {
    if (v0.ctype === 'void' && v1.ctype === 'number') { //Monadisches Minus
        return CSNumber.neg(v1);
    }
    if (v0.ctype === 'void' && v1.ctype === 'list') { //Monadisches Plus
        return List.neg(v1);
    }
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.sub(v0, v1);
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.sub(v0, v1);
    }
    return nada;
};

General.mult = function(v0, v1) {

    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.mult(v0, v1);
    }
    if (v0.ctype === 'number' && v1.ctype === 'list') {
        return List.scalmult(v0, v1);
    }
    if (v0.ctype === 'list' && v1.ctype === 'number') {
        return List.scalmult(v1, v0);
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.mult(v0, v1);
    }
    return nada;

};

General.div = function(v0, v1) {

    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.div(v0, v1);
    }
    if (v0.ctype === 'list' && v1.ctype === 'number') {
        return List.scaldiv(v1, v0);
    }
    return nada;
};


General.max = function(v0, v1) {

    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.max(v0, v1);
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.max(v0, v1);
    }
    return nada;

};


General.min = function(v0, v1) {

    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.min(v0, v1);
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.min(v0, v1);
    }
    return nada;

};

General.wrap = function(v) {
    if (typeof v === "number") {
        return CSNumber.real(v);
    }
    if (typeof v === "object" && v.length !== undefined) { //evtl in List ziehen
        var li = [];
        for (var i = 0; i < v.length; i++) {
            li[i] = General.wrap(v[i]);
        }
        return List.turnIntoCSList(li);
    }
    if (typeof v === "string") {
        return {
            ctype: "string",
            value: v
        };
    }
    if (typeof v === "boolean") {
        return {
            ctype: "boolean",
            value: v
        };
    }
    return nada;
};

General.withUsage = function(v, usage) {
    // shallow copy with possibly new usage
    return {
        "ctype": v.ctype,
        "value": v.value,
        "usage": usage
    };
};
//*******************************************************
// and here are the definitions of the operators
//*******************************************************

evaluator.timestamp$0 = function(args, modifs) {
    return {
        "ctype": "number",
        "value": {
            "real": new Date().getTime(),
            "imag": 0
        }
    };
};

evaluator.seconds$0 = function(args, modifs) { //OK
    return {
        "ctype": "number",
        "value": {
            'real': (new Date().getTime() / 1000),
            'imag': 0
        }
    };
};


evaluator.clearconsole$0 = function(args, modifs) {
    csconsole.clear();
};

evaluator.err$1 = function(args, modifs) { //OK
    var varname = '',
        s;
    if (args[0].ctype === 'variable') {
        varname = args[0].name;
        s = namespace.getvar(args[0].name);
    } else {
        s = args[0];
    }
    s = varname + " ===> " + niceprint(evaluate(s));

    csconsole.err(s);

    return nada;
};

evaluator.errc$1 = function(args, modifs) { //OK
    var s;
    if (args[0].ctype === 'variable') {
        // var s=evaluate(args[0].value[0]);
        s = evaluate(namespace.getvar(args[0].name));
        console.log(args[0].name + " ===> " + niceprint(s));

    } else {
        s = evaluate(args[0]);
        console.log(" ===> " + niceprint(s));

    }
    return nada;
};

evaluator.print$1 = function(args, modifs) {
    csconsole.out(niceprint(evaluate(args[0])), true);
};

evaluator.println$1 = function(args, modifs) {
    csconsole.out(niceprint(evaluate(args[0])));
};

evaluator.dump$1 = function(args, modifs) {

    dump(args[0]);
    return nada;
};


evaluator.repeat$2 = function(args, modifs) { //OK
    return evaluator.repeat$3([args[0], null, args[1]], modifs);
};

evaluator.repeat$3 = function(args, modifs) { //OK
    function handleModifs() {
        var erg;

        if (modifs.start !== undefined) {
            erg = evaluate(modifs.start);
            if (erg.ctype === 'number') {
                startb = true;
                start = erg.value.real;
            }
        }
        if (modifs.step !== undefined) {
            erg = evaluate(modifs.step);
            if (erg.ctype === 'number') {
                stepb = true;
                step = erg.value.real;
            }
        }
        if (modifs.stop !== undefined) {
            erg = evaluate(modifs.stop);
            if (erg.ctype === 'number') {
                stopb = true;
                stop = erg.value.real;
            }
        }


        if (startb && !stopb && !stepb) {
            stop = step * n + start;
        }

        if (!startb && stopb && !stepb) {
            start = -step * (n - 1) + stop;
            stop += step;
        }

        if (!startb && !stopb && stepb) {
            stop = step * n + start;
        }

        if (startb && stopb && !stepb) {
            step = (stop - start) / (n - 1);
            stop += step;
        }

        if (startb && !stopb && stepb) {
            stop = step * n + start;
        }

        if (!startb && stopb && stepb) {
            start = -step * (n - 1) + stop;
            stop += step;
        }

        if (startb && stopb && stepb) {
            stop += step;
        }
    }


    var v1 = evaluateAndVal(args[0]);

    var lauf = '#';
    if (args[1] !== null) {
        if (args[1].ctype === 'variable') {
            lauf = args[1].name;
        }
    }
    if (v1.ctype !== 'number') {
        return nada;
    }
    var n = Math.round(v1.value.real); //TODO: conversion to real!!!
    var step = 1;
    var start = 1;
    var stop = n + 1;
    var startb = false;
    var stopb = false;
    var stepb = false;
    handleModifs();
    if ((start <= stop && step > 0) || (start >= stop && step < 0))
        if (startb && stopb && stepb) {
            n = Math.floor((stop - start) / step);
        }

    namespace.newvar(lauf);
    var erg = nada;
    for (var i = 0; i < n; i++) {
        namespace.setvar(lauf, {
            'ctype': 'number',
            'value': {
                'real': i * step + start,
                'imag': 0
            }
        });
        erg = evaluate(args[2]);
    }
    namespace.removevar(lauf);

    return erg;

};


evaluator.while$2 = function(args, modifs) { //OK

    var prog = args[1];
    var test = args[0];
    var bo = evaluate(test);
    var erg = nada;
    while (bo.ctype !== 'list' && bo.value) {
        erg = evaluate(prog);
        bo = evaluate(test);
    }

    return erg;

};


evaluator.apply$2 = function(args, modifs) { //OK
    return evaluator.apply$3([args[0], null, args[1]], modifs);
};

evaluator.apply$3 = function(args, modifs) { //OK

    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype !== 'list') {
        return nada;
    }

    var lauf = '#';
    if (args[1] !== null) {
        if (args[1].ctype === 'variable') {
            lauf = args[1].name;
        }
    }

    var li = v1.value;
    var erg = [];
    namespace.newvar(lauf);
    for (var i = 0; i < li.length; i++) {
        namespace.setvar(lauf, li[i]);
        erg[i] = evaluate(args[2]);
    }
    namespace.removevar(lauf);

    return {
        'ctype': 'list',
        'value': erg
    };

};

evaluator.forall$2 = function(args, modifs) { //OK
    return evaluator.forall$3([args[0], null, args[1]], modifs);
};

evaluator.forall$3 = function(args, modifs) { //OK

    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype !== 'list') {
        return nada;
    }

    var lauf = '#';
    if (args[1] !== null) {
        if (args[1].ctype === 'variable') {
            lauf = args[1].name;
        }
    }

    var li = v1.value;
    var erg = [];
    namespace.newvar(lauf);
    var res;
    for (var i = 0; i < li.length; i++) {
        namespace.setvar(lauf, li[i]);
        res = evaluate(args[2]);
        erg[i] = res;
    }
    namespace.removevar(lauf);

    return res;

};

evaluator.select$2 = function(args, modifs) { //OK
    return evaluator.select$3([args[0], null, args[1]], modifs);
};

evaluator.select$3 = function(args, modifs) { //OK

    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype !== 'list') {
        return nada;
    }

    var lauf = '#';
    if (args[1] !== null) {
        if (args[1].ctype === 'variable') {
            lauf = args[1].name;
        }
    }

    var li = v1.value;
    var erg = [];
    namespace.newvar(lauf);
    var ct = 0;
    for (var i = 0; i < li.length; i++) {
        namespace.setvar(lauf, li[i]);
        var res = evaluate(args[2]);
        if (res.ctype === 'boolean') {
            if (res.value === true) {
                erg[ct] = li[i];
                ct++;
            }
        }
    }
    namespace.removevar(lauf);

    return {
        'ctype': 'list',
        'value': erg
    };

};


evaluator.flatten$1 = function(args, modifs) {
    function recurse(lst, level) {
        if (level === -1 || lst.ctype !== "list")
            return lst;
        return [].concat.apply([], lst.value.map(function(elt) {
            return recurse(elt, level - 1);
        }));
    }
    var lst = evaluateAndVal(args[0]);
    if (lst.ctype !== "list")
        return lst;
    var levels = modifs.levels;
    if (levels === undefined) {
        levels = 1;
    } else {
        levels = evaluate(levels);
        if (levels.ctype === "number")
            levels = levels.value.real;
        else if (levels.ctype === "string" && levels.value === "all")
            levels = -2;
        else
            levels = 1;
    }
    return {
        'ctype': 'list',
        'value': recurse(lst, levels)
    };
};


function infix_semicolon(args, modifs) { //OK
    var u0 = (args[0].ctype === 'void');
    var u1 = (args[1].ctype === 'void');

    if (u0 && u1) {
        return nada;
    }
    if (!u0 && u1) {
        return evaluate(args[0]);
    }
    if (!u0 && !u1) {
        evaluate(args[0]); //Wegen sideeffects
    }
    if (!u1) {
        return evaluate(args[1]);
    }
    return nada;
}


evaluator.createvar$1 = function(args, modifs) { //OK
    if (args[0].ctype === 'variable') {
        var v = args[0].name;
        namespace.newvar(v);
    }
    return nada;
};

evaluator.local = function(args, modifs) { //VARIADIC!

    for (var i = 0; i < args.length; i++) {
        if (args[i].ctype === 'variable') {
            var v = args[i].name;
            namespace.newvar(v);
        }
    }

    return nada;

};


evaluator.removevar$1 = function(args, modifs) { //OK
    var ret = evaluate(args[0]);
    if (args[0].ctype === 'variable') {
        var v = args[0].name;
        namespace.removevar(v);
    }
    return ret;
};


evaluator.release = function(args, modifs) { //VARIADIC!

    if (args.length === 0)
        return nada;


    var ret = evaluate(args[args.length - 1]);

    for (var i = 0; i < args.length; i++) {
        if (args[i].ctype === 'variable') {
            var v = args[i].name;
            namespace.removevar(v);
        }
    }

    return ret;

};

evaluator.regional = function(args, modifs) { //VARIADIC!

    for (var i = 0; i < args.length; i++) {
        if (args[i].ctype === 'variable') {
            var v = args[i].name;
            namespace.newvar(v);
            namespace.pushVstack(v);
        }
    }
    return nada;

};


evaluator.genList = function(args, modifs) { //VARIADIC!
    var erg = [];
    for (var i = 0; i < args.length; i++) {
        erg[i] = evaluate(args[i]);
    }
    return {
        'ctype': 'list',
        'value': erg
    };
};


eval_helper.assigntake = function(data, what) { //TODO: Bin nicht ganz sicher obs das so tut
    var lhs = data.args[0];
    var where = evaluate(lhs);
    var ind = evaluateAndVal(data.args[1]);
    var rhs = nada;

    if (where.ctype === 'list' || where.ctype === 'string') {
        var ind1 = Math.floor(ind.value.real);
        if (ind1 < 0) {
            ind1 = where.value.length + ind1 + 1;
        }
        if (ind1 > 0 && ind1 <= where.value.length) {
            if (where.ctype === 'list') {
                var lst = where.value.slice();
                lst[ind1 - 1] = evaluate(what);
                rhs = List.turnIntoCSList(lst);
            } else {
                var str = where.value;
                str = str.substring(0, ind1 - 1) +
                    niceprint(evaluate(what)) +
                    str.substring(ind1, str.length);
                rhs = General.string(str);
            }
        }
    }
    infix_assign([lhs, rhs]);
};


eval_helper.assigndot = function(data, what) {
    var where = evaluate(data.obj);
    var field = data.key;
    if (where.ctype === 'geo' && field) {
        Accessor.setField(where.value, field, what);
    }

    return nada;

};


eval_helper.assignlist = function(vars, vals) {
    var n = vars.length;
    var m = vals.length;
    if (m < n) n = m;

    for (var i = 0; i < n; i++) {
        var name = vars[i];
        var val = vals[i];
        infix_assign([name, val], []);

    }


};


function infix_assign(args, modifs) {

    var u0 = (args[0].ctype === 'undefined');
    var u1 = (args[1].ctype === 'undefined');
    var v1 = evaluate(args[1]);
    if (u0 || u1) {
        return nada;
    }
    if (args[0].ctype === 'variable') {
        namespace.setvar(args[0].name, v1);
    } else if (args[0].ctype === 'infix') {
        if (args[0].oper === '_') {
            // Copy on write
            eval_helper.assigntake(args[0], v1);
        } else {
            console.error("Can't use infix expression as lvalue");
        }
    } else if (args[0].ctype === 'field') {
        eval_helper.assigndot(args[0], v1);
    } else if (args[0].ctype === 'function' && args[0].oper === 'genList') {
        if (v1.ctype === "list") {
            eval_helper.assignlist(args[0].args, v1.value);
        } else {
            console.error("Expected list in rhs of assignment");
        }
    } else {
        console.error("Left hand side of assignment is not a recognized lvalue");
    }
    return v1;
}


function infix_define(args, modifs) {

    var u0 = (args[0].ctype === 'undefined');
    var u1 = (args[1].ctype === 'undefined');

    if (u0 || u1) {
        return nada;
    }
    if (args[0].ctype === 'function') {
        var fname = args[0].oper;
        var ar = args[0].args;
        var body = args[1];
        myfunctions[fname] = {
            'oper': fname,
            'body': body,
            'arglist': ar
        };
    }

    return nada;
}


evaluator.if$2 = function(args, modifs) { //OK
    return evaluator.if$3(args, modifs);
};

evaluator.if$3 = function(args, modifs) { //OK

    var u0 = (args[0].ctype === 'undefined');
    var u1 = (args[1].ctype === 'undefined');

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'boolean') {
        if (v0.value === true) {
            return evaluate(args[1]);
        } else if (args.length === 3) {
            return evaluate(args[2]);
        }
    }

    return nada;

};

function comp_equals(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return {
            'ctype': 'boolean',
            'value': (v0.value.real === v1.value.real) &&
                (v0.value.imag === v1.value.imag)
        };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value === v1.value)
        };
    }
    if (v0.ctype === 'boolean' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (v0.value === v1.value)
        };
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        var erg = List.equals(v0, v1);
        return erg;
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
}

function comp_notequals(args, modifs) {
    return General.not(comp_equals(args, modifs));
}

function comp_almostequals(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return {
            'ctype': 'boolean',
            'value': CSNumber._helper.isAlmostEqual(v0, v1)
        };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value === v1.value)
        };
    }
    if (v0.ctype === 'boolean' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (v0.value === v1.value)
        };
    }
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        var erg = List.almostequals(v0, v1);
        return erg;
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
}


evaluator.and$2 = infix_and;

function infix_and(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    if (v0.ctype === 'boolean' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (v0.value && v1.value)
        };
    }

    return nada;
}


evaluator.or$2 = infix_or;

function infix_or(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    if (v0.ctype === 'boolean' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (v0.value || v1.value)
        };
    }

    return nada;
}


evaluator.xor$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    if (v0.ctype === 'boolean' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (v0.value !== v1.value)
        };
    }

    return nada;
};


evaluator.not$1 = function(args, modifs) {
    var v = evaluateAndVal(args[0]);

    if (v.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (!v.value)
        };
    }

    return nada;
};

function prefix_not(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    if (v0.ctype === 'void' && v1.ctype === 'boolean') {
        return {
            'ctype': 'boolean',
            'value': (!v1.value)
        };
    }

    return nada;
}


function postfix_numb_degree(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    if (v0.ctype === 'number' && v1.ctype === 'void') {
        return General.withUsage(CSNumber.realmult(Math.PI / 180, v0), "Angle");
    }

    return nada;
}


function comp_notalmostequals(args, modifs) {
    return General.not(comp_almostequals(args, modifs));
}


function comp_ugt(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real > v1.value.real + CSNumber.eps)
            };
    }
    return nada;
}

function comp_uge(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real > v1.value.real - CSNumber.eps)
            };
    }
    return nada;
}

function comp_ult(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real < v1.value.real - CSNumber.eps)
            };
    }
    return nada;
}

function comp_ule(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real < v1.value.real + CSNumber.eps)
            };
    }
    return nada;
}


function comp_gt(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real > v1.value.real)
            };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value > v1.value)
        };
    }
    return nada;
}


function comp_ge(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real >= v1.value.real)
            };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value >= v1.value)
        };
    }
    return nada;
}


function comp_le(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real <= v1.value.real)
            };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value <= v1.value)
        };
    }
    return nada;
}

function comp_lt(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) && CSNumber._helper.isAlmostReal(v1))
            return {
                'ctype': 'boolean',
                'value': (v0.value.real < v1.value.real)
            };
    }
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': (v0.value < v1.value)
        };
    }
    return nada;
}


function infix_sequence(args, modifs) { //OK
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return List.sequence(v0, v1);
    }
    return nada;
}

eval_helper.genericListMathGen = function(name, op, emptyval) {
    evaluator[name + "$1"] = function(args, modifs) {
        var v0 = evaluate(args[0]);
        if (v0.ctype !== 'list') {
            return nada;
        }
        var li = v0.value;
        if (li.length === 0) {
            return emptyval;
        }

        var erg = li[0];
        for (var i = 1; i < li.length; i++) {
            erg = op(erg, li[i]);
        }
        return erg;
    };
    var name$3 = name + "$3";
    evaluator[name + "$2"] = function(args, modifs) {
        return evaluator[name$3]([args[0], null, args[1]]);
    };
    evaluator[name$3] = function(args, modifs) {
        var v0 = evaluateAndVal(args[0]);
        if (v0.ctype !== 'list') {
            return nada;
        }
        var li = v0.value;
        if (li.length === 0) {
            return emptyval;
        }

        var lauf = '#';
        if (args[1] !== null) {
            if (args[1].ctype === 'variable') {
                lauf = args[1].name;
            }
        }

        namespace.newvar(lauf);
        namespace.setvar(lauf, li[0]);
        var erg = evaluate(args[2]);
        for (var i = 1; i < li.length; i++) {
            namespace.setvar(lauf, li[i]);
            var b = evaluate(args[2]);
            erg = op(erg, b);
        }
        namespace.removevar(lauf);
        return erg;
    };
};

eval_helper.genericListMathGen("product", General.mult, CSNumber.real(1));
eval_helper.genericListMathGen("sum", General.add, CSNumber.real(0));
eval_helper.genericListMathGen("max", General.max, nada);
eval_helper.genericListMathGen("min", General.min, nada);

evaluator.max$2 = function(args, modifs) {
    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype === "list")
        return evaluator.max$3([v1, null, args[1]]);
    var v2 = evaluateAndVal(args[1]);
    return evaluator.max$1([List.turnIntoCSList([v1, v2])]);
};

evaluator.min$2 = function(args, modifs) {
    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype === "list")
        return evaluator.min$3([v1, null, args[1]]);
    var v2 = evaluateAndVal(args[1]);
    return evaluator.min$1([List.turnIntoCSList([v1, v2])]);
};

evaluator.add$2 = infix_add;

function infix_add(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var erg = General.add(v0, v1);
    if (v0.usage === "Angle" && v1.usage === "Angle")
        erg = General.withUsage(erg, "Angle");
    return erg;
}

evaluator.sub$2 = infix_sub;

function infix_sub(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var erg = General.sub(v0, v1);
    if (v0.usage === "Angle" && v1.usage === "Angle")
        erg = General.withUsage(erg, "Angle");
    return erg;
}

evaluator.mult$2 = infix_mult;

function infix_mult(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var erg = General.mult(v0, v1);
    if (v0.usage === "Angle" && !v1.usage)
        erg = General.withUsage(erg, "Angle");
    else if (v1.usage === "Angle" && !v0.usage)
        erg = General.withUsage(erg, "Angle");
    return erg;
}

evaluator.div$2 = infix_div;

function infix_div(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var erg = General.div(v0, v1);
    if (v0.usage === "Angle" && !v1.usage)
        erg = General.withUsage(erg, "Angle");
    else if (v1.usage === "Angle" && !v0.usage)
        erg = General.withUsage(erg, "Angle");
    return erg;
}


evaluator.mod$2 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.mod(v0, v1);
    }
    return nada;

};

evaluator.pow$2 = infix_pow;

function infix_pow(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.pow(v0, v1);
    }
    return nada;

}


///////////////////////////////
//     UNARY MATH OPS        //
///////////////////////////////


evaluator.exp$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.exp(v0);
    }
    return nada;
};

evaluator.sin$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.sin(v0);
    }
    return nada;
};

evaluator.sqrt$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.sqrt(v0);
    }
    return nada;
};

eval_helper.laguerre = function(cs, x, maxiter) {
    if (cs.ctype !== 'list')
        return nada;
    var n = cs.value.length - 1,
        i;
    for (i = 0; i <= n; i++)
        if (cs.value[i].ctype !== 'number')
            return nada;
    if (x.ctype !== 'number')
        return nada;
    var rand = [1.0, 0.3141, 0.5926, 0.5358, 0.9793, 0.2385, 0.6264, 0.3383, 0.2795, 0.0288];
    var a, p, q, s, g, g2, h, r, d1, d2;
    var tol = 1e-14;
    for (var iter = 1; iter <= maxiter; iter++) {
        s = CSNumber.real(0.0);
        q = CSNumber.real(0.0);
        p = cs.value[n];

        for (i = n - 1; i >= 0; i--) {
            s = CSNumber.add(q, CSNumber.mult(s, x));
            q = CSNumber.add(p, CSNumber.mult(q, x));
            p = CSNumber.add(cs.value[i], CSNumber.mult(p, x));
        }

        if (CSNumber._helper.isLessThan(CSNumber.abs(p), CSNumber.real(tol)))
            return x;

        g = CSNumber.div(q, p);
        g2 = CSNumber.mult(g, g);
        h = CSNumber.sub(g2, CSNumber.div(CSNumber.mult(CSNumber.real(2.0), s), p));
        r = CSNumber.sqrt(CSNumber.mult(CSNumber.real(n - 1), CSNumber.sub(CSNumber.mult(CSNumber.real(n), h), g2)));
        d1 = CSNumber.add(g, r);
        d2 = CSNumber.sub(g, r);
        if (CSNumber._helper.isLessThan(CSNumber.abs(d1), CSNumber.abs(d2)))
            d1 = d2;
        if (CSNumber._helper.isLessThan(CSNumber.real(tol), CSNumber.abs(d1)))
            a = CSNumber.div(CSNumber.real(n), d1);
        else
            a = CSNumber.mult(CSNumber.add(CSNumber.abs(x), CSNumber.real(1.0)), CSNumber.complex(Math.cos(iter), Math.sin(iter)));
        if (CSNumber._helper.isLessThan(CSNumber.abs(a), CSNumber.real(tol)))
            return x;
        if (iter % 20 === 0)
            a = CSNumber.mult(a, CSNumber.real(rand[iter / 20]));
        x = CSNumber.sub(x, a);
    }
    return x;
};

evaluator.roots$1 = function(args, modifs) {
    var cs = evaluateAndVal(args[0]);
    if (cs.ctype === 'list') {
        var i;
        for (i = 0; i < cs.value.length; i++)
            if (cs.value[i].ctype !== 'number')
                return nada;

        var roots = [];
        var cs_orig = cs;
        var n = cs.value.length - 1;
        for (i = 0; i < n; i++) {
            roots[i] = eval_helper.laguerre(cs, CSNumber.zero, 200);
            roots[i] = eval_helper.laguerre(cs_orig, roots[i], 1);
            var fx = [];
            fx[n - i] = cs.value[n - i];
            for (var j = n - i; j > 0; j--)
                fx[j - 1] = CSNumber.add(cs.value[j - 1], CSNumber.mult(fx[j], roots[i]));
            fx.shift();
            cs = List.turnIntoCSList(fx);
        }
        return List.sort1(List.turnIntoCSList(roots));
    }
    return nada;
};

evaluator.autodiff$3 = function(args, modifs) {
    var varname = "x"; // fix this later
    var ffunc;
    if (args[0].ctype === "function") {
        ffunc = myfunctions[args[0].oper].body;
        varname = args[0].args[0].name;
    } else if (typeof(args[0].impl) === "function")
        ffunc = args[0];
    else {
        console.log("could not parse function");
        return nada;
    }
    var xarr = evaluateAndVal(args[1]);
    var grade = evaluateAndVal(args[2]);

    if (grade.value.real < 1) {
        console.log("grade cant be < 1");
        return nada;
    }

    grade = CSNumber.add(grade, CSNumber.real(1));
    var erg = CSad.autodiff(ffunc, varname, xarr, grade);
    return erg;
};

evaluator.cos$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.cos(v0);
    }
    return nada;
};


evaluator.tan$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.tan(v0);
    }
    return nada;
};

evaluator.arccos$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.arccos(v0);
    }
    return nada;
};


evaluator.arcsin$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.arcsin(v0);
    }
    return nada;
};


evaluator.arctan$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.arctan(v0);
    }
    return nada;
};

evaluator.arctan2$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return CSNumber.arctan2(v0, v1);
    }
    return nada;
};

evaluator.arctan2$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list' && v0.value.length === 2) {
        var tmp = v0.value;
        if (tmp[0].ctype === 'number' && tmp[1].ctype === 'number') {
            return evaluator.arctan2$2(tmp, modifs);
        }
    }
    return nada;
};


evaluator.log$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.log(v0);
    }
    return nada;

};


eval_helper.recursiveGen = function(op) {
    var numOp = CSNumber[op],
        listOp = List[op];
    evaluator[op + "$1"] = function(args, modifs) {
        var v0 = evaluateAndVal(args[0]);
        if (v0.ctype === 'number') {
            return numOp(v0);
        }
        if (v0.ctype === 'list') {
            return listOp(v0);
        }
        return nada;
    };
};

eval_helper.recursiveGen("im");
eval_helper.recursiveGen("re");
eval_helper.recursiveGen("conjugate");
eval_helper.recursiveGen("round");
eval_helper.recursiveGen("ceil");
eval_helper.recursiveGen("floor");
eval_helper.recursiveGen("abs");
evaluator.abs_infix = evaluator.abs$1;

///////////////////////////////
//        RANDOM             //
///////////////////////////////

evaluator.random$0 = function(args, modifs) {
    return CSNumber.real(CSNumber._helper.rand());
};

evaluator.random$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return CSNumber.complex(v0.value.real * CSNumber._helper.rand(), v0.value.imag * CSNumber._helper.rand());
    }
    return nada;
};

evaluator.seedrandom$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        CSNumber._helper.seedrandom(v0.value.real);
    }
    return nada;

};

evaluator.randomnormal$0 = function(args, modifs) {
    return CSNumber.real(CSNumber._helper.randnormal());
};

evaluator.randominteger$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        var r = v0.value.real | 0,
            i = v0.value.imag | 0;
        r = (r * CSNumber._helper.rand()) | 0;
        i = (i * CSNumber._helper.rand()) | 0;
        return CSNumber.complex(r, i);
    }
    return nada;
};

evaluator.randomint$1 = evaluator.randominteger$1;

evaluator.randombool$0 = function(args, modifs) {
    if (CSNumber._helper.rand() > 0.5) {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


///////////////////////////////
//        TYPECHECKS         //
///////////////////////////////

evaluator.isreal$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0)) {
            return {
                'ctype': 'boolean',
                'value': true
            };
        }
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isinteger$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) &&
            v0.value.real === Math.floor(v0.value.real)) {
            return {
                'ctype': 'boolean',
                'value': true
            };
        }
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.iseven$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) &&
            v0.value.real / 2 === Math.floor(v0.value.real / 2)) {
            return {
                'ctype': 'boolean',
                'value': true
            };
        }
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isodd$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        if (CSNumber._helper.isAlmostReal(v0) &&
            (v0.value.real - 1) / 2 === Math.floor((v0.value.real - 1) / 2)) {
            return {
                'ctype': 'boolean',
                'value': true
            };
        }
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.iscomplex$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isstring$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'string') {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.islist$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.ismatrix$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if ((List._helper.colNumb(v0)) !== -1) {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.iscircle$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "geo" && v0.value.kind === "C" && v0.value.matrix.usage === "Circle") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.isconic$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "geo" && v0.value.kind === "C") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isline$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "geo" && v0.value.kind === "L") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.ispoint$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "geo" && v0.value.kind === "P") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.isgeometric$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "geo") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isnumbermatrix$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if ((List.isNumberMatrix(v0)).value) {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isnumbervector$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if ((List.isNumberVector(v0)).value) {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.issun$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'geo' && v0.value.behavior !== undefined && v0.value.behavior.type === "Sun") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.ismass$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'geo' && v0.value.behavior !== undefined && v0.value.behavior.type === "Mass") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.isspring$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'geo' && v0.value.behavior !== undefined && v0.value.behavior.type === "Spring") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};


evaluator.isbouncer$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'geo' && v0.value.behavior !== undefined && v0.value.behavior.type === "Bouncer") {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.isundefined$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'undefined') {
        return {
            'ctype': 'boolean',
            'value': true
        };
    }
    return {
        'ctype': 'boolean',
        'value': false
    };
};

evaluator.matrixrowcolumn$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var n = List._helper.colNumb(v0);
    if (n !== -1) {
        return List.realVector([v0.value.length, v0.value[0].value.length]);
    }
    return nada;
};

evaluator.rowmatrix$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "list")
        return List.turnIntoCSList([v0]);
    return nada;
};

evaluator.columnmatrix$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === "list")
        return List.turnIntoCSList(v0.value.map(function(elt) {
            return List.turnIntoCSList([elt]);
        }));
    return nada;
};

evaluator.submatrix$3 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    var v2 = evaluate(args[2]);
    if (v0.ctype === "list" && v1.ctype === "number" && v2.ctype === "number") {
        var col = Math.round(v1.value.real);
        var row = Math.round(v2.value.real);
        var mat = v0.value.slice();
        if (row > 0 && row <= mat.length)
            mat.splice(row - 1, 1);
        var sane = true;
        var erg = mat.map(function(row1) {
            if (row1.ctype !== "list") {
                sane = false;
                return;
            }
            var row2 = row1.value.slice();
            if (col > 0 && col <= row2.length)
                row2.splice(col - 1, 1);
            return List.turnIntoCSList(row2);
        });
        if (!sane)
            return nada;
        return List.turnIntoCSList(erg);
    }
    return nada;
};


///////////////////////////////
//         GEOMETRY          //
///////////////////////////////


evaluator.complex$1 = function(args, modifs) {
    var a, b, c, v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        if (List.isNumberVector(v0)) {
            if (v0.value.length === 2) {
                a = v0.value[0];
                b = v0.value[1];
                return CSNumber.complex(a.value.real - b.value.imag, b.value.real + a.value.imag);
            }
            if (v0.value.length === 3) {
                a = v0.value[0];
                b = v0.value[1];
                c = v0.value[2];
                a = CSNumber.div(a, c);
                b = CSNumber.div(b, c);
                return CSNumber.complex(a.value.real - b.value.imag, b.value.real + a.value.imag);
            }
        }
    }
    return nada;
};

evaluator.gauss$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return List.realVector([v0.value.real, v0.value.imag]);
    }
    return nada;
};


evaluator.cross$2 = function(args, modifs) {
    var v0 = evaluateAndHomog(args[0]);
    var v1 = evaluateAndHomog(args[1]);
    if (v0 !== nada && v1 !== nada) {
        var erg = List.cross(v0, v1);
        if (v0.usage === "Point" && v1.usage === "Point") {
            erg = General.withUsage(erg, "Line");
        }
        if (v0.usage === "Line" && v1.usage === "Line") {
            erg = General.withUsage(erg, "Point");
        }
        return erg;
    }
    return nada;
};

evaluator.crossratio$4 = function(args, modifs) {
    var a0 = evaluate(args[0]);
    var a1 = evaluate(args[1]);
    var a2 = evaluate(args[2]);
    var a3 = evaluate(args[3]);

    var v0 = evaluateAndHomog(a0);
    var v1 = evaluateAndHomog(a1);
    var v2 = evaluateAndHomog(a2);
    var v3 = evaluateAndHomog(a3);
    if (v0 !== nada && v1 !== nada && v2 !== nada && v3 !== nada) {
        // TODO: can't handle four collinear points at infinity
        return List.crossratio3(v0, v1, v2, v3, List.ii);
    }

    if (a0.ctype === "number" && a1.ctype === "number" &&
        a2.ctype === "number" && a3.ctype === "number") {
        return CSNumber.div(
            CSNumber.mult(
                CSNumber.sub(a0, a2),
                CSNumber.sub(a1, a3)
            ), CSNumber.mult(
                CSNumber.sub(a0, a3),
                CSNumber.sub(a1, a2)
            )
        );
    }

    return nada;
};

evaluator.para$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var w0 = evaluateAndHomog(v0);
    var w1 = evaluateAndHomog(v1);

    if (v0 !== nada && v1 !== nada) {
        var u0 = v0.usage;
        var u1 = v1.usage;
        var p = w0;
        var l = w1;
        if (u0 === "Line" || u1 === "Point") {
            p = w1;
            l = w0;
        }
        var inf = List.linfty;
        var erg = List.cross(List.cross(inf, l), p);
        return General.withUsage(erg, "Line");
    }
    return nada;
};


evaluator.perp$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var w0 = evaluateAndHomog(v0);
    var w1 = evaluateAndHomog(v1);
    if (v0 !== nada && v1 !== nada) {
        var u0 = v0.usage || w0.usage;
        var u1 = v1.usage || w1.usage;
        var p = w0;
        var l = w1;
        if (u0 === "Line" || u1 === "Point") {
            p = w1;
            l = w0;
        }
        var tt = List.turnIntoCSList([l.value[0], l.value[1], CSNumber.zero]);
        var erg = List.cross(tt, p);
        return General.withUsage(erg, "Line");
    }
    return nada;
};

evaluator.perp$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (List._helper.isNumberVecN(v0, 2)) {
        var erg = List.turnIntoCSList([CSNumber.neg(v0.value[1]), v0.value[0]]);
        return erg;
    }
    return nada;
};

evaluator.parallel$2 = evaluator.para$2;

evaluator.perpendicular$2 = evaluator.perp$2;

evaluator.perpendicular$1 = evaluator.perp$1;

evaluator.meet$2 = function(args, modifs) {
    var v0 = evaluateAndHomog(args[0]);
    var v1 = evaluateAndHomog(args[1]);
    if (v0 !== nada && v1 !== nada) {
        var erg = List.cross(v0, v1);
        return General.withUsage(erg, "Point");
    }
    return nada;
};


evaluator.join$2 = function(args, modifs) {
    var v0 = evaluateAndHomog(args[0]);
    var v1 = evaluateAndHomog(args[1]);
    if (v0 !== nada && v1 !== nada) {
        var erg = List.cross(v0, v1);
        return General.withUsage(erg, "Line");
    }
    return nada;
};


evaluator.dist$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var diff = infix_sub([v0, v1], []);
    return evaluator.abs$1([diff], []);
};

evaluator.dist_infix = evaluator.dist$2;


evaluator.point$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (List._helper.isNumberVecN(v0, 3) || List._helper.isNumberVecN(v0, 2)) {
        return General.withUsage(v0, "Point");
    }
    return v0;
};

evaluator.line$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (List._helper.isNumberVecN(v0, 3)) {
        return General.withUsage(v0, "Line");
    }
    return v0;
};

evaluator.det$3 = function(args, modifs) {
    var v0 = evaluateAndHomog(args[0]);
    var v1 = evaluateAndHomog(args[1]);
    var v2 = evaluateAndHomog(args[2]);
    if (v0 !== nada && v1 !== nada && v2 !== nada) {
        var erg = List.det3(v0, v1, v2);
        return erg;
    }
};

evaluator.det$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            return List.det(v0);
        }
    }
    return nada;
};


evaluator.eig$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            return List.eig(v0);
        }
    }
    return nada;
};


evaluator.eigenvalues$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            var erg = List.eig(v0, false);
            return erg.value[0]; // return only eigenvals
        }
    }
    return nada;
};


evaluator.rank$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            return List.rank(v0, modifs.precision);
        }
    }
    return nada;
};


evaluator.kernel$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            var erg = List.nullSpace(v0, modifs.precision);
            return List.transpose(erg);
        }
    }
    return nada;
};


evaluator.eigenvectors$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            var erg = List.eig(v0);
            return erg.value[1]; // return only eigenvecs
        }
    }
    return nada;
};


evaluator.area$3 = function(args, modifs) {
    var v0 = evaluateAndHomog(args[0]);
    var v1 = evaluateAndHomog(args[1]);
    var v2 = evaluateAndHomog(args[2]);
    if (v0 !== nada && v1 !== nada && v2 !== nada) {
        var z0 = v0.value[2];
        var z1 = v1.value[2];
        var z2 = v2.value[2];
        if (!CSNumber._helper.isAlmostZero(z0) && !CSNumber._helper.isAlmostZero(z1) && !CSNumber._helper.isAlmostZero(z2)) {
            v0 = List.scaldiv(z0, v0);
            v1 = List.scaldiv(z1, v1);
            v2 = List.scaldiv(z2, v2);
            var erg = List.det3(v0, v1, v2);
            return CSNumber.realmult(0.5, erg);
        }
    }
    return nada;
};


evaluator.inverse$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length) {
            return List.inverse(v0);
        }
    }
    return nada;
};


evaluator.linearsolve$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'list') {
        var n = List._helper.colNumb(v0);
        if (n !== -1 && n === v0.value.length && List._helper.isNumberVecN(v1, n)) {
            return List.linearsolve(v0, v1);
        }
    }
    return nada;
};

var permutationsFixedList = [
    [ // 0
        []
    ],
    [ // 1
        [0]
    ],
    [ // 2,
        [0, 1],
        [1, 0]
    ],
    [ // 3
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0]
    ],
    [ // 4
        [0, 1, 2, 3],
        [0, 1, 3, 2],
        [0, 2, 1, 3],
        [0, 2, 3, 1],
        [0, 3, 1, 2],
        [0, 3, 2, 1],
        [1, 0, 2, 3],
        [1, 0, 3, 2],
        [1, 2, 0, 3],
        [1, 2, 3, 0],
        [1, 3, 0, 2],
        [1, 3, 2, 0],
        [2, 0, 1, 3],
        [2, 0, 3, 1],
        [2, 1, 0, 3],
        [2, 1, 3, 0],
        [2, 3, 0, 1],
        [2, 3, 1, 0],
        [3, 0, 1, 2],
        [3, 0, 2, 1],
        [3, 1, 0, 2],
        [3, 1, 2, 0],
        [3, 2, 0, 1],
        [3, 2, 1, 0]
    ]
];

function minCostMatching(w) {
    var n = w.length;
    if (n === 0) return [];
    if (n === 1) return [0];
    if (n === 2) {
        if (w[0][0] + w[1][1] <= w[0][1] + w[1][0]) return [0, 1];
        else return [1, 0];
    }
    if (n > 4)
        return hungarianMethod(w);
    var perms = permutationsFixedList[n];
    var bc = Number.POSITIVE_INFINITY;
    var bp = perms[0];
    for (var i = 0; i < perms.length; ++i) {
        var p = perms[i];
        var c = 0;
        for (var j = 0; j < n; ++j)
            c += w[j][p[j]];
        if (c < bc) {
            bc = c;
            bp = p;
        }
    }
    return bp;
}

function hungarianMethod(w) {
    // Hungarian Algorithm to determine a min-cost matching
    // for a square cost matrix given as JavaScript arrays (not Lists)
    // of floating point numbers (not CSNumbers).
    // The invariant v1[i1].cost + v2[i2].cost <= w[i1][i2] will be maintained.
    // The result is the matched column (inner index) for every row
    // (outer index) of the supplied weight matrix.

    var abs = Math.abs;
    var n = w.length;
    var i1, i2;
    var v1 = new Array(n);
    var v2 = new Array(n); // the two partitions
    var e = new Array(n); // excess matrix, zero indicates edge in eq. subgr.
    for (i1 = 0; i1 < n; ++i1)
        e[i1] = new Array(n);

    function mkVertex() {
        return {
            matched: -1, // index of partner in matching
            prev: -1, // previous node in alternating tree
            start: -1, // root of alternating path
            cost: 0, // vertex cost for hungarian method
            used: false, // flag used for matching and vertex cover
            leaf: false // indicates queued item for matching computation
        };
    }

    for (i1 = 0; i1 < n; ++i1) {
        v1[i1] = mkVertex();
        v2[i1] = mkVertex();
        v1[i1].cost = w[i1][0];
        for (i2 = 1; i2 < n; ++i2) {
            if (v1[i1].cost > w[i1][i2])
                v1[i1].cost = w[i1][i2];
        }
    }

    for (;;) {

        // Step 1: update excess matrix: edge cost minus sum of vertex costs
        for (i1 = 0; i1 < n; ++i1) {
            for (i2 = 0; i2 < n; ++i2) {
                e[i1][i2] = w[i1][i2] - v1[i1].cost - v2[i2].cost;
                if (e[i1][i2] < (abs(w[i1][i2]) + abs(v1[i1].cost) +
                        abs(v2[i2].cost)) * 1e-14)
                    e[i1][i2] = 0;
            }
        }

        // Step 2: find a maximal matching in the equality subgraph
        for (i1 = 0; i1 < n; ++i1)
            v1[i1].matched = v2[i1].matched = -1; // reset
        var matchsize = 0;
        for (;;) {
            for (i1 = 0; i1 < n; ++i1) {
                v1[i1].used = v1[i1].leaf = v2[i1].used = v2[i1].leaf = false;
                if (v1[i1].matched !== -1) continue;
                v1[i1].start = i1;
                v1[i1].used = v1[i1].leaf = true;
                v1[i1].prev = -1;
            }
            var haspath = false;
            var empty = false;
            while (!empty) {

                // follow edges not in matching
                for (i1 = 0; i1 < n; ++i1) {
                    if (!v1[i1].leaf) continue;
                    v1[i1].leaf = false;
                    for (i2 = 0; i2 < n; ++i2) {
                        if (v2[i2].used || e[i1][i2] > 0)
                            continue;
                        if (v1[i1].matched === i2)
                            continue;
                        v2[i2].prev = i1;
                        v2[i2].start = v1[i1].start;
                        v2[i2].used = v2[i2].leaf = true;
                        if (v2[i2].matched === -1) {
                            v1[v2[i2].start].prev = i2;
                            haspath = true;
                            break;
                        }
                    } // for i2
                } // for i1

                if (haspath) break;
                empty = true;

                // follow edge in matching
                for (i2 = 0; i2 < n; ++i2) {
                    if (!v2[i2].leaf) continue;
                    v2[i2].leaf = false;
                    i1 = v2[i2].matched;
                    if (v1[i1].used) continue;
                    v1[i1].prev = i2;
                    v1[i1].start = v2[i2].start;
                    v1[i1].used = v1[i1].leaf = true;
                    empty = false;
                } // for i2

            } // while !empty
            if (!haspath) break;

            // now augment every path found
            for (var start = 0; start < n; ++start) {
                if (v1[start].matched !== -1 || v1[start].prev === -1) continue;
                i2 = v1[start].prev;
                do {
                    i1 = v2[i2].prev;
                    v2[i2].matched = i1;
                    v1[i1].matched = i2;
                    i2 = v1[i1].prev;
                } while (i1 !== start);
                ++matchsize;
            }
        } // for(;;)

        if (matchsize === n) break; // found maximum weight matching

        // Step 3: find vertex cover on equality subgraph
        for (i1 = 0; i1 < n; ++i1) {
            v1[i1].used = v1[i1].leaf = v2[i1].used = v2[i1].leaf = false;
        }
        for (i1 = 0; i1 < n; ++i1) {
            if (v1[i1].matched === -1) notincover1(i1);
        }
        for (i2 = 0; i2 < n; ++i2) {
            if (v2[i2].matched === -1) notincover2(i2);
        }
        for (i1 = 0; i1 < n; ++i1) {
            if (v1[i1].matched === -1) continue;
            if (v1[i1].used || v2[v1[i1].matched].used) continue;
            v1[i1].used = true;
        }

        // Step 4: adjust costs.
        // cost change is minimal cost in the part not covered
        var eps = Number.POSITIVE_INFINITY;
        for (i1 = 0; i1 < n; ++i1) {
            if (v1[i1].used) continue;
            for (i2 = 0; i2 < n; ++i2) {
                if (v2[i2].used) continue;
                if (eps > e[i1][i2]) eps = e[i1][i2];
            }
        }
        // assert(eps>0);
        // reduce total cost by applying cost change
        for (i1 = 0; i1 < n; ++i1) {
            if (!v1[i1].used) v1[i1].cost += eps;
            if (v2[i1].used) v2[i1].cost -= eps;
        }
    }

    // We have a result, so let's format it appropriately
    var res = new Array(n);
    for (i1 = 0; i1 < n; ++i1) {
        i2 = v1[i1].matched;
        res[i1] = i2;
    }
    return res;

    // v1[i1] is definitely not in the cover
    //  => all edges must have their opposite endpoint covered
    function notincover1(i1) {
        for (var i2 = 0; i2 < n; ++i2) {
            if (e[i1][i2] > 0 || v2[i2].used) continue;
            v2[i2].used = true;
            notincover1(v2[i2].matched);
        }
    }

    // symmetric to the above
    function notincover2(i2) {
        for (var i1 = 0; i1 < n; ++i1) {
            if (e[i1][i2] > 0 || v1[i1].used) continue;
            v1[i1].used = true;
            notincover2(v1[i1].matched);
        }
    }

}

evaluator.mincostmatching$1 = function(args, modifs) {
    var costMatrix = evaluate(args[0]);
    if (List.isNumberMatrix(costMatrix)) {
        var nr = costMatrix.value.length;
        var nc = List._helper.colNumb(costMatrix);
        var size = (nr < nc ? nc : nr);
        var i, j;
        var w = new Array(size);
        for (i = 0; i < size; ++i) {
            w[i] = new Array(size);
            for (j = 0; j < size; ++j) {
                if (i < nr && j < nc)
                    w[i][j] = costMatrix.value[i].value[j].value.real;
                else
                    w[i][j] = 0;
            }
        }
        var matching = minCostMatching(w);
        var res = new Array(nr);
        for (i = 0; i < nr; ++i) {
            j = matching[i];
            if (j < nc)
                res[i] = CSNumber.real(j + 1);
            else
                res[i] = CSNumber.real(0);
        }
        return List.turnIntoCSList(res);
    }
    return nada;
};

///////////////////////////////
//    List Manipulations     //
///////////////////////////////

function infix_take(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v1.ctype === 'number') {
        var ind = Math.floor(v1.value.real);
        if (v0.ctype === 'list' || v0.ctype === 'string') {
            if (ind < 0) {
                ind = v0.value.length + ind + 1;
            }
            if (ind > 0 && ind < v0.value.length + 1) {
                if (v0.ctype === 'list') {
                    return v0.value[ind - 1];
                }
                return {
                    "ctype": "string",
                    "value": v0.value.charAt(ind - 1)
                };
            }
            return nada;
        }
    }
    if (v1.ctype === 'list') { //Hab das jetzt mal rekursiv gemacht, ist anders als in Cindy
        var li = [];
        for (var i = 0; i < v1.value.length; i++) {
            var v1i = evaluateAndVal(v1.value[i]);
            li[i] = infix_take([v0, v1i], []);
        }
        return List.turnIntoCSList(li);
    }
    return nada;
}


evaluator.length$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list' || v0.ctype === 'string') {
        return CSNumber.real(v0.value.length);
    }
    return nada;
};


evaluator.pairs$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.pairs(v0);
    }
    return nada;
};

evaluator.triples$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.triples(v0);
    }
    return nada;
};

evaluator.cycle$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.cycle(v0);
    }
    return nada;
};

evaluator.consecutive$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.consecutive(v0);
    }
    return nada;
};


evaluator.reverse$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.reverse(v0);
    }
    return nada;
};

evaluator.directproduct$2 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.directproduct(v0, v1);
    }
    return nada;
};

evaluator.concat$2 = infix_concat;

function infix_concat(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.concat(v0, v1);
    }
    if (v0.ctype === 'shape' && v1.ctype === 'shape') {
        return eval_helper.shapeconcat(v0, v1);
    }
    return nada;
}

evaluator.common$2 = infix_common;

function infix_common(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.set(List.common(v0, v1));
    }
    if (v0.ctype === 'shape' && v1.ctype === 'shape') {
        return eval_helper.shapecommon(v0, v1);
    }
    return nada;
}

evaluator.remove$2 = infix_remove;

function infix_remove(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'list' && v1.ctype === 'list') {
        return List.remove(v0, v1);
    }
    if (v0.ctype === 'shape' && v1.ctype === 'shape') {
        return eval_helper.shaperemove(v0, v1);
    }
    return nada;
}


evaluator.append$2 = infix_append;

function infix_append(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'list') {
        return List.append(v0, v1);
    }
    return nada;
}

evaluator.prepend$2 = infix_prepend;

function infix_prepend(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v1.ctype === 'list') {
        return List.prepend(v0, v1);
    }
    return nada;
}

evaluator.contains$2 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'list') {
        return List.contains(v0, v1);
    }
    return nada;
};

evaluator.sort$2 = function(args, modifs) {
    return evaluator.sort$3([args[0], null, args[1]], modifs);
};

evaluator.sort$3 = function(args, modifs) { //OK
    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype !== 'list') {
        return nada;
    }

    var lauf = '#';
    if (args[1] !== null) {
        if (args[1].ctype === 'variable') {
            lauf = args[1].name;
        }
    }

    var li = v1.value;
    var erg = [];
    namespace.newvar(lauf);
    var i;
    for (i = 0; i < li.length; i++) {
        namespace.setvar(lauf, li[i]);
        erg[i] = {
            val: li[i],
            result: evaluate(args[2])
        };
    }
    namespace.removevar(lauf);

    erg.sort(General.compareResults);
    var erg1 = [];
    for (i = 0; i < li.length; i++) {
        erg1[i] = erg[i].val;
    }

    return {
        'ctype': 'list',
        'value': erg1
    };
};

evaluator.sort$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.sort1(v0);
    }
    return nada;
};

evaluator.set$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        return List.set(v0);
    }
    return nada;
};

function gcd(a, b) {
    a = a | 0;
    b = b | 0;
    if (a === 0 && b === 0)
        return 0;
    while (b !== 0) {
        var c = a;
        a = b;
        b = (c % b) | 0;
    }
    return a;
}

evaluator.combinations$2 = function(args, modifs) {
    var base = evaluate(args[0]);
    var count = evaluate(args[1]);
    var n, k, current, res;

    if (count.ctype === 'number') {
        k = count.value.real | 0;
        if (base.ctype === 'number') {
            n = base.value.real | 0;
            if (n - k < k) k = n - k;
            if (k < 0) return CSNumber.real(0);
            if (k === 0) return CSNumber.real(1);
            if (k === 1) return base;
            // compute (n! / (n-k)!) / k! efficiently
            var numer = 1;
            var denom = 1;
            for (var i = 1; i <= k; ++i) {
                // Use "| 0" to indicate integer arithmetic
                var x = (n - k + i) | 0;
                var y = i | 0;
                var g = gcd(x, y) | 0;
                x = (x / g) | 0;
                y = (y / g) | 0;
                g = gcd(numer, y) | 0;
                numer = (numer / g) | 0;
                y = (y / g) | 0;
                g = gcd(x, denom) | 0;
                x = (x / g) | 0;
                denom = (denom / g) | 0;
                numer = (numer * x) | 0;
                denom = (denom * y) | 0;
            }
            return CSNumber.real(numer / denom);
        }
        if (base.ctype === 'list') {
            n = base.value.length;
            if (k < 0 || k > n)
                return List.turnIntoCSList([]);
            if (k === 0)
                return List.turnIntoCSList([List.turnIntoCSList([])]);
            if (k === n)
                return List.turnIntoCSList([base]);
            res = [];
            current = new Array(k);
            pick(0, 0);
            return List.turnIntoCSList(res);
        }
    }
    return nada;

    function pick(i, s) {
        if (i === k) {
            res.push(List.turnIntoCSList(current.slice()));
        } else if (s < n) {
            current[i] = base.value[s];
            pick(i + 1, s + 1);
            pick(i, s + 1);
        }
    }
};

evaluator.zeromatrix$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v0.ctype === 'number' && v1.ctype === 'number') {
        return List.zeromatrix(v0, v1);
    }
    return nada;
};


evaluator.zerovector$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        return List.zerovector(v0);
    }
    return nada;
};

evaluator.transpose$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list' && List._helper.colNumb(v0) !== -1) {
        return List.transpose(v0);
    }
    return nada;
};

evaluator.row$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v1.ctype === 'number' && v0.ctype === 'list' && List._helper.colNumb(v0) !== -1) {
        return List.row(v0, v1);
    }
    return nada;
};

evaluator.column$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    if (v1.ctype === 'number' && v0.ctype === 'list' && List._helper.colNumb(v0) !== -1) {
        return List.column(v0, v1);
    }
    return nada;
};


///////////////////////////////
//         COLOR OPS         //
///////////////////////////////

evaluator.red$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        var c = Math.min(1, Math.max(0, v0.value.real));
        return List.realVector([c, 0, 0]);
    }
    return nada;
};

evaluator.green$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        var c = Math.min(1, Math.max(0, v0.value.real));
        return List.realVector([0, c, 0]);
    }
    return nada;
};

evaluator.blue$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        var c = Math.min(1, Math.max(0, v0.value.real));
        return List.realVector([0, 0, c]);
    }
    return nada;
};

evaluator.gray$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        var c = Math.min(1, Math.max(0, v0.value.real));
        return List.realVector([c, c, c]);
    }
    return nada;
};

evaluator.grey$1 = evaluator.gray$1;

eval_helper.HSVtoRGB = function(h, s, v) {

    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s;
        v = h.v;
        h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return List.realVector([r, g, b]);
};

evaluator.hue$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'number') {
        var c = v0.value.real;
        c = c - Math.floor(c);
        return eval_helper.HSVtoRGB(c, 1, 1);
    }
    return nada;
};

///////////////////////////////
//      shape booleans       //
///////////////////////////////


eval_helper.shapeconvert = function(a) {
    var i, li;
    if (a.type === "circle") {
        var pt = a.value.value[0];
        var aa = General.div(pt, pt.value[2]);
        var mx = aa.value[0].value.real;
        var my = aa.value[1].value.real;
        var r = a.value.value[1].value.real;
        li = [];
        var n = 36;
        var d = Math.PI * 2 / n;
        for (i = 0; i < n; i++) {
            li[i] = {
                X: (mx + Math.cos(i * d) * r),
                Y: (my + Math.sin(i * d) * r)
            };
        }

        return [li];
    }
    if (a.type === "polygon") {
        var erg = [];
        for (i = 0; i < a.value.length; i++) {
            var pol = a.value[i];
            li = [];
            for (var j = 0; j < pol.length; j++) {
                li[j] = {
                    X: pol[j].X,
                    Y: pol[j].Y
                };
            }
            erg[i] = li;
        }
        return erg;
    }


};


eval_helper.shapeop = function(a, b, op) {

    var convert;
    var aa = eval_helper.shapeconvert(a);
    var bb = eval_helper.shapeconvert(b);
    var scale = 1000;
    ClipperLib.JS.ScaleUpPaths(aa, scale);
    ClipperLib.JS.ScaleUpPaths(bb, scale);
    var cpr = new ClipperLib.Clipper();
    cpr.AddPaths(aa, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(bb, ClipperLib.PolyType.ptClip, true);
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clipType = op;
    var solution_paths = new ClipperLib.Paths();
    cpr.Execute(clipType, solution_paths, subject_fillType, clip_fillType);
    ClipperLib.JS.ScaleDownPaths(solution_paths, scale);
    //    console.log(JSON.stringify(solution_paths));    
    return {
        ctype: "shape",
        type: "polygon",
        value: solution_paths
    };

};

eval_helper.shapecommon = function(a, b) {
    return eval_helper.shapeop(a, b, ClipperLib.ClipType.ctIntersection);
};

eval_helper.shaperemove = function(a, b) {
    return eval_helper.shapeop(a, b, ClipperLib.ClipType.ctDifference);
};

eval_helper.shapeconcat = function(a, b) {
    return eval_helper.shapeop(a, b, ClipperLib.ClipType.ctUnion);
};


///////////////////////////////
//            IO             //
///////////////////////////////

evaluator.key$0 = function(args, modifs) { //OK
    return {
        ctype: "string",
        value: cskey
    };
};


evaluator.keycode$0 = function(args, modifs) { //OK
    return CSNumber.real(cskeycode);
};


evaluator.mouse$0 = function(args, modifs) { //OK
    var x = csmouse[0];
    var y = csmouse[1];
    return List.realVector([x, y]);
};

evaluator.mover$0 = function(args, modifs) { //OK
    if (move && move.mover)
        return {
            ctype: "geo",
            value: move.mover,
            type: "P"
        };
    else
        console.log("Not moving anything at the moment");
    return nada;
};


///////////////////////////////
//      Graphic State        //
///////////////////////////////

evaluator.translate$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list') {
        if (List.isNumberVector(v0)) {
            if (v0.value.length === 2) {
                var a = v0.value[0];
                var b = v0.value[1];
                csport.translate(a.value.real, b.value.real);
                return nada;
            }
        }
    }
    return nada;
};


evaluator.rotate$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        csport.rotate(v0.value.real);
        return nada;
    }
    return nada;
};


evaluator.scale$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        csport.scale(v0.value.real);
        return nada;
    }
    return nada;
};


evaluator.greset$0 = function(args, modifs) {
    var n = csgstorage.stack.length;
    csport.greset();
    for (var i = 0; i < n; i++) {
        csctx.restore();
    }
    return nada;
};


evaluator.gsave$0 = function(args, modifs) {
    csport.gsave();
    csctx.save();
    return nada;
};


evaluator.grestore$0 = function(args, modifs) {
    csport.grestore();
    csctx.restore();
    return nada;
};


evaluator.color$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list' && List.isNumberVector(v0).value) {
        csport.setcolor(v0);
    }
    return nada;
};


evaluator.linecolor$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list' && List.isNumberVector(v0).value) {
        csport.setlinecolor(v0);
    }
    return nada;
};


evaluator.pointcolor$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'list' && List.isNumberVector(v0).value) {
        csport.setpointcolor(v0);
    }
    return nada;
};

evaluator.alpha$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        csport.setalpha(v0);
    }
    return nada;
};

evaluator.pointsize$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        csport.setpointsize(v0);
    }
    return nada;
};

evaluator.linesize$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        csport.setlinesize(v0);
    }
    return nada;
};

evaluator.textsize$1 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        csport.settextsize(v0);
    }
    return nada;
};


//////////////////////////////////////////
//          Animation control           //
//////////////////////////////////////////

evaluator.playanimation$0 = function(args, modifs) {
    csplay();
    return nada;
};

evaluator.pauseanimation$0 = function(args, modifs) {
    cspause();
    return nada;
};

evaluator.stopanimation$0 = function(args, modifs) {
    csstop();
    return nada;
};


///////////////////////////////
//          String           //
///////////////////////////////


evaluator.replace$3 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    var v2 = evaluate(args[2]);
    if (v0.ctype === 'string' && v1.ctype === 'string' && v2.ctype === 'string') {
        var str0 = v0.value;
        var str1 = v1.value.replace(/[^A-Za-z0-9]/g, "\\$&");
        var str2 = v2.value.replace(/\$/g, "$$$$");
        var regex = new RegExp(str1, "g");
        str0 = str0.replace(regex, str2);
        return {
            ctype: "string",
            value: str0
        };
    }
};

evaluator.replace$2 = function(args, modifs) {
    var ind;
    var repl;
    var keyind;
    var from;

    /////HELPER/////
    function getReplStr(str, keys, from) {
        var s = "";
        ind = -1;
        keyind = -1;
        for (var i = 0; i < keys.length; i++) {
            var s1 = keys[i][0];
            var a = str.indexOf(s1, from);
            if (a !== -1) {
                if (ind === -1) {
                    s = s1;
                    ind = a;
                    keyind = i;
                } else if (a < ind) {
                    s = s1;
                    ind = a;
                    keyind = i;
                }
            }
        }
        return s;
    }

    //////////////// 

    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'string' && v1.ctype === 'list') {
        var s = v0.value;
        var rules = [];
        for (var i = 0; i < v1.value.length; i++) {
            var el = v1.value[i];
            if (el.ctype === "list" &&
                el.value.length === 2 &&
                el.value[0].ctype === "string" &&
                el.value[1].ctype === "string") {
                rules[rules.length] = [el.value[0].value, el.value[1].value];
            }

        }
        ind = -1;
        from = 0;
        var srep = getReplStr(s, rules, from);
        while (ind !== -1) {
            s = s.substring(0, ind) +
                (rules[keyind][1]) +
                s.substring(ind + (srep.length), s.length);
            from = ind + rules[keyind][1].length;
            srep = getReplStr(s, rules, from);
        }

        return {
            ctype: "string",
            value: s
        };
    }

    return nada;
};


evaluator.substring$3 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var v2 = evaluateAndVal(args[2]);
    if (v0.ctype === 'string' && v1.ctype === 'number' && v2.ctype === 'number') {
        var s = v0.value;
        return {
            ctype: "string",
            value: s.substring(Math.floor(v1.value.real),
                Math.floor(v2.value.real))
        };
    }
    return nada;
};


evaluator.tokenize$2 = function(args, modifs) { //TODO der ist gerade sehr uneffiktiv implementiert
    var li, i;
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        var convert = true;
        if (modifs.autoconvert !== undefined) {
            var erg = evaluate(modifs.autoconvert);
            if (erg.ctype === 'boolean') {
                convert = erg.value;
            }
        }


        var str = v0.value;
        var split = v1.value;
        var splitlist = str.split(split);
        li = [];
        for (i = 0; i < splitlist.length; i++) {
            var val = splitlist[i];
            if (convert) {
                var fl = parseFloat(val);
                if (!isNaN(fl))
                    val = fl;
            }
            li[i] = {
                ctype: "string",
                value: val
            };
        }
        return List.turnIntoCSList(li);
    }
    if (v0.ctype === 'string' && v1.ctype === 'list') {
        if (v1.value.length === 0) {
            return v0;
        }

        var token = v1.value[0];

        var tli = List.turnIntoCSList(tokens);
        var firstiter = evaluator.tokenize$2([args[0], token], modifs).value;

        li = [];
        for (i = 0; i < firstiter.length; i++) {
            var tokens = [];
            for (var j = 1; j < v1.value.length; j++) { //TODO: Das ist Notlösung weil ich das wegen 
                tokens[j - 1] = v1.value[j]; //CbV und CbR irgendwie anders nicht hinbekomme
            }

            tli = List.turnIntoCSList(tokens);
            li[i] = evaluator.tokenize$2([firstiter[i], tli], modifs);
        }
        return List.turnIntoCSList(li);
    }
    return nada;
};

evaluator.indexof$2 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    if (v0.ctype === 'string' && v1.ctype === 'string') {
        var str = v0.value;
        var code = v1.value;
        var i = str.indexOf(code);
        return CSNumber.real(i + 1);
    }
    return nada;
};

evaluator.indexof$3 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    var v1 = evaluate(args[1]);
    var v2 = evaluate(args[2]);
    if (v0.ctype === 'string' && v1.ctype === 'string' && v2.ctype === 'number') {
        var str = v0.value;
        var code = v1.value;
        var start = Math.round(v2.value.real);
        var i = str.indexOf(code, start - 1);
        return CSNumber.real(i + 1);
    }
    return nada;
};

evaluator.parse$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'string') {
        var code = condense(v0.value);
        var prog = analyse(code);
        return evaluate(prog);
    }
    return nada;
};

evaluator.unicode$1 = function(args, modifs) {
    var codepoint, str;
    var arg = evaluate(args[0]);
    var base = 16;
    if (modifs.base) {
        var b = evaluate(modifs.base);
        if (b.ctype === 'number')
            base = b.value.real;
    }
    if (arg.ctype === 'string') {
        codepoint = parseInt(arg.value, base);
    } else if (arg.ctype === 'number') {
        codepoint = arg.value.real;
    } else {
        return nada;
    }
    if (typeof String.fromCodePoint !== "undefined") {
        str = String.fromCodePoint(codepoint);
    } else if (codepoint <= 0xffff) {
        str = String.fromCharCode(codepoint);
    } else {
        var cp = codepoint - 0x10000;
        var hi = (cp >> 10) + 0xd800;
        var lo = (cp & 0x3ff) + 0xdc00;
        str = String.fromCharCode(hi, lo);
    }
    return General.string(str);
};

evaluator.international$1 = function(args, modifs) {
    return evaluator.international$2([args[0], null], modifs);
};

function defaultPluralForm(cnt) {
    return cnt === 1 ? 0 : 1;
}

evaluator.international$2 = function(args, modifs) {
    var arg = evaluate(args[0]);
    if (arg.ctype !== "string") return nada;
    var language = instanceInvocationArguments.language || "en";
    var tr = instanceInvocationArguments.translations || {};
    var trl = tr[language] || {};
    if (!trl.hasOwnProperty(arg.value)) return arg;
    var entry = trl[arg.value];
    if (typeof entry === "string")
        return General.string(entry);
    var pluralform = 0;
    if (args[1] === null)
        return arg;
    var count = evaluate(args[1]);
    if (count.ctype === "number")
        count = count.value.real;
    else
        count = 0;
    var pluralFormFunction = trl._pluralFormFunction || defaultPluralForm;
    var pluralForm = pluralFormFunction(count);
    if (pluralForm < entry.length)
        return General.string(entry[pluralForm]);
    return arg;
};

evaluator.currentlanguage$0 = function(args, modifs) {
    return General.string(instanceInvocationArguments.language || "en");
};

///////////////////////////////
//     Transformations       //
///////////////////////////////

eval_helper.basismap = function(a, b, c, d) {
    var mat = List.turnIntoCSList([a, b, c]);
    mat = List.adjoint3(List.transpose(mat));
    var vv = General.mult(mat, d);
    mat = List.turnIntoCSList([
        General.mult(vv.value[0], a),
        General.mult(vv.value[1], b),
        General.mult(vv.value[2], c)
    ]);
    return List.transpose(mat);

};

evaluator.map$8 = function(args, modifs) {
    var w0 = evaluateAndHomog(args[0]);
    var w1 = evaluateAndHomog(args[1]);
    var w2 = evaluateAndHomog(args[2]);
    var w3 = evaluateAndHomog(args[3]);
    var v0 = evaluateAndHomog(args[4]);
    var v1 = evaluateAndHomog(args[5]);
    var v2 = evaluateAndHomog(args[6]);
    var v3 = evaluateAndHomog(args[7]);
    if (v0 !== nada && v1 !== nada && v2 !== nada && v3 !== nada &&
        w0 !== nada && w1 !== nada && w2 !== nada && w3 !== nada) {
        var m1 = eval_helper.basismap(v0, v1, v2, v3);
        var m2 = eval_helper.basismap(w0, w1, w2, w3);
        var erg = General.mult(m1, List.adjoint3(m2));
        return List.normalizeMax(erg);
    }
    return nada;
};

evaluator.map$6 = function(args, modifs) {
    var w0 = evaluateAndHomog(args[0]);
    var w1 = evaluateAndHomog(args[1]);
    var w2 = evaluateAndHomog(args[2]);
    var inf = List.realVector([0, 0, 1]);
    var cc = List.cross;

    var w3 = cc(cc(w2, cc(inf, cc(w0, w1))),
        cc(w1, cc(inf, cc(w0, w2))));

    var v0 = evaluateAndHomog(args[3]);
    var v1 = evaluateAndHomog(args[4]);
    var v2 = evaluateAndHomog(args[5]);
    var v3 = cc(cc(v2, cc(inf, cc(v0, v1))),
        cc(v1, cc(inf, cc(v0, v2))));

    if (v0 !== nada && v1 !== nada && v2 !== nada && v3 !== nada &&
        w0 !== nada && w1 !== nada && w2 !== nada && w3 !== nada) {
        var m1 = eval_helper.basismap(v0, v1, v2, v3);
        var m2 = eval_helper.basismap(w0, w1, w2, w3);
        var erg = General.mult(m1, List.adjoint3(m2));
        return List.normalizeMax(erg);
    }
    return nada;
};

evaluator.map$4 = function(args, modifs) {
    var ii = List.ii;
    var jj = List.jj;

    var w0 = evaluateAndHomog(args[0]);
    var w1 = evaluateAndHomog(args[1]);
    var v0 = evaluateAndHomog(args[2]);
    var v1 = evaluateAndHomog(args[3]);

    if (v0 !== nada && v1 !== nada &&
        w0 !== nada && w1 !== nada) {
        var m1 = eval_helper.basismap(v0, v1, ii, jj);
        var m2 = eval_helper.basismap(w0, w1, ii, jj);
        var erg = General.mult(m1, List.adjoint3(m2));
        return List.normalizeMax(erg);
    }
    return nada;
};

evaluator.map$2 = function(args, modifs) {
    var ii = List.ii;
    var jj = List.jj;
    var w0 = evaluateAndHomog(args[0]);
    var w1 = General.add(List.realVector([1, 0, 0]), w0);
    var v0 = evaluateAndHomog(args[1]);
    var v1 = General.add(List.realVector([1, 0, 0]), v0);

    if (v0 !== nada && v1 !== nada &&
        w0 !== nada && w1 !== nada) {
        var m1 = eval_helper.basismap(v0, v1, ii, jj);
        var m2 = eval_helper.basismap(w0, w1, ii, jj);
        var erg = General.mult(m1, List.adjoint3(m2));
        return List.normalizeMax(erg);
    }
    return nada;
};

evaluator.pointreflect$1 = function(args, modifs) {
    var ii = List.ii;
    var jj = List.jj;

    var w0 = evaluateAndHomog(args[0]);
    var w1 = General.add(List.realVector([1, 0, 0]), w0);
    var v1 = General.add(List.realVector([-1, 0, 0]), w0);

    if (v1 !== nada && w0 !== nada && w1 !== nada) {
        var m1 = eval_helper.basismap(w0, v1, ii, jj);
        var m2 = eval_helper.basismap(w0, w1, ii, jj);
        var erg = General.mult(m1, List.adjoint3(m2));
        return List.normalizeMax(erg);
    }
    return nada;
};


evaluator.linereflect$1 = function(args, modifs) {
    var ii = List.ii;
    var jj = List.jj;

    var w0 = evaluateAndHomog(args[0]);
    var r0 = List.realVector([Math.random(), Math.random(), Math.random()]);
    var r1 = List.realVector([Math.random(), Math.random(), Math.random()]);
    var w1 = List.cross(r0, w0);
    var w2 = List.cross(r1, w0);

    if (w0 !== nada && w1 !== nada) {
        var m1 = eval_helper.basismap(w1, w2, ii, jj);
        var m2 = eval_helper.basismap(w1, w2, jj, ii);
        var erg = General.mult(m1, List.adjoint3(m2));
        return List.normalizeMax(erg);
    }
    return nada;
};


///////////////////////////////
//         Shapes            //
///////////////////////////////


eval_helper.extractPointVec = function(v1) { //Eventuell Homogen machen
    var erg = {};
    erg.ok = false;
    if (v1.ctype === 'geo') {
        var val = v1.value;
        if (val.kind === "P") {
            erg.x = Accessor.getField(val, "x");
            erg.y = Accessor.getField(val, "y");
            erg.z = CSNumber.real(1);
            erg.ok = true;
            return erg;
        }

    }
    if (v1.ctype !== 'list') {
        return erg;
    }

    var pt1 = v1.value;
    var x = 0;
    var y = 0;
    var z = 0;
    var n1, n2, n3;
    if (pt1.length === 2) {
        n1 = pt1[0];
        n2 = pt1[1];
        if (n1.ctype === 'number' && n2.ctype === 'number') {
            erg.x = n1;
            erg.y = n2;
            erg.z = CSNumber.real(1);
            erg.ok = true;
            return erg;
        }
    }

    if (pt1.length === 3) {
        n1 = pt1[0];
        n2 = pt1[1];
        n3 = pt1[2];
        if (n1.ctype === 'number' && n2.ctype === 'number' && n3.ctype === 'number') {
            erg.x = CSNumber.div(n1, n3);
            erg.y = CSNumber.div(n2, n3);
            erg.z = CSNumber.real(1);
            erg.ok = true;
            return erg;
        }
    }

    return erg;

};


evaluator.polygon$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'list') {
        var li = [];
        for (var i = 0; i < v0.value.length; i++) {
            var pt = eval_helper.extractPoint(v0.value[i]);
            if (!pt.ok) {
                return nada;
            }
            li[i] = {
                X: pt.x,
                Y: pt.y
            };
        }
        return {
            ctype: "shape",
            type: "polygon",
            value: [li]
        };
    }
    return nada;
};

evaluator.circle$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var pt = eval_helper.extractPointVec(v0);

    if (!pt.ok || v1.ctype !== 'number') {
        return nada;
    }
    var pt2 = List.turnIntoCSList([pt.x, pt.y, pt.z]);
    return {
        ctype: "shape",
        type: "circle",
        value: List.turnIntoCSList([pt2, v1])
    };
};

evaluator.screen$0 = function(args, modifs) {
    var m = csport.drawingstate.initialmatrix;
    var transf = function(px, py) {
        var xx = px - m.tx;
        var yy = py + m.ty;
        var x = (xx * m.d - yy * m.b) / m.det;
        var y = -(-xx * m.c + yy * m.a) / m.det;
        var erg = {
            X: x,
            Y: y
        };
        return erg;
    };
    var erg = [
        transf(0, 0),
        transf(csw, 0),
        transf(csw, csh),
        transf(0, csh)
    ];
    return {
        ctype: "shape",
        type: "polygon",
        value: [erg]
    };
};

evaluator.halfplane$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var w0 = evaluateAndHomog(v0);
    var w1 = evaluateAndHomog(v1);
    if (v0 !== nada && v1 !== nada) {
        var u0 = v0.usage;
        var u1 = v1.usage;
        var p = w0;
        var l = w1;
        if (u0 === "Line" || u1 === "Point") {
            p = w1;
            l = v0;
        }
        //OK im Folgenden lässt sich viel optimieren
        var tt = List.turnIntoCSList([l.value[0], l.value[1], CSNumber.zero]);
        var erg = List.cross(tt, p);
        var foot = List.cross(l, erg);
        foot = General.div(foot, foot.value[2]);
        p = General.div(p, p.value[2]);
        var diff = List.sub(p, foot);
        var nn = List.abs(diff);
        diff = General.div(diff, nn);

        var sx = foot.value[0].value.real;
        var sy = foot.value[1].value.real;
        var dx = diff.value[0].value.real * 1000;
        var dy = diff.value[1].value.real * 1000;

        var pp1 = {
            X: sx + dy / 2,
            Y: sy - dx / 2
        };
        var pp2 = {
            X: sx + dy / 2 + dx,
            Y: sy - dx / 2 + dy
        };
        var pp3 = {
            X: sx - dy / 2 + dx,
            Y: sy + dx / 2 + dy
        };
        var pp4 = {
            X: sx - dy / 2,
            Y: sy + dx / 2
        };
        return {
            ctype: "shape",
            type: "polygon",
            value: [
                [pp1, pp2, pp3, pp4]
            ]
        };
    }
    return nada;
};

///////////////////////////////
//   Geometric elements      //
///////////////////////////////

evaluator.allpoints$0 = function(args, modifs) {
    var erg = [];
    for (var i = 0; i < csgeo.points.length; i++) {
        erg[i] = {
            ctype: "geo",
            value: csgeo.points[i],
            type: "P"
        };
    }
    return {
        ctype: "list",
        value: erg
    };
};

evaluator.allmasses$0 = function(args, modifs) {
    var erg = [];
    for (var i = 0; i < masses.length; i++) {
        erg[i] = {
            ctype: "geo",
            value: masses[i],
            type: "P"
        };
    }
    return {
        ctype: "list",
        value: erg
    };
};

evaluator.alllines$0 = function(args, modifs) {
    var erg = [];
    for (var i = 0; i < csgeo.lines.length; i++) {
        erg[i] = {
            ctype: "geo",
            value: csgeo.lines[i],
            type: "L"
        };
    }
    return {
        ctype: "list",
        value: erg
    };
};

evaluator.createpoint$2 = function(args, modifs) {
    var name = evaluate(args[0]);
    var pos = evaluateAndHomog(args[1]);

    if (name.ctype !== "string") {
        console.log("Name must be a string");
        return nada;
    }

    if (pos.ctype !== "list" && List.isNumberVector(pos)) {
        console.log("Position must be a number vector");
        return nada;
    }

    var el = {
        name: name.value,
        type: "Free",
        labeled: true,
        pos: pos
    };

    return addElement(el);
};

evaluator.create$3 = function(args, modifs) {
    var names = evaluate(args[0]);
    var type = evaluate(args[1]);
    var defs = evaluate(args[2]);

    var name;
    if (names.ctype === "string") {
        name = names.value;
    } else if (names.ctype !== "list") {
        console.log("Names must be a string or a list of strings");
        return nada;
    } else if (names.value.length !== 1) {
        console.log("multi-result compatibility operations not supported yet");
        return nada;
    } else if (names.value[0].ctype !== "string") {
        console.log("Element of names list must be a string");
        return nada;
    } else {
        name = names.value[0].value;
    }
    if (type.ctype !== "string") {
        console.log("Type must be a string");
        return nada;
    }
    if (defs.ctype !== "list") {
        console.log("Arguments must be a list");
        return nada;
    }

    if (geoOps[type.value] === undefined) {
        console.log("Invalid geometric operation: '" + type.value + "'");
        return nada;
    }

    var a = [];
    var pos = null;

    for (var i = 0; i < defs.value.length; i++) {
        var def = defs.value[i];

        if (def.ctype === "string") {
            a.push(def.value);
        } else {
            var vec = evaluateAndHomog(def);
            if (vec !== nada) {
                pos = vec;
            } else {
                console.log("Unknown argument type");
                return nada;
            }
        }
    }

    var el = {
        name: name,
        type: type.value,
        labeled: true
    };

    if (pos)
        el.pos = pos;

    if (a.length > 0)
        el.args = a;

    return addElement(el);
};

///////////////////////////////
//   Calling external code   //
///////////////////////////////

evaluator.javascript$1 = function(args, modifs) {
    var v0 = evaluate(args[0]);
    if (v0.ctype === 'string') {
        var s = v0.value;
        var f = new Function(s); // jshint ignore:line
        f.call(globalInstance); // run code, with CindyJS instance as "this".
    }
    return nada;
};

evaluator.use$1 = function(args, modifs) {
    function defineFunction(name, arity, impl) {
        evaluator[name + "$" + arity] = impl;
    }
    var v0 = evaluate(args[0]);
    if (v0.ctype === "string") {
        var name = v0.value,
            cb;
        if (instanceInvocationArguments.plugins)
            cb = instanceInvocationArguments.plugins[name];
        if (!cb)
            cb = createCindy._pluginRegistry[name];
        if (cb) {
            /* The following object constitutes API for third-party plugins.
             * We should feel committed to maintaining this API.
             */
            cb({
                "instance": globalInstance,
                "config": instanceInvocationArguments,
                "nada": nada,
                "evaluate": evaluate,
                "evaluateAndVal": evaluateAndVal,
                "defineFunction": defineFunction,
                "addShutdownHook": shutdownHooks.push.bind(shutdownHooks),
                "addAutoCleaningEventListener": addAutoCleaningEventListener,
                "getVariable": namespace.getvar.bind(namespace),
                "getInitialMatrix": function() {
                    return csport.drawingstate.initialmatrix;
                },
                "setTextRenderer": function(handler) {
                    textRenderer = handler;
                },
            });
            return {
                "ctype": "boolean",
                "value": true
            };
        } else {
            console.log("Plugin " + name + " not found");
            return {
                "ctype": "boolean",
                "value": false
            };
        }
    }
    return nada;
};

evaluator.format$2 = function(args, modifs) { //TODO Angles
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var dec;

    function fmtNumber(n) {
        var erg = n.toFixed(dec),
            erg1;
        do {
            erg1 = erg;
            erg = erg.substring(0, erg.length - 1);
        } while (erg !== "" && erg !== "-" && +erg === +erg1);
        return "" + erg1;
    }

    function fmt(v) {
        var r, i, erg;
        if (v.ctype === 'number') {
            r = fmtNumber(v.value.real);
            i = fmtNumber(v.value.imag);
            if (i === "0")
                erg = r;
            else if (i.substring(0, 1) === "-")
                erg = r + " - i*" + i.substring(1);
            else
                erg = r + " + i*" + i;
            return {
                "ctype": "string",
                "value": erg
            };
        }
        if (v.ctype === 'list') {
            return {
                "ctype": "list",
                "value": v.value.map(fmt)
            };
        }
        return {
            "ctype": "string",
            "value": niceprint(v).toString()
        };
    }
    if ((v0.ctype === 'number' || v0.ctype === 'list') && v1.ctype === 'number') {
        dec = Math.round(v1.value.real);
        return fmt(v0);
    }
    return nada;
};

///////////////////////////////
//     Date and time         //
///////////////////////////////

if (!Date.now) Date.now = function() {
    return new Date().getTime();
};
var epoch = 0;

evaluator.seconds$0 = function(args, modifs) { //OK
    return {
        "ctype": "number",
        "value": {
            'real': ((Date.now() - epoch) / 1000),
            'imag': 0
        }
    };
};

evaluator.resetclock$0 = function(args, modifs) {
    epoch = Date.now();
    return nada;
};

evaluator.time$0 = function(args, modifs) {
    var now = new Date();
    return List.realVector([
        now.getHours(), now.getMinutes(),
        now.getSeconds(), now.getMilliseconds()
    ]);
};

evaluator.date$0 = function(args, modifs) {
    var now = new Date();
    return List.realVector([
        now.getFullYear(), now.getMonth(), now.getDay()
    ]);
};

evaluator.setTimeout$2 = function(args, modifs) {
    var delay = evaluate(args[0]); // delay in seconds
    var code = args[1]; // code to execute, cannot refer to regional variables
    function callback() {
        evaluate(code);
        updateCindy();
    }
    if (delay.ctype === "number") {
        if (typeof window !== "undefined") {
            window.setTimeout(callback, delay.value.real * 1000.0);
        }
    }
    return nada;
};

/***********************************/
/**********    WEBGL     ***********/
/***********************************/

eval_helper.formatForWebGL = function(x) {
    return x.toFixed(10);
};

evaluator.generateWebGL$2 = function(args, modifs) {
    var f = eval_helper.formatForWebGL;
    var expr = args[0];
    var vars = evaluate(args[1]);
    console.log(vars);
    if (vars.ctype !== "list") {
        return nada;
    }

    var varlist = [];
    for (var i = 0; i < vars.value.length; i++) {
        if (vars.value[i].ctype === "string") {
            varlist.push(vars.value[i].value);

        }
    }
    console.log("***********");
    console.log(varlist);
    var li = eval_helper.plotvars(expr);
    console.log(li);

    if (li.indexOf("a") === -1 && li.indexOf("b") === -1 && li.indexOf("c") === -1 && li.indexOf("d") === -1 && li.indexOf("e") === -1 && li.indexOf("f") === -1) {
        var erg = evaluateAndVal(expr);
        expr = erg;

    }

    //   dump(expr);
    if (expr.ctype === "number") {
        return {
            "ctype": "string",
            "value": "vec2(" + f(expr.value.real) + "," + f(expr.value.imag) + ")"
        };
    }
    if (expr.ctype === "variable") {

        return {
            "ctype": "string",
            "value": expr.name
        };
    }
    if (expr.ctype === "string" || expr.ctype === "void") {
        return expr;
    }
    var a, b;
    if (expr.args.length === 2) {
        if (expr.ctype === "infix" || expr.ctype === "function") {
            a = evaluator.compileToWebGL$1([expr.args[0]], {});
            b = evaluator.compileToWebGL$1([expr.args[1]], {});
            if (expr.oper === "+" || expr.oper === "add") {
                if (a.value === undefined || a.ctype === "void") {
                    return {
                        "ctype": "string",
                        "value": b.value
                    };

                } else {
                    return {
                        "ctype": "string",
                        "value": "addc(" + a.value + "," + b.value + ")"
                    };
                }

            }
            if (expr.oper === "*" || expr.oper === "mult") {
                return {
                    "ctype": "string",
                    "value": "multc(" + a.value + "," + b.value + ")"
                };
            }
            if (expr.oper === "/" || expr.oper === "div") {
                return {
                    "ctype": "string",
                    "value": "divc(" + a.value + "," + b.value + ")"
                };
            }
            if (expr.oper === "-" || expr.oper === "sub") {
                if (a.value === undefined || a.ctype === "void") {
                    return {
                        "ctype": "string",
                        "value": "negc(" + b.value + ")"
                    };

                } else {
                    return {
                        "ctype": "string",
                        "value": "subc(" + a.value + "," + b.value + ")"
                    };
                }
            }
            if (expr.oper === "^" || expr.oper === "pow") {
                return {
                    "ctype": "string",
                    "value": "powc(" + a.value + "," + b.value + ")"
                };
            }
        }
    }

    if ((expr.ctype === "function") && (expr.args.length === 1)) {
        a = evaluator.compileToWebGL$1([expr.args[0]], {});
        if (expr.oper === "sin$1") {
            return {
                "ctype": "string",
                "value": "sinc(" + a.value + ")"
            };
        }
        if (expr.oper === "cos$1") {
            return {
                "ctype": "string",
                "value": "cosc(" + a.value + ")"
            };
        }
        if (expr.oper === "tan$1") {
            return {
                "ctype": "string",
                "value": "tanc(" + a.value + ")"
            };
        }
        if (expr.oper === "exp$1") {
            return {
                "ctype": "string",
                "value": "expc(" + a.value + ")"
            };
        }
        if (expr.oper === "log$1") {
            return {
                "ctype": "string",
                "value": "logc(" + a.value + ")"
            };
        }
        if (expr.oper === "arctan$1") {
            return {
                "ctype": "string",
                "value": "arctanc(" + a.value + ")"
            };
        }
        if (expr.oper === "arcsin$1") {
            return {
                "ctype": "string",
                "value": "arcsinc(" + a.value + ")"
            };
        }
        if (expr.oper === "arccos$1") {
            return {
                "ctype": "string",
                "value": "arccosc(" + a.value + ")"
            };
        }
        if (expr.oper === "sqrt$1") {
            return {
                "ctype": "string",
                "value": "sqrtc(" + a.value + ")"
            };
        }
    }

    return nada;

};


evaluator.compileToWebGL$1 = function(args, modifs) {
    var a, b;
    var f = eval_helper.formatForWebGL;
    var expr = args[0];
    var li = eval_helper.plotvars(expr);

    if (li.indexOf("a") === -1 && li.indexOf("b") === -1 && li.indexOf("c") === -1 && li.indexOf("d") === -1 && li.indexOf("e") === -1 && li.indexOf("f") === -1) {
        var erg = evaluateAndVal(expr);
        expr = erg;

    }

    //   dump(expr);
    if (expr.ctype === "number") {
        return {
            "ctype": "string",
            "value": "vec2(" + f(expr.value.real) + "," + f(expr.value.imag) + ")"
        };
    }
    if (expr.ctype === "variable") {

        return {
            "ctype": "string",
            "value": expr.name
        };
    }
    if (expr.ctype === "string" || expr.ctype === "void") {
        return expr;
    }
    if (expr.args.length === 2) {
        if (expr.ctype === "infix" || expr.ctype === "function") {
            a = evaluator.compileToWebGL$1([expr.args[0]], {});
            b = evaluator.compileToWebGL$1([expr.args[1]], {});
            if (expr.oper === "+" || expr.oper === "add") {
                if (a.value === undefined || a.ctype === "void") {
                    return {
                        "ctype": "string",
                        "value": b.value
                    };

                } else {
                    return {
                        "ctype": "string",
                        "value": "addc(" + a.value + "," + b.value + ")"
                    };
                }

            }
            if (expr.oper === "*" || expr.oper === "mult") {
                return {
                    "ctype": "string",
                    "value": "multc(" + a.value + "," + b.value + ")"
                };
            }
            if (expr.oper === "/" || expr.oper === "div") {
                return {
                    "ctype": "string",
                    "value": "divc(" + a.value + "," + b.value + ")"
                };
            }
            if (expr.oper === "-" || expr.oper === "sub") {
                if (a.value === undefined || a.ctype === "void") {
                    return {
                        "ctype": "string",
                        "value": "negc(" + b.value + ")"
                    };

                } else {
                    return {
                        "ctype": "string",
                        "value": "subc(" + a.value + "," + b.value + ")"
                    };
                }
            }
            if (expr.oper === "^" || expr.oper === "pow") {
                return {
                    "ctype": "string",
                    "value": "powc(" + a.value + "," + b.value + ")"
                };
            }
        }
    }
    if ((expr.ctype === "function") && (expr.args.length === 1)) {
        a = evaluator.compileToWebGL$1([expr.args[0]], {});

        if (expr.oper === "sin$1") {
            return {
                "ctype": "string",
                "value": "sinc(" + a.value + ")"
            };
        }
        if (expr.oper === "cos$1") {
            return {
                "ctype": "string",
                "value": "cosc(" + a.value + ")"
            };
        }
        if (expr.oper === "tan$1") {
            return {
                "ctype": "string",
                "value": "tanc(" + a.value + ")"
            };
        }
        if (expr.oper === "exp$1") {
            return {
                "ctype": "string",
                "value": "expc(" + a.value + ")"
            };
        }
        if (expr.oper === "log$1") {
            return {
                "ctype": "string",
                "value": "logc(" + a.value + ")"
            };
        }
        if (expr.oper === "arctan$1") {
            return {
                "ctype": "string",
                "value": "arctanc(" + a.value + ")"
            };
        }
        if (expr.oper === "arcsin$1") {
            return {
                "ctype": "string",
                "value": "arcsinc(" + a.value + ")"
            };
        }
        if (expr.oper === "arccos$1") {
            return {
                "ctype": "string$1",
                "value": "arccosc(" + a.value + ")"
            };
        }
        if (expr.oper === "sqrt$1") {
            return {
                "ctype": "string",
                "value": "sqrtc(" + a.value + ")"
            };
        }
    }
    return nada;
};


/***********************************/
/**********    PHYSIC    ***********/
/***********************************/


evaluator.setsimulationspeed$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        if (typeof(labObjects) !== "undefined" && typeof(labObjects.env) !== "undefined") {
            labObjects.env.deltat = v0.value.real;
        }
    }
    return nada;
};

evaluator.setsimulationaccuracy$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        if (typeof(labObjects) !== "undefined" && typeof(labObjects.env) !== "undefined") {
            labObjects.env.accuracy = v0.value.real;
        }
    }
    return nada;
};

evaluator.setsimulationquality$1 = function(args, modifs) {

    var v0 = evaluateAndVal(args[0]);
    if (v0.ctype === 'number') {
        if (typeof(labObjects) !== "undefined" && typeof(labObjects.env) !== "undefined") {
            var qual = v0.value.real;
            if (qual === 0) {
                labObjects.env.errorbound = 0.01;
                labObjects.env.lowestdeltat = 0.00001;
                labObjects.env.slowdownfactor = 2;
            }
            if (qual === 1) {
                labObjects.env.errorbound = 0.001;
                labObjects.env.lowestdeltat = 0.0000001;
                labObjects.env.slowdownfactor = 2;
            }
            if (qual === 2) {
                labObjects.env.errorbound = 0.00001;
                labObjects.env.lowestdeltat = 0.0000000001;
                labObjects.env.slowdownfactor = 4;
            }
            if (qual === 3) {
                labObjects.env.errorbound = 0.000001;
                labObjects.env.lowestdeltat = 0.000000000001;
                labObjects.env.slowdownfactor = 4;
            }
        }
    }
    return nada;
};
//*******************************************************
// and here are the definitions of the drawing operators
//*******************************************************


eval_helper.extractPoint = function(v1) {
    var erg = {};
    erg.ok = false;
    if (v1.ctype === 'geo') {
        var val = v1.value;
        if (val.kind === "P") {
            erg.x = Accessor.getField(val, "x").value.real;
            erg.y = Accessor.getField(val, "y").value.real;
            erg.ok = true;
            return erg;
        }

    }
    if (v1.ctype !== 'list') {
        return erg;
    }

    var pt1 = v1.value;
    var x = 0;
    var y = 0;
    var z = 0,
        n1, n2, n3;
    if (pt1.length === 2) {
        n1 = pt1[0];
        n2 = pt1[1];
        if (n1.ctype === 'number' && n2.ctype === 'number') {
            erg.x = n1.value.real;
            erg.y = n2.value.real;
            erg.ok = true;
            return erg;
        }
    }

    if (pt1.length === 3) {
        n1 = pt1[0];
        n2 = pt1[1];
        n3 = pt1[2];
        if (n1.ctype === 'number' && n2.ctype === 'number' && n3.ctype === 'number') {
            n1 = CSNumber.div(n1, n3);
            n2 = CSNumber.div(n2, n3);
            erg.x = n1.value.real;
            erg.y = n2.value.real;
            erg.ok = true;
            return erg;
        }
    }

    return erg;

};

evaluator.draw$1 = function(args, modifs) {

    var v1 = evaluateAndVal(args[0]);
    if (v1.ctype === "shape") {
        eval_helper.drawshape(v1, modifs);
    } else if (v1.usage === "Line") {
        Render2D.handleModifs(modifs, Render2D.lineModifs);
        Render2D.drawline(v1);
    } else {
        var pt = eval_helper.extractPoint(v1);

        if (!pt.ok) {
            if (typeof(v1.value) !== "undefined") { //eventuell doch ein Segment
                if (v1.value.length === 2) {
                    return evaluator.draw$2(v1.value, modifs);
                }
            }
            return;
        }

        if (modifs !== null) {
            Render2D.handleModifs(modifs, Render2D.pointModifs);
        }
        Render2D.drawpoint(pt);
    }
    return nada;
};

evaluator.draw$2 = function(args, modifs) {
    var v1 = evaluateAndVal(args[0]);
    var v2 = evaluateAndVal(args[1]);
    var pt1 = eval_helper.extractPoint(v1);
    var pt2 = eval_helper.extractPoint(v2);
    if (!pt1.ok || !pt2.ok) {
        return nada;
    }
    if (modifs !== null) {
        Render2D.handleModifs(modifs, Render2D.lineModifs);
    }
    Render2D.drawsegcore(pt1, pt2);
    return nada;
};

evaluator.drawcircle$2 = function(args, modifs) {
    return eval_helper.drawcircle(args, modifs, "D");
};


eval_helper.arcHelper = function(args) {
    var arc = {};
    arc.startPoint = evaluateAndHomog(args[0]);
    arc.viaPoint = evaluateAndHomog(args[1]);
    arc.endPoint = evaluateAndHomog(args[2]);
    return arc;
};

evaluator.fillcircle$2 = function(args, modifs) {
    return eval_helper.drawcircle(args, modifs, "F");
};

evaluator.drawarc$3 = function(args, modifs) {
    var arc = eval_helper.arcHelper(args);
    return eval_helper.drawarc(arc, modifs, "D");
};

evaluator.fillarc$3 = function(args, modifs) {
    var arc = eval_helper.arcHelper(args);
    return eval_helper.drawarc(arc, modifs, "F");
};


eval_helper.drawarc = function(args, modifs, df) {
    var a = args.startPoint;
    var b = args.viaPoint;
    var c = args.endPoint;

    // check for complex values
    if (!List._helper.isAlmostReal(List.turnIntoCSList([a, b, c]))) return nada;

    // modifs handling
    Render2D.handleModifs(modifs, Render2D.conicModifs);
    Render2D.preDrawCurve();

    var abcdet = List.det3(a, b, c);

    if (Math.abs(abcdet.value.real) > 1e-12) { // we have an arc, not segment
        var con = geoOps._helper.ConicBy5(null, a, b, c, List.ii, List.jj);
        var cen = geoOps._helper.CenterOfConic(con);
        cen = List.normalizeMax(cen);

        var zer = CSNumber.real(0);

        // move center of conic to origin
        var mat = List.turnIntoCSList([
            List.turnIntoCSList([cen.value[2], zer, CSNumber.neg(cen.value[0])]),
            List.turnIntoCSList([zer, cen.value[2], CSNumber.neg(cen.value[1])]),
            List.turnIntoCSList([zer, zer, cen.value[2]])
        ]);
        var aa = List.normalizeZ(General.mult(mat, a));
        var bb = List.normalizeZ(General.mult(mat, b));
        var cc = List.normalizeZ(General.mult(mat, c));


        // get angles of A and C 
        var startAngle = -Math.atan2(aa.value[1].value.real, aa.value[0].value.real);
        var endAngle = -Math.atan2(cc.value[1].value.real, cc.value[0].value.real);

        cen = List.normalizeZ(cen);
        a = List.normalizeZ(a);
        b = List.normalizeZ(b);
        c = List.normalizeZ(c);
        var arcDist = List.abs(List.sub(a, cen));

        // x, y vals of the center
        var pt = [cen.value[0].value.real, cen.value[1].value.real];

        // transform to canvas
        var m = csport.drawingstate.matrix;
        var xx = pt[0] * m.a - pt[1] * m.b + m.tx;
        var yy = pt[0] * m.c - pt[1] * m.d - m.ty;


        // check for counter clockwise drawing
        var cclock = List.det3(a, b, c).value.real > 0;

        csctx.save();

        // canvas circle radius 
        var rad = arcDist.value.real * m.sdet;

        csctx.beginPath();
        csctx.translate(xx, yy);

        // use the canvas arc function -- buggy in Chrome at least in Okt 15
        var useArc = false;

        if (useArc) {
            csctx.arc(0, 0, arcDist.value.real * m.sdet, startAngle, endAngle, cclock);
        } else {
            var num = 500; // Number of segments

            //  mod 2 pi in case startAngle > endAngle
            if (startAngle > endAngle) endAngle = endAngle + Math.PI * 2;

            // divide segments --  rotate counterclockwise if necessary
            var ntler = !cclock ? (endAngle - startAngle) / num : -(2 * Math.PI - endAngle + startAngle) / num;

            // drawing
            csctx.moveTo(rad * Math.cos(startAngle), rad * Math.sin(startAngle));
            var angl;
            for (var ii = 0; ii <= num; ii++) {
                angl = startAngle + ii * ntler;
                csctx.lineTo(rad * Math.cos(angl), rad * Math.sin(angl));
            }
        }


        if (df === "F") {
            csctx.fillStyle = Render2D.lineColor;
            csctx.closePath();
            csctx.fill();
        }

        if (df === "D") {
            csctx.stroke();
        }
        csctx.restore();

    } else { // segment case
        if (df !== "D") return nada; // Nothing to fill in the degenerate case
        var ptA = eval_helper.extractPoint(a);
        var ptB = eval_helper.extractPoint(b);
        var ptC = eval_helper.extractPoint(c);
        if (!ptA.ok || !ptB.ok || !ptC.ok) return nada;

        // dists
        var dAB = (ptA.x - ptB.x) * (ptA.x - ptB.x) + (ptA.y - ptB.y) * (ptA.y - ptB.y);
        var dAC = (ptA.x - ptC.x) * (ptA.x - ptC.x) + (ptA.y - ptC.y) * (ptA.y - ptC.y);
        var dBC = (ptC.x - ptB.x) * (ptC.x - ptB.x) + (ptC.y - ptB.y) * (ptC.y - ptB.y);

        // if 2 points are the same return nada;
        if (dAB < 1e-12 || dAC < 1e-12 || dBC < 1e-12) return nada;

        // check by dets if B is in the middle
        var crossr = List.crossratio3(a, c, b, List.cross(List.cross(a, b), List.linfty), List.ii);
        var Bmiddle = crossr.value.real < 0;

        // if B is in the middle we are fine
        if (Bmiddle) {
            Render2D.drawsegcore(ptA, ptC);
        } else { // nasty case -- B not in the middle -- we have 2 ray to infinity

            // flip the orientation to the right side 
            var sflip = dAB > dBC ? 1 : -1;

            // first ray
            // get direction and normalise
            var dx = sflip * (ptA.x - ptB.x);
            var dy = sflip * (ptA.y - ptB.y);
            var norm = Math.sqrt(dx * dx + dy * dy);

            // get points outside canvas (at "infinity")
            var sc = csport.drawingstate.matrix.sdet;
            var farAway = 25000 / sc; // 25000px in user coordinates
            var factor = farAway / norm;
            dx = dx * factor;
            dy = dy * factor;
            Render2D.drawsegcore(ptA, {
                x: ptA.x + dx,
                y: ptA.y + dy
            });
            Render2D.drawsegcore(ptC, {
                x: ptC.x - dx,
                y: ptC.y - dy
            });
        }
    }

    return nada;
};


// draw circle with from alp to bet (for circle 0 to 2*pi)
eval_helper.drawcircle = function(args, modifs, df) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluateAndVal(args[1]);

    function magic_circle(ctx, x, y, r) {
        m = 0.551784;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(r, r);

        ctx.beginPath();
        ctx.moveTo(1, 0);
        ctx.bezierCurveTo(1, -m, m, -1, 0, -1);
        ctx.bezierCurveTo(-m, -1, -1, -m, -1, 0);
        ctx.bezierCurveTo(-1, m, -m, 1, 0, 1);
        ctx.bezierCurveTo(m, 1, 1, m, 1, 0);
        ctx.closePath();
        ctx.restore();
    }


    var pt = eval_helper.extractPoint(v0);


    if (!pt.ok || v1.ctype !== 'number') {
        return nada;
    }
    var m = csport.drawingstate.matrix;

    var xx = pt.x * m.a - pt.y * m.b + m.tx;
    var yy = pt.x * m.c - pt.y * m.d - m.ty;

    Render2D.handleModifs(modifs, Render2D.conicModifs);
    Render2D.preDrawCurve();

    csctx.beginPath();
    csctx.arc(xx, yy, v1.value.real * m.sdet, 0, 2 * Math.PI);
    //  magic_circle(csctx,xx,yy,v1.value.real*m.sdet);


    if (df === "D") {
        csctx.stroke();
    }
    if (df === "F") {
        csctx.fillStyle = Render2D.lineColor;
        csctx.fill();
    }
    if (df === "C") {
        csctx.clip();
    }

    return nada;
};

evaluator.drawconic$1 = function(args, modifs) {
    var Conic = {};
    Conic.usage = "conic";

    var arr = evaluateAndVal(args[0]);

    if (arr.ctype !== "list" || arr.value.length !== 3 && arr.value.length !== 6) {
        console.error("could not parse conic");
        return nada;
    }

    if (arr.value.length === 6) { // array case

        for (var i = 0; i < 6; i++) // check for faulty arrays
            if (arr.value[i].ctype !== "number") {
                console.error("could not parse conic");
                return nada;
            }

        var half = CSNumber.real(0.5);

        var a = arr.value[0];
        var b = arr.value[2];
        b = CSNumber.mult(b, half);
        var c = arr.value[1];
        var d = arr.value[3];
        d = CSNumber.mult(d, half);
        var e = arr.value[4];
        e = CSNumber.mult(e, half);
        var f = arr.value[5];

        var mat = List.turnIntoCSList([
            List.turnIntoCSList([a, b, d]),
            List.turnIntoCSList([b, c, e]),
            List.turnIntoCSList([d, e, f])
        ]);
        Conic.matrix = mat;
    } else { // matrix case

        for (var ii = 0; ii < 3; ii++) // check for faulty arrays
            for (var jj = 0; jj < 3; jj++)
            if (arr.value[ii].value[jj].ctype !== "number") {
                console.error("could not parse conic");
                return nada;
            }

        if (!List.equals(arr, List.transpose(arr)).value) { // not symm case
            var aa = General.mult(arr, CSNumber.real(0.5));
            var bb = General.mult(List.transpose(arr), CSNumber.real(0.5));
            arr = List.add(aa, bb);
            Conic.matrix = arr;
        } else {
            Conic.matrix = arr;
        }


    }
    Conic.matrix = List.normalizeMax(Conic.matrix);
    return eval_helper.drawconic(Conic.matrix, modifs);
};

eval_helper.drawconic = function(conicMatrix, modifs) {

    Render2D.handleModifs(modifs, Render2D.conicModifs);
    if (Render2D.lsize === 0)
        return;
    Render2D.preDrawCurve();

    var eps = 1e-14; //JRG Hab ih von 1e-16 runtergesetzt
    var mat = List.normalizeMax(conicMatrix);
    var origmat = mat;

    // check for complex values
    for (var i = 0; i < 2; i++)
        for (var j = 0; j < 2; j++) {
            if (Math.abs(mat.value[i].value[j].value.imag) > eps) return;
        }

    // transform matrix to canvas coordiantes
    var tMatrix1 = List.turnIntoCSList([ // inverse of homog points (0,0), (1,0), (0, 1)
        List.realVector([-1, -1, 1]),
        List.realVector([1, 0, 0]),
        List.realVector([0, 1, 0])
    ]);

    // get canvas coordiantes
    var pt0 = csport.from(0, 0, 1);
    pt0[2] = 1;
    var pt1 = csport.from(1, 0, 1);
    pt1[2] = 1;
    var pt2 = csport.from(0, 1, 1);
    pt2[2] = 1;

    var tMatrix2 = List.turnIntoCSList([
        List.realVector(pt0),
        List.realVector(pt1),
        List.realVector(pt2)
    ]);
    tMatrix2 = List.transpose(tMatrix2);

    var ttMatrix = General.mult(tMatrix2, tMatrix1); // get transformation matrix

    var ittMatrix = List.inverse(ttMatrix);

    // transform Conic
    mat = General.mult(List.transpose(ittMatrix), mat);
    mat = General.mult(mat, ittMatrix);


    var a = mat.value[0].value[0].value.real;
    var b = mat.value[1].value[0].value.real;
    var c = mat.value[1].value[1].value.real;
    var d = mat.value[2].value[0].value.real;
    var e = mat.value[2].value[1].value.real;
    var f = mat.value[2].value[2].value.real;

    var myMat = [
        [a, b, d],
        [b, c, e],
        [d, e, f]
    ];


    var det = a * c * f - a * e * e - b * b * f + 2 * b * d * e - c * d * d;
    var degen = Math.abs(det) < eps;

    var cswh_max = csw > csh ? csw : csh;

    var x_zero = -1.5 * cswh_max;
    var x_w = 1.5 * cswh_max; //2 * cswh_max;
    var y_zero = -1.5 * cswh_max;
    var y_h = 1.5 * cswh_max;

    var useRot = 1;
    if (degen) { // since we split then - rotation unnecessary
        useRot = 0;
    }


    if (useRot) {
        var C = [a, b, c, d, e, f];
        var A = [
            [C[0], C[1]],
            [C[1], C[2]]
        ];
        var angle = 0;
        if (Math.abs(a - b) > eps) {
            angle = Math.atan(b / a - c) / 2;
        } else {
            angle = Math.PI / 4;
        }
        var get_rMat = function(angle) {
            var acos = Math.cos(angle);
            var asin = Math.sin(angle);
            return [
                [acos, -asin, 0],
                [asin, acos, 0],
                [0, 0, 1]
            ];
        };


        var rMat = get_rMat(angle);
        rMat = List.realMatrix(rMat);
        var TrMat = List.transpose(rMat);
        var tmp = General.mult(List.realMatrix(myMat), rMat);
        tmp = General.mult(TrMat, tmp);
        a = tmp.value[0].value[0].value.real;
        b = tmp.value[1].value[0].value.real;
        c = tmp.value[1].value[1].value.real;
        d = tmp.value[2].value[0].value.real;
        e = tmp.value[2].value[1].value.real;
        f = tmp.value[2].value[2].value.real;

    }

    var Conic = [a, b, c, d, e, f];

    // split degenerate conic into 1 or 2 lines
    var split_degen = function() {

        //modifs.size= CSNumber.real(2); // TODO fix this
        var erg = geoOps._helper.splitDegenConic(origmat);
        if (erg === nada) return;
        var lg = erg[0];
        var lh = erg[1];

        var arg = [lg];
        evaluator.draw$1(arg, modifs);
        arg[0] = lh;
        evaluator.draw$1(arg, modifs);

    };

    var get_concic_type = function(C) {
        if (C === 'undefined' || C.length !== 6) {
            console.error("this does not define a Conic");
        }

        if (degen) return "degenerate";

        var det = C[0] * C[2] - C[1] * C[1];

        if (Math.abs(det) < eps) {
            return "parabola";
        } else if (det > eps) {
            return "ellipsoid";
        } else {
            return "hyperbola";
        }

    }; // end get_concic_type

    var type = get_concic_type(Conic);

    var norm = function(x0, y0, x1, y1) {
        var norm = Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2);
        return Math.sqrt(norm);
    };

    var is_inside = function(x, y) {
        return (x > 0 && x < csw && y > 0 && y < csh);
    };

    var drawRect = function(x, y, col) {
        csctx.strokeStyle = 'red';
        if (col !== 'undefined') csctx.strokeStyle = col;
        csctx.beginPath();
        csctx.rect(x, y, 10, 10);
        csctx.stroke();
    };
    // arrays to save points on conic
    var arr_x1 = [];
    var arr_x2 = [];
    var arr_y1 = [];
    var arr_y2 = [];
    var arr_xg = [];
    var arr_yg = [];

    var resetArrays = function() {
        arr_x1 = [];
        arr_x2 = [];
        arr_y1 = [];
        arr_y2 = [];
        arr_xg = [];
        arr_yg = [];
    };

    var drawArray = function(x, y) {
        csctx.beginPath();
        csctx.moveTo(x[0], y[0]);
        for (var i = 1; i < x.length; i++) {
            //csctx.moveTo(x[i - 1], y[i - 1]);
            //csctx.fillRect(x[i],y[i],5,5);
            csctx.lineTo(x[i], y[i]);
        }
        csctx.stroke();
    }; // end drawArray


    var eval_conic_x = function(C, ymin, ymax) {
        var x1, x2;
        var type = get_concic_type(C);

        if (C.length !== 6) {
            console.error("Conic needs 6 Parameters");
            return;
        }

        var a = C[0];
        var b = C[1];
        var c = C[2];
        var d = C[3];
        var e = C[4];
        var f = C[5];


        var step;
        var perc = 0.1;
        var diff = ymax - ymin;
        var ssmall = perc * diff + ymin;
        var slarge = ymax - perc * diff;
        for (var y = ymin; y <= ymax; y += step) {
            if (y < ssmall || y > slarge || Math.abs(ymax - ymin) < 100) {
                step = 1 / 2;
            } else if (y < 0 || y > csh) {
                step = 10;
            } else {
                step = 3;
            }

            var inner = -a * c * y * y - 2 * a * e * y - a * f + b * b * y * y + 2 * b * d * y + d * d;
            inner = Math.sqrt(inner);


            x1 = 1 / a * (-b * y - d + inner);
            x2 = -1 / a * (b * y + d + inner);


            var ya, yb, y1, y2;
            if (useRot) {
                var r1 = [x1, y, 1];
                var r2 = [x2, y, 1];
                r1 = General.mult(rMat, List.realVector(r1));
                r2 = General.mult(rMat, List.realVector(r2));
                x1 = r1.value[0].value.real;
                x2 = r2.value[0].value.real;
                y1 = r1.value[1].value.real;
                y2 = r2.value[1].value.real;
            } else {
                y1 = y;
                y2 = y;
            }


            // for ellipsoids we go out of canvas
            if (!isNaN(x1) && type === "ellipsoid") {
                arr_x1.push(x1);
                arr_y1.push(y1);
            } else if (!isNaN(x1) && x1 >= x_zero && x1 <= x_w) {
                arr_x1.push(x1);
                arr_y1.push(y1);
            }

            if (!isNaN(x2) && type === "ellipsoid") {
                arr_x2.push(x2);
                arr_y2.push(y2);
            } else if (!isNaN(x2) && x2 >= x_zero && x2 <= x_w) {
                arr_x2.push(x2);
                arr_y2.push(y2);
            }
        }
    }; // end eval_conic_x

    // calc and draw conic
    var calc_draw = function(C) {
        var ymin, ymax, y0, y1;
        var ttemp;

        var type = get_concic_type(C);


        if (C.length !== 6) {
            console.error("Conic needs 6 Parameters");
            return;
        }

        var a = C[0];
        var b = C[1];
        var c = C[2];
        var d = C[3];
        var e = C[4];
        var f = C[5];

        // these are the actual formulas - we use variables to speed up
        //y0 = (-a*e + b*d - Math.sqrt(a*(-a*c*f + a*Math.pow(e, 2) + Math.pow(b, 2)*f - 2*b*d*e + c*Math.pow(d,2))))/(a*c - Math.pow(b, 2));
        //y1 = (-a*e + b*d + Math.sqrt(a*(-a*c*f + a*Math.pow(e, 2) + Math.pow(b, 2)*f - 2*b*d*e + c*Math.pow(d,2))))/(a*c - Math.pow(b, 2));

        var aebd = -a * e + b * d;
        var largeSqrt = Math.sqrt(a * (-a * c * f + a * Math.pow(e, 2) + Math.pow(b, 2) * f - 2 * b * d * e + c * Math.pow(d, 2)));
        var deNom = a * c - Math.pow(b, 2);

        if (Math.abs(deNom) > eps) {
            y0 = (aebd - largeSqrt) / deNom;
            y1 = (aebd + largeSqrt) / deNom;
        } else {
            y0 = (-a * f + d * d) / (2 * a * e - 2 * b * d);
            y1 = y0;
        }

        if (!isNaN(y0) && y0 > y_zero && y0 < y_h) { // ungly but works
        } else {
            y0 = y_zero;
        }

        if (!isNaN(y1) && y1 > y_zero && y1 < y_h) {} else {
            y1 = y_zero;
        }

        ymin = (y0 < y1 ? y0 : y1);
        ymax = (y0 > y1 ? y0 : y1);


        eval_conic_x(C, y_zero, ymin);
        arr_xg = arr_x1.concat(arr_x2.reverse());
        arr_yg = arr_y1.concat(arr_y2.reverse());
        drawArray(arr_xg, arr_yg);
        resetArrays();


        eval_conic_x(C, ymax, y_h);
        drawArray(arr_x1, arr_y1);
        //drawRect(arr_x1[0], arr_y1[0], "red");
        //console.log(arr_x1, arr_y1);
        //drawRect(arr_x2[0], arr_y2[0], "green");
        // bridge branches
        if (is_inside(arr_x1[0], arr_y1[1]) || is_inside(arr_x2[0], arr_y2[0])) { // drawing bug fix
            csctx.beginPath();
            csctx.moveTo(arr_x1[0], arr_y1[0]);
            csctx.lineTo(arr_x2[0], arr_y2[0]);
            csctx.stroke();
        }
        drawArray(arr_x2, arr_y2);
        resetArrays();


        eval_conic_x(C, ymin, ymax);
        drawArray(arr_x1, arr_y1);
        // bridge branches
        // if (type === "ellipsoid") {
        csctx.beginPath();
        csctx.moveTo(arr_x1[0], arr_y1[0]);
        csctx.lineTo(arr_x2[0], arr_y2[0]);
        csctx.stroke();
        csctx.beginPath();
        csctx.moveTo(arr_x1[arr_x1.length - 1], arr_y1[arr_y1.length - 1]);
        csctx.lineTo(arr_x2[arr_x2.length - 1], arr_y2[arr_y2.length - 1]);
        csctx.stroke();
        //}
        // }
        drawArray(arr_x2, arr_y2);
        resetArrays();
    }; // end calc_draw


    // actually start drawing
    if (!degen) {
        calc_draw(Conic);
    } else {
        split_degen();
    }

}; // end eval_helper.drawconic

evaluator.drawall$1 = function(args, modifs) {
    var v1 = evaluate(args[0]);
    if (v1.ctype === "list") {
        Render2D.handleModifs(modifs, Render2D.pointAndLineModifs);
        for (var i = 0; i < v1.value.length; i++) {
            evaluator.draw$1([v1.value[i]], null);
        }
    }
    return nada;
};

evaluator.connect$1 = function(args, modifs) {
    return eval_helper.drawpolygon(args, modifs, "D", false);
};


evaluator.drawpoly$1 = function(args, modifs) {
    return eval_helper.drawpolygon(args, modifs, "D", true);
};


evaluator.fillpoly$1 = function(args, modifs) {
    return eval_helper.drawpolygon(args, modifs, "F", true);
};

evaluator.drawpolygon$1 = function(args, modifs) {
    return eval_helper.drawpolygon(args, modifs, "D", true);
};


evaluator.fillpolygon$1 = function(args, modifs) {
    return eval_helper.drawpolygon(args, modifs, "F", true);
};


eval_helper.drawpolygon = function(args, modifs, df, cycle) {

    Render2D.handleModifs(modifs, Render2D.conicModifs);
    Render2D.preDrawCurve();
    csctx.mozFillRule = 'evenodd';

    var m = csport.drawingstate.matrix;

    function drawpolyshape() {
        var polys = v0.value;
        for (var j = 0; j < polys.length; j++) {
            var pol = polys[j];
            var i;
            for (i = 0; i < pol.length; i++) {
                var pt = pol[i];
                var xx = pt.X * m.a - pt.Y * m.b + m.tx;
                var yy = pt.X * m.c - pt.Y * m.d - m.ty;
                if (i === 0)
                    csctx.moveTo(xx, yy);
                else
                    csctx.lineTo(xx, yy);
            }
            csctx.closePath();
        }
    }

    function drawpoly() {
        var i;
        for (i = 0; i < v0.value.length; i++) {
            var pt = eval_helper.extractPoint(v0.value[i]);
            if (!pt.ok) {
                return;
            }
            var xx = pt.x * m.a - pt.y * m.b + m.tx;
            var yy = pt.x * m.c - pt.y * m.d - m.ty;
            if (i === 0)
                csctx.moveTo(xx, yy);
            else
                csctx.lineTo(xx, yy);
        }
        if (cycle)
            csctx.closePath();
    }

    var v0 = evaluate(args[0]);
    csctx.beginPath();
    if (v0.ctype === 'list') {
        drawpoly();
    }
    if (v0.ctype === 'shape') {
        drawpolyshape();
    }

    if (df === "D") {
        csctx.stroke();
    }
    if (df === "F") {
        csctx.fillStyle = Render2D.lineColor;
        csctx.fill();
    }
    if (df === "C") {
        csctx.clip();
    }

    return nada;

};

// This is a hook: the following function may get replaced by a plugin.
var textRenderer = function(ctx, text, x, y, align) {
    var width = ctx.measureText(text).width;
    ctx.fillText(text, x - width * align, y);
};

evaluator.drawtext$2 = function(args, modifs) {
    var v0 = evaluateAndVal(args[0]);
    var v1 = evaluate(args[1]);
    var pt = eval_helper.extractPoint(v0);

    if (!pt.ok) {
        return nada;
    }

    var m = csport.drawingstate.matrix;

    var xx = pt.x * m.a - pt.y * m.b + m.tx;
    var yy = pt.x * m.c - pt.y * m.d - m.ty;

    var col = csport.drawingstate.textcolor;
    Render2D.handleModifs(modifs, Render2D.textModifs);
    var size = csport.drawingstate.textsize;
    if (Render2D.size !== null) size = Render2D.size;
    csctx.fillStyle = Render2D.textColor;

    csctx.font = Render2D.bold + Render2D.italics + Math.round(size * 10) / 10 + "px " + Render2D.family;
    var txt = niceprint(v1);
    textRenderer(csctx, txt, xx + Render2D.xOffset, yy - Render2D.yOffset,
        Render2D.align);

    return nada;

};

eval_helper.drawshape = function(shape, modifs) {
    if (shape.type === "polygon") {
        return eval_helper.drawpolygon([shape], modifs, "D", 1);
    }
    if (shape.type === "circle") {
        return eval_helper.drawcircle([shape.value.value[0], shape.value.value[1]], modifs, "D");
    }
    return nada;
};


eval_helper.fillshape = function(shape, modifs) {

    if (shape.type === "polygon") {
        return eval_helper.drawpolygon([shape], modifs, "F", 1);
    }
    if (shape.type === "circle") {
        return eval_helper.drawcircle([shape.value.value[0], shape.value.value[1]], modifs, "F");
    }
    return nada;
};


eval_helper.clipshape = function(shape, modifs) {
    if (shape.type === "polygon") {
        return eval_helper.drawpolygon([shape], modifs, "C", 1);
    }
    if (shape.type === "circle") {
        return eval_helper.drawcircle([shape.value.value[0], shape.value.value[1]], modifs, "C");
    }
    return nada;
};


evaluator.fill$1 = function(args, modifs) {
    var v1 = evaluate(args[0]);
    if (v1.ctype === "shape") {
        return eval_helper.fillshape(v1, modifs);
    }
    return nada;
};


evaluator.clip$1 = function(args, modifs) {
    var v1 = evaluate(args[0]);
    if (v1.ctype === "shape") {
        return eval_helper.clipshape(v1, modifs);
    }
    if (v1.ctype === "list") {
        var erg = evaluator.polygon$1(args, []);
        return evaluator.clip$1([erg], []);
    }
    return nada;
};

///////////////////////////////////////////////
////// FUNCTION PLOTTING    ///////////////////
///////////////////////////////////////////////

// TODO: Dynamic Color and Alpha

evaluator.plot$1 = function(args, modifs) {
    return evaluator.plot$2([args[0], null], modifs);
};

evaluator.plot$2 = function(args, modifs) {
    var dashing = false;
    var connectb = false;
    var minstep = 0.001;
    var pxlstep = 0.2 / csscale; //TODO Anpassen auf PortScaling
    var count = 0;
    var stroking = false;
    var start = -10; //TODO Anpassen auf PortScaling
    var stop = 10;
    var step = 1;
    var steps = 1000;

    var v1 = args[0];
    var runv;
    if (args[1] !== null && args[1].ctype === 'variable') {
        runv = args[1].name;

    } else {
        var li = eval_helper.plotvars(v1);
        runv = "#";
        if (li.indexOf("t") !== -1) {
            runv = "t";
        }
        if (li.indexOf("z") !== -1) {
            runv = "z";
        }
        if (li.indexOf("y") !== -1) {
            runv = "y";
        }
        if (li.indexOf("x") !== -1) {
            runv = "x";
        }
    }

    namespace.newvar(runv);

    var m = csport.drawingstate.matrix;
    var col = csport.drawingstate.linecolor;
    var lsize = 1;

    Render2D.handleModifs(modifs, {
        "color": true,
        "alpha": true,
        "size": true,
        "dashpattern": true,
        "dashtype": true,
        "dashing": true,

        "connect": function(v) {
            if (v.ctype === 'boolean')
                connectb = v.value;
        },

        "start": function(v) {
            if (v.ctype === 'number')
                start = v.value.real;
        },

        "stop": function(v) {
            if (v.ctype === 'number')
                stop = v.value.real;
        },

        "steps": function(v) {
            if (v.ctype === 'number')
                steps = v.value.real;
        },
    });
    csctx.strokeStyle = Render2D.lineColor;
    csctx.lineWidth = Render2D.lsize;
    csctx.lineCap = 'round';
    csctx.lineJoin = 'round';

    function canbedrawn(v) {
        return v.ctype === 'number' && CSNumber._helper.isAlmostReal(v);
    }

    function limit(v) { //TODO: Die  muss noch geschreoben werden
        return v;

    }

    function drawstroke(x1, x2, v1, v2, step) {
        count++;
        //console.log(niceprint(x1)+"  "+niceprint(x2));
        //console.log(step);
        var xb = +x2.value.real;
        var yb = +v2.value.real;


        var xx2 = xb * m.a - yb * m.b + m.tx;
        var yy2 = xb * m.c - yb * m.d - m.ty;
        var xa = +x1.value.real;
        var ya = +v1.value.real;
        var xx1 = xa * m.a - ya * m.b + m.tx;
        var yy1 = xa * m.c - ya * m.d - m.ty;

        if (!stroking) {
            csctx.beginPath();
            csctx.moveTo(xx1, yy1);
            csctx.lineTo(xx2, yy2);
            stroking = true;
        } else {
            csctx.lineTo(xx1, yy1);

            csctx.lineTo(xx2, yy2);
        }

    }


    function drawrec(x1, x2, y1, y2, step) {

        var drawable1 = canbedrawn(y1);
        var drawable2 = canbedrawn(y2);


        if ((step < minstep)) { //Feiner wollen wir  nicht das muss wohl ein Sprung sein
            if (!connectb) {
                if (stroking) {
                    csctx.stroke();
                    stroking = false;
                }


            }
            return;
        }
        if (!drawable1 && !drawable2)
            return; //also hier gibt's nix zu malen, ist ja nix da

        var mid = CSNumber.real((x1.value.real + x2.value.real) / 2);
        namespace.setvar(runv, mid);
        var ergmid = evaluate(v1);

        var drawablem = canbedrawn(ergmid);

        if (drawable1 && drawable2 && drawablem) { //alles ist malbar ---> Nach Steigung schauen
            var a = limit(y1.value.real);
            var b = limit(ergmid.value.real);
            var c = limit(y2.value.real);
            var dd = Math.abs(a + c - 2 * b) / (pxlstep);
            var drawit = (dd < 1);
            if (drawit) { //Weiterer Qualitätscheck eventuell wieder rausnehmen.
                var mid1 = CSNumber.real((x1.value.real + mid.value.real) / 2);
                namespace.setvar(runv, mid1);
                var ergmid1 = evaluate(v1);

                var mid2 = CSNumber.real((mid.value.real + x2.value.real) / 2);
                namespace.setvar(runv, mid2);
                var ergmid2 = evaluate(v1);

                var ab = limit(ergmid1.value.real);
                var bc = limit(ergmid2.value.real);
                var dd1 = Math.abs(a + b - 2 * ab) / (pxlstep);
                var dd2 = Math.abs(b + c - 2 * bc) / (pxlstep);
                drawit = drawit && dd1 < 1 && dd2 < 1;


            }
            if (drawit) { // Refinement sieht gut aus ---> malen
                drawstroke(x1, mid, y1, ergmid, step / 2);
                drawstroke(mid, x2, ergmid, y2, step / 2);

            } else { //Refinement zu grob weiter verfeinern
                drawrec(x1, mid, y1, ergmid, step / 2);
                drawrec(mid, x2, ergmid, y2, step / 2);
            }
            return;
        }

        //Übergange con drawable auf nicht drawable

        drawrec(x1, mid, y1, ergmid, step / 2);

        drawrec(mid, x2, ergmid, y2, step / 2);


    }

    //Hier beginnt der Hauptteil
    var xo, vo, x, v, xx, yy;

    stroking = false;

    x = CSNumber.real(14.32);
    namespace.setvar(runv, x);
    v = evaluate(v1);
    if (v.ctype !== "number") {
        if (List.isNumberVector(v).value) {
            if (v.value.length === 2) { //Parametric Plot
                stroking = false;
                step = (stop - start) / steps;
                for (x = start; x < stop; x = x + step) {
                    namespace.setvar(runv, CSNumber.real(x));
                    var erg = evaluate(v1);
                    if (List.isNumberVector(erg).value && erg.value.length === 2) {
                        var x1 = +erg.value[0].value.real;
                        var y = +erg.value[1].value.real;
                        xx = x1 * m.a - y * m.b + m.tx;
                        yy = x1 * m.c - y * m.d - m.ty;

                        if (!stroking) {
                            csctx.beginPath();
                            csctx.moveTo(xx, yy);
                            stroking = true;
                        } else {
                            csctx.lineTo(xx, yy);
                        }

                    }


                }
                csctx.stroke();

                namespace.removevar(runv);

            }
        }
        return nada;
    }


    for (xx = start; xx < stop + step; xx = xx + step) {

        x = CSNumber.real(xx);
        namespace.setvar(runv, x);
        v = evaluate(v1);

        if (x.value.real > start) {
            drawrec(xo, x, vo, v, step);

        }
        xo = x;
        vo = v;


    }


    namespace.removevar(runv);
    if (stroking)
        csctx.stroke();

    return nada;
};


evaluator.plotX$1 = function(args, modifs) { //OK


    var v1 = args[0];
    var li = eval_helper.plotvars(v1);
    var runv = "#";
    if (li.indexOf("t") !== -1) {
        runv = "t";
    }
    if (li.indexOf("z") !== -1) {
        runv = "z";
    }
    if (li.indexOf("y") !== -1) {
        runv = "y";
    }
    if (li.indexOf("x") !== -1) {
        runv = "x";
    }


    namespace.newvar(runv);
    var start = -10;
    var stop = 10;
    var step = 0.01;
    var m = csport.drawingstate.matrix;
    var col = csport.drawingstate.linecolor;
    csctx.fillStyle = col;
    csctx.lineWidth = 1;
    csctx.lineCap = 'round';

    var stroking = false;

    for (var x = start; x < stop; x = x + step) {
        namespace.setvar(runv, CSNumber.real(x));

        var erg = evaluate(v1);
        if (erg.ctype === "number") {
            var y = +erg.value.real;
            var xx = x * m.a - y * m.b + m.tx;
            var yy = x * m.c - y * m.d - m.ty;
            if (!stroking) {
                csctx.beginPath();
                csctx.moveTo(xx, yy);
                stroking = true;
            } else {
                csctx.lineTo(xx, yy);
            }

        }


    }
    csctx.stroke();

    namespace.removevar(runv);


    return nada;

};


eval_helper.plotvars = function(a) {
    function merge(x, y) {
        var obj = {},
            i;
        for (i = x.length - 1; i >= 0; --i)
            obj[x[i]] = x[i];
        for (i = y.length - 1; i >= 0; --i)
            obj[y[i]] = y[i];
        var res = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) // <-- optional
                res.push(obj[k]);
        }
        return res;
    }

    function remove(x, y) {

        for (var i = 0; i < x.length; i++) {
            if (x[i] === y) {
                x.splice(i, 1);
                i--;
            }
        }
        return x;
    }

    var l1, l2, li, els, j;

    if (a.ctype === "variable") {
        return [a.name];
    }

    if (a.ctype === 'infix') {
        l1 = eval_helper.plotvars(a.args[0]);
        l2 = eval_helper.plotvars(a.args[1]);
        return merge(l1, l2);
    }

    if (a.ctype === 'list') {
        els = a.value;
        li = [];
        for (j = 0; j < els.length; j++) {
            l1 = eval_helper.plotvars(els[j]);
            li = merge(li, l1);
        }
        return li;
    }

    if (a.ctype === 'function') {
        els = a.args;
        li = [];
        for (j = 0; j < els.length; j++) {
            l1 = eval_helper.plotvars(els[j]);
            li = merge(li, l1);

        }
        if ((a.oper === "apply" //OK, das kann man eleganter machen, TODO: irgendwann
                || a.oper === "select" || a.oper === "forall" || a.oper === "sum" || a.oper === "product" || a.oper === "repeat" || a.oper === "min" || a.oper === "max" || a.oper === "sort"
            ) && a.args[1].ctype === "variable") {
            li = remove(li, a.args[1].name);
        }
        return li;
    }

    return [];


};


evaluator.clrscr$0 = function(args, modifs) {
    if (typeof csw !== 'undefined' && typeof csh !== 'undefined') {
        csctx.clearRect(0, 0, csw, csh);
    }
    return nada;
};

evaluator.repaint$0 = function(args, modifs) {
    updateCindy();
    return nada;
};


evaluator.screenbounds$0 = function(args, modifs) {
    var pt1 = General.withUsage(List.realVector(csport.to(0, 0)), "Point");
    var pt2 = General.withUsage(List.realVector(csport.to(csw, 0)), "Point");
    var pt3 = General.withUsage(List.realVector(csport.to(csw, csh)), "Point");
    var pt4 = General.withUsage(List.realVector(csport.to(0, csh)), "Point");
    return (List.turnIntoCSList([pt1, pt2, pt3, pt4]));
};


evaluator.createimage$3 = function(args, modifs) {

    var v0 = evaluate(args[0]);
    var v1 = evaluateAndVal(args[1]);
    var v2 = evaluateAndVal(args[2]);


    if (v1.ctype !== 'number' || v2.ctype !== 'number' || v0.ctype !== 'string') {
        return nada;
    }


    var canvas = document.createElement("canvas");
    canvas.id = v0.value;
    canvas.width = v1.value.real;
    canvas.height = v2.value.real;

    // canvas.style.border="1px solid #FF0000";
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    images[v0.value] = canvas;

    return nada;
};


evaluator.clearimage$1 = function(args, modifs) {

    var name = evaluate(args[0]);

    if (name.ctype !== 'string') {
        return nada;
    }

    var localcanvas = document.getElementById(name.value);
    if (typeof(localcanvas) === "undefined" || localcanvas === null) {
        return nada;
    }
    var cw = localcanvas.width;
    var ch = localcanvas.height;
    var localcontext = localcanvas.getContext('2d');
    localcontext.clearRect(0, 0, cw, ch);

    return nada;
};


evaluator.canvas$4 = function(args, modifs) {
    var a = evaluateAndVal(args[0]);
    var b = evaluateAndVal(args[1]);
    var name = evaluate(args[2]);
    var prog = args[3];

    var pta = eval_helper.extractPoint(a);
    var ptb = eval_helper.extractPoint(b);
    if (!pta.ok || !ptb.ok || name.ctype !== 'string') {
        return nada;
    }
    var localcanvas = document.getElementById(name.value);
    if (typeof(localcanvas) === "undefined" || localcanvas === null) {
        return nada;
    }


    var cw = localcanvas.width;
    var ch = localcanvas.height;

    var diffx = ptb.x - pta.x;
    var diffy = ptb.y - pta.y;

    var ptcx = pta.x - diffy * ch / cw;
    var ptcy = pta.y + diffx * ch / cw;
    var ptdx = ptb.x - diffy * ch / cw;
    var ptdy = ptb.y + diffx * ch / cw;

    var cva = csport.from(pta.x, pta.y, 1);
    var cvc = csport.from(ptcx, ptcy, 1);
    var cvd = csport.from(ptdx, ptdy, 1);


    var x11 = cva[0];
    var x12 = cva[1];
    var x21 = cvc[0];
    var x22 = cvc[1];
    var x31 = cvd[0];
    var x32 = cvd[1];
    var y11 = 0;
    var y12 = ch;
    var y21 = 0;
    var y22 = 0;
    var y31 = cw;
    var y32 = 0;

    var a1 = (cw * (x12 - x22)) / ((x11 - x21) * (x12 - x32) - (x11 - x31) * (x12 - x22));
    var a2 = (cw * (x11 - x21)) / ((x12 - x22) * (x11 - x31) - (x12 - x32) * (x11 - x21));
    var a3 = -a1 * x11 - a2 * x12;
    var a4 = (ch * (x12 - x32) - ch * (x12 - x22)) / ((x11 - x21) * (x12 - x32) - (x11 - x31) * (x12 - x22));
    var a5 = (ch * (x11 - x31) - ch * (x11 - x21)) / ((x12 - x22) * (x11 - x31) - (x12 - x32) * (x11 - x21));
    var a6 = ch - a4 * x11 - a5 * x12;

    var localcontext = localcanvas.getContext('2d');

    var backupctx = csctx;
    csctx = localcontext;
    csctx.save();

    csctx.transform(a1, a4, a2, a5, a3, a6);

    evaluate(prog);
    csctx.restore();
    csctx = backupctx;
};


evaluator.canvas$5 = function(args, modifs) {
    var a = evaluateAndVal(args[0]);
    var b = evaluateAndVal(args[1]);
    var c = evaluateAndVal(args[2]);
    var name = evaluate(args[3]);
    var prog = args[4];

    var pta = eval_helper.extractPoint(a);
    var ptb = eval_helper.extractPoint(b);
    var ptc = eval_helper.extractPoint(c);
    if (!pta.ok || !ptb.ok || !ptc.ok || name.ctype !== 'string') {
        return nada;
    }
    var localcanvas = document.getElementById(name.value);
    if (typeof(localcanvas) === "undefined" || localcanvas === null) {
        return nada;
    }


    var cw = localcanvas.width;
    var ch = localcanvas.height;


    var cva = csport.from(pta.x, pta.y, 1);
    var cvb = csport.from(ptb.x, ptb.y, 1);
    var cvc = csport.from(ptc.x, ptc.y, 1);


    var x11 = cva[0];
    var x12 = cva[1];
    var x21 = cvb[0];
    var x22 = cvb[1];
    var x31 = cvc[0];
    var x32 = cvc[1];
    var y11 = 0;
    var y12 = ch;
    var y21 = cw;
    var y22 = ch;
    var y31 = 0;
    var y32 = 0;

    var a1 = ((y11 - y21) * (x12 - x32) - (y11 - y31) * (x12 - x22)) /
        ((x11 - x21) * (x12 - x32) - (x11 - x31) * (x12 - x22));
    var a2 = ((y11 - y21) * (x11 - x31) - (y11 - y31) * (x11 - x21)) /
        ((x12 - x22) * (x11 - x31) - (x12 - x32) * (x11 - x21));
    var a3 = y11 - a1 * x11 - a2 * x12;
    var a4 = ((y12 - y22) * (x12 - x32) - (y12 - y32) * (x12 - x22)) /
        ((x11 - x21) * (x12 - x32) - (x11 - x31) * (x12 - x22));
    var a5 = ((y12 - y22) * (x11 - x31) - (y12 - y32) * (x11 - x21)) /
        ((x12 - x22) * (x11 - x31) - (x12 - x32) * (x11 - x21));
    var a6 = y12 - a4 * x11 - a5 * x12;

    var localcontext = localcanvas.getContext('2d');

    var backupctx = csctx;
    csctx = localcontext;
    csctx.save();

    csctx.transform(a1, a4, a2, a5, a3, a6);

    evaluate(prog);
    csctx.restore();
    csctx = backupctx;
};

evaluator.screenresolution$0 = function(args, modifs) {
    var m = csport.drawingstate.matrix;
    return CSNumber.real(m.a);
};

evaluator.layer$1 = function(args, modifs) {
    // No-op to avoid error messages when exporting from Cinderella
    // See https://gitlab.cinderella.de:8082/cindyjs/cindyjs/issues/17
};
//*******************************************************
// and here are the definitions of the image operators
//*******************************************************


eval_helper.extractReferenceX = function(w, pos) {


};

evaluator.imagesize$1 = function(args, modifs) {
    var img = evaluateAndVal(args[0]);
    if (img.ctype === 'string') {
        if (images[img.value]) {
            var w = images[img.value].width;
            var h = images[img.value].height;
            return List.realVector([w, h]);

        }
    }

    return nada;

};

evaluator.drawimage$2 = function(args, modifs) {

    function drawimg1() {


        function handleModifs() {
            var erg;
            if (modifs.angle !== undefined) {
                erg = evaluate(modifs.angle);
                if (erg.ctype === 'number') {
                    rot = erg.value.real;
                }
            }

            if (modifs.rotation !== undefined) {
                erg = evaluate(modifs.rotation);
                if (erg.ctype === 'number') {
                    rot = erg.value.real;
                }
            }

            if (modifs.scale !== undefined) {
                erg = evaluateAndVal(modifs.scale);
                if (erg.ctype === 'number') {
                    scax = erg.value.real;
                    scay = erg.value.real;
                }
                if (List.isNumberVector(erg).value && (erg.value.length === 2)) {
                    scax = erg.value[0].value.real;
                    scay = erg.value[1].value.real;
                }

            }

            if (modifs.scalex !== undefined) {
                erg = evaluate(modifs.scalex);
                if (erg.ctype === 'number') {
                    scax = erg.value.real;
                }
            }

            if (modifs.scaley !== undefined) {
                erg = evaluate(modifs.scaley);
                if (erg.ctype === 'number') {
                    scay = erg.value.real;
                }
            }

            if (modifs.flipx !== undefined) {
                erg = evaluate(modifs.flipx);
                if (erg.ctype === 'boolean') {
                    if (erg.value) {
                        flipx = -1;
                    }
                }
            }

            if (modifs.flipy !== undefined) {
                erg = evaluate(modifs.flipy);
                if (erg.ctype === 'boolean') {
                    if (erg.value) {
                        flipy = -1;
                    }
                }
            }


            if (modifs.alpha !== undefined) {
                erg = evaluate(modifs.alpha);
                if (erg.ctype === 'number') {
                    alpha = erg.value.real;
                }

            }


        }


        var scax = 1;
        var scay = 1;
        var flipx = 1;
        var flipy = 1;
        var rot = 0;
        var alpha = 1;

        var pt = eval_helper.extractPoint(v0);
        if (!pt.ok || img.ctype !== 'string') {
            return nada;
        }

        csctx.save();
        handleModifs();


        var m = csport.drawingstate.matrix;
        var initm = csport.drawingstate.initialmatrix;


        var w = images[img.value].width;
        var h = images[img.value].height;

        //TODO das ist für die Drehungen im lokaen koordinatensystem
        //sollte eigentlich einfacher gehen

        var xx = pt.x * m.a - pt.y * m.b + m.tx;
        var yy = pt.x * m.c - pt.y * m.d - m.ty;

        var xx1 = (pt.x + 1) * m.a - pt.y * m.b + m.tx - xx;
        var yy1 = (pt.x + 1) * m.c - pt.y * m.d - m.ty - yy;

        var ixx = pt.x * initm.a - pt.y * initm.b + initm.tx;
        var iyy = pt.x * initm.c - pt.y * initm.d - initm.ty;

        var ixx1 = (pt.x + 1) * initm.a - pt.y * initm.b + initm.tx - ixx;
        var iyy1 = (pt.x + 1) * initm.c - pt.y * initm.d - initm.ty - iyy;

        var sc = Math.sqrt(xx1 * xx1 + yy1 * yy1) / Math.sqrt(ixx1 * ixx1 + iyy1 * iyy1);
        var ang = -Math.atan2(xx1, yy1) + Math.atan2(ixx1, iyy1);


        if (alpha !== 1)
            csctx.globalAlpha = alpha;

        csctx.translate(xx, yy);
        csctx.scale(scax * flipx * sc, scay * flipy * sc);


        csctx.rotate(rot + ang);


        csctx.translate(-xx, -yy);
        csctx.translate(-w / 2, -h / 2);


        csctx.drawImage(images[img.value], xx, yy);
        csctx.globalAlpha = 1;

        csctx.restore();


    }


    function drawimg3() {
        var alpha = 1;
        var flipx = 1;
        var flipy = 1;
        var aspect = 1;

        function handleModifs() {
            var erg;

            if (modifs.alpha !== undefined) {
                erg = evaluate(modifs.alpha);
                if (erg.ctype === 'number') {
                    alpha = erg.value.real;
                }

            }

            if (modifs.aspect !== undefined) {
                erg = evaluate(modifs.aspect);
                if (erg.ctype === 'number') {
                    aspect = erg.value.real;
                }

            }

            if (modifs.flipx !== undefined) {
                erg = evaluate(modifs.flipx);
                if (erg.ctype === 'boolean') {
                    if (erg.value) {
                        flipx = -1;
                    }
                }
            }

            if (modifs.flipy !== undefined) {
                erg = evaluate(modifs.flipy);
                if (erg.ctype === 'boolean') {
                    if (erg.value) {
                        flipy = -1;
                    }
                }
            }

        }


        var pt1 = eval_helper.extractPoint(v0);
        var pt2 = eval_helper.extractPoint(v1);
        var pt3;


        if (!pt1.ok || !pt2.ok || img.ctype !== 'string') {
            return nada;
        }
        // console.lof(JSON.stringify(images));
        if (images === undefined || images[img.value] === undefined)
            return;
        var w = images[img.value].width;
        var h = images[img.value].height;


        if (v2 === 0) {

            pt3 = {};
            pt3.x = pt1.x - (pt2.y - pt1.y);
            pt3.y = pt1.y + (pt2.x - pt1.x);
            aspect = h / w;

        } else {
            pt3 = eval_helper.extractPoint(v2);
            if (!pt1.ok) return nada;
        }

        csctx.save();
        handleModifs();


        var m = csport.drawingstate.matrix;
        var initm = csport.drawingstate.initialmatrix;


        if (alpha !== 1)
            csctx.globalAlpha = alpha;

        var xx1 = pt1.x * m.a - pt1.y * m.b + m.tx;
        var yy1 = pt1.x * m.c - pt1.y * m.d - m.ty;

        var xx2 = pt2.x * m.a - pt2.y * m.b + m.tx;
        var yy2 = pt2.x * m.c - pt2.y * m.d - m.ty;

        var xx3 = pt3.x * m.a - pt3.y * m.b + m.tx;
        var yy3 = pt3.x * m.c - pt3.y * m.d - m.ty;

        csctx.transform(xx2 - xx1, yy2 - yy1, xx3 - xx1, yy3 - yy1, xx1, yy1);
        csctx.scale(1 / w, -1 / h * aspect);

        csctx.translate(w / 2, -h / 2);
        csctx.scale(flipx, flipy);
        csctx.translate(-w / 2, h / 2);

        csctx.translate(0, -h);


        csctx.drawImage(images[img.value], 0, 0);
        csctx.globalAlpha = 1;

        csctx.restore();


    }


    var v0, v1, v2, img;

    if (args.length === 2) {
        v0 = evaluateAndVal(args[0]);
        img = evaluateAndVal(args[1]);

        return drawimg1();
    }

    if (args.length === 3) {
        v0 = evaluateAndVal(args[0]);
        v1 = evaluateAndVal(args[1]);
        v2 = 0;
        img = evaluateAndVal(args[2]);

        return drawimg3();
    }


    if (args.length === 4) {
        v0 = evaluateAndVal(args[0]);
        v1 = evaluateAndVal(args[1]);
        v2 = evaluateAndVal(args[2]);
        img = evaluateAndVal(args[3]);

        return drawimg3();
    }

    return nada;
};

// TODO: separate arities
evaluator.drawimage$3 = evaluator.drawimage$2;
evaluator.drawimage$4 = evaluator.drawimage$2;
//****************************************************************
// this function is responsible for evaluation an expression tree
//****************************************************************

function evaluate(a) {

    if (typeof a === 'undefined') {
        return nada;
    }

    if (a.ctype === 'infix') {
        return a.impl(a.args, {});
    }
    if (a.ctype === 'variable') {
        return namespace.getvar(a.name);
        //  return a.value[0];
    }
    if (a.ctype === 'void') {
        return a;
    }
    if (a.ctype === 'geo') {
        return a;
    }
    if (a.ctype === 'number') {
        return a;
    }
    if (a.ctype === 'boolean') {
        return a;
    }
    if (a.ctype === 'string') {
        return a;
    }
    if (a.ctype === 'list') {
        return a;
    }
    if (a.ctype === 'undefined') {
        return a;
    }
    if (a.ctype === 'shape') {
        return a;
    }

    if (a.ctype === 'field') {

        var obj = evaluate(a.obj);

        if (obj.ctype === "geo") {
            return Accessor.getField(obj.value, a.key);
        }
        if (obj.ctype === "list") {
            return List.getField(obj, a.key);
        }
        return nada;
    }

    if (a.ctype === 'function') {
        var eargs = [];
        return eval_helper.evaluate(a.oper, a.args, a.modifs);
    }
    return nada;

}


function evaluateAndVal(a) {


    var x = evaluate(a);
    if (x.ctype === 'geo') {
        var val = x.value;
        if (val.kind === "P") {
            return Accessor.getField(val, "xy");
        }

    }
    return x; //TODO Implement this
}

function evaluateAndHomog(a) {
    var x = evaluate(a);
    if (x.ctype === 'geo') {
        var val = x.value;
        if (val.kind === "P") {
            return Accessor.getField(val, "homog");
        }
        if (val.kind === "L") {
            return Accessor.getField(val, "homog");
        }

    }
    if (List._helper.isNumberVecN(x, 3)) {
        return x;
    }

    if (List._helper.isNumberVecN(x, 2)) {
        var y = List.turnIntoCSList([
            x.value[0], x.value[1], CSNumber.real(1)
        ]);
        if (x.usage)
            y = General.withUsage(y, x.usage);
        return y;
    }

    return nada;
}


//*******************************************************
// this function removes all comments spaces and newlines
//*******************************************************

function condense(code) {
    var literalmode = false;
    var commentmode = false;
    var erg = '';
    for (var i = 0; i < code.length; i++) {
        var closetoend = (i === code.length - 1);
        var c = code[i];
        if (c === '\"' && !commentmode)
            literalmode = !literalmode;

        if (c === '/' && (i !== code.length - 1))
            if (code[i + 1] === '/')
                commentmode = true;
        if (c === '\n')
            commentmode = false;
        if (!(c === '\u0020' || c === '\u0009' || c === '\u000A' || c === '\u000C' || c === '\u000D' || commentmode) || literalmode)
            erg = erg + c;
    }
    return erg;
}

//*******************************************************
// this function shows an expression tree on the console
//*******************************************************

function report(a, i) {
    var prep = new Array(i + 1).join('.'),
        els, j;
    if (a.ctype === 'infix') {
        console.log(prep + "INFIX: " + a.oper);
        console.log(prep + "ARG 1 ");
        report(a.args[0], i + 1);
        console.log(prep + "ARG 2 ");
        report(a.args[1], i + 1);
    }
    if (a.ctype === 'number') {
        console.log(prep + "NUMBER: " + CSNumber.niceprint(a));
    }
    if (a.ctype === 'variable') {
        console.log(prep + "VARIABLE: " + a.name);
    }
    if (a.ctype === 'undefined') {
        console.log(prep + "UNDEF");
    }
    if (a.ctype === 'void') {
        console.log(prep + "VOID");
    }
    if (a.ctype === 'string') {
        console.log(prep + "STRING: " + a.value);
    }
    if (a.ctype === 'shape') {
        console.log(prep + "SHAPE: " + a.type);
    }
    if (a.ctype === 'modifier') {
        console.log(prep + "MODIF: " + a.key);
    }
    if (a.ctype === 'list') {
        console.log(prep + "LIST ");
        els = a.value;
        for (j = 0; j < els.length; j++) {
            console.log(prep + "EL" + j);
            report(els[j], i + 1);
        }
    }
    if (a.ctype === 'function') {
        console.log(prep + "FUNCTION: " + a.oper);
        els = a.args;
        for (j = 0; j < els.length; j++) {
            console.log(prep + "ARG" + j);
            report(els[j], i + 1);
        }
        els = a.modifs;
        for (var name in els) {
            console.log(prep + "MODIF:" + name);
            report(els[name], i + 1);
        }
    }
    if (a.ctype === 'error') {
        console.log(prep + "ERROR: " + a.message);
    }

}


function generateInfix(oper, f1, f2) {
    var erg = {};
    erg.ctype = 'infix';
    erg.oper = oper;
    erg.impl = infixmap[oper];
    erg.args = [f1, f2];
    return erg;
}


function modifierOp(code, bestbinding, oper) {
    var s = code.substring(0, bestbinding);
    var f1 = analyse(code.substring(bestbinding + oper.length), false);
    if (f1.ctype === 'error') return f1;
    return {
        'ctype': 'modifier',
        'key': s,
        'value': f1
    };
}


function definitionDot(code, bestbinding, oper) {
    if (isNumber(code)) {
        var erg = {};
        erg.value = {
            'real': parseFloat(code),
            'imag': 0
        };
        erg.ctype = 'number';
        return erg;
    }
    var s1 = analyse(code.substring(0, bestbinding), false);
    var s2 = code.substring(bestbinding + oper.length);
    return {
        'ctype': 'field',
        'obj': s1,
        'key': s2
    };
}


function validDefinabaleFunction(f) { //TODO Eventuell echte fehlermelungen zurückgeben
    var i, j;
    if (f.ctype !== 'function') {
        console.log("Invalid function name.");
        return false; //Invalid Function Name
    }
    for (i = 0; i < f.args.length; i++) {
        if (f.args[i].ctype !== 'variable') {
            console.log("Argument is not a variable.");
            return false; //Arg not a variable
        }
    }
    for (i = 0; i < f.args.length - 1; i++) {
        for (j = i + 1; j < f.args.length; j++) {
            if (f.args[i].name === f.args[j].name) {
                console.log("Variable name used twice.");
                return false; //Varname used twice
            }

        }
    }


    return true;
}

function definitionOp(code, bestbinding, oper) {

    var s1 = code.substring(0, bestbinding);
    var f1 = analyse(s1, true);
    if (f1.ctype === 'error') return f1;
    if (f1.cstring === 'variable' || validDefinabaleFunction(f1)) {

        var s2 = code.substring(bestbinding + oper.length);
        var f2 = analyse(s2, false);
        if (f2.ctype === 'error') return f2;

        return generateInfix(oper, f1, f2);

    }
    console.log(["Function not definable", f1]);
    return new CError('Function not definable');
}


function infixOp(code, bestbinding, oper) {
    var f1 = analyse(code.substring(0, bestbinding), false);
    var f2 = analyse(code.substring(bestbinding + oper.length), false);
    if (f1.ctype === 'error') return f1;
    if (f2.ctype === 'error') return f2;

    return generateInfix(oper, f1, f2);

}

function isPureNumber(code) {
    return code !== "" && !isNaN(code);
}


function isNumber(code) {

    var a = code.indexOf('.');
    var b = code.lastIndexOf('.');
    if (a !== b) return false;
    if (a === -1) {
        return isPureNumber(code);
    } else {
        return isPureNumber(code.substring(0, a)) || isPureNumber(code.substring(a + 1));
    }
}


function somethingelse(code) {

    if (code === '') {
        return new Void();
    }
    if (code.charAt(0) === '"' && code.charAt(code.length - 1) === '"') {
        return {
            'ctype': 'string',
            'value': code.substring(1, code.length - 1)
        };
    }

    if (isPureNumber(code)) {
        return {
            'ctype': 'number',
            'value': {
                'real': parseInt(code),
                'imag': 0
            }
        };
    }
    if (namespace.isVariable(code)) {
        return namespace.vars[code];
    }
    if (namespace.isVariableName(code)) {
        var variable = namespace.create(code);
        return variable;
    }


    /*                        if (isVariable(expr)) {
     if (cat.isDebugEnabled()) cat.debug("Variable: " + expr);
     Assignments ass = getAssignments();
     if (ass !== null) {
     FormulaValue elem = dispatcher.namespace.getVariable(expr);
     if (!elem.isNull()) {
     fout = (Formula) elem;
     }
     }
     } else if (isVariableName(expr)) {
     if (cat.isDebugEnabled()) cat.debug("Create Variable: " + expr);
     Variable f = new Variable(this);
     f.setCode(expr);
     Assignments ass = getAssignments();
     if (ass !== null) dispatcher.namespace.putVariable(expr, f);
     fout = f;
     }*/
    //                      if (!fout.isNull()) return fout;
    return nada;
}


function isOpener(c) {
    return c === '[' || c === '(' || c === '{' || c === '|';
}

function isCloser(c) {
    return c === ']' || c === ')' || c === '}' || c === '|';
}

function isBracketPair(c) {
    return c === '[]' || c === '()' || c === '{}' || c === '||';
}

var usedFunctions = {};


function funct(code, firstbraind, defining) {

    var args = [];
    var argsi = [];
    var argsf = [];
    var modifs = {};

    var oper = code.substring(0, firstbraind);

    var length = code.length;
    var bracount = 0;
    var start = firstbraind + 1;
    var literalmode = false;
    var absolute = false;
    var i;
    for (i = start; i < length; i++) {
        var c = code[i];
        if (c === '"') literalmode = !literalmode;
        if (!literalmode) {
            if (isOpener(c) && (c !== '|' || !absolute)) {
                bracount++;
                if (c === '|') absolute = true;
            } else if (isCloser(c) && (c !== '|' || absolute)) {
                bracount--;
                if (c === '|') absolute = false;
            }
            if (c === ',' && bracount === 0 || bracount === -1) {
                var arg = code.substring(start, i);
                args.push(arg);
                argsi.push(start);

                if (args.length === 1 && bracount === -1 && !args[0].length) { //Um f() abzufangen
                    args = [];
                    argsi = [];
                }
                start = i + 1;
            }
        }
    }

    for (i = 0; i < args.length; i++) {
        var s = args[i];

        var f = analyse(s, false);
        if (f.ctype === 'error') return f;
        if (f.ctype === 'modifier') {
            modifs[f.key] = f.value;
            //                           modifs[modifs.length]=f;
        } else {
            argsf.push(f);
        }
    }

    // Term t = (Term) generateFunction(oper, argsf, modifs, defining);
    // return t;
    var erg = {};
    erg.ctype = 'function';
    erg.oper = oper + "$" + argsf.length;
    usedFunctions[erg.oper] = true;
    erg.args = argsf;
    erg.modifs = modifs;

    return erg;

}


function parseList(code) {
    var code1 = code;

    var args = []; //das sind die argument exprs
    var argsi = []; //das sind die startindize
    var argsf = []; //das sind die formeln zu den exprs
    code1 = code1 + ',';
    var length = code1.length;
    var bracount = 0;
    var start = 0;
    var absolute = false;
    var literalmode = false;
    var i;
    for (i = start; i < length; i++) {
        var c;
        c = code1[i];
        if (c === '"') literalmode = !literalmode;
        if (!literalmode) {
            if (isOpener(c) && (c !== '|' || !absolute)) {
                bracount++;
                if (c === '|') absolute = true;
            } else if (isCloser(c) && (c !== '|' || absolute)) {
                bracount--;
                if (c === '|') absolute = false;
            }
            if (c === ',' && bracount === 0 || bracount === -1) {

                var arg = code1.substring(start, i);
                args.push(arg);
                argsi.push(start);
                start = i + 1;

            }
        }
    }
    for (i = 0; i < args.length; i++) {
        var s = args[i];
        if ("" === s) {
            argsf.push('nil');
        } else {
            var f = analyse(s, false);
            if (f.ctype === 'error') return f;

            argsf.push(f);
        }
    }
    /*  var erg={};
     erg.ctype='list';
     erg.value=argsf;*/
    var erg = {};
    erg.ctype = 'function';
    erg.oper = 'genList';
    erg.args = argsf;
    erg.modifs = {};
    return erg;
}


function bracket(code) {
    //TODO: ABS
    /*      if (code.charAt(0) === '|') {
     Formula f1 = parseList(expr.substring(1, expr.length() - 1), csc);
     OpAbsArea f = new OpAbsArea(csc);
     ArrayList<Formula> args = new ArrayList<Formula>();
     args.add(f1);
     f.setArguments(args);
     return f;
     }*/

    var erg;

    if (code[0] === "|") {
        var f1 = parseList(code.substring(1, code.length - 1));
        var type = f1.args.length;
        if (type === 1) {
            f1.oper = "abs_infix";
            return f1;

        }
        if (type === 2) {
            f1.oper = "dist_infix";
            return f1;

        }
        return nada;

    }

    if (code === "()" || code === "[]") {
        erg = {};
        erg.ctype = 'list';
        erg.value = [];
        return erg;
    }

    if (code[0] === '[') {
        return parseList(code.substring(1, code.length - 1));
    }
    if (code[0] === '(') {
        erg = parseList(code.substring(1, code.length - 1));
        if (erg.args.length > 1) {
            return erg;
        }

    }

    erg = analyse(code.substring(1, code.length - 1), false);


    return erg;

}


function analyse(code, defining) {
    var literalmode = false;
    var erg = {};
    var bra = '';
    var bestbinding = -1;
    var yourthetop = -1;
    var bestoper = '';
    var bracount = 0;
    var braexprcount = 0;
    var firstbra = ' '; //erste Klammer
    var lastbra = ' '; //letzte Klammer
    var open1 = 0;
    var close1 = 0;
    var open2 = 0;
    var close2 = 0;
    var offset = 0;
    var absolute = false; //betragsklammer
    var length = code.length;

    for (var i = 0; i < length; i++) {
        var c;
        var c1 = ' ';
        var c2 = ' ';
        if (offset > 0) offset--;
        c = code[i];
        if (i + 1 < length) c1 = code[i + 1]; //die werden fuer lange operatoren gebraucht
        if (i + 2 < length) c2 = code[i + 2];

        if (c === '\"') { //Anführungszeichen schalten alles aus
            literalmode = !literalmode;
        }
        if (!literalmode) {
            if (isOpener(c) && (c !== '|' || !absolute)) { //Klammer geht auf
                if (c === '|') absolute = true;
                bra = bra + c;
                bracount++;
                if (bracount === 1) {
                    braexprcount++;
                    if (braexprcount === 1) open1 = i;
                    if (braexprcount === 2) open2 = i;
                }
                if (firstbra === ' ') firstbra = c;
            } else if (isCloser(c) && (c !== '|' || absolute)) { //Schließende Klammer
                if (c === '|') absolute = false;
                if (bracount === 0) {
                    return new CError('close without open');
                }
                var pair = bra[bra.length - 1] + c;
                if (isBracketPair(pair)) { //Passt die schliesende Klammer?
                    bracount--;
                    bra = bra.substring(0, bra.length - 1);
                    if (braexprcount === 1) close1 = i;
                    if (braexprcount === 2) close2 = i;
                    lastbra = c;
                } else {
                    return new CError('unmatched brackets');
                }
            }
            if (bra.length === 0) { //Wir sind auf oberster Stufe
                var prior = -1;
                var oper = "";
                if ((typeof operators[c + c1 + c2] !== 'undefined') && offset === 0) {
                    oper = c + c1 + c2;
                    offset = 3;
                } else if ((typeof operators[c + c1] !== 'undefined') && offset === 0) {
                    oper = "" + c + c1;
                    offset = 2;
                } else if ((typeof operators[c] !== 'undefined') && offset === 0) {
                    oper = "" + c;
                    offset = 1;
                }
                if (oper !== '') {
                    prior = operators[oper];
                }

                if (prior >= yourthetop) { //Der bindet bisher am stärksten
                    yourthetop = prior;
                    bestbinding = i;
                    bestoper = oper;
                    if (prior >= 0) i += oper.length - 1;
                }
            }
        }
    }


    if (bracount !== 0) {
        return new CError('open without close');

    }

    //Und jetzt wird der Baum aufgebaut.

    var firstbraind = code.indexOf(firstbra);
    var lastbraind = code.lastIndexOf(lastbra);

    if (bracount === 0 && yourthetop > -1) { //infix Operator gefunden
        //   if (bestoper.equals("->")) //Specialbehandlung von modyfiern
        //   return modifierOp(expr, bestbinding, bestoper);
        //   else if (bestoper.equals(":=")) //Specialbehandlung von definitionen
        //   return definitionOp(expr, bestbinding, bestoper);
        //   else if (bestoper.equals(".")) //Specialbehandlung von Feldzugriff
        //   return definitionDot(expr, bestbinding, bestoper);
        //   else return infixOp(expr, bestbinding, bestoper);
        if (bestoper === '->') //Specialbehandlung von modifyern
            return modifierOp(code, bestbinding, bestoper);
        if (bestoper === '.') //Specialbehandlung von Feldzugriff
            return definitionDot(code, bestbinding, bestoper);
        if (bestoper === ':=') //Specialbehandlung von definitionen
            return definitionOp(code, bestbinding, bestoper);
        return infixOp(code, bestbinding, bestoper);
    } else if (bracount === 0 && braexprcount === 1 && lastbraind === code.length - 1) { //Klammer oder Funktion

        if (firstbraind === 0) { //Einfach eine Klammer (evtl Vector))
            return bracket(code);
        } else {
            return funct(code, firstbraind, defining);
        }
    } else {
        return somethingelse(code); //Zahlen, Atomics, Variablen, oder nicht parsebar
    }


}
//*******************************************************
// and here are the definitions of the sound operators
//*******************************************************

var sound = {};
sound.lines = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

evaluator.playsin$1 = function(args, modifs) {

    function handleModifs() {
        var erg;
        if (modifs.line !== undefined) {

            erg = evaluate(modifs.line);
            if (erg.ctype === 'number') {
                linenumber = Math.floor(erg.value.real);
                if (linenumber < 0) {
                    linenumber = 0;
                }
                if (linenumber > 10) {
                    linenumber = 10;
                }
            }
        }
    }


    var v0 = evaluateAndVal(args[0]);
    var linenumber = 0;
    if (v0.ctype === 'number') {
        handleModifs();
        var lines = sound.lines;
        var f = v0.value.real;
        if (lines[linenumber] === 0) {
            // Was bitte sollte die Funktion T an dieser Stelle sein?
            // lines[linenumber]=T("sin", {freq:f,mul:0.6}).play();


        } else {
            lines[linenumber].set({
                freq: f
            });
        }

    }
    return nada;

};
var CSad = {};

CSad.printArr = function(erg) {
    var n = erg.value.length;
    var ttemp = [];
    var ttempi = [];
    var printimag = false;
    for (var k = 0; k < n; k++) {
        ttemp[k] = erg.value[k].value.real;
        ttempi[k] = erg.value[k].value.imag;
        if (ttempi[k] !== 0) printimag = true;
    }
    console.log(ttemp);
    if (printimag)
        console.log(ttempi);
};

// array which contains only n zeros
CSad.zero = function(n) {
    var erg = [];
    var zero = CSNumber.real(0);

    for (var i = 0; i < n.value.real; i++) {
        erg[i] = zero;
    }

    return List.turnIntoCSList(erg);
};

// csad number type [x0, 0, 0, ...]
CSad.number = function(x0, n) {
    var erg = CSad.zero(n);
    erg.value[0] = x0;
    return erg;
};

// csad variables [x0, 1, 0, ....]
CSad.variable = function(x0, n) {
    var erg = CSad.zero(n);
    erg.value[0] = x0;
    erg.value[1] = CSNumber.real(1);
    return erg;
};

CSad.add = function(a, b) {
    return List.add(a, b);
};

CSad.sub = function(a, b) {
    return List.sub(a, b);
};

CSad.mult = function(f, g) {
    if (f.value.length !== g.value.length) {
        console.error("dims don't fit return nada");
        return nada;
    }

    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));

    var ges = CSNumber.real(0);
    for (var k = 0; k < le; k++) {
        for (var i = 0; i <= k; i++) {
            ges = CSNumber.add(ges, CSNumber.mult(f.value[i], g.value[k - i]));
        } // end inner
        erg.value[k] = ges;
        ges = CSNumber.real(0);
    } // end outer

    return erg;
};


CSad.pow = function(a, b) {
    if (b.value.real < 0 || b.value.real !== Math.floor(b.value.real)) {
        return CSad.root(a, b);
    } else {
        var temp = a;
        for (var i = 1; i < b.value.real; i++) {
            temp = CSad.mult(temp, a);
        }
        return temp;
    }
};

// (f)^r for float r
CSad.root = function(f, r) {
    var zero = CSNumber.real(0);
    var one = CSNumber.real(1);
    var rOne = CSNumber.add(one, r);

    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));
    erg.value[0] = CSNumber.pow(f.value[0], r);

    var sum = zero;
    var inner;
    var ges, csK;
    for (var k = 1; k < le; k++) {
        csK = CSNumber.real(k);
        ges = f.value[k];
        for (var i = 1; i <= k; i++) {
            inner = CSNumber.mult(rOne, CSNumber.real(i));
            inner = CSNumber.div(inner, csK);
            inner = CSNumber.sub(inner, one);
            inner = CSNumber.mult(inner, f.value[i]);
            inner = CSNumber.mult(inner, erg.value[k - i]);
            sum = CSNumber.add(sum, inner);
        } // end inner

        ges = CSNumber.div(sum, f.value[0]);
        erg.value[k] = ges;
        sum = zero;
    } // end outer

    //    CSad.printArr(erg);
    return erg;

};

// return first nonzero indexes of f and g starting from k
CSad.findFirstNoneZero = function(f, g, k) {
    var idxf = Infinity;
    var idxg = Infinity;
    var myEps = 1e-12;
    for (var i = k; i < f.value.length; i++) {
        if (CSNumber.abs2(f.value[i]).value.real > myEps) {
            idxf = i;
            break;
        }
    }

    for (var j = k; j < g.value.length; j++) {
        if (CSNumber.abs2(g.value[j]).value.real > myEps) {
            idxg = j;
            break;
        }
    }

    return [idxf, idxg];
};

//CSad.trimArr = function(f, g) {};

// f / g
CSad.div = function(f, g) {
    if (f.value.length !== g.value.length) {
        console.log("dims don't fit - return nada");
        return nada;
    }

    var le = f.value.length;
    var myEps = 1e-16;
    var zero = CSNumber.real(0);
    var erg = CSad.zero(CSNumber.real(le));

    var sum = zero;
    var ges = zero;

    // loop over all coefficients
    for (var k = 0; k < le; k++) {
        // L'Hospitals rule
        var indxs = CSad.findFirstNoneZero(f, g, k);
        if (k < indxs[0] && (indxs[0] === indxs[1]) && indxs[0] !== Infinity) {
            //console.log("apply l Hospital", k);
            f.value.splice(k, indxs[0]);
            g.value.splice(k, indxs[0]);
            erg.value.splice(k, indxs[0]);
            le = le - indxs[0];
        }


        ges = f.value[k];
        for (var i = 0; i < k; i++) {
            sum = CSNumber.add(sum, CSNumber.mult(erg.value[i], g.value[k - i]));
        } // end inner

        ges = CSNumber.sub(ges, sum);
        ges = CSNumber.div(ges, g.value[0]);
        erg.value[k] = ges;
        ges = zero;
        sum = zero;
    } // end outer

    return erg;
};

CSad.exp = function(f) {
    var zero = CSNumber.real(0);
    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));

    var sum = zero;
    var inner;
    erg.value[0] = CSNumber.exp(f.value[0]);
    for (var k = 1; k < le; k++) {
        for (var i = 1; i <= k; i++) {
            inner = CSNumber.mult(CSNumber.real(i), f.value[i]);
            inner = CSNumber.mult(inner, erg.value[k - i]);
            sum = CSNumber.add(sum, inner);
        } // end inner
        erg.value[k] = CSNumber.div(sum, CSNumber.real(k));
        sum = zero;
    } // end outer

    return erg;
};

CSad.log = function(f) {
    var zero = CSNumber.real(0);
    var le = f.value.length;
    var erg = CSad.zero(CSNumber.real(le));
    erg.value[0] = CSNumber.log(f.value[0]);

    var sum = zero;
    var ges;
    var inner;
    for (var k = 1; k < le; k++) {
        ges = f.value[k];
        for (var i = 1; i < k; i++) {
            inner = CSNumber.mult(CSNumber.real(i), erg.value[i]);
            inner = CSNumber.mult(inner, f.value[k - i]);
            sum = CSNumber.add(sum, inner);
        } // end inner

        sum = CSNumber.div(sum, CSNumber.real(k));
        ges = CSNumber.sub(ges, sum);
        ges = CSNumber.div(ges, f.value[0]);
        erg.value[k] = ges;
        sum = zero;
    } // end outer

    return erg;
};

CSad.sincos = function(f) {
    var zero = CSNumber.real(0);
    var le = f.value.length;
    var ergsin = CSad.zero(CSNumber.real(le));
    var ergcos = CSad.zero(CSNumber.real(le));
    ergsin.value[0] = CSNumber.sin(f.value[0]);
    ergcos.value[0] = CSNumber.cos(f.value[0]);

    var sumcos = zero;
    var sumsin = zero;
    var insin, incos, inboth;
    var numk;
    for (var k = 1; k < le; k++) {
        numk = CSNumber.real(k);
        for (var i = 1; i <= k; i++) {
            inboth = CSNumber.mult(CSNumber.real(i), f.value[i]);
            insin = CSNumber.mult(inboth, ergcos.value[k - i]);
            incos = CSNumber.mult(inboth, ergsin.value[k - i]);

            sumsin = CSNumber.add(sumsin, insin);

            sumcos = CSNumber.add(sumcos, incos);
        } // end inner

        sumsin = CSNumber.div(sumsin, numk);
        sumcos = CSNumber.div(sumcos, CSNumber.neg(numk));
        ergsin.value[k] = sumsin;
        ergcos.value[k] = sumcos;
        sumsin = zero;
        sumcos = zero;
    } // end outer

    CSad.sinsave = ergsin;
    CSad.cossave = ergcos;
    return [ergsin, ergcos];

};

CSad.sin = function(f) {
    var erg = CSad.sincos(f);
    return erg[0];
};

CSad.cos = function(f) {
    var erg = CSad.sincos(f);
    return erg[1];
};


CSad.faculty = function(n) {
    var erg = [];
    erg[0] = CSNumber.real(1);
    var val = 1;
    for (var i = 1; i <= n.value.real; i++) {
        val = i * val;
        erg[i] = CSNumber.real(val);
    }
    erg = List.turnIntoCSList(erg);
    return erg;
};


CSad.diff = function(prog, varname, x0, grade) {
    var erg;

    if (prog.ctype === "variable") {
        if (prog.name !== varname) { // if we have different variable than run variable substitute with right val
            erg = CSad.number(evaluate(prog), grade);
        } else {
            erg = CSad.variable(x0, grade);
        }
    } else if (prog.ctype === "number") {
        erg = CSad.number(prog, grade);
    } else if (prog.ctype === "infix") {
        if (prog.oper === "*") {
            return CSad.mult(CSad.diff(prog.args[0], varname, x0, grade), CSad.diff(prog.args[1], varname, x0, grade));
        }
        if (prog.oper === "^") {
            return CSad.pow(CSad.diff(prog.args[0], varname, x0, grade), CSad.diff(prog.args[1], varname, x0, grade).value[0]); // .value[0] since we only want the exponent
        }

        if (prog.oper === "/") {
            return CSad.div(CSad.diff(prog.args[0], varname, x0, grade), CSad.diff(prog.args[1], varname, x0, grade));
        } else if (prog.oper === "+") {
            return CSad.add(CSad.diff(prog.args[0], varname, x0, grade), CSad.diff(prog.args[1], varname, x0, grade));
        } else if (prog.oper === "-") {
            return CSad.sub(CSad.diff(prog.args[0], varname, x0, grade), CSad.diff(prog.args[1], varname, x0, grade));
        } else {
            console.log("infix not found", prog.oper);
            return nada;
        }

    } else if (prog.ctype === "function") {
        if (prog.oper === "exp$1") {
            return CSad.exp(CSad.diff(prog.args[0], varname, x0, grade));
        }
        if (prog.oper === "log$1") {
            return CSad.log(CSad.diff(prog.args[0], varname, x0, grade));
        }
        if (prog.oper === "sin$1") {
            return CSad.sin(CSad.diff(prog.args[0], varname, x0, grade));
        }
        if (prog.oper === "cos$1") {
            return CSad.cos(CSad.diff(prog.args[0], varname, x0, grade));
        }
    } else {
        console.log("ctype not found", prog.ctype);
        return nada;
    }

    return erg;

};

CSad.adevaluate = function(prog, varname, x0, grade) {
    var ergarr = CSad.diff(prog, varname, x0, grade);
    var facs = CSad.faculty(grade);
    for (var i = 2; i < ergarr.value.length; i++) {
        ergarr.value[i] = CSNumber.mult(ergarr.value[i], facs.value[i]);
    }

    //console.log("erg after fac");
    //CSad.printArr(ergarr);

    return ergarr;
};

CSad.autodiff = function(ffunc, varname, xarr, grade) {
    var erg = [];
    var le = xarr.value.length;

    var arr;
    for (var i = 0; i < le; i++) {
        arr = CSad.adevaluate(ffunc, varname, xarr.value[i], grade);
        erg[i] = arr;
    }

    erg = List.turnIntoCSList(erg);
    return erg;
};
var Render2D = {};

Render2D.handleModifs = function(modifs, handlers) {
    // Reset stuff first
    if (Render2D.dashing)
        Render2D.unSetDash();
    Render2D.colorraw = null;
    Render2D.size = null;
    if (Render2D.psize <= 0) Render2D.psize = 0;
    if (Render2D.lsize <= 0) Render2D.lsize = 0;
    Render2D.overhang = 1; //TODO Eventuell dfault setzen
    Render2D.dashing = false;
    Render2D.isArrow = false;
    Render2D.arrowSides = '==>';
    Render2D.arrowposition = 1.0; // position arrowhead along the line
    Render2D.headlen = 10; // arrow head length - perhaps set this relative to canvas size
    Render2D.arrowShape = 'default';
    Render2D.alpha = csport.drawingstate.alpha;
    Render2D.bold = "";
    Render2D.italics = "";
    Render2D.family = "Arial";
    Render2D.align = 0;
    Render2D.xOffset = 0;
    Render2D.yOffset = 0;

    // Process handlers
    var key, handler;
    for (key in modifs) {
        var val = modifs[key];
        if (!val) continue; // may happen when called internally
        handler = handlers[key];
        if (!handler) {
            console.log("Modifier not supported: " + key);
            continue;
        }
        if (handler === true) {
            handler = Render2D.modifHandlers[key];
        }
        handler(evaluate(val));
    }

    // Post-process settings

    if (Render2D.size !== null) {
        Render2D.psize = Render2D.lsize = Render2D.size;
    } else {
        Render2D.psize = csport.drawingstate.pointsize;
        Render2D.lsize = csport.drawingstate.linesize;
    }
    if (Render2D.dashing) {
        Render2D.dashing(Render2D.lsize);
    }
    if (Render2D.colorraw !== null) {
        Render2D.pointColor = Render2D.lineColor = Render2D.textColor =
            Render2D.makeColor(Render2D.colorraw);
    } else if (Render2D.alpha === 1) {
        Render2D.pointColor = csport.drawingstate.pointcolor;
        Render2D.lineColor = csport.drawingstate.linecolor;
        Render2D.textColor = csport.drawingstate.textcolor;
    } else {
        Render2D.pointColor =
            Render2D.makeColor(csport.drawingstate.pointcolorraw);
        Render2D.lineColor =
            Render2D.makeColor(csport.drawingstate.linecolorraw);
        Render2D.textColor =
            Render2D.makeColor(csport.drawingstate.textcolorraw);
    }
    if (Render2D.alpha === 1) {
        Render2D.black = "rgb(0,0,0)";
    } else {
        Render2D.black = "rgba(0,0,0," + Render2D.alpha + ")";
    }

};

Render2D.sin30deg = 0.5;
Render2D.cos30deg = Math.sqrt(0.75);

Render2D.modifHandlers = {
    "size": function(v) {
        if (v.ctype === "number") {
            Render2D.size = v.value.real;
            if (Render2D.size < 0) Render2D.size = 0;
            if (Render2D.size > 1000) Render2D.size = 1000;
        }
    },

    "color": function(v) {
        if (List.isNumberVector(v).value && v.value.length === 3) {
            Render2D.colorraw = [
                v.value[0].value.real,
                v.value[1].value.real,
                v.value[2].value.real
            ];
        }
    },

    "alpha": function(v) {
        if (v.ctype === "number") {
            Render2D.alpha = v.value.real;
        }
    },

    "dashpattern": function(v) {
        if (v.ctype === "list") {
            var pat = [];
            for (var i = 0, j = 0; i < v.value.length; i++) {
                if (v.value[i].ctype === "number")
                    pat[j++] = v.value[i].value.real;
            }
            Render2D.dashing = Render2D.setDash.bind(null, pat);
        }
    },

    "dashtype": function(v) {
        var type;
        if (v.ctype === "number") {
            type = Math.floor(v.value.real);
        } else if (v.ctype === "string") {
            type = v.value;
        } else {
            return;
        }
        var pat = Render2D.dashTypes[type];
        if (pat)
            Render2D.dashing = Render2D.setDash.bind(null, pat);
    },

    "dashing": function(v) {
        if (v.ctype === 'number') {
            var si = Math.floor(v.value.real);
            Render2D.dashing = Render2D.setDash.bind(null, [si * 2, si]);
        }
    },

    "overhang": function(v) {
        if (v.ctype === 'number') {
            // Might combine with arrowposition, see there for details
            Render2D.overhang = Render2D.overhang * v.value.real +
                (1 - Render2D.overhang) * (1 - v.value.real);
        }
    },

    "arrow": function(v) {
        if (v.ctype === 'boolean') {
            Render2D.isArrow = v.value;
        } else {
            console.error("arrow needs to be of type boolean");
        }
    },

    "arrowshape": function(v) {
        if (v.ctype === 'string') {
            Render2D.arrowShape = v.value;
            Render2D.isArrow = true;
        } else {
            console.error("arrowshape needs to be of type string");
        }
    },

    "arrowsides": function(v) {
        if (v.ctype !== 'string') {
            console.error('arrowsides is not of type string');
        } else if (!(v.value === '==>' || v.value === '<==>' || v.value === '<==')) {
            console.error("arrowsides is unknows");
        } else {
            Render2D.arrowSides = v.value;
            Render2D.isArrow = true;
        }
    },

    "arrowposition": function(v) {
        if (v.ctype !== "number") {
            console.error('arrowposition is not of type number');
        } else if (v.value.real < 0.0) {
            console.error("arrowposition has to be positive");
        } else if (v.value.real > 1.0) {
            // Combine position into overhang to simplify things
            // Writing a for overhang and b for arrowposition, we have
            // q1 = b*(a*p1 + (1-a)*p2) + (1-b)*(a*p2 + (1-a)*p1)
            Render2D.overhang = Render2D.overhang * v.value.real +
                (1 - Render2D.overhang) * (1 - v.value.real);
        } else {
            Render2D.arrowposition = v.value.real;
            Render2D.isArrow = true;
        }
    },

    "arrowsize": function(v) {
        if (v.ctype !== "number") {
            console.error('arrowsize is not of type number');
        } else if (v.value.real < 0.0) {
            console.error("arrowsize has to be positive");
        } else {
            Render2D.headlen = Render2D.headlen * v.value.real;
        }
    },

    "bold": function(v) {
        if (v.ctype === "boolean" && v.value)
            Render2D.bold = "bold ";
    },

    "italics": function(v) {
        if (v.ctype === "boolean" && v.value)
            Render2D.italics = "italic ";
    },

    "family": function(v) {
        if (v.ctype === "string") {
            Render2D.family = v.value;
        }
    },

    "align": function(v) {
        if (v.ctype === "string") {
            var s = v.value;
            if (s === "left")
                Render2D.align = 0;
            if (s === "right")
                Render2D.align = 1;
            if (s === "mid")
                Render2D.align = 0.5;
        }
    },

    "x_offset": function(v) {
        if (v.ctype === "number")
            Render2D.xOffset = v.value.real;
    },

    "y_offset": function(v) {
        if (v.ctype === "number")
            Render2D.yOffset = v.value.real;
    },

    "offset": function(v) {
        if (v.ctype === "list" && v.value.length === 2 &&
            v.value[0].ctype === "number" && v.value[1].ctype === "number") {
            Render2D.xOffset = v.value[0].value.real;
            Render2D.yOffset = v.value[1].value.real;
        }
    },

};

Render2D.lineModifs = {
    "size": true,
    "color": true,
    "alpha": true,
    "dashpattern": true,
    "dashtype": true,
    "dashing": true,
    "overhang": true,
    "arrow": true,
    "arrowshape": true,
    "arrowsides": true,
    "arrowposition": true,
    "arrowsize": true,
};

Render2D.pointModifs = {
    "size": true,
    "color": true,
    "alpha": true,
};

Render2D.pointAndLineModifs = Render2D.lineModifs;

Render2D.conicModifs = Render2D.pointModifs;

Render2D.textModifs = {
    "size": true,
    "color": true,
    "alpha": true,
    "bold": true,
    "italics": true,
    "family": true,
    "align": true,
    "x_offset": true,
    "y_offset": true,
    "offset": true,
};


Render2D.makeColor = function(colorraw) {
    var alpha = Render2D.alpha;
    var r = Math.floor(colorraw[0] * 255);
    var g = Math.floor(colorraw[1] * 255);
    var b = Math.floor(colorraw[2] * 255);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
};

Render2D.preDrawCurve = function() {
    csctx.lineWidth = Render2D.lsize;
    csctx.lineCap = 'round';
    csctx.lineJoin = 'miter';
    csctx.strokeStyle = Render2D.lineColor;
};

Render2D.drawsegcore = function(pt1, pt2) {
    var m = csport.drawingstate.matrix;
    var endpoint1x = pt1.x * m.a - pt1.y * m.b + m.tx;
    var endpoint1y = pt1.x * m.c - pt1.y * m.d - m.ty;
    var endpoint2x = pt2.x * m.a - pt2.y * m.b + m.tx;
    var endpoint2y = pt2.x * m.c - pt2.y * m.d - m.ty;
    var overhang1 = Render2D.overhang;
    var overhang2 = 1 - overhang1;
    var overhang1x = overhang1 * endpoint1x + overhang2 * endpoint2x;
    var overhang1y = overhang1 * endpoint1y + overhang2 * endpoint2y;
    var overhang2x = overhang1 * endpoint2x + overhang2 * endpoint1x;
    var overhang2y = overhang1 * endpoint2y + overhang2 * endpoint1y;
    csctx.lineWidth = Render2D.lsize;
    csctx.lineCap = 'round';
    csctx.lineJoin = 'miter';
    csctx.strokeStyle = Render2D.lineColor;


    if (!Render2D.isArrow ||
        (endpoint1x === endpoint1y && endpoint2x === endpoint2y)) {
        // Fast path if we have no arrowheads
        if (Render2D.lsize < 0.01) return;
        csctx.beginPath();
        csctx.moveTo(overhang1x, overhang1y);
        csctx.lineTo(overhang2x, overhang2y);
        csctx.stroke();
        return;
    }

    var dx = endpoint2x - endpoint1x;
    var dy = endpoint2y - endpoint1y;
    var norm = Math.sqrt(dx * dx + dy * dy);
    var cosAngle = dx / norm;
    var sinAngle = dy / norm;
    var pos_fac1 = Render2D.arrowposition;
    var pos_fac2 = 1 - pos_fac1;
    var tip1x = pos_fac1 * overhang1x + pos_fac2 * overhang2x;
    var tip1y = pos_fac1 * overhang1y + pos_fac2 * overhang2y;
    var tip2x = pos_fac1 * overhang2x + pos_fac2 * overhang1x;
    var tip2y = pos_fac1 * overhang2y + pos_fac2 * overhang1y;
    var headlen = Render2D.headlen;
    var sin30 = Render2D.sin30deg;
    var cos30 = Render2D.cos30deg;
    var x30sub = headlen * (cosAngle * cos30 + sinAngle * sin30);
    var x30add = headlen * (cosAngle * cos30 - sinAngle * sin30);
    var y30sub = headlen * (sinAngle * cos30 - cosAngle * sin30);
    var y30add = headlen * (sinAngle * cos30 + cosAngle * sin30);
    var arrowSides = Render2D.arrowSides;

    csctx.beginPath();

    // draw line in parts for full arrow
    if (Render2D.arrowShape === "full") {
        var rx, ry, lx, ly;
        if (arrowSides === "<==>" || arrowSides === "<==") {
            rx = tip1x + x30sub;
            ry = tip1y + y30sub;
            lx = tip1x + x30add;
            ly = tip1y + y30add;
            if (Render2D.arrowposition < 1.0) {
                csctx.moveTo(overhang1x, overhang1y);
                csctx.lineTo(tip1x, tip1y);
            }
            csctx.moveTo((rx + lx) / 2, (ry + ly) / 2);
        } else {
            csctx.moveTo(overhang1x, overhang1y);
        }
        if (arrowSides === '==>' || arrowSides === '<==>') {
            rx = tip2x - x30sub;
            ry = tip2y - y30sub;
            lx = tip2x - x30add;
            ly = tip2y - y30add;
            csctx.lineTo((rx + lx) / 2, (ry + ly) / 2);
            if (Render2D.arrowposition < 1.0) {
                csctx.moveTo(tip2x, tip2y);
                csctx.lineTo(overhang2x, overhang2y);
            }
        } else {
            csctx.lineTo(overhang2x, overhang2y);
        }
    } else {
        csctx.moveTo(overhang1x, overhang1y);
        csctx.lineTo(overhang2x, overhang2y);
    }

    csctx.stroke();

    // draw arrow heads at desired positions
    if (arrowSides === '==>' || arrowSides === '<==>') {
        draw_arrowhead(tip2x, tip2y, 1);
    }
    if (arrowSides === '<==' || arrowSides === '<==>') {
        draw_arrowhead(tip1x, tip1y, -1);
    }

    function draw_arrowhead(tipx, tipy, sign) {
        var rx = tipx - sign * x30sub;
        var ry = tipy - sign * y30sub;

        csctx.beginPath();
        if (Render2D.arrowShape === "full") {
            csctx.lineWidth = Render2D.lsize / 2;
        }
        var lx = tipx - sign * x30add;
        var ly = tipy - sign * y30add;
        csctx.moveTo(rx, ry);
        csctx.lineTo(tipx, tipy);
        csctx.lineTo(lx, ly);
        if (Render2D.arrowShape === "full") {
            csctx.fillStyle = Render2D.lineColor;
            csctx.closePath();
            csctx.fill();
        } else if (Render2D.arrowShape !== "default") {
            console.error("arrowshape is unknown");
        }
        csctx.stroke();
    }

};

Render2D.drawpoint = function(pt) {
    var m = csport.drawingstate.matrix;

    var xx = pt.x * m.a - pt.y * m.b + m.tx;
    var yy = pt.x * m.c - pt.y * m.d - m.ty;

    csctx.lineWidth = Render2D.psize * 0.3;
    csctx.beginPath();
    csctx.arc(xx, yy, Render2D.psize, 0, 2 * Math.PI);
    csctx.fillStyle = Render2D.pointColor;

    csctx.fill();

    csctx.beginPath();
    csctx.arc(xx, yy, Render2D.psize * 1.15, 0, 2 * Math.PI);
    csctx.fillStyle = Render2D.black;
    csctx.strokeStyle = Render2D.black;
    csctx.stroke();
};

Render2D.drawline = function(homog) {
    var na = CSNumber.abs(homog.value[0]).value.real;
    var nb = CSNumber.abs(homog.value[1]).value.real;
    var nc = CSNumber.abs(homog.value[2]).value.real;
    var divi;

    if (na >= nb && na >= nc) {
        divi = homog.value[0];
    }
    if (nb >= na && nb >= nc) {
        divi = homog.value[1];
    }
    if (nc >= nb && nc >= na) {
        divi = homog.value[2];
    }
    var a = CSNumber.div(homog.value[0], divi);
    var b = CSNumber.div(homog.value[1], divi);
    var c = CSNumber.div(homog.value[2], divi); //TODO Realitycheck einbauen

    var l = [
        a.value.real,
        b.value.real,
        c.value.real
    ];
    var b1, b2;
    if (Math.abs(l[0]) < Math.abs(l[1])) {
        b1 = [1, 0, 30];
        b2 = [-1, 0, 30];
    } else {
        b1 = [0, 1, 30];
        b2 = [0, -1, 30];
    }
    var erg1 = [
        l[1] * b1[2] - l[2] * b1[1],
        l[2] * b1[0] - l[0] * b1[2],
        l[0] * b1[1] - l[1] * b1[0]
    ];
    var erg2 = [
        l[1] * b2[2] - l[2] * b2[1],
        l[2] * b2[0] - l[0] * b2[2],
        l[0] * b2[1] - l[1] * b2[0]
    ];

    var pt1 = {
        x: erg1[0] / erg1[2],
        y: erg1[1] / erg1[2]
    };
    var pt2 = {
        x: erg2[0] / erg2[2],
        y: erg2[1] / erg2[2]

    };

    Render2D.drawsegcore(pt1, pt2);
};

Render2D.dashTypes = {
    "solid": [],
    "dashed": [10, 10],
    "tightdash": [10, 4],
    "dotted": [1, 3],
    "dashdot": [10, 5, 1, 5],
    "dashvalue.solid": [],
    "dashvalue.dashed": [10, 10],
    "dashvalue.tightdash": [10, 4],
    "dashvalue.dotted": [1, 3],
    "dashvalue.dashdot": [10, 5, 1, 5],
    0: [],
    1: [10, 10],
    2: [10, 4],
    3: [1, 3],
    4: [10, 5, 1, 5],
};

Render2D.setDash = function(pattern, size) {
    var s = Math.sqrt(size);
    pattern = pattern.slice();
    for (var i = 0; i < pattern.length; i++) {
        pattern[i] *= s;
    }
    csctx.webkitLineDash = pattern; //Safari
    csctx.setLineDash(pattern); //Chrome
    csctx.mozDash = pattern; //FFX
};

Render2D.unSetDash = function() {
    csctx.webkitLineDash = []; //Safari
    csctx.setLineDash([]); //Chrome
    csctx.mozDash = []; //FFX
};
var csgstorage = {};

var csport = {};
csport.drawingstate = {};
csport.drawingstate.linecolor = "rgb(0,0,255)";
csport.drawingstate.linecolorraw = [0, 0, 1];
csport.drawingstate.pointcolor = "rgb(255,200,0)";
csport.drawingstate.pointcolorraw = [1, 0.78, 0];
csport.drawingstate.textcolor = "rgb(0,0,0)";
csport.drawingstate.textcolorraw = [0, 0, 0];
csport.drawingstate.alpha = 1.0;
csport.drawingstate.pointsize = 4.0;
csport.drawingstate.linesize = 1.0;
csport.drawingstate.textsize = 20;

csport.drawingstate.matrix = {};
csport.drawingstate.matrix.a = 25;
csport.drawingstate.matrix.b = 0;
csport.drawingstate.matrix.c = 0;
csport.drawingstate.matrix.d = 25;
csport.drawingstate.matrix.tx = 250.5;
csport.drawingstate.matrix.ty = 250.5;
csport.drawingstate.matrix.det = csport.drawingstate.matrix.a * csport.drawingstate.matrix.d - csport.drawingstate.matrix.b * csport.drawingstate.matrix.c;

csport.drawingstate.matrix.sdet = Math.sqrt(csport.drawingstate.matrix.det);


csport.drawingstate.initialmatrix = {};
csport.drawingstate.initialmatrix.a = csport.drawingstate.matrix.a;
csport.drawingstate.initialmatrix.b = csport.drawingstate.matrix.b;
csport.drawingstate.initialmatrix.c = csport.drawingstate.matrix.c;
csport.drawingstate.initialmatrix.d = csport.drawingstate.matrix.d;
csport.drawingstate.initialmatrix.tx = csport.drawingstate.matrix.tx;
csport.drawingstate.initialmatrix.ty = csport.drawingstate.matrix.ty;
csport.drawingstate.initialmatrix.det = csport.drawingstate.matrix.det;
csport.drawingstate.initialmatrix.sdet = csport.drawingstate.matrix.sdet;

csport.clone = function(obj) {
    if (obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj)
        temp[key] = csport.clone(obj[key]);
    return temp;
};

csgstorage.backup = csport.clone(csport.drawingstate);
csgstorage.stack = [];


var back = csport.clone(csport.drawingstate);


csport.reset = function() {
    csport.drawingstate.matrix.a = csport.drawingstate.initialmatrix.a;
    csport.drawingstate.matrix.b = csport.drawingstate.initialmatrix.b;
    csport.drawingstate.matrix.c = csport.drawingstate.initialmatrix.c;
    csport.drawingstate.matrix.d = csport.drawingstate.initialmatrix.d;
    csport.drawingstate.matrix.tx = csport.drawingstate.initialmatrix.tx;
    csport.drawingstate.matrix.ty = csport.drawingstate.initialmatrix.ty;
    csport.drawingstate.matrix.det = csport.drawingstate.initialmatrix.det;
    csport.drawingstate.matrix.sdet = csport.drawingstate.initialmatrix.sdet;
};

csport.from = function(x, y, z) { //Rechnet Homogene Koordinaten in Pixelkoordinaten um
    var xx = x / z;
    var yy = y / z;
    var m = csport.drawingstate.matrix;
    var xxx = xx * m.a - yy * m.b + m.tx;
    var yyy = xx * m.c - yy * m.d - m.ty;
    return [xxx, yyy];
};

csport.to = function(px, py) { //Rechnet Pixelkoordinaten in Homogene Koordinaten um
    var m = csport.drawingstate.matrix;
    var xx = px - m.tx;
    var yy = py + m.ty;
    var x = (xx * m.d - yy * m.b) / m.det;
    var y = -(-xx * m.c + yy * m.a) / m.det;
    return [x, y, 1];
};

csport.dumpTrafo = function() {

    function r(x) {
        return Math.round(x * 1000) / 1000;

    }
    var m = csport.drawingstate.matrix;

    console.log("a:" + r(m.a) + " " +
        "b:" + r(m.b) + " " +
        "c:" + r(m.c) + " " +
        "d:" + r(m.d) + " " +
        "tx:" + r(m.ty) + " " +
        "ty:" + r(m.tx)
    );

};

csport.setMat = function(a, b, c, d, tx, ty) {
    var m = csport.drawingstate.matrix;
    m.a = a;
    m.b = b;
    m.c = c;
    m.d = d;
    m.tx = tx;
    m.ty = ty;
    m.det = a * d - b * c;
    m.sdet = Math.sqrt(m.det);
};

csport.scaleAndOrigin = function(scale, originX, originY) {
    csport.setMat(scale, 0, 0, scale, originX, originY);
};

csport.visibleRect = function(left, top, right, bottom) {
    var width = right - left;
    var height = top - bottom;
    var scale;
    if (csw * height < csh * width)
        scale = csw / width;
    else
        scale = csh / height;
    var originX = (csw - scale * (left + right)) / 2;
    var originY = (csh - scale * (top + bottom)) / 2;
    csport.setMat(scale, 0, 0, scale, originX, originY);
};

// TODO: This function looks broken. It seems as if the linear
// portion of the matrix is multiplied from the left, but the
// translation is multiplied from the right. Very confusing!
csport.applyMat = function(a, b, c, d, tx, ty) {
    var m = csport.drawingstate.matrix;
    csport.setMat(
        m.a * a + m.c * b,
        m.b * a + m.d * b,
        m.a * c + m.c * d,
        m.b * c + m.d * d,
        m.a * tx + m.c * ty + m.tx,
        m.b * tx + m.d * ty + m.ty);
    var tl = csport.to(0, -csh);
    var br = csport.to(csw, 0);
    console.log("{visibleRect: [" +
        tl[0] + "," + tl[1] + "," + br[0] + "," + br[1] + "]}");
};

csport.translate = function(tx, ty) {
    csport.applyMat(1, 0, 0, 1, tx, ty);
};

csport.rotate = function(w) {
    var c = Math.cos(w);
    var s = Math.sin(w);
    csport.applyMat(c, s, -s, c, 0, 0);
};

csport.scale = function(s) {
    csport.applyMat(s, 0, 0, s, 0, 0);
};

csport.gsave = function() {
    csgstorage.stack.push(csport.clone(csport.drawingstate));

};

csport.grestore = function() {
    if (csgstorage.stack.length !== 0) {
        csport.drawingstate = csgstorage.stack.pop();
    }
};

csport.greset = function() {
    csport.drawingstate = csport.clone(csgstorage.backup);
    csport.drawingstate.matrix.ty = csport.drawingstate.matrix.ty - csh;
    csport.drawingstate.initialmatrix.ty = csport.drawingstate.initialmatrix.ty - csh;
    csgstorage.stack = [];

};

csport.createnewbackup = function() {
    csport.drawingstate.initialmatrix.a = csport.drawingstate.matrix.a;
    csport.drawingstate.initialmatrix.b = csport.drawingstate.matrix.b;
    csport.drawingstate.initialmatrix.c = csport.drawingstate.matrix.c;
    csport.drawingstate.initialmatrix.d = csport.drawingstate.matrix.d;
    csport.drawingstate.initialmatrix.tx = csport.drawingstate.matrix.tx;
    csport.drawingstate.initialmatrix.ty = csport.drawingstate.matrix.ty;
    csport.drawingstate.initialmatrix.det = csport.drawingstate.matrix.det;
    csport.drawingstate.initialmatrix.sdet = csport.drawingstate.matrix.sdet;
    csgstorage.backup = csport.clone(csport.drawingstate);

};

csport.makecolor = function(r, g, b) {
    var rv = Math.floor(r * 255);
    var gv = Math.floor(g * 255);
    var bv = Math.floor(b * 255);
    if (csport.drawingstate.alpha === 1) {
        return "rgb(" + rv + "," + gv + "," + bv + ")";
    } else {
        return "rgba(" + rv + "," + gv + "," + bv +
            "," + csport.drawingstate.alpha + ")";
    }
};

csport.setcolor = function(co) {
    var r = co.value[0].value.real;
    var g = co.value[1].value.real;
    var b = co.value[2].value.real;
    csport.drawingstate.linecolor =
        csport.drawingstate.pointcolor = csport.makecolor(r, g, b);
    csport.drawingstate.linecolorraw =
        csport.drawingstate.pointcolorraw = [r, g, b];
};

csport.setlinecolor = function(co) {
    var r = co.value[0].value.real;
    var g = co.value[1].value.real;
    var b = co.value[2].value.real;
    csport.drawingstate.linecolor = csport.makecolor(r, g, b);
    csport.drawingstate.linecolorraw = [r, g, b];
};

csport.settextcolor = function(co) {
    var r = co.value[0].value.real;
    var g = co.value[1].value.real;
    var b = co.value[2].value.real;
    csport.drawingstate.textcolor = csport.makecolor(r, g, b);
    csport.drawingstate.textcolorraw = [r, g, b];
};


csport.setpointcolor = function(co) {
    var r = co.value[0].value.real;
    var g = co.value[1].value.real;
    var b = co.value[2].value.real;
    csport.drawingstate.pointcolor = csport.makecolor(r, g, b);
    csport.drawingstate.pointcolorraw = [r, g, b];
};

csport.setalpha = function(al) {
    csport.drawingstate.alpha = al.value.real;
    csport.drawingstate.linecolor = csport.makecolor(
        csport.drawingstate.linecolorraw[0],
        csport.drawingstate.linecolorraw[1],
        csport.drawingstate.linecolorraw[2]);
    csport.drawingstate.pointcolor = csport.makecolor(
        csport.drawingstate.pointcolorraw[0],
        csport.drawingstate.pointcolorraw[1],
        csport.drawingstate.pointcolorraw[2]);
    csport.drawingstate.textcolor = csport.makecolor(
        csport.drawingstate.textcolorraw[0],
        csport.drawingstate.textcolorraw[1],
        csport.drawingstate.textcolorraw[2]);
};

csport.setpointsize = function(si) {
    csport.drawingstate.pointsize = si.value.real;
};


csport.setlinesize = function(si) {
    csport.drawingstate.linesize = si.value.real;
};

csport.settextsize = function(si) {
    csport.drawingstate.textsize = si.value.real;
};
var defaultAppearance = {};
defaultAppearance.clip = "none";
defaultAppearance.pointColor = [1, 0, 0];
defaultAppearance.lineColor = [0, 0, 1];
defaultAppearance.pointSize = 5;
defaultAppearance.lineSize = 1;
defaultAppearance.alpha = 1;
defaultAppearance.overhangLine = 1.1;
defaultAppearance.overhangSeg = 1;
defaultAppearance.dimDependent = 1;
defaultAppearance.fontFamily = "sans-serif";

function setDefaultAppearance(obj) {
    var key;
    for (key in obj)
        if (obj[key] !== null)
            defaultAppearance[key] = obj[key];
}
if (instanceInvocationArguments.defaultAppearance)
    setDefaultAppearance(instanceInvocationArguments.defaultAppearance);

function csinit(gslp) {

    // establish defaults for geoOps
    Object.keys(geoOps).forEach(function(opName) {
        var op = geoOps[opName];
        assert(op.signature || opName === "_helper",
            opName + " has no signature");
        if (op.updatePosition !== undefined && op.stateSize === undefined)
            op.stateSize = 0;
    });

    //Main Data:
    //args          The arguments of the operator
    //type          The operator
    //kind          L,P,C, wird automatisch zugeordnet

    //Relevant fields for appearance:
    //color
    //size
    //alpha
    //overhang
    //clip
    //visible       zum ein und ausblenden
    //isshowing     das wird durch den Konstruktionsbaum vererbt
    //movable

    csgeo.gslp = [];
    csgeo.csnames = {}; // Map from name to geometric element
    csgeo.points = [];
    csgeo.lines = [];
    csgeo.conics = [];
    csgeo.free = [];

    gslp.forEach(addElement);
    guessIncidences();
}

// Setzen der Default appearance

function pointDefault(el) {

    if (el.size === undefined) el.size = defaultAppearance.pointSize;
    el.size = CSNumber.real(el.size);
    if (el.type !== "Free") {
        el.color = List.realVector(el.color || defaultAppearance.pointColor);
        el.color = List.scalmult(CSNumber.real(defaultAppearance.dimDependent), el.color);
    } else {
        el.color = List.realVector(el.color || defaultAppearance.pointColor);
    }
    if (el.alpha === undefined) el.alpha = defaultAppearance.alpha;
    el.alpha = CSNumber.real(el.alpha);

    if (el.drawtrace) {
        if (typeof el.tracedim === "undefined") el.tracedim = 1;
        if (typeof el.tracelength === "undefined") el.tracelength = 100;
        if (typeof el.traceskip === "undefined") el.traceskip = 1;
        el._traces = new Array(el.tracelength);
        el._traces_index = 0;
        el._traces_tick = 0;
    }
}

function lineDefault(el) {
    if (el.size === undefined) el.size = defaultAppearance.lineSize;
    el.size = CSNumber.real(el.size);
    el.color = List.realVector(el.color || defaultAppearance.lineColor);
    if (el.alpha === undefined) el.alpha = defaultAppearance.alpha;
    el.alpha = CSNumber.real(el.alpha);
    el.clip = General.string(el.clip || defaultAppearance.clip);
    if (el.overhang === undefined)
        el.overhang = defaultAppearance.overhangLine;
    el.overhang = CSNumber.real(el.overhang);
    if (el.dashtype)
        el.dashtype = General.wrap(el.dashtype);
}

function segmentDefault(el) {
    if (el.overhang === undefined)
        el.overhang = defaultAppearance.overhangSeg;
    if (el.arrow)
        el.arrow = General.bool(el.arrow);
    if (el.arrowsize)
        el.arrowsize = CSNumber.real(el.arrowsize);
    if (el.arrowposition)
        el.arrowposition = CSNumber.real(el.arrowposition);
    if (el.arrowshape)
        el.arrowshape = General.string(el.arrowshape);
    if (el.arrowsides)
        el.arrowsides = General.string(el.arrowsides);
    lineDefault(el);
    el.clip = General.string("end");
}

function addElement(el) {
    var i;

    // Adding an existing element moves that element to the given position
    if (csgeo.csnames[el.name] !== undefined) {
        console.log("Element name '" + el.name + "' already exists");

        var existingEl = csgeo.csnames[el.name];
        if (geoOps[existingEl.type].isMovable)
            movepointscr(existingEl, el.pos, "homog");

        return {
            'ctype': 'geo',
            'value': existingEl
        };
    }

    // Expand macros
    var macro = geoMacros[el.type];
    if (macro) {
        var expansion = macro(el);
        var res = null;
        for (i = 0; i < expansion.length; ++i) {
            res = addElement(expansion[i]);
        }
        return res;
    }

    // Detect unsupported operations or missing or incorrect arguments
    var op = geoOps[el.type];
    if (!op) {
        console.error(el);
        console.error("Operation " + el.type + " not implemented yet");
        return null;
    }
    if (op.signature.length !== (el.args ? el.args.length : 0)) {
        window.alert("Wrong number of arguments for " + el.name);
        return null;
    }
    if (el.args) {
        for (i = 0; i < el.args.length; ++i) {
            if (!csgeo.csnames.hasOwnProperty(el.args[i])) {
                console.log(
                    "Dropping " + el.name +
                    " due to missing argument " + el.args[i]);
                return null;
            }
            var argKind = csgeo.csnames[el.args[i]].kind;
            if (!(op.signature[i] === argKind ||
                    (argKind === "S" && op.signature[i] === "L"))) {
                window.alert(
                    "Wrong argument kind " + argKind + " as argument " + i +
                    " to element " + el.name + " of type " + el.type);
                return null;
            }
        }
    }
    if (op.signatureConstraints && !op.signatureConstraints(el)) {
        window.alert("signature constraints violated for element " + el.name);
    }

    csgeo.gslp.push(el);
    csgeo.csnames[el.name] = el;
    var totalStateSize = stateLastGood.length;
    el.kind = op.kind;
    el.stateIdx = totalStateSize;
    totalStateSize += op.stateSize;
    el.incidences = [];
    el.isshowing = true;
    el.movable = false;

    if (op.isMovable) {
        el.movable = true;
        csgeo.free.push(el);
    }

    if (el.kind === "P") {
        csgeo.points.push(el);
        pointDefault(el);
    }
    if (el.kind === "L") {
        csgeo.lines.push(el);
        lineDefault(el);
    }
    if (el.kind === "C") {
        csgeo.conics.push(el);
        lineDefault(el);
    }
    if (el.kind === "S") {
        csgeo.lines.push(el);
        segmentDefault(el);
    }

    if (true || op.stateSize !== 0) {
        stateAlloc(totalStateSize);
        stateIn = stateOut = stateLastGood;
        // initially, stateIn and stateOut are the same, so that initialize can
        // write some state and updatePosition can immediately use it
        tracingInitial = true;
        if (op.initialize) {
            stateInIdx = stateOutIdx = el.stateIdx;
            el.param = op.initialize(el);
            assert(stateOutIdx === el.stateIdx + op.stateSize,
                "State fully initialized");
        }
        stateInIdx = stateOutIdx = el.stateIdx;
        op.updatePosition(el, false);
        assert(stateInIdx === el.stateIdx + op.stateSize,
            "State fully consumed");
        assert(stateOutIdx === el.stateIdx + op.stateSize,
            "State fully updated");
        tracingInitial = false;
        stateIn = stateArrays.in;
        stateIn.set(stateLastGood);
        stateOut = stateArrays.out;
    } else {
        // Do the updatePosition call with correct state handling around it.
    }
    isShowing(el, op);

    geoDependantsCache = {};
    //guessIncidences();
}

function onSegment(p, s) { //TODO was ist mit Fernpunkten
    // TODO das ist eine sehr teure implementiereung
    // Geht das einfacher?
    var el1 = csgeo.csnames[s.args[0]].homog;
    var el2 = csgeo.csnames[s.args[1]].homog;
    var elm = p.homog;

    var x1 = CSNumber.div(el1.value[0], el1.value[2]);
    var y1 = CSNumber.div(el1.value[1], el1.value[2]);
    var x2 = CSNumber.div(el2.value[0], el2.value[2]);
    var y2 = CSNumber.div(el2.value[1], el2.value[2]);
    var xm = CSNumber.div(elm.value[0], elm.value[2]);
    var ym = CSNumber.div(elm.value[1], elm.value[2]);

    if (CSNumber._helper.isAlmostReal(x1) &&
        CSNumber._helper.isAlmostReal(y1) &&
        CSNumber._helper.isAlmostReal(x2) &&
        CSNumber._helper.isAlmostReal(y2) &&
        CSNumber._helper.isAlmostReal(xm) &&
        CSNumber._helper.isAlmostReal(ym)) {
        x1 = x1.value.real;
        y1 = y1.value.real;
        x2 = x2.value.real;
        y2 = y2.value.real;
        xm = xm.value.real;
        ym = ym.value.real;
        var d12 = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        var d1m = Math.sqrt((x1 - xm) * (x1 - xm) + (y1 - ym) * (y1 - ym));
        var d2m = Math.sqrt((x2 - xm) * (x2 - xm) + (y2 - ym) * (y2 - ym));
        var dd = d12 - d1m - d2m;
        return dd * dd < 0.000000000000001;

    }
    return false;

}

function isShowing(el, op) {
    el.isshowing = true;
    if (el.args) {
        for (var i = 0; i < el.args.length; i++) {
            if (!csgeo.csnames[el.args[i]].isshowing) {
                el.isshowing = false;
                return;
            }
        }
    }
    /*    if (el.kind==="P" ||el.kind==="L"){
        
            if(!List.helper.isAlmostReal(el.homog)){
                el.isshowing=false;
                return;
            }
        }*/

    if (op.visiblecheck) {
        op.visiblecheck(el);
    }

}

var geoDependantsCache = {};

function getGeoDependants(mover) {
    var deps = geoDependantsCache[mover.name];
    if (deps) return deps;
    var depSet = {};
    var k = 0;
    deps = [];
    depSet[mover.name] = mover;
    var gslp = csgeo.gslp;
    for (var i = 0; i < gslp.length; ++i) {
        var el = gslp[i];
        var args = el.args;
        if (!args) continue;
        for (var j = 0; j < args.length; ++j) {
            var arg = args[j];
            if (depSet.hasOwnProperty(arg)) {
                depSet[el.name] = el;
                deps[k++] = el;
            }
        }
    }
    geoDependantsCache[mover.name] = deps;
    /*
    console.log("getGeoDependants(" + mover.name + ") := [" +
                deps.map(function(el) { return el.name; }).join(",") + "]");
    */
    return deps;
}

function guessIncidences() {

    var gslp = csgeo.gslp;
    for (var i = 0; i < csgeo.lines.length; i++) {
        var l = csgeo.lines[i];
        for (var j = 0; j < csgeo.points.length; j++) {
            var p = csgeo.points[j];
            var pn = List.scaldiv(List.abs(p.homog), p.homog);
            var ln = List.scaldiv(List.abs(l.homog), l.homog);
            var prod = CSNumber.abs(List.scalproduct(pn, ln));
            if (prod.value.real < 0.0000000000001) {
                p.incidences.push(l.name);
                l.incidences.push(p.name);

            }

        }
    }


}
function render() {

    function drawgeopoint(el) {
        if (!el.isshowing || el.visible === false || !List._helper.isAlmostReal(el.homog))
            return;
        var col = el.color;
        if (el.behavior) {
            col = el.color; //TODO Anpassen
            // col=List.realVector([0,0,1]);
        }
        evaluator.draw$1([el.homog], {
            size: el.size,
            color: col,
            alpha: el.alpha
        });
        if (el.labeled) {
            var lbl = el.printname || el.name || "P";
            var lpos = el.labelpos || {
                'x': 3,
                'y': 3
            };
            var textsize = el.textsize || 12;
            var bold = (el.textbold === true);
            var italics = (el.textitalics === true);
            var family = el.text_fontfamily || defaultAppearance.fontFamily;
            var dist = lpos.x * lpos.x + lpos.y * lpos.y;
            var factor = 1.0;
            if (dist > 0) {
                factor = 1.0 + el.size.value.real / Math.sqrt(dist);
            }
            evaluator.drawtext$2(
                [el.homog, General.wrap(lbl)], {
                    'x_offset': General.wrap(factor * lpos.x),
                    'y_offset': General.wrap(factor * lpos.y),
                    'size': General.wrap(textsize),
                    'bold': General.wrap(bold),
                    'italics': General.wrap(italics),
                    'family': General.wrap(family)
                });
        }
    }

    function drawgeoarc(el) {
        if (!el.isshowing || el.visible === false)
            return;

        var modifs = {};
        modifs.color = el.color;
        modifs.alpha = el.alpha;
        modifs.size = el.size;

        // check if we have filled: true
        var df = el.filled ? "F" : "D";

        eval_helper.drawarc(el, modifs, df);
    }


    function drawgeoconic(el) {
        if (!el.isshowing || el.visible === false)
            return;

        var modifs = {};
        modifs.color = el.color;
        modifs.alpha = el.alpha;
        modifs.size = el.size;

        eval_helper.drawconic(el.matrix, modifs);


    }

    function drawgeoline(el) {
        var pt1, pt2;
        if (!el.isshowing || el.visible === false || !List._helper.isAlmostReal(el.homog))
            return;

        if (el.kind === "S") {
            // Segments always join their endpoints.
            evaluator.draw$2(
                [el.startpos, el.endpos], {
                    overhang: el.overhang,
                    dashtype: el.dashtype,
                    size: el.size,
                    color: el.color,
                    alpha: el.alpha,
                    arrow: el.arrow,
                    arrowsize: el.arrowsize,
                    arrowposition: el.arrowposition,
                    arrowshape: el.arrowshape,
                    arrowsides: el.arrowsides,
                });
            return;
        }
        if (el.clip.value === "end" && el.type === "Join") {
            // Lines clipped to their defining points join these.
            pt1 = csgeo.csnames[el.args[0]];
            pt2 = csgeo.csnames[el.args[1]];
            evaluator.draw$2(
                [pt1.homog, pt2.homog], {
                    overhang: el.overhang,
                    dashtype: el.dashtype,
                    size: el.size,
                    color: el.color,
                    alpha: el.alpha
                });
            return;
        }
        if (el.clip.value === "inci") {
            // Figuring out incident points here.
            var li = [];
            var xmin = [+1000000, 0];
            var xmax = [-1000000, 0];
            var ymin = [+1000000, 0];
            var ymax = [-1000000, 0];
            for (var i = 0; i < el.incidences.length; i++) {
                var pt = csgeo.csnames[el.incidences[i]].homog;
                var x = pt.value[0];
                var y = pt.value[1];
                var z = pt.value[2];

                if (!CSNumber._helper.isAlmostZero(z)) {
                    x = CSNumber.div(x, z);
                    y = CSNumber.div(y, z);
                    if (CSNumber._helper.isAlmostReal(x) && CSNumber._helper.isAlmostReal(y)) {
                        if (x.value.real < xmin[0]) {
                            xmin = [x.value.real, pt];
                        }
                        if (x.value.real > xmax[0]) {
                            xmax = [x.value.real, pt];
                        }
                        if (y.value.real < ymin[0]) {
                            ymin = [y.value.real, pt];
                        }
                        if (y.value.real > ymax[0]) {
                            ymax = [y.value.real, pt];
                        }
                    }
                }
            }
            if ((xmax[0] - xmin[0]) > (ymax[0] - ymin[0])) {
                pt1 = xmin[1];
                pt2 = xmax[1];
            } else {
                pt1 = ymin[1];
                pt2 = ymax[1];

            }
            if (pt1 !== pt2) {
                evaluator.draw$2(
                    [pt1, pt2], {
                        dashtype: el.dashtype,
                        size: el.size,
                        color: el.color,
                        alpha: el.alpha,
                        overhang: el.overhang
                    });
                return;
            }
            // otherwise fall through
        }
        // Default: draw an unclipped line
        evaluator.draw$1([el.homog], {
            dashtype: el.dashtype,
            size: el.size,
            color: el.color,
            alpha: el.alpha
        });
    }

    var i;

    for (i = 0; i < csgeo.conics.length; i++) {
        if (csgeo.conics[i].isArc) drawgeoarc(csgeo.conics[i]);
        else drawgeoconic(csgeo.conics[i]);
    }


    for (i = 0; i < csgeo.lines.length; i++) {
        drawgeoline(csgeo.lines[i]);
    }


    for (i = 0; i < csgeo.points.length; i++) {
        drawgeopoint(csgeo.points[i]);
    }

}

// TODO Lines, ...
// TODO tracedim
function draw_traces() {
    for (var i = 0; i < csgeo.points.length; i++) {
        var el = csgeo.points[i];

        if (!el.drawtrace) continue;
        if (el._traces_tick === el.traceskip) {
            el._traces[el._traces_index] = el.homog;
            el._traces_index = (el._traces_index + 1) % el._traces.length;
            el._traces_tick = 0;
        } else {
            el._traces_tick++;
        }

        var elAlpha = el.alpha.value.real;
        var size = el.size.value.real;
        var dimfactor = 1;
        if (el.tracedim !== 1) {
            size *= el.tracedim;
            dimfactor = Math.pow(el.tracedim, -1 / el._traces.length);
        }
        var j, k = 0;
        for (j = el._traces_index; j < el._traces.length; ++j)
            drawIt();
        for (j = 0; j < el._traces_index; ++j)
            drawIt();
    }

    function drawIt() {
        var lev = k++/ el._traces.length;
        var pos = el._traces[j];
        if (pos) {
            var alpha = elAlpha * lev * lev * lev;
            evaluator.draw$1([pos], {
                size: CSNumber.real(size),
                color: el.color,
                alpha: CSNumber.real(alpha)
            });
        }
        size *= dimfactor;
    }
}
function assert(condition, message) {
    var msg = "Assertion failed: " + message;
    if (condition) return;
    console.log(msg);
    shutdown();
    if (typeof alert !== "undefined") alert(msg); // jshint ignore:line
    throw new Error(msg);
}

var totalStateSize = 0;
var stateArrayNames = ["in", "out", "good", "backup"];
// Initialize all state to zero-length arrays, can be reallocated later on
var stateMasterArray = new Float64Array(0);
var stateArrays = {};
stateArrayNames.forEach(function(name) {
    stateArrays[name] = stateMasterArray;
});
var stateIn = stateMasterArray;
var stateOut = stateMasterArray;
var stateLastGood = stateMasterArray;

function stateAlloc(newSize) {
    if (newSize === stateLastGood.length) return;
    var offset, i;
    var states = stateArrayNames.length;
    if (stateMasterArray.length < newSize * states) {
        // We really need to reallocate memory
        offset = newSize * 2; // include some reserve
        stateMasterArray = new Float64Array(states * offset);
    } else {
        // Master array still has room, we just need to lengthen the subarrays
        offset = (stateMasterArray.length / states) | 0;
    }
    for (i = 0; i < states; ++i) {
        stateArrays[stateArrayNames[i]] = stateMasterArray.subarray(
            i * offset, i * offset + newSize);
    }
    // No array content is deliberately preserved by the above.
    // Now we do preserve the stateLastGood.
    var oldStateLastGood = stateLastGood;
    stateIn = stateArrays.in;
    stateOut = stateArrays.out;
    stateLastGood = stateArrays.good;
    stateLastGood.set(oldStateLastGood);
}

/**
 * Current state (i.e. stateIn) is now deemed good, even in case it
 * wasn't considered good before. Make it the stateLastGood. If we
 * were in a good situation, there is nothing to do.
 */
function stateContinueFromHere() {
    stateLastGood.set(stateIn);
    tracingStateReport(false);

    // Make numbers which are almost real totally real. This avoids
    // accumulating errors in the imaginary part.
    var n = stateLastGood.length;
    var abs = Math.abs;
    var epsInverse = 1e12;
    for (var i = 0; i < n; i += 2) {
        if (abs(stateLastGood[i]) > abs(stateLastGood[i + 1]) * epsInverse) {
            stateLastGood[i + 1] = 0;
        }
    }
}

var stateInIdx, stateOutIdx;

var tracingInitial, tracingFailed, noMoreRefinements;

var inMouseMove = false;

var RefineException = {
    toString: function() {
        return "RefineException";
    }
};

function requestRefinement() {
    // Call this whenever you would need exra refinement.
    // Possible outcomes: either an exception will be thrown to
    // request more refinements, or the tracingFailed flag will be set
    // and the function returns normally.
    if (noMoreRefinements) tracingFailed = true;
    else throw RefineException;
}

function defaultParameterPath(el, tr, tc, src, dst) {
    // src + t * (dst - src)
    return General.add(src, General.mult(tc, General.sub(dst, src)));
}

function traceMouseAndScripts() {
    if (traceLog) {
        traceLog.currentMouseAndScripts = [];
    }
    inMouseMove = true;
    tracingFailed = false;
    stateIn.set(stateLastGood); // copy stateLastGood and use it as input
    if (move) {
        var mover = move.mover;
        var sx = mouse.x + move.offset.x;
        var sy = mouse.y + move.offset.y;
        var pos = List.realVector([sx, sy, 1]);
        traceMover(mover, pos, "mouse");
        move.prev.x = mouse.x;
        move.prev.y = mouse.y;
    }
    evaluate(cscompiled.move);
    evaluate(cscompiled.draw);
    if (!tracingFailed) {
        stateContinueFromHere();
    }
    inMouseMove = false;
    if (traceLog) {
        traceLog.fullLog.push(List.turnIntoCSList([
            List.turnIntoCSList(traceLog.currentMouseAndScripts)
        ]));
        if (traceLog.length > traceLog.logLength)
            traceLog.splice(0, traceLog.length - traceLog.logLength);
        traceLog.currentMouseAndScripts = null;
        traceLog.postMouseHooks.forEach(function(cb) {
            cb();
        });
    }
}

function movepointscr(mover, pos, type) {
    if (inMouseMove) {
        traceMover(mover, pos, type);
        return;
    }
    stateContinueFromHere();
    tracingFailed = false;
    traceMover(mover, pos, type);
    stateContinueFromHere();
}

/*
 * traceMover moves mover from current param to param for pos along a complex detour.
 */
function traceMover(mover, pos, type) {
    if (traceLog && traceLog.currentMouseAndScripts) {
        traceLog.currentMover = [];
    }
    stateOut.set(stateIn); // copy in to out, for elements we don't recalc
    var traceLimit = 10000; // keep UI responsive in evil situations
    var deps = getGeoDependants(mover);
    var last = -1;
    var step = 0.9; // two steps with the *1.25 scaling used below
    var i, el, op;
    var opMover = geoOps[mover.type];
    var parameterPath = opMover.parameterPath || defaultParameterPath;
    stateInIdx = mover.stateIdx;
    var originParam = opMover.getParamFromState(mover);
    stateInIdx = stateOutIdx = mover.stateIdx;
    var targetParam = opMover.getParamForInput(mover, pos, type);
    //console.log("Tracing from " + niceprint(originParam) + " to " + niceprint(targetParam));
    var t = last + step;
    while (last !== t) {
        // Rational parametrization of semicircle,
        // see http://jsperf.com/half-circle-parametrization
        var t2 = t * t;
        var dt = 0.5 / (1 + t2);
        var tc = CSNumber.complex((2 * t) * dt + 0.5, (1 - t2) * dt);
        noMoreRefinements = (last + 0.5 * step <= last || traceLimit === 0);
        if (traceLimit === 0) console.log("tracing limit Reached");
        var refining = false;

        if (traceLog && traceLog.currentMouseAndScripts) {
            traceLog.currentStep = [];
        }
        try {
            traceOneStep();
        } catch (e) {
            if (e !== RefineException)
                throw e;
            step *= 0.5; // reduce step size
            t = last + step;
            --traceLimit;
            refining = true;
        }
        if (traceLog && traceLog.currentMouseAndScripts) {
            traceLog.currentMover.push(List.turnIntoCSList([
                List.turnIntoCSList(traceLog.currentStep), // 1
                General.wrap(refining), //                    2
                General.wrap(last), //                        3
                General.wrap(t), //                           4
                General.wrap(traceLog.currentParam), //       5
            ]));
            traceLog.currentStep = null;
            traceLog.currentParam = null;
        }
    }
    tracingStateReport(tracingFailed);
    for (i = 0; i < deps.length; ++i) {
        el = deps[i];
        op = geoOps[el.type];
        isShowing(el, op);
    }
    if (traceLog && traceLog.currentMouseAndScripts) {
        traceLog.currentMouseAndScripts.push(List.turnIntoCSList([
            List.turnIntoCSList(traceLog.currentMover), //    1
            General.wrap(tracingFailed), //                   2
            General.wrap(mover.name), //                      3
            pos, //                                           4
            General.wrap(type), //                            5
            originParam, //                                   6
            targetParam, //                                   7
        ]));
        traceLog.currentMover = null;
    }

    // use own function to enable compiler optimization
    function traceOneStep() {
        stateInIdx = stateOutIdx = mover.stateIdx;
        var param =
            parameterPath(mover, t, tc, originParam, targetParam);
        if (traceLog) traceLog.currentParam = param;

        var stateTmp = stateOut;
        stateOut = stateIn;
        opMover.putParamToState(el, param);
        stateOut = stateTmp;
        stateOutIdx = mover.stateIdx;

        if (traceLog) traceLog.currentElement = mover;
        opMover.updatePosition(mover, true);
        assert(stateInIdx === mover.stateIdx + opMover.stateSize, "State fully consumed");
        assert(stateOutIdx === mover.stateIdx + opMover.stateSize, "State fully updated");
        for (i = 0; i < deps.length; ++i) {
            el = deps[i];
            op = geoOps[el.type];
            stateInIdx = stateOutIdx = el.stateIdx;
            if (traceLog) traceLog.currentElement = el;
            op.updatePosition(el, false);
            assert(stateInIdx === el.stateIdx + op.stateSize, "State fully consumed");
            assert(stateOutIdx === el.stateIdx + op.stateSize, "State fully updated");
        }
        if (traceLog) traceLog.currentElement = null;
        last = t; // successfully traced up to t
        step *= 1.25;
        t += step;
        if (t >= 1) t = 1;

        // stateTmp = stateOut; // we still have this from above
        stateOut = stateIn; // recycle old input, reuse as output
        stateIn = stateTmp; // use last output as next input
    }
}

function recalcAll() {
    stateContinueFromHere();
    noMoreRefinements = true; // avoid exceptions requesting refinements
    var gslp = csgeo.gslp;
    for (var k = 0; k < gslp.length; k++) {
        var el = gslp[k];
        var op = geoOps[el.type];
        stateInIdx = stateOutIdx = el.stateIdx;
        op.updatePosition(el, false);
        isShowing(el, op);
    }
    var stateTmp = stateOut;
    stateOut = stateIn;
    stateIn = stateTmp;
    stateContinueFromHere();
}

function tracingStateReport(failed) {
    var arg = instanceInvocationArguments.tracingStateReport;
    if (typeof arg === "string") {
        document.getElementById(arg).textContent =
            failed ? "BAD" : "GOOD";
    }
}

var traceLog = null;

if (instanceInvocationArguments.enableTraceLog) {
    // most properties are JavaScript lists of CindyScript lists
    traceLog = {
        logLength: Infinity,
        fullLog: [],
        currentMouseAndScripts: null,
        currentMover: null,
        currentStep: null,
        currentElement: null,
        currentParam: null,
        labelTracing2: General.wrap("tracing2"),
        labelTracing4: General.wrap("tracing4"),
        labelTracingSesq: General.wrap("tracingSesq"),
        postMouseHooks: []
    };
    if (typeof instanceInvocationArguments.enableTraceLog === "number")
        traceLog.logLength = instanceInvocationArguments.enableTraceLog;
    globalInstance.getTraceLog = getTraceLog;
    globalInstance.formatTraceLog = formatTraceLog;
    globalInstance.addTraceHook =
        traceLog.postMouseHooks.push.bind(traceLog.postMouseHooks);
}

function getTraceLog() {
    return List.turnIntoCSList(traceLog.fullLog.slice());
}

function formatTraceLog(save) {
    var str = JSON.stringify(traceLog.fullLog);
    var type = save ? 'application/octet-stream' : 'application/json';
    var blob = new Blob([str], {
        'type': type
    });
    var uri = window.URL.createObjectURL(blob);
    // var uri = 'data:text/html;base64,' + window.btoa(html);
    return uri;
}

function getStateComplexNumber() {
    var i = stateInIdx;
    stateInIdx += 2;
    return CSNumber.complex(stateIn[i], stateIn[i + 1]);
}

function getStateComplexVector(n) {
    var lst = new Array(n);
    for (var i = 0; i < n; ++i)
        lst[i] = getStateComplexNumber();
    return List.turnIntoCSList(lst);
}

function putStateComplexNumber(c) {
    stateOut[stateOutIdx] = c.value.real;
    stateOut[stateOutIdx + 1] = c.value.imag;
    stateOutIdx += 2;
}

function putStateComplexVector(v) {
    for (var i = 0, n = v.value.length; i < n; ++i)
        putStateComplexNumber(v.value[i]);
}

function tracing2(n1, n2) {
    var o1 = getStateComplexVector(3);
    var o2 = getStateComplexVector(3);
    var res = tracing2core(n1, n2, o1, o2);
    putStateComplexVector(res[0]);
    putStateComplexVector(res[1]);
    return List.turnIntoCSList(res);
}

function tracing2core(n1, n2, o1, o2) {
    var safety = 3;

    if (tracingInitial)
        return [n1, n2];

    var do1n1 = List.projectiveDistMinScal(o1, n1);
    var do1n2 = List.projectiveDistMinScal(o1, n2);
    var do2n1 = List.projectiveDistMinScal(o2, n1);
    var do2n2 = List.projectiveDistMinScal(o2, n2);
    var do1o2 = List.projectiveDistMinScal(o1, o2);
    var dn1n2 = List.projectiveDistMinScal(n1, n2);
    var cost1 = do1n1 + do2n2;
    var cost2 = do1n2 + do2n1;
    var cost, res;

    // Always sort output: we don't know yet whether it's correct, but
    // it's our best bet.
    if (cost1 > cost2) {
        res = [n2, n1];
        cost = cost2;
    } else {
        res = [n1, n2];
        cost = cost1;
    }

    var debug = function() {};
    // debug = console.log.bind(console);
    if (traceLog && traceLog.currentStep) {
        var logRow = [
            traceLog.labelTracing2, //                        1
            General.wrap(traceLog.currentElement.name), //    2
            List.turnIntoCSList(res), //                      3
            List.turnIntoCSList([o1, o2]), //                 4
            List.realMatrix([ //                              5
                [do1n1, do1n2],
                [do2n1, do2n2]
            ]),
            General.wrap(cost), //                            6
            General.wrap(do1o2), //                           7
            General.wrap(dn1n2), //                           8
            nada, // will become the outcome message //       9
        ];
        traceLog.currentStep.push(List.turnIntoCSList(logRow));
        debug = function(msg) {
            if (!traceLog.hasOwnProperty(msg))
                traceLog[msg] = General.wrap(msg);
            logRow[logRow.length - 1] = traceLog[msg];
            // Evil: modify can break copy on write! But it's safe here.
        };
    }
    if (List._helper.isNaN(n1) || List._helper.isNaN(n2)) {
        // Something went very wrong, numerically speaking. We have no
        // clue whether refining will make things any better, so we
        // assume it won't and give up.
        debug("Tracing failed due to NaNs.");
        tracingFailed = true;
    } else if (do1o2 > cost * safety && dn1n2 > cost * safety) {
        // Distance within matching considerably smaller than distance
        // across matching, so we could probably match correctly.
        debug("Normal case, everything all right.");
    } else if (dn1n2 < 1e-5) {
        // New points too close: we presumably are inside a singularity.
        if (do1o2 < 1e-5) { // Cinderella uses the constant 1e-6 here
            // The last "good" position was already singular.
            // Nothing we can do about this.
            debug("Staying inside singularity.");
        } else {
            // We newly moved into the singularity. New position is
            // not "good", but refining won't help since the endpoint
            // is singular.
            debug("Moved into singularity.");
            tracingFailed = true;
        }
    } else if (do1o2 < 1e-5) { // Cinderella uses the constant 1e-6 here
        // We just moved out of a singularity. Things can only get
        // better. If the singular situation was "good", we stay
        // "good", and keep track of things from now on.
        debug("Moved out of singularity.");
    } else {
        // Neither old nor new position looks singular, so there was
        // an avoidable singularity along the way. Refine to avoid it.
        if (noMoreRefinements)
            debug("Reached refinement limit, giving up.");
        else
            debug("Need to refine.");
        requestRefinement();
    }
    return res;
}
tracing2.stateSize = 12; // two three-element complex vectors

function tracing4(n1, n2, n3, n4) {
    var o1 = getStateComplexVector(3);
    var o2 = getStateComplexVector(3);
    var o3 = getStateComplexVector(3);
    var o4 = getStateComplexVector(3);

    var res = tracing4core(n1, n2, n3, n4, o1, o2, o3, o4);

    putStateComplexVector(res[0]);
    putStateComplexVector(res[1]);
    putStateComplexVector(res[2]);
    putStateComplexVector(res[3]);
    return List.turnIntoCSList(res);
}
tracing4.stateSize = 24; // four three-element complex vectors


function tracing4core(n1, n2, n3, n4, o1, o2, o3, o4) {
    var debug = function() {};
    // var debug = console.log.bind(console);

    var useGreedy = false; // greedy or permutation?
    var safety;

    var old_el = [o1, o2, o3, o4];
    var new_el = [n1, n2, n3, n4];

    // first we leave everything to input
    if (tracingInitial)
        return new_el;

    var res, dist, i, j, distMatrix;
    var min_cost = 0;

    if (useGreedy) {
        safety = 3;
        res = new_el;
        for (i = 0; i < 4; i++) {
            var idx = i;
            var min_dist = List.projectiveDistMinScal(old_el[i], res[i]);
            for (j = i + 1; j < 4; j++) {
                dist = List.projectiveDistMinScal(old_el[i], res[j]);
                if (dist < min_dist) {
                    idx = j;
                    min_dist = dist;
                }
            }
            // swap elements
            var tmp = res[i];
            res[i] = res[idx];
            res[idx] = tmp;
            min_cost += min_dist;
        }
    } else {
        safety = 1;

        // build dist matrix
        distMatrix = new Array(4);
        for (i = 0; i < 4; i++) {
            distMatrix[i] = new Array(4);
            for (j = 0; j < 4; j++) {
                dist = List.projectiveDistMinScal(old_el[i], new_el[j]);
                distMatrix[i][j] = dist;
            }
        }

        var bestperm = minCostMatching(distMatrix);
        res = new Array(4);
        for (i = 0; i < 4; ++i) {
            res[i] = new_el[bestperm[i]];
            min_cost += distMatrix[i][bestperm[i]];
        }
    } // end use greedy

    // assume now we have machting between res and old_el
    var need_refine = false;
    var match_cost = min_cost * safety;
    var odist = Infinity;
    var ndist = Infinity;

    for (i = 0; i < 4; i++) {
        if (need_refine) break;
        if (List._helper.isNaN(new_el[i])) {
            // Something went very wrong, numerically speaking. We have no
            // clue whether refining will make things any better, so we
            // assume it won't and give up.
            debug("Tracing failed due to NaNs.");
            tracingFailed = true;
            return res;
        }
        for (j = i + 1; j < 4; j++) {
            dist = List.projectiveDistMinScal(old_el[i], old_el[j]); // do1o2...
            if (odist > dist) odist = dist;
            dist = List.projectiveDistMinScal(res[i], res[j]); // dn1n2...
            if (ndist > dist) ndist = dist;
        }
    }

    if (traceLog && traceLog.currentStep) {
        var logRow = [
            traceLog.labelTracing4, //                        1
            General.wrap(traceLog.currentElement.name), //    2
            List.turnIntoCSList(res), //                      3
            List.turnIntoCSList(old_el), //                   4
            List.realMatrix(distMatrix), //                   5
            General.wrap(min_cost), //                        6
            General.wrap(odist), //                           7
            General.wrap(ndist), //                           8
            nada, // will become the outcome message //       9
        ];
        traceLog.currentStep.push(List.turnIntoCSList(logRow));
        debug = function(msg) {
            if (!traceLog.hasOwnProperty(msg))
                traceLog[msg] = General.wrap(msg);
            logRow[logRow.length - 1] = traceLog[msg];
            // Evil: modify can break copy on write! But it's safe here.
        };
    }

    if (odist > match_cost && ndist > match_cost) {
        // Distance within matching considerably smaller than distance
        // across matching, so we could probably match correctly.
        //debug("Normal case, everything all right.");
    } else if (ndist < 1e-5) {
        // New points too close: we presumably are inside a singularity.
        if (odist < 1e-5) {
            // The last "good" position was already singular.
            // Nothing we can do about this.
            debug("Staying inside singularity.");
        } else {
            // We newly moved into the singularity. New position is
            // not "good", but refining won't help since the endpoint
            // is singular.
            debug("Moved into singularity.");
            tracingFailed = true;
        }
    } else if (odist < 1e-5) {
        // We just moved out of a singularity. Things can only get
        // better. If the singular situation was "good", we stay
        // "good", and keep track of things from now on.
        debug("Moved out of singularity.");
    } else {
        if (noMoreRefinements)
            debug("Reached refinement limit, giving up.");
        else
            debug("Need to refine.");
        requestRefinement();

    }
    return res;
}

function tracing2X(n1, n2, c1, c2, el) {
    var OK = 0;
    var DECREASE_STEP = 1;
    var INVALID = 2;
    var tooClose = el.tooClose || OK;
    var safety = 3;

    var do1n1 = List.projectiveDistMinScal(c1, n1);
    var do1n2 = List.projectiveDistMinScal(c1, n2);
    var do2n1 = List.projectiveDistMinScal(c2, n1);
    var do2n2 = List.projectiveDistMinScal(c2, n2);
    var do1o2 = List.projectiveDistMinScal(c1, c2);
    var dn1n2 = List.projectiveDistMinScal(n1, n2);

    //Das Kommt jetzt eins zu eins aus Cindy

    var care = (do1o2 > 0.000001);

    // First we try to assign the points

    if (do1o2 / safety > do1n1 + do2n2 && dn1n2 / safety > do1n1 + do2n2) {
        el.results = List.turnIntoCSList([n1, n2]); //Das ist "sort Output"
        return OK + tooClose;
    }

    if (do1o2 / safety > do1n2 + do2n1 && dn1n2 / safety > do1n2 + do2n1) {
        el.results = List.turnIntoCSList([n2, n1]); //Das ist "sort Output"
        return OK + tooClose;
    }

    //  Maybe they are too close?

    if (dn1n2 < 0.00001) {
        // They are. Do we care?
        if (care) {
            tooClose = el.tooClose = INVALID;
            el.results = List.turnIntoCSList([n1, n2]);
            return OK + tooClose;
        } else {
            el.results = List.turnIntoCSList([n1, n2]);
            return OK + tooClose;
        }
    }

    // They are far apart. We care now.
    if (!care || tooClose === INVALID) {
        el.results = List.turnIntoCSList([n1, n2]); //Das ist "sort Output"
        return OK + tooClose;
    }
    return DECREASE_STEP + tooClose;
}

function tracingSesq(newVecs) {
    /*
     * Trace an arbitrary number of solutions, with an arbitrary
     * dimension for the homogeneous solution vectors.
     *
     * Conceptually the cost function being used is the negated square
     * of the absolute value of the sesquilinearproduct between two
     * vectors normalized to unit norm. In practice, we avoid
     * normalizing the vectors, and instead divide by the squared norm
     * to avoid taking square roots.
     */

    var n = newVecs.length;
    var i, j;

    if (tracingInitial) {
        for (i = 0; i < n; ++i) {
            stateInIdx += 2 * newVecs[i].value.length;
            putStateComplexVector(newVecs[i]);
        }
        return newVecs;
    }

    var oldVecs = new Array(n);
    var oldNorms = new Array(n);
    var newNorms = new Array(n);
    var oldMinCost = 99;
    var newMinCost = 99;
    var cost = new Array(n);
    for (i = 0; i < n; ++i) {
        oldVecs[i] = getStateComplexVector(newVecs[i].value.length);
        oldNorms[i] = List.normSquared(oldVecs[i]).value.real;
        newNorms[i] = List.normSquared(newVecs[i]).value.real;
        cost[i] = new Array(n);
    }
    var p, w;
    for (i = 0; i < n; ++i) {
        for (j = 0; j < n; ++j) {
            p = List.sesquilinearproduct(oldVecs[i], newVecs[j]).value;
            w = (p.real * p.real + p.imag * p.imag) /
                (oldNorms[i] * newNorms[j]);
            cost[i][j] = 1 - w;
        }
        for (j = i + 1; j < n; ++j) {
            p = List.sesquilinearproduct(oldVecs[i], oldVecs[j]).value;
            w = (p.real * p.real + p.imag * p.imag) /
                (oldNorms[i] * oldNorms[j]);
            if (oldMinCost > 1 - w)
                oldMinCost = 1 - w;
            p = List.sesquilinearproduct(newVecs[i], newVecs[j]).value;
            w = (p.real * p.real + p.imag * p.imag) /
                (newNorms[i] * newNorms[j]);
            if (newMinCost > 1 - w)
                newMinCost = 1 - w;
        }
    }
    var m = minCostMatching(cost);
    var res = new Array(n);
    var resCost = 0;
    var anyNaN = false;
    for (i = 0; i < n; ++i) {
        resCost += cost[i][m[i]];
        var v = res[i] = newVecs[m[i]];
        putStateComplexVector(v);
        anyNaN |= List._helper.isNaN(v);
    }
    anyNaN |= isNaN(resCost);
    var safety = 3;
    var debug = function() {};
    if (traceLog && traceLog.currentStep) {
        var logRow = [
            traceLog.labelTracingSesq, //                     1
            General.wrap(traceLog.currentElement.name), //    2
            List.turnIntoCSList(res), //                      3
            List.turnIntoCSList(oldVecs), //                  4
            List.realMatrix(cost), //                         5
            General.wrap(resCost), //                         6
            General.wrap(oldMinCost), //                      7
            General.wrap(newMinCost), //                      8
            nada, // will become the outcome message //       9
        ];
        traceLog.currentStep.push(List.turnIntoCSList(logRow));
        debug = function(msg) {
            if (!traceLog.hasOwnProperty(msg))
                traceLog[msg] = General.wrap(msg);
            logRow[logRow.length - 1] = traceLog[msg];
            // Evil: modify can break copy on write! But it's safe here.
        };
    }
    if (anyNaN) {
        // Something went very wrong, numerically speaking. We have no
        // clue whether refining will make things any better, so we
        // assume it won't and give up.
        debug("Tracing failed due to NaNs.");
        tracingFailed = true;
    } else if (oldMinCost > resCost * safety && newMinCost > resCost * safety) {
        // Distance within matching considerably smaller than distance
        // across matching, so we could probably match correctly.
        debug("Normal case, everything all right.");
    } else if (newMinCost < 1e-5) {
        // New points too close: we presumably are inside a singularity.
        if (oldMinCost < 1e-5) {
            // The last "good" position was already singular.
            // Nothing we can do about this.
            debug("Staying inside singularity.");
        } else {
            // We newly moved into the singularity. New position is
            // not "good", but refining won't help since the endpoint
            // is singular.
            debug("Moved into singularity.");
            tracingFailed = true;
        }
    } else if (oldMinCost < 1e-5) {
        // We just moved out of a singularity. Things can only get
        // better. If the singular situation was "good", we stay
        // "good", and keep track of things from now on.
        debug("Moved out of singularity.");
    } else {
        // Neither old nor new position looks singular, so there was
        // an avoidable singularity along the way. Refine to avoid it.
        if (noMoreRefinements)
            debug("Reached refinement limit, giving up.");
        else
            debug("Need to refine.");
        requestRefinement();
    }
    return res;
}
var geoOps = {};
geoOps._helper = {};

/* Kinds of geometric elements:
 * P  - Point
 * L  - Line
 * S  - Segment
 * C  - Conic (including circle)
 * *s - Set of *
 * Tr - Projective transformation
 * Mt - Moebius transformation
 */


////The RandomLine RandomPoint operators are used by Cinderellas
////Original Mirror Operations

geoOps.RandomLine = {};
geoOps.RandomLine.kind = "L";
geoOps.RandomLine.signature = [];
geoOps.RandomLine.updatePosition = function(el) {
    el.homog = List.realVector([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};


geoOps.FreeLine = {};
geoOps.FreeLine.kind = "L";
geoOps.FreeLine.signature = [];
geoOps.FreeLine.isMovable = true;
geoOps.FreeLine.initialize = function(el) {
    var pos = geoOps._helper.initializePoint(el);
    putStateComplexVector(pos);
};
geoOps.FreeLine.getParamForInput = function(el, pos, type) {
    var homog = List.cross(pos, List.ez);
    homog = List.cross(homog, pos);
    return List.normalizeMax(homog);
};
geoOps.FreeLine.getParamFromState = function(el) {
    return getStateComplexVector(3);
};
geoOps.FreeLine.putParamToState = function(el, param) {
    putStateComplexVector(param);
};
geoOps.FreeLine.updatePosition = function(el) {
    var param = getStateComplexVector(3);
    putStateComplexVector(param); // copy param
    el.homog = General.withUsage(param, "Line");
};
geoOps.FreeLine.stateSize = 6;


geoOps.RandomPoint = {};
geoOps.RandomPoint.kind = "P";
geoOps.RandomPoint.signature = [];
geoOps.RandomPoint.updatePosition = function(el) {
    el.homog = List.realVector([100 * Math.random(), 100 * Math.random(), 100 * Math.random()]);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Point");
};

///////////////////////////


geoOps.Join = {};
geoOps.Join.kind = "L";
geoOps.Join.signature = ["P", "P"];
geoOps.Join.updatePosition = function(el) {
    var el1 = csgeo.csnames[(el.args[0])];
    var el2 = csgeo.csnames[(el.args[1])];
    el.homog = List.cross(el1.homog, el2.homog);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};


geoOps.Segment = {};
geoOps.Segment.kind = "S";
geoOps.Segment.signature = ["P", "P"];
geoOps.Segment.updatePosition = function(el) {
    var el1 = csgeo.csnames[(el.args[0])];
    var el2 = csgeo.csnames[(el.args[1])];
    el.homog = List.cross(el1.homog, el2.homog);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
    el.startpos = el1.homog;
    el.endpos = el2.homog;
    el.farpoint = List.cross(el.homog, List.linfty);
};


geoOps.Meet = {};
geoOps.Meet.kind = "P";
geoOps.Meet.signature = ["L", "L"];
geoOps.Meet.updatePosition = function(el) {
    var el1 = csgeo.csnames[(el.args[0])];
    var el2 = csgeo.csnames[(el.args[1])];
    el.homog = List.cross(el1.homog, el2.homog);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Point");
};

geoOps.Meet.visiblecheck = function(el) {
    var visible = true;
    var el1 = csgeo.csnames[(el.args[0])];
    var el2 = csgeo.csnames[(el.args[1])];

    if (el1.type === "Segment") {
        visible = onSegment(el, el1);
    }
    if (visible && el1.type === "Segment") {
        visible = onSegment(el, el2);
    }
    el.isshowing = visible;
};

geoOps._helper.midpoint = function(a, b) {
    return List.normalizeMax(List.add(
        List.scalmult(b.value[2], a),
        List.scalmult(a.value[2], b)));
};

geoOps.Mid = {};
geoOps.Mid.kind = "P";
geoOps.Mid.signature = ["P", "P"];
geoOps.Mid.updatePosition = function(el) {
    var x = csgeo.csnames[(el.args[0])].homog;
    var y = csgeo.csnames[(el.args[1])].homog;
    var res = geoOps._helper.midpoint(x, y);
    el.homog = General.withUsage(res, "Point");
};


geoOps.Perp = {};
geoOps.Perp.kind = "L";
geoOps.Perp.signature = ["L", "P"];
geoOps.Perp.updatePosition = function(el) {
    var l = csgeo.csnames[(el.args[0])].homog;
    var p = csgeo.csnames[(el.args[1])].homog;
    var tt = List.turnIntoCSList([l.value[0], l.value[1], CSNumber.zero]);
    el.homog = List.cross(tt, p);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};


geoOps.Para = {};
geoOps.Para.kind = "L";
geoOps.Para.signature = ["L", "P"];
geoOps.Para.updatePosition = function(el) {
    var l = csgeo.csnames[(el.args[0])].homog;
    var p = csgeo.csnames[(el.args[1])].homog;
    var inf = List.linfty;
    el.homog = List.cross(List.cross(inf, l), p);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};

// Horizontal line through a point
geoOps.Horizontal = {};
geoOps.Horizontal.kind = "L";
geoOps.Horizontal.signature = ["P"];
geoOps.Horizontal.updatePosition = function(el) {
    var el1 = csgeo.csnames[(el.args[0])];
    el.homog = List.cross(List.ex, el1.homog);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};


// Cinderella's freely movable HorizontalLine (Cinderella semantics)
geoOps.HorizontalLine = {};
geoOps.HorizontalLine.kind = "L";
geoOps.HorizontalLine.signature = [];
geoOps.HorizontalLine.isMovable = true;
geoOps.HorizontalLine.initialize = function(el) {
    var pos = geoOps._helper.initializePoint(el);
    pos = List.turnIntoCSList([CSNumber.zero, pos.value[1], pos.value[2]]);
    pos = List.normalizeMax(pos);
    putStateComplexVector(pos);
};
geoOps.HorizontalLine.getParamForInput = function(el, pos, type) {
    var homog = List.cross(pos, List.ex);
    return List.normalizeMax(homog);
};
geoOps.HorizontalLine.getParamFromState = function(el) {
    return getStateComplexVector(3);
};
geoOps.HorizontalLine.putParamToState = function(el, param) {
    putStateComplexVector(param);
};
geoOps.HorizontalLine.updatePosition = function(el) {
    var param = getStateComplexVector(3);
    putStateComplexVector(param); // copy param
    el.homog = General.withUsage(param, "Line");
};
geoOps.HorizontalLine.stateSize = 6;


// Vertical line through a point
geoOps.Vertical = {};
geoOps.Vertical.kind = "L";
geoOps.Vertical.signature = ["P"];
geoOps.Vertical.updatePosition = function(el) {
    var el1 = csgeo.csnames[(el.args[0])];
    el.homog = List.cross(List.ey, el1.homog);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};


// Cinderella's freely movable VerticalLine (Cinderella semantics)
geoOps.VerticalLine = {};
geoOps.VerticalLine.kind = "L";
geoOps.VerticalLine.signature = [];
geoOps.VerticalLine.isMovable = true;
geoOps.VerticalLine.initialize = function(el) {
    var pos = geoOps._helper.initializePoint(el);
    pos = List.turnIntoCSList([pos.value[0], CSNumber.zero, pos.value[2]]);
    pos = List.normalizeMax(pos);
    putStateComplexVector(pos);
};
geoOps.VerticalLine.getParamForInput = function(el, pos, type) {
    var homog = List.cross(pos, List.ey);
    return List.normalizeMax(homog);
};
geoOps.VerticalLine.getParamFromState = function(el) {
    return getStateComplexVector(3);
};
geoOps.VerticalLine.putParamToState = function(el, param) {
    putStateComplexVector(param);
};
geoOps.VerticalLine.updatePosition = function(el) {
    var param = getStateComplexVector(3);
    putStateComplexVector(param); // copy param
    el.homog = General.withUsage(param, "Line");
};
geoOps.VerticalLine.stateSize = 6;


geoOps.LineByFixedAngle = {};
geoOps.LineByFixedAngle.kind = "L";
geoOps.LineByFixedAngle.signature = ["L", "P"];
geoOps.LineByFixedAngle.initialize = function(el) {
    var a = CSNumber._helper.input(el.angle);
    var c = CSNumber.cos(a);
    var s = CSNumber.sin(a);
    // Setup matrix for applying the angle rotation.
    // This will also map from line in the plane to point at infinity.
    // So it's a rotation combined with a projection and hence has det=0.
    // And the rotation is 90 degrees less than one might expect at first
    // due to the translation between line and point.
    el.rot = List.turnIntoCSList([
        List.turnIntoCSList([s, c, CSNumber.zero]),
        List.turnIntoCSList([CSNumber.neg(c), s, CSNumber.zero]),
        List.turnIntoCSList([CSNumber.zero, CSNumber.zero, CSNumber.zero])
    ]);
};
geoOps.LineByFixedAngle.updatePosition = function(el) {
    var l = csgeo.csnames[(el.args[0])];
    var p = csgeo.csnames[(el.args[1])];
    var dir = List.productMV(el.rot, l.homog);
    el.homog = List.cross(p.homog, dir);
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Line");
};


geoOps.Through = {};
geoOps.Through.kind = "L";
geoOps.Through.signature = ["P"];
geoOps.Through.isMovable = true;
geoOps.Through.initialize = function(el) {
    var dir;
    if (el.dir)
        dir = General.wrap(el.dir);
    else
        dir = List.realVector([el.pos[1], -el.pos[0], 0]);
    putStateComplexVector(dir);
};
geoOps.Through.getParamForInput = function(el, pos, type) {
    var l;
    if (type === "mouse") {
        var p1 = csgeo.csnames[(el.args[0])].homog;
        l = List.cross(p1, pos);
    } else if (type === "homog") {
        l = pos;
    } else {
        l = List.turnIntoCSList([CSNumber.zero, CSNumber.zero, CSNumber.zero]);
    }
    var dir = List.cross(List.linfty, l);
    // The parameter is the point at infinity, without its last coordinate.
    return List.normalizeMax(dir);
};
geoOps.Through.getParamFromState = function(el) {
    return getStateComplexVector(3);
};
geoOps.Through.putParamToState = function(el, param) {
    putStateComplexVector(param);
};
geoOps.Through.updatePosition = function(el) {
    var dir = getStateComplexVector(3);
    putStateComplexVector(dir); // copy param
    var p1 = csgeo.csnames[el.args[0]].homog;
    var homog = List.cross(p1, dir);
    homog = List.normalizeMax(homog);
    el.homog = General.withUsage(homog, "Line");
};
geoOps.Through.stateSize = 6;


geoOps.Free = {};
geoOps.Free.kind = "P";
geoOps.Free.signature = [];
geoOps.Free.isMovable = true;
geoOps.Free.initialize = function(el) {
    var pos = geoOps._helper.initializePoint(el);
    putStateComplexVector(pos);
};
geoOps.Free.getParamForInput = function(el, pos, type) {
    if (type === "mouse" && cssnap && csgridsize !== 0) {
        pos = List.normalizeZ(pos);
        var sx = pos.value[0].value.real;
        var sy = pos.value[1].value.real;
        var rx = Math.round(sx / csgridsize) * csgridsize;
        var ry = Math.round(sy / csgridsize) * csgridsize;
        if (Math.abs(rx - sx) < 0.2 && Math.abs(ry - sy) < 0.2) {
            pos = List.realVector([rx, ry, 1]);
        }
    }
    return List.normalizeMax(pos);
};
geoOps.Free.getParamFromState = function(el) {
    return getStateComplexVector(3);
};
geoOps.Free.putParamToState = function(el, param) {
    putStateComplexVector(param);
};
geoOps.Free.updatePosition = function(el) {
    var param = getStateComplexVector(3);
    putStateComplexVector(param); // copy param
    el.homog = General.withUsage(param, "Point");
};
geoOps.Free.stateSize = 6;

geoOps._helper.projectPointToLine = function(point, line) {
    var tt = List.turnIntoCSList([line.value[0], line.value[1], CSNumber.zero]);
    var perp = List.cross(tt, point);
    return List.normalizeMax(List.cross(perp, line));
};

geoOps.PointOnLine = {};
geoOps.PointOnLine.kind = "P";
geoOps.PointOnLine.signature = ["L"];
geoOps.PointOnLine.isMovable = true;
geoOps.PointOnLine.initialize = function(el) {
    var point = geoOps._helper.initializePoint(el);
    var line = csgeo.csnames[(el.args[0])].homog;
    point = geoOps._helper.projectPointToLine(point, line);
    point = List.normalizeMax(point);
    var other = List.cross(List.linfty, point);
    other = List.normalizeMax(other);
    putStateComplexVector(point);
    putStateComplexVector(line);
    tracingInitial = false; // force updatePosition to do proper matching
};
geoOps.PointOnLine.updatePosition = function(el, isMover) {
    var newPoint;
    var newLine = csgeo.csnames[(el.args[0])].homog;
    var oldPoint = getStateComplexVector(3);
    var oldLine = getStateComplexVector(3);

    if (isMover) {
        newPoint = oldPoint;
    } else {
        // Also read from last good, which is real,
        // instead of only stateIn which might be complex.
        stateInIdx = el.stateIdx;
        var tmpIn = stateIn;
        stateIn = stateLastGood;
        var realPoint = getStateComplexVector(3);
        var realLine = getStateComplexVector(3);
        stateIn = tmpIn;

        var center = List.cross(realLine, newLine);
        //if (CSNumber._helper.isAlmostZero(List.scalproduct(newLine, realPoint))) {
        if (List._helper.isAlmostZero(center)) {
            // line stayed (almost) the same, perform orthogonal projection
            center = List.cross(List.linfty, newLine);
        }
        // Note: center is NOT continuous in the parameter,
        // so refinements might cause it to jump between situations.
        // But refinement will bring lines close to one another,
        // in which case the exact location of center becomes less relevant
        var circle = geoOps._helper.CircleMP(center, realPoint);
        var newCandidates = geoOps._helper.IntersectLC(newLine, circle);
        var oldAntipode = geoOps._helper.pointReflection(center, oldPoint);
        var res = tracing2core(
            newCandidates[0], newCandidates[1],
            oldPoint, oldAntipode);
        newPoint = res[0];
    }
    newPoint = List.normalizeMax(newPoint);
    putStateComplexVector(newPoint);
    putStateComplexVector(newLine);
    el.homog = General.withUsage(newPoint, "Point");
};
geoOps.PointOnLine.getParamForInput = function(el, pos, type) {
    var line = csgeo.csnames[(el.args[0])].homog;
    pos = geoOps._helper.projectPointToLine(pos, line);
    // TODO: snap to grid
    return pos;
};
geoOps.PointOnLine.getParamFromState = function(el) {
    return getStateComplexVector(3); // point is first state element
};
geoOps.PointOnLine.putParamToState = function(el, param) {
    return putStateComplexVector(param);
};
geoOps.PointOnLine.stateSize = 12;


geoOps.PointOnCircle = {};
geoOps.PointOnCircle.kind = "P";
geoOps.PointOnCircle.signature = ["C"];
geoOps.PointOnCircle.isMovable = true;
geoOps.PointOnCircle.initialize = function(el) {
    var circle = csgeo.csnames[el.args[0]];
    var pos = List.normalizeZ(geoOps._helper.initializePoint(el));
    var mid = List.normalizeZ(geoOps._helper.CenterOfConic(circle.matrix));
    var dir = List.sub(pos, mid);
    var param = List.turnIntoCSList([
        dir.value[1],
        CSNumber.neg(dir.value[0]),
        CSNumber.zero
    ]);
    // The parameter is the far point polar to the diameter through the point
    var diameter = List.cross(pos, mid);
    var candidates = geoOps._helper.IntersectLC(diameter, circle.matrix);
    var d0 = List.projectiveDistMinScal(pos, candidates[0]);
    var d1 = List.projectiveDistMinScal(pos, candidates[1]);
    var other;
    if (d1 < d0) {
        pos = candidates[1];
        other = candidates[0];
    } else {
        pos = candidates[0];
        other = candidates[1];
    }
    putStateComplexVector(param);
    putStateComplexVector(pos);
    putStateComplexVector(other);
    tracingInitial = false; // force updatePosition to do proper matching
};
geoOps.PointOnCircle.putParamToState = function(el, param) {
    putStateComplexVector(param);
};
geoOps.PointOnCircle.getParamFromState = function(el) {
    return getStateComplexVector(3);
};
geoOps.PointOnCircle.getParamForInput = function(el, pos, type) {
    var circle = csgeo.csnames[el.args[0]];
    var mid = List.normalizeZ(geoOps._helper.CenterOfConic(circle.matrix));
    var dir = List.sub(pos, mid);
    stateInIdx = el.stateIdx;
    var oldparam = getStateComplexVector(3);
    var oldpos = List.normalizeZ(getStateComplexVector(3));
    var olddir = List.sub(oldpos, mid);
    var oldSign = CSNumber.sub(
        CSNumber.mult(oldparam.value[0], olddir.value[1]),
        CSNumber.mult(oldparam.value[1], olddir.value[0]));
    if (oldSign.value.real < 0)
        dir = List.neg(dir);
    // if oldSign > 0 then oldparam[0], oldparam[1]
    // is a positive multiple of olddir[1], -olddir[0]
    return List.turnIntoCSList([
        dir.value[1],
        CSNumber.neg(dir.value[0]),
        CSNumber.zero
    ]);
};
geoOps.PointOnCircle.parameterPath = function(el, tr, tc, src, dst) {
    src = List.normalizeAbs(src);
    dst = List.normalizeAbs(dst);
    var sp = List.scalproduct(src, dst);
    if (sp.value.real >= 0)
        return defaultParameterPath(el, tr, tc, src, dst);
    // If we have more than half a turn, do two half-circle arcs
    // with a real position half way along the path.
    // This should ensure we get to the far intersection point when needed.
    var mid = List.turnIntoCSList([
        CSNumber.sub(src.value[1], dst.value[1]),
        CSNumber.sub(dst.value[0], src.value[0]),
        CSNumber.zero
    ]);
    sp = List.scalproduct(src, mid);
    if (sp.value.real < 0)
        mid = List.neg(mid);
    var t2, dt;
    if (tr < 0) {
        tr = 2 * tr + 1;
        t2 = tr * tr;
        dt = 0.25 / (1 + t2);
        tc = CSNumber.complex((2 * tr) * dt + 0.25, (1 - t2) * dt);
    } else {
        tr = 2 * tr - 1;
        t2 = tr * tr;
        dt = 0.25 / (1 + t2);
        tc = CSNumber.complex((2 * tr) * dt + 0.75, (1 - t2) * dt);
    }
    var uc = CSNumber.sub(CSNumber.real(1), tc);
    var tc2 = CSNumber.mult(tc, tc);
    var uc2 = CSNumber.mult(uc, uc);
    var tuc = CSNumber.mult(tc, uc);
    var res = List.scalmult(uc2, src);
    res = List.add(res, List.scalmult(tuc, mid));
    res = List.add(res, List.scalmult(tc2, dst));
    return res;
};
geoOps.PointOnCircle.updatePosition = function(el) {
    var param = getStateComplexVector(3);
    putStateComplexVector(param); // copy parameter
    var circle = csgeo.csnames[el.args[0]];
    var diameter = List.productMV(circle.matrix, param);
    var candidates = geoOps._helper.IntersectLC(diameter, circle.matrix);
    candidates = tracing2(candidates[0], candidates[1]);
    var pos = List.normalizeMax(candidates.value[0]);
    el.homog = General.withUsage(pos, "Point");
    el.antipodalPoint = candidates.value[1];
};
geoOps.PointOnCircle.stateSize = 6 + tracing2.stateSize;

geoOps.OtherPointOnCircle = {};
geoOps.OtherPointOnCircle.kind = "P";
geoOps.OtherPointOnCircle.signature = ["P"];
geoOps.OtherPointOnCircle.signatureConstraints = function(el) {
    return csgeo.csnames[el.args[0]].type === "PointOnCircle";
};
geoOps.OtherPointOnCircle.updatePosition = function(el) {
    var first = csgeo.csnames[el.args[0]];
    var pos = first.antipodalPoint;
    pos = List.normalizeMax(pos);
    el.homog = General.withUsage(pos, "Point");
};

geoOps.PointOnSegment = {};
geoOps.PointOnSegment.kind = "P";
geoOps.PointOnSegment.signature = ["S"];
geoOps.PointOnSegment.isMovable = true;
geoOps.PointOnSegment.initialize = function(el) {
    var pos = geoOps._helper.initializePoint(el);
    var cr = geoOps.PointOnSegment.getParamForInput(el, pos);
    putStateComplexNumber(cr);
};
geoOps.PointOnSegment.getParamForInput = function(el, pos) {
    var seg = csgeo.csnames[el.args[0]];
    var line = seg.homog;
    var tt = List.turnIntoCSList([line.value[0], line.value[1], CSNumber.zero]);
    var cr = List.crossratio3(
        seg.farpoint, seg.startpos, seg.endpos, pos, tt);
    if (cr.value.real < 0)
        cr = CSNumber.complex(0, cr.value.imag);
    if (cr.value.real > 1)
        cr = CSNumber.complex(1, cr.value.imag);
    return cr;
};
geoOps.PointOnSegment.getParamFromState = function(el) {
    return getStateComplexNumber();
};
geoOps.PointOnSegment.putParamToState = function(el, param) {
    putStateComplexNumber(param);
};
geoOps.PointOnSegment.updatePosition = function(el) {
    var param = getStateComplexNumber();
    putStateComplexNumber(param); // copy parameter
    var seg = csgeo.csnames[el.args[0]];
    // TODO: Handle case where seg is the result of a projective transform,
    // where seg.farpoint would not have z==0. Can't happen yet.
    var start = List.scalmult(seg.endpos.value[2], seg.startpos);
    var end = List.scalmult(seg.startpos.value[2], seg.endpos);
    // now they have the same z coordinate, so their difference is far
    var far = List.sub(end, start);
    var homog = List.add(start, List.scalmult(param, far));
    homog = List.normalizeMax(homog);
    el.homog = General.withUsage(homog, "Point");
};
geoOps.PointOnSegment.stateSize = 2;


geoOps._helper.CenterOfConic = function(c) {
    // The center is the pole of the line at infinity.
    return General.mult(List.adjoint3(c), List.linfty);
};

geoOps.CenterOfConic = {};
geoOps.CenterOfConic.kind = "P";
geoOps.CenterOfConic.signature = ["C"];
geoOps.CenterOfConic.updatePosition = function(el) {
    var c = csgeo.csnames[(el.args[0])].matrix;
    var erg = geoOps._helper.CenterOfConic(c);
    el.homog = erg;
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Point");


};

geoOps._helper.CircleMP = function(m, p) {
    var x = m.value[0];
    var y = m.value[1];
    var mz = CSNumber.neg(m.value[2]);
    var zero = CSNumber.zero;
    var tang = List.turnIntoCSList([
        List.turnIntoCSList([mz, zero, x]),
        List.turnIntoCSList([zero, mz, y]),
        List.turnIntoCSList([x, y, zero]),
    ]);
    var mu = General.mult(General.mult(p, tang), p);
    var la = General.mult(General.mult(p, List.fund), p);
    var m1 = General.mult(mu, List.fund);
    var m2 = General.mult(la, tang);
    var erg = List.sub(m1, m2);
    return erg;
};

geoOps.CircleMP = {};
geoOps.CircleMP.kind = "C";
geoOps.CircleMP.signature = ["P", "P"];
geoOps.CircleMP.updatePosition = function(el) { //TODO Performance Checken. Das ist jetzt der volle CK-ansatz
    //Weniger Allgemein geht das viiiiel schneller
    var m = csgeo.csnames[(el.args[0])].homog;
    var p = csgeo.csnames[(el.args[1])].homog;
    el.matrix = geoOps._helper.CircleMP(m, p);
    el.matrix = List.normalizeMax(el.matrix);
    el.matrix = General.withUsage(el.matrix, "Circle");

};


geoOps.CircleMr = {};
geoOps.CircleMr.kind = "C";
geoOps.CircleMr.signature = ["P"];
geoOps.CircleMr.isMovable = true;
geoOps.CircleMr.initialize = function(el) {
    putStateComplexNumber(CSNumber.real(el.radius));
};
geoOps.CircleMr.getParamForInput = function(el, pos) {
    var m = csgeo.csnames[(el.args[0])].homog;
    m = List.normalizeZ(m);
    pos = List.normalizeZ(pos);
    var rad = List.sub(m, pos);
    rad = List.abs(rad);
    return rad;
};
geoOps.CircleMr.getParamFromState = function(el) {
    return getStateComplexNumber();
};
geoOps.CircleMr.putParamToState = function(el, param) {
    putStateComplexNumber(param);
};
geoOps.CircleMr.updatePosition = function(el) {
    var r = getStateComplexNumber();
    putStateComplexNumber(r); // copy param
    var m = csgeo.csnames[(el.args[0])].homog;
    m = List.normalizeZ(m);
    var p = List.turnIntoCSList([r, CSNumber.zero, CSNumber.zero]);
    p = List.add(p, m);
    var matrix = geoOps._helper.CircleMP(m, p);
    matrix = List.normalizeMax(matrix);
    el.matrix = General.withUsage(matrix, "Circle");
    el.radius = r;
};
geoOps.CircleMr.stateSize = 2;


//TODO Must be redone for Points at infinity
//Original Cindy Implementation is not correct either
geoOps.Compass = {};
geoOps.Compass.kind = "C";
geoOps.Compass.signature = ["P", "P", "P"];
geoOps.Compass.updatePosition = function(el) {
    var m = csgeo.csnames[(el.args[2])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var c = csgeo.csnames[(el.args[0])].homog;
    m = List.normalizeZ(m);
    b = List.normalizeZ(b);
    c = List.normalizeZ(c);
    var diff = List.sub(b, c);
    var p = List.add(diff, m);
    p = List.normalizeZ(p);

    var matrix = geoOps._helper.CircleMP(m, p);
    matrix = List.normalizeMax(matrix);
    el.matrix = General.withUsage(matrix, "Circle");
};


geoOps._helper.getConicType = function(C) {
    var myEps = 1e-16;
    var adet = CSNumber.abs(List.det(C));

    if (adet.value.real < myEps) {
        return "degenerate";
    }

    var det = CSNumber.mult(C.value[0].value[0], C.value[1].value[1]);
    det = CSNumber.sub(det, CSNumber.pow(C.value[0].value[1], CSNumber.real(2)));

    det = det.value.real;

    if (Math.abs(det) < myEps) {
        return "parabola";
    } else if (det > myEps) {
        return "ellipsoid";
    } else {
        return "hyperbola";
    }
};


geoOps._helper.ConicBy5 = function(el, a, b, c, d, p) {

    var v23 = List.turnIntoCSList([List.cross(b, c)]);
    var v14 = List.turnIntoCSList([List.cross(a, d)]);
    var v12 = List.turnIntoCSList([List.cross(a, b)]);
    var v34 = List.turnIntoCSList([List.cross(c, d)]);
    var deg1 = General.mult(List.transpose(v14), v23);

    var erg = geoOps._helper.conicFromTwoDegenerates(v23, v14, v12, v34, p);
    return erg;
};

geoOps._helper.conicFromTwoDegenerates = function(v23, v14, v12, v34, p) {
    var deg1 = General.mult(List.transpose(v14), v23);
    var deg2 = General.mult(List.transpose(v34), v12);
    deg1 = List.add(deg1, List.transpose(deg1));
    deg2 = List.add(deg2, List.transpose(deg2));
    var mu = General.mult(General.mult(p, deg1), p);
    var la = General.mult(General.mult(p, deg2), p);
    var m1 = General.mult(mu, deg2);
    var m2 = General.mult(la, deg1);

    var erg = List.sub(m1, m2);
    return erg;
};


geoOps.ConicBy5 = {};
geoOps.ConicBy5.kind = "C";
geoOps.ConicBy5.signature = ["P", "P", "P", "P", "P"];
geoOps.ConicBy5.updatePosition = function(el) {
    var a = csgeo.csnames[(el.args[0])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var c = csgeo.csnames[(el.args[2])].homog;
    var d = csgeo.csnames[(el.args[3])].homog;
    var p = csgeo.csnames[(el.args[4])].homog;

    var erg = geoOps._helper.ConicBy5(el, a, b, c, d, p);

    el.matrix = erg;
    el.matrix = List.normalizeMax(el.matrix);
    el.matrix = General.withUsage(el.matrix, "Conic");
};

geoOps._helper.buildConicMatrix = function(arr) {
    var a = arr[0];
    var b = arr[1];
    var c = arr[2];
    var d = arr[3];
    var e = arr[4];
    var f = arr[5];

    var M = List.turnIntoCSList([
        List.turnIntoCSList([a, b, d]),
        List.turnIntoCSList([b, c, e]),
        List.turnIntoCSList([d, e, f])
    ]);
    return M;
};

geoOps._helper.splitDegenConic = function(mat) {
    var adj_mat = List.adjoint3(mat);

    var idx = 0;
    var k, l, abs2;
    var max = CSNumber.abs2(adj_mat.value[0].value[0]).value.real;
    for (k = 1; k < 3; k++) {
        abs2 = CSNumber.abs2(adj_mat.value[k].value[k]).value.real;
        if (abs2 > max) {
            idx = k;
            max = abs2;
        }
    }

    var beta = CSNumber.sqrt(CSNumber.mult(CSNumber.real(-1), adj_mat.value[idx].value[idx]));
    if (CSNumber.abs2(beta).value.real < 1e-16) {
        var zeros = List.turnIntoCSList([
            CSNumber.zero, CSNumber.zero, CSNumber.zero
        ]);
        return [zeros, zeros];
    }
    idx = CSNumber.real(idx + 1);
    var p = List.column(adj_mat, idx);

    p = List.scaldiv(beta, p);


    var lam = p.value[0],
        mu = p.value[1],
        tau = p.value[2];
    var M = List.turnIntoCSList([
        List.turnIntoCSList([CSNumber.real(0), tau, CSNumber.mult(CSNumber.real(-1), mu)]),
        List.turnIntoCSList([CSNumber.mult(CSNumber.real(-1), tau), CSNumber.real(0), lam]),
        List.turnIntoCSList([mu, CSNumber.mult(CSNumber.real(-1), lam), CSNumber.real(0)])
    ]);


    var C = List.add(mat, M);

    // get nonzero index
    var ii = 0;
    var jj = 0;
    max = 0;
    for (k = 0; k < 3; k++)
        for (l = 0; l < 3; l++) {
            abs2 = CSNumber.abs2(C.value[k].value[l]).value.real;
            if (abs2 > max) {
                ii = k;
                jj = l;
                max = abs2;
            }
        }


    var lg = C.value[ii];
    C = List.transpose(C);
    var lh = C.value[jj];
    lg = List.normalizeMax(lg);
    lh = List.normalizeMax(lh);

    lg = General.withUsage(lg, "Line");
    lh = General.withUsage(lh, "Line");


    return [lg, lh];
};

geoOps.SelectConic = {};
geoOps.SelectConic.kind = "C";
geoOps.SelectConic.signature = ["Cs"];
geoOps.SelectConic.initialize = function(el) {
    if (el.index !== undefined)
        return el.index - 1;
    var xx = CSNumber._helper.input(el.pos.xx);
    var yy = CSNumber._helper.input(el.pos.yy);
    var zz = CSNumber._helper.input(el.pos.zz);
    var xy = CSNumber.realmult(0.5, CSNumber._helper.input(el.pos.xy));
    var xz = CSNumber.realmult(0.5, CSNumber._helper.input(el.pos.xz));
    var yz = CSNumber.realmult(0.5, CSNumber._helper.input(el.pos.yz));
    var pos = List.turnIntoCSList([
        List.turnIntoCSList([xx, xy, xz]),
        List.turnIntoCSList([xy, yy, yz]),
        List.turnIntoCSList([xz, yz, zz])
    ]);
    var set = csgeo.csnames[(el.args[0])].results;
    var d1 = List.conicDist(pos, set[0]);
    var best = 0;
    for (var i = 1; i < set.length; ++i) {
        var d2 = List.conicDist(pos, set[i]);
        if (d2 < d1) {
            d1 = d2;
            best = i;
        }
    }
    return best;
};
geoOps.SelectConic.updatePosition = function(el) {
    var set = csgeo.csnames[(el.args[0])];
    el.matrix = set.results[el.param];
    el.matrix = List.normalizeMax(el.matrix);
    el.matrix = General.withUsage(el.matrix, "Conic");
};

// conic by 4 Points and 1 line
geoOps._helper.ConicBy4p1l = function(el, a, b, c, d, l) {
    var a1 = List.cross(List.cross(a, c), l);
    var a2 = List.cross(List.cross(b, d), l);
    var b1 = List.cross(List.cross(a, b), l);
    var b2 = List.cross(List.cross(c, d), l);
    var o = List.realVector(csport.to(100 * Math.random(), 100 * Math.random()));

    var r1 = CSNumber.mult(List.det3(o, a2, b1), List.det3(o, a2, b2));
    r1 = CSNumber.sqrt(r1);
    var r2 = CSNumber.mult(List.det3(o, a1, b1), List.det3(o, a1, b2));
    r2 = CSNumber.sqrt(r2);

    var k1 = List.scalmult(r1, a1);
    var k2 = List.scalmult(r2, a2);

    var x = List.add(k1, k2);
    var y = List.sub(k1, k2);

    var t1 = geoOps._helper.ConicBy5(el, a, b, c, d, x);
    var t2 = geoOps._helper.ConicBy5(el, a, b, c, d, y);

    return [t1, t2];
};

geoOps.ConicBy4p1l = {};
geoOps.ConicBy4p1l.kind = "Cs";
geoOps.ConicBy4p1l.signature = ["P", "P", "P", "P", "L"];
geoOps.ConicBy4p1l.updatePosition = function(el) {
    var a = csgeo.csnames[(el.args[0])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var c = csgeo.csnames[(el.args[2])].homog;
    var d = csgeo.csnames[(el.args[3])].homog;

    var l = csgeo.csnames[(el.args[4])].homog;

    var erg = geoOps._helper.ConicBy4p1l(el, a, b, c, d, l);

    el.results = erg;

};


geoOps._helper.ConicBy3p2l = function(a, b, c, g, h) {
    // see http://math.stackexchange.com/a/1187525/35416
    var l = List.cross(a, b);
    var gh = List.cross(g, h);
    var gl = List.cross(g, l);
    var hl = List.cross(h, l);
    var m1 = List.turnIntoCSList([gl, hl, gh]);
    var s1 = List.productVM(c, List.adjoint3(m1));
    var m2 = List.adjoint3(List.turnIntoCSList([
        List.scalmult(s1.value[0], gl),
        List.scalmult(s1.value[1], hl),
        List.scalmult(s1.value[2], gh)
    ]));
    var m3 = List.transpose(m2);
    var mul = CSNumber.mult;
    var aa = List.productMV(m3, a);
    var a1 = aa.value[0];
    var a2 = aa.value[1];
    var bb = List.productMV(m3, b);
    var b1 = bb.value[0];
    var b2 = bb.value[1];
    // assert: aa.value[2] and bb.value[2] are zero

    var a3a = CSNumber.sqrt(mul(a1, a2));
    var b3a = CSNumber.sqrt(mul(b1, b2));
    var signs, res = new Array(4);
    for (signs = 0; signs < 4; ++signs) {
        var sa = ((signs & 1) << 1) - 1;
        var sb = (signs & 2) - 1;
        var a3 = mul(CSNumber.real(sa), a3a);
        var b3 = mul(CSNumber.real(sb), b3a);
        var p1 = det2(a2, a3, b2, b3);
        var p2 = det2(b1, b3, a1, a3);
        var p3 = det2(a1, a2, b1, b2);
        var p4 = CSNumber.add(
            CSNumber.add(
                det2(b1, b2, a1, a2),
                det2(b2, b3, a2, a3)),
            det2(b3, b1, a3, a1));
        var xx = mul(p1, p1);
        var yy = mul(p2, p2);
        var zz = mul(p4, p4);
        var xy = mul(p1, p2);
        var xz = mul(p1, p4);
        var yz = mul(p2, p4);
        xy = CSNumber.sub(xy, mul(CSNumber.real(0.5), mul(p3, p3)));
        var mm = List.turnIntoCSList([
            List.turnIntoCSList([xx, xy, xz]),
            List.turnIntoCSList([xy, yy, yz]),
            List.turnIntoCSList([xz, yz, zz])
        ]);
        mm = List.productMM(m2, List.productMM(mm, m3));
        var vv = List.turnIntoCSList([
            mm.value[0].value[0],
            mm.value[0].value[1],
            mm.value[0].value[2],
            mm.value[1].value[1],
            mm.value[1].value[2],
            mm.value[2].value[2]
        ]);
        res[signs] = vv;
    }
    return res;

    function det2(a, b, c, d) {
        return CSNumber.sub(CSNumber.mult(a, d), CSNumber.mult(b, c));
    }
};

geoOps.ConicBy3p2l = {};
geoOps.ConicBy3p2l.kind = "Cs";
geoOps.ConicBy3p2l.signature = ["P", "P", "P", "L", "L"];
geoOps.ConicBy3p2l.updatePosition = function(el) {
    var a = csgeo.csnames[(el.args[0])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var c = csgeo.csnames[(el.args[2])].homog;
    var g = csgeo.csnames[(el.args[3])].homog;
    var h = csgeo.csnames[(el.args[4])].homog;
    var newVecs = geoOps._helper.ConicBy3p2l(a, b, c, g, h);
    newVecs = tracingSesq(newVecs);
    var res = new Array(4);
    for (var i = 0; i < 4; ++i) {
        var v = newVecs[i].value;
        res[i] = List.turnIntoCSList([
            List.turnIntoCSList([v[0], v[1], v[2]]),
            List.turnIntoCSList([v[1], v[3], v[4]]),
            List.turnIntoCSList([v[2], v[4], v[5]])
        ]);
    }
    el.results = res;
};
geoOps.ConicBy3p2l.stateSize = 48;

geoOps.ConicBy2p3l = {};
geoOps.ConicBy2p3l.kind = "Cs";
geoOps.ConicBy2p3l.signature = ["P", "P", "L", "L", "L"];
geoOps.ConicBy2p3l.updatePosition = function(el) {
    var a = csgeo.csnames[(el.args[0])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var g = csgeo.csnames[(el.args[2])].homog;
    var h = csgeo.csnames[(el.args[3])].homog;
    var l = csgeo.csnames[(el.args[4])].homog;
    var oldVecs = el.tracing;
    var newVecs = geoOps._helper.ConicBy3p2l(g, h, l, a, b);
    newVecs = tracingSesq(newVecs);
    var res = new Array(4);
    for (var i = 0; i < 4; ++i) {
        var v = newVecs[i].value;
        var dual = List.turnIntoCSList([
            List.turnIntoCSList([v[0], v[1], v[2]]),
            List.turnIntoCSList([v[1], v[3], v[4]]),
            List.turnIntoCSList([v[2], v[4], v[5]])
        ]);
        res[i] = List.normalizeMax(List.adjoint3(dual));
    }
    el.results = res;
};
geoOps.ConicBy2p3l.stateSize = 48;

geoOps.ConicBy1p4l = {};
geoOps.ConicBy1p4l.kind = "Cs";
geoOps.ConicBy1p4l.signature = ["P", "L", "L", "L", "L"];
geoOps.ConicBy1p4l.updatePosition = function(el) {
    var p = csgeo.csnames[(el.args[0])].homog;
    var l1 = csgeo.csnames[(el.args[1])].homog;
    var l2 = csgeo.csnames[(el.args[2])].homog;
    var l3 = csgeo.csnames[(el.args[3])].homog;
    var l4 = csgeo.csnames[(el.args[4])].homog;


    var erg = geoOps._helper.ConicBy4p1l(el, l1, l2, l3, l4, p);
    var t1 = erg[0];
    var t2 = erg[1];
    t1 = List.adjoint3(t1);
    t2 = List.adjoint3(t2);

    erg = [t1, t2];
    el.results = erg;

};

geoOps.ConicParabolaPL = {};
geoOps.ConicParabolaPL.kind = "C";
geoOps.ConicParabolaPL.signature = ["P", "L"];
geoOps.ConicParabolaPL.updatePosition = function(el) {
    var F = csgeo.csnames[(el.args[0])].homog.value; // focus point
    var d = csgeo.csnames[(el.args[1])].homog.value; // directrix line
    /* Desired outcome:
     * [[Fz^2*dy^2, -Fz^2*dx*dy, -(Fx*dx^2 + Fx*dy^2 + Fz*dx*dz)*Fz],
     *  [-Fz^2*dx*dy, Fz^2*dx^2, -(Fy*dx^2 + Fy*dy^2 + Fz*dy*dz)*Fz],
     *  [-(Fx*dx^2 + Fx*dy^2 + Fz*dx*dz)*Fz,
     *   -(Fy*dx^2 + Fy*dy^2 + Fz*dy*dz)*Fz,
     *   Fx^2*dx^2 + Fy^2*dx^2 + Fx^2*dy^2 + Fy^2*dy^2 - Fz^2*dz^2]]
     * For derivation see https://github.com/CindyJS/CindyJS/pull/126
     * or http://math.stackexchange.com/a/1557496/35416
     * or https://gist.github.com/gagern/5a1d6d4663c3da6f52dd
     */
    var mult = CSNumber.mult;
    var neg = CSNumber.neg;
    var add = CSNumber.add;
    var sub = CSNumber.sub;
    var Fx = F[0];
    var Fy = F[1];
    var Fz = F[2];
    var dx = d[0];
    var dy = d[1];
    var dz = d[2];
    var Fz2 = mult(Fz, Fz);
    var dx2 = mult(dx, dx);
    var dy2 = mult(dy, dy);
    var Fzdz = mult(Fz, dz);
    var nFz = neg(Fz);
    var dx2pdy2 = add(dx2, dy2);
    var xx = mult(Fz2, dy2);
    var yy = mult(Fz2, dx2);
    var xy = mult(neg(Fz2), mult(dx, dy));
    var xz = mult(nFz, add(mult(Fx, dx2pdy2), mult(Fzdz, dx)));
    var yz = mult(nFz, add(mult(Fy, dx2pdy2), mult(Fzdz, dy)));
    var zz = sub(
        mult(add(mult(Fx, Fx), mult(Fy, Fy)), dx2pdy2),
        mult(Fz2, mult(dz, dz)));
    var m = geoOps._helper.buildConicMatrix([xx, xy, yy, xz, yz, zz]);
    m = List.normalizeMax(m);
    el.matrix = General.withUsage(m, "Conic");
};

geoOps.ConicBy2Foci1P = {};
geoOps.ConicBy2Foci1P.kind = "Cs";
geoOps.ConicBy2Foci1P.signature = ["P", "P", "P"];
geoOps.ConicBy2Foci1P.updatePosition = function(el) {
    var F1 = csgeo.csnames[(el.args[0])].homog;
    var F2 = csgeo.csnames[(el.args[1])].homog;
    var PP = csgeo.csnames[(el.args[2])].homog;

    // i and j
    var II = List.ii;
    var JJ = List.jj;

    var b1 = List.normalizeMax(List.cross(F1, PP));
    var b2 = List.normalizeMax(List.cross(F2, PP));
    var a1 = List.normalizeMax(List.cross(PP, II));
    var a2 = List.normalizeMax(List.cross(PP, JJ));

    var har = geoOps._helper.coHarmonic(a1, a2, b1, b2);
    var e1 = List.normalizeMax(har[0]);
    var e2 = List.normalizeMax(har[1]);

    // lists for transposed
    var lII = List.turnIntoCSList([II]);
    var lJJ = List.turnIntoCSList([JJ]);
    var lF1 = List.turnIntoCSList([F1]);
    var lF2 = List.turnIntoCSList([F2]);

    var co1 = geoOps._helper.conicFromTwoDegenerates(lII, lJJ, lF1, lF2, e1);
    co1 = List.normalizeMax(co1);
    var co2 = geoOps._helper.conicFromTwoDegenerates(lII, lJJ, lF1, lF2, e2);
    co2 = List.normalizeMax(co2);

    // adjoint
    co1 = List.normalizeMax(List.adjoint3(co1));
    co2 = List.normalizeMax(List.adjoint3(co2));

    // return ellipsoid first 
    if (geoOps._helper.getConicType(co1) !== "ellipsoid") {
        var temp = co1;
        co1 = co2;
        co2 = temp;
    }

    // remove hyperbola in limit case
    if (List.almostequals(F1, F2).value) {
        var three = CSNumber.real(3);
        co2 = List.zeromatrix(three, three);
    }

    var erg = [co1, co2];
    el.results = erg;

};

geoOps._helper.coHarmonic = function(a1, a2, b1, b2) {
    var poi = List.realVector([100 * Math.random(), 100 * Math.random(), 1]);

    var ix = List.det3(poi, b1, a1);
    var jx = List.det3(poi, b1, a2);
    var iy = List.det3(poi, b2, a1);
    var jy = List.det3(poi, b2, a2);

    var sqj = CSNumber.sqrt(CSNumber.mult(jy, jx));
    var sqi = CSNumber.sqrt(CSNumber.mult(iy, ix));

    var mui = General.mult(a1, sqj);
    var tauj = General.mult(a2, sqi);

    var out1 = List.add(mui, tauj);
    var out2 = List.sub(mui, tauj);

    return [out1, out2];
};

geoOps.ConicInSquare = {};
geoOps.ConicInSquare.kind = "C";
geoOps.ConicInSquare.signature = ["P", "P", "P", "P"];
geoOps.ConicInSquare.updatePosition = function(el) {
    var A = csgeo.csnames[(el.args[0])].homog;
    var B = csgeo.csnames[(el.args[1])].homog;
    var C = csgeo.csnames[(el.args[2])].homog;
    var D = csgeo.csnames[(el.args[3])].homog;
    // Compute projective transformation from basis to given points (A, B, C, D)
    var m1 = eval_helper.basismap(A, B, C, D);
    // Compute projective transformation from basis to the corners of a square
    // tangent to a unit circle combined with applying this to the unit circle
    // matrix. The pre-computed constant result scaled by 1/16 is created here.
    var o = CSNumber.one;
    var m2Tucm2 = geoOps._helper.buildConicMatrix([o, o, o, CSNumber.real(-3), o, o]);
    // Complete transformation using m1 and m2Tucm2
    var m1a = List.adjoint3(m1);
    var mC = List.productMM(List.productMM(List.transpose(m1a), m2Tucm2), m1a);
    mC = List.normalizeMax(mC);
    el.matrix = General.withUsage(mC, "Conic");
};

geoOps.ConicBy5lines = {};
geoOps.ConicBy5lines.kind = "C";
geoOps.ConicBy5lines.signature = ["L", "L", "L", "L", "L"];
geoOps.ConicBy5lines.updatePosition = function(el) {
    var a = csgeo.csnames[(el.args[0])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var c = csgeo.csnames[(el.args[2])].homog;
    var d = csgeo.csnames[(el.args[3])].homog;
    var p = csgeo.csnames[(el.args[4])].homog;

    var erg_temp = geoOps._helper.ConicBy5(el, a, b, c, d, p);
    var erg = List.adjoint3(erg_temp);
    el.matrix = erg;
    el.matrix = List.normalizeMax(el.matrix);
    el.matrix = General.withUsage(el.matrix, "Conic");
};

geoOps.ConicFromPrincipalDirections = {};
geoOps.ConicFromPrincipalDirections.kind = "C";
geoOps.ConicFromPrincipalDirections.signature = ["P", "P", "P"];
geoOps.ConicFromPrincipalDirections.updatePosition = function(el) {
    var M = csgeo.csnames[(el.args[0])].homog;
    var P1 = csgeo.csnames[(el.args[1])].homog;
    var P2 = csgeo.csnames[(el.args[2])].homog;
    var P3 = geoOps._helper.pointReflection(M, P1);
    var P1M = List.cross(P1, M);
    // Extract perpendicular direction from line P1M
    var perpDirP1M = List.turnIntoCSList([P1M.value[0], P1M.value[1], CSNumber.zero]);
    // A pair of duplicate P1M lines serves as the first degenerate conic
    var vP1M = List.turnIntoCSList([P1M]);
    // The perpendicular lines to P1M through P1 and its antipodal P3 serve as the second
    var vPP1MTP1 = List.turnIntoCSList([List.cross(P1, perpDirP1M)]);
    var vPP1MTP3 = List.turnIntoCSList([List.cross(P3, perpDirP1M)]);
    el.matrix = geoOps._helper.conicFromTwoDegenerates(vP1M, vP1M, vPP1MTP1, vPP1MTP3, P2);
    el.matrix = List.normalizeMax(el.matrix);
    el.matrix = General.withUsage(el.matrix, "Conic");
};

geoOps.CircleBy3 = {};
geoOps.CircleBy3.kind = "C";
geoOps.CircleBy3.signature = ["P", "P", "P"];
geoOps.CircleBy3.updatePosition = function(el) {
    var a = csgeo.csnames[(el.args[0])].homog;
    var b = csgeo.csnames[(el.args[1])].homog;
    var c = List.ii;
    var d = List.jj;
    var p = csgeo.csnames[(el.args[2])].homog;

    var erg = geoOps._helper.ConicBy5(el, a, b, c, d, p);
    el.matrix = List.normalizeMax(erg);
    el.matrix = General.withUsage(el.matrix, "Circle");

};

geoOps.ArcBy3 = {};
geoOps.ArcBy3.kind = "C";
geoOps.ArcBy3.signature = ["P", "P", "P"];
geoOps.ArcBy3.updatePosition = function(el) {
    geoOps.CircleBy3.updatePosition(el);
    el.startPoint = csgeo.csnames[(el.args[0])].homog;
    el.viaPoint = csgeo.csnames[(el.args[1])].homog;
    el.endPoint = csgeo.csnames[(el.args[2])].homog;
};
geoOps.ArcBy3.initialize = function(el) {
    el.startPoint = csgeo.csnames[(el.args[0])].homog;
    el.viaPoint = csgeo.csnames[(el.args[1])].homog;
    el.endPoint = csgeo.csnames[(el.args[2])].homog;
    el.isArc = true;
};

geoOps.PolarOfPoint = {};
geoOps.PolarOfPoint.kind = "L";
geoOps.PolarOfPoint.signature = ["P", "C"];
geoOps.PolarOfPoint.updatePosition = function(el) {
    var point = csgeo.csnames[(el.args[0])];
    var conic = csgeo.csnames[(el.args[1])];
    var homog = General.mult(conic.matrix, point.homog);
    homog = List.normalizeMax(homog);
    el.homog = General.withUsage(homog, "Line");
};

geoOps.PolarOfLine = {};
geoOps.PolarOfLine.kind = "P";
geoOps.PolarOfLine.signature = ["L", "C"];
geoOps.PolarOfLine.updatePosition = function(el) {
    var line = csgeo.csnames[(el.args[0])];
    var conic = csgeo.csnames[(el.args[1])];
    var dualMatrix = List.adjoint3(conic.matrix);
    var homog = General.mult(dualMatrix, line.homog);
    homog = List.normalizeMax(homog);
    el.homog = General.withUsage(homog, "Point");
};


geoOps.angleBisector = {};
geoOps.angleBisector.kind = "Ls";
geoOps.angleBisector.signature = ["L", "L"];
geoOps.angleBisector.updatePosition = function(el) {
    var xx = csgeo.csnames[(el.args[0])];
    var yy = csgeo.csnames[(el.args[1])];

    var poi = List.normalizeMax(List.cross(xx.homog, yy.homog));

    var myI = List.normalizeMax(List.cross(List.ii, poi));
    var myJ = List.normalizeMax(List.cross(List.jj, poi));

    var sqi = CSNumber.sqrt(CSNumber.mult(List.det3(poi, yy.homog, myI), List.det3(poi, xx.homog, myI)));
    var sqj = CSNumber.sqrt(CSNumber.mult(List.det3(poi, yy.homog, myJ), List.det3(poi, xx.homog, myJ)));

    var mui = General.mult(myI, sqj);
    var tauj = General.mult(myJ, sqi);

    var erg1 = List.add(mui, tauj);
    var erg2 = List.sub(mui, tauj);

    var erg1zero = List.abs(erg1).value.real < CSNumber.eps;
    var erg2zero = List.abs(erg2).value.real < CSNumber.eps;

    if (!erg1zero && !erg2zero) {
        erg1 = List.normalizeMax(erg1);
        erg2 = List.normalizeMax(erg2);
    } else if (erg1zero) {
        erg2 = List.normalizeMax(erg2);
    } else if (erg2zero) {
        erg1 = List.normalizeMax(erg1);
    }

    // degenrate case
    if ((List.almostequals(erg1, List.linfty).value && erg2zero) || (List.almostequals(erg2, List.linfty).value && erg1zero)) {
        var mu, tau, mux, tauy;
        if (List.abs(erg1).value.real < List.abs(erg2).value.real) {
            mu = List.det3(poi, yy.homog, erg2);
            tau = List.det3(poi, xx.homog, erg2);

            mux = General.mult(xx.homog, mu);
            tauy = General.mult(yy.homog, tau);

            erg1 = List.add(mux, tauy);

        } else {
            mu = List.det3(poi, yy.homog, erg1);
            tau = List.det3(poi, xx.homog, erg1);

            mux = General.mult(xx.homog, mu);
            tauy = General.mult(yy.homog, tau);

            erg2 = List.add(mux, tauy);
        }
    }

    erg1 = List.normalizeMax(erg1);
    erg2 = List.normalizeMax(erg2);

    el.results = tracing2(erg1, erg2);
};
geoOps.angleBisector.stateSize = tracing2.stateSize;

geoOps._helper.IntersectLC = function(l, c) {

    var N = CSNumber;
    var l1 = List.crossOperator(l);
    var l2 = List.transpose(l1);
    var s = General.mult(l2, General.mult(c, l1));

    var maxidx = List.maxIndex(l, CSNumber.abs2);
    var a11, a12, a21, a22, b;
    if (maxidx === 0) { // x is maximal
        a11 = s.value[1].value[1];
        a12 = s.value[1].value[2];
        a21 = s.value[2].value[1];
        a22 = s.value[2].value[2];
        b = l.value[0];
    } else if (maxidx === 1) { // y is maximal
        a11 = s.value[0].value[0];
        a12 = s.value[0].value[2];
        a21 = s.value[2].value[0];
        a22 = s.value[2].value[2];
        b = l.value[1];
    } else { // z is maximal
        a11 = s.value[0].value[0];
        a12 = s.value[0].value[1];
        a21 = s.value[1].value[0];
        a22 = s.value[1].value[1];
        b = l.value[2];
    }
    var alp = N.div(N.sqrt(N.sub(N.mult(a12, a21), N.mult(a11, a22))), b);
    var erg = List.add(s, List.scalmult(alp, l1));

    maxidx = List.maxIndex(erg, List.abs2);
    var erg1 = erg.value[maxidx];
    erg1 = List.normalizeMax(erg1);
    erg1 = General.withUsage(erg1, "Point");
    erg = List.transpose(erg);
    maxidx = List.maxIndex(erg, List.abs2);
    var erg2 = erg.value[maxidx];
    erg2 = List.normalizeMax(erg2);
    erg2 = General.withUsage(erg2, "Point");
    return [erg1, erg2];
};

geoOps.IntersectLC = {};
geoOps.IntersectLC.kind = "Ps";
geoOps.IntersectLC.signature = ["L", "C"];
geoOps.IntersectLC.updatePosition = function(el) {
    var l = csgeo.csnames[(el.args[0])].homog;
    var c = csgeo.csnames[(el.args[1])].matrix;

    var erg = geoOps._helper.IntersectLC(l, c);
    var erg1 = erg[0];
    var erg2 = erg[1];
    el.results = tracing2(erg1, erg2);
};
geoOps.IntersectLC.stateSize = tracing2.stateSize;

geoOps.OtherIntersectionCL = {};
geoOps.OtherIntersectionCL.kind = "P";
geoOps.OtherIntersectionCL.signature = ["C", "L", "P"];
geoOps.OtherIntersectionCL.updatePosition = function(el) {
    var l = csgeo.csnames[(el.args[1])].homog;
    var c = csgeo.csnames[(el.args[0])].matrix;
    var p = csgeo.csnames[(el.args[2])].homog;

    var erg = geoOps._helper.IntersectLC(l, c);
    var erg1 = erg[0];
    var erg2 = erg[1];
    var d1 = List.projectiveDistMinScal(erg1, p);
    var d2 = List.projectiveDistMinScal(erg2, p);
    if (d1 < d2) {
        el.homog = erg2;
    } else {
        el.homog = erg1;
    }
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Point");

};


geoOps.IntersectCirCir = {};
geoOps.IntersectCirCir.kind = "Ps";
geoOps.IntersectCirCir.signature = ["C", "C"];
geoOps.IntersectCirCir.updatePosition = function(el) {
    var c1 = csgeo.csnames[(el.args[0])].matrix;
    var c2 = csgeo.csnames[(el.args[1])].matrix;

    var ct1 = c2.value[0].value[0];
    var line1 = List.scalmult(ct1, c1.value[2]);
    var ct2 = c1.value[0].value[0];
    var line2 = List.scalmult(ct2, c2.value[2]);
    var ll = List.sub(line1, line2);
    ll = List.turnIntoCSList([
        ll.value[0], ll.value[1], CSNumber.realmult(0.5, ll.value[2])
    ]);
    ll = List.normalizeMax(ll);


    var erg = geoOps._helper.IntersectLC(ll, c1);
    var erg1 = erg[0];
    var erg2 = erg[1];
    el.results = tracing2(erg1, erg2);
};
geoOps.IntersectCirCir.stateSize = tracing2.stateSize;


geoOps.OtherIntersectionCC = {};
geoOps.OtherIntersectionCC.kind = "P";
geoOps.OtherIntersectionCC.signature = ["C", "C", "P"];
geoOps.OtherIntersectionCC.updatePosition = function(el) {
    var c1 = csgeo.csnames[(el.args[0])].matrix;
    var c2 = csgeo.csnames[(el.args[1])].matrix;
    var p = csgeo.csnames[(el.args[2])].homog;

    var ct1 = c2.value[0].value[0];
    var line1 = List.scalmult(ct1, c1.value[2]);
    var ct2 = c1.value[0].value[0];
    var line2 = List.scalmult(ct2, c2.value[2]);
    var ll = List.sub(line1, line2);
    ll = List.turnIntoCSList([
        ll.value[0], ll.value[1], CSNumber.realmult(0.5, ll.value[2])
    ]);
    ll = List.normalizeMax(ll);


    var erg = geoOps._helper.IntersectLC(ll, c1);
    var erg1 = erg[0];
    var erg2 = erg[1];
    var d1 = List.projectiveDistMinScal(erg1, p);
    var d2 = List.projectiveDistMinScal(erg2, p);
    if (d1 < d2) {
        el.homog = erg2;
    } else {
        el.homog = erg1;
    }
    el.homog = List.normalizeMax(el.homog);
    el.homog = General.withUsage(el.homog, "Point");

};


geoOps._helper.IntersectConicConic = function(A, B) {
    var myeps = 1e-24;

    var A1 = A.value[0];
    var A2 = A.value[1];
    var A3 = A.value[2];
    var B1 = B.value[0];
    var B2 = B.value[1];
    var B3 = B.value[2];

    var c3 = List.det3(A1, A2, A3);
    var c2 = CSNumber.add(CSNumber.add(
        List.det3(A1, A2, B3), List.det3(A1, B2, A3)), List.det3(B1, A2, A3));
    var c1 = CSNumber.add(CSNumber.add(
        List.det3(A1, B2, B3), List.det3(B1, A2, B3)), List.det3(B1, B2, A3));
    var c0 = List.det3(B1, B2, B3);
    // det(a*A + b*B) = a^3*c3 + a^2*b*c2 + a*b^2*c1 + b^3*c0 = 0

    var Aabs2 = CSNumber.abs2(c3).value.real;
    var Babs2 = CSNumber.abs2(c0).value.real;
    if (Aabs2 < Babs2) {
        // ensure |c3| > |c0| so if only one is singular, it's B = (0*A + B)
        var tmp = A;
        A = B;
        B = tmp;

        tmp = c0;
        c0 = c3;
        c3 = tmp;

        tmp = c1;
        c1 = c2;
        c2 = tmp;

        tmp = Aabs2;
        Aabs2 = Babs2;
        Babs2 = tmp;
    }

    var CDeg1, CDeg2;
    if (Aabs2 < myeps) { // both are degenerate
        CDeg1 = A;
        CDeg2 = B;
    } else {
        // produce two DISTINCT degenerate Conics
        var sols = CSNumber.solveCubic(c3, c2, c1, c0);
        var d01 = CSNumber.abs2(CSNumber.sub(sols[0], sols[1])).value.real;
        var d02 = CSNumber.abs2(CSNumber.sub(sols[0], sols[2])).value.real;
        var d12 = CSNumber.abs2(CSNumber.sub(sols[1], sols[2])).value.real;
        var sol1, sol2;
        if (d01 > d02) {
            sol1 = sols[1];
            if (d01 > d12) { // d01 > {d02, d12}
                sol2 = sols[0];
            } else { // d12 >= d01 > d02
                sol2 = sols[2];
            }
        } else { // d02 >= d01
            sol1 = sols[2];
            if (d02 > d12) { // d02 >= {d01, d12}
                sol2 = sols[0];
            } else { // d12 >= d02 >= d01
                sol2 = sols[1];
            }
        }
        CDeg1 = List.add(List.scalmult(sol1, A), B);
        CDeg2 = List.add(List.scalmult(sol2, A), B);
    }
    var lines1 = geoOps._helper.splitDegenConic(CDeg1);
    var l11 = lines1[0];
    var l12 = lines1[1];

    var lines2 = geoOps._helper.splitDegenConic(CDeg2);
    var l21 = lines2[0];
    var l22 = lines2[1];

    var p1 = List.cross(l11, l21);
    var p2 = List.cross(l12, l21);
    var p3 = List.cross(l11, l22);
    var p4 = List.cross(l12, l22);

    p1 = List.normalizeMax(p1);
    p2 = List.normalizeMax(p2);
    p3 = List.normalizeMax(p3);
    p4 = List.normalizeMax(p4);

    p1 = General.withUsage(p1, "Point");
    p2 = General.withUsage(p2, "Point");
    p3 = General.withUsage(p3, "Point");
    p4 = General.withUsage(p4, "Point");

    return [p1, p2, p3, p4];
};

geoOps.IntersectConicConic = {};
geoOps.IntersectConicConic.kind = "Ps";
geoOps.IntersectConicConic.signature = ["C", "C"];
geoOps.IntersectConicConic.updatePosition = function(el) {
    var AA = csgeo.csnames[(el.args[0])].matrix;
    var BB = csgeo.csnames[(el.args[1])].matrix;

    var erg = geoOps._helper.IntersectConicConic(AA, BB);
    erg = tracing4(erg[0], erg[1], erg[2], erg[3]);
    el.results = erg;
    //    el.results = List.turnIntoCSList(erg);
};
geoOps.IntersectConicConic.stateSize = tracing4.stateSize;


geoOps.SelectP = {};
geoOps.SelectP.kind = "P";
geoOps.SelectP.signature = ["Ps"];
geoOps.SelectP.initialize = function(el) {
    if (el.index !== undefined)
        return el.index - 1;
    var set = csgeo.csnames[(el.args[0])].results.value;
    var pos = geoOps._helper.initializePoint(el);
    var d1 = List.projectiveDistMinScal(pos, set[0]);
    var best = 0;
    for (var i = 1; i < set.length; ++i) {
        var d2 = List.projectiveDistMinScal(pos, set[i]);
        if (d2 < d1) {
            d1 = d2;
            best = i;
        }
    }
    return best;
};
geoOps.SelectP.updatePosition = function(el) {
    var set = csgeo.csnames[(el.args[0])];
    el.homog = set.results.value[el.param];
};

geoOps.SelectL = {};
geoOps.SelectL.kind = "L";
geoOps.SelectL.signature = ["Ls"];
geoOps.SelectL.updatePosition = function(el) {
    var set = csgeo.csnames[(el.args[0])];
    el.homog = set.results.value[el.index - 1];
    el.homog = General.withUsage(el.homog, "Line");
};

geoOps._helper.moebiusStep = function(a, b, c) {
    var add = CSNumber.add;
    var sub = CSNumber.sub;
    var mult = CSNumber.mult;
    var ax = a.value[0];
    var ay = a.value[1];
    var az = a.value[2];
    var bx = b.value[0];
    var by = b.value[1];
    var bz = b.value[2];
    var cx = c.value[0];
    var cy = c.value[1];
    var cz = c.value[2];
    /*
    Building the matrix [[ax + i*ay, az], [bx + i*by, bz]].transpose()
    using matrices to represent the complex numbers yields this:

        ⎛ ax -ay  bx -by⎞
    m = ⎜ ay  ax  by  bx⎟
        ⎜ az   0  bz   0⎟
        ⎝  0  az   0  bz⎠

    We want to solve that up to a scalar multiple for [cx + i*xy, cz]
    using the same representation.  We avoid inversion and use the 2×2
    adjoint. Since the adjoint of [[a,b],[c,d]] is [[d,-b],[-c,a]] we have

    ⎛ bz   0 -bx  by⎞ ⎛ cx -cy⎞   ⎛ bz*cx - bx*cz -bz*cy + by*cz⎞
    ⎜  0  bz -by -bx⎟ ⎜ cy  cx⎟ = ⎜ bz*cy - by*cz  bz*cx - bx*cz⎟
    ⎜-az   0  ax -ay⎟ ⎜ cz   0⎟   ⎜-az*cx + ax*cz  az*cy - ay*cz⎟
    ⎝  0 -az  ay  ax⎠ ⎝  0  cz⎠   ⎝-az*cy + ay*cz -az*cx + ax*cz⎠

    Let's save the first column of that.
    */
    var d1 = sub(mult(bz, cx), mult(bx, cz));
    var d2 = sub(mult(bz, cy), mult(by, cz));
    var d3 = sub(mult(ax, cz), mult(az, cx));
    var d4 = sub(mult(ay, cz), mult(az, cy));
    /*
    Now we turn that into a diagonal matrix, and multiply m with that.

    ⎛ ax -ay  bx -by⎞ ⎛ d1 -d2   0   0⎞
    ⎜ ay  ax  by  bx⎟ ⎜ d2  d1   0   0⎟ =
    ⎜ az   0  bz   0⎟ ⎜  0   0  d3 -d4⎟
    ⎝  0  az   0  bz⎠ ⎝  0   0  d4  d3⎠
      ⎛ ax*d1 - ay*d2 -ay*d1 - ax*d2  bx*d3 - by*d4 -by*d3 - bx*d4⎞
      ⎜ ay*d1 + ax*d2  ax*d1 - ay*d2  by*d3 + bx*d4  bx*d3 - by*d4⎟
      ⎜         az*d1         -az*d2          bz*d3         -bz*d4⎟
      ⎝         az*d2          az*d1          bz*d4          bz*d3⎠

    We return the first and third column of that. In essence these are
    the real and imaginary parts of the four entries of a 2×2 matrix.
    */
    return [
        sub(mult(ax, d1), mult(ay, d2)),
        add(mult(ay, d1), mult(ax, d2)),
        mult(az, d1),
        mult(az, d2),
        sub(mult(bx, d3), mult(by, d4)),
        add(mult(by, d3), mult(bx, d4)),
        mult(bz, d3),
        mult(bz, d4)
    ];
};

geoOps.TrMoebius = {};
geoOps.TrMoebius.kind = "Mt";
geoOps.TrMoebius.signature = ["P", "P", "P", "P", "P", "P"];
geoOps.TrMoebius.updatePosition = function(el) {
    var neg = CSNumber.neg;
    var A1 = (csgeo.csnames[el.args[0]]).homog;
    var A2 = (csgeo.csnames[el.args[2]]).homog;
    var A3 = (csgeo.csnames[el.args[4]]).homog;
    var A = geoOps._helper.moebiusStep(A1, A2, A3);
    var B1 = (csgeo.csnames[el.args[1]]).homog;
    var B2 = (csgeo.csnames[el.args[3]]).homog;
    var B3 = (csgeo.csnames[el.args[5]]).homog;
    var B = geoOps._helper.moebiusStep(B1, B2, B3);

    /*
    Now we conceptually want B * A.adjoint()

    ⎛ B0 -B1  B4 -B5⎞ ⎛ A6 -A7 -A4  A5⎞   ⎛ ar -ai  br -bi⎞
    ⎜ B1  B0  B5  B4⎟ ⎜ A7  A6 -A5 -A4⎟ = ⎜ ai  ar  bi  br⎟
    ⎜ B2 -B3  B6 -B7⎟ ⎜-A2  A3  A0 -A1⎟   ⎜ cr -ci  dr -di⎟
    ⎝ B3  B2  B7  B6⎠ ⎝-A3 -A2  A1  A0⎠   ⎝ ci  cr  di  dr⎠

    But since we only care about two columns of the result, it's
    enough to use two columns of the adjoint of A, namely the first
    and the third.
    */
    var mB = List.normalizeMax(List.matrix([
        [B[0], neg(B[1]), B[4], neg(B[5])],
        [B[1], B[0], B[5], B[4]],
        [B[2], neg(B[3]), B[6], neg(B[7])],
        [B[3], B[2], B[7], B[6]]
    ]));
    var mAa = List.normalizeMax(List.matrix([
        [A[6], neg(A[4])],
        [A[7], neg(A[5])],
        [neg(A[2]), A[0]],
        [neg(A[3]), A[1]]
    ]));
    var C = List.productMM(mB, mAa);

    // Read from that the (doubly) complex matrix [[a, b], [c, d]]
    var ar = C.value[0].value[0];
    var ai = C.value[1].value[0];
    var br = C.value[0].value[1];
    var bi = C.value[1].value[1];
    var cr = C.value[2].value[0];
    var ci = C.value[3].value[0];
    var dr = C.value[2].value[1];
    var di = C.value[3].value[1];

    /*
    Build two matrices with the interesting property that for pxy = px + i*py
    this essentially encodes a Möbius transformation including division:

                                ⎛Re((a*pxy + b*pz)*conj(c*pxy + d*pz))⎞
    cross(mat1 * p, mat2 * p) = ⎜Im((a*pxy + b*pz)*conj(c*pxy + d*pz))⎟
                                ⎝   (c*pxy + d*pz)*conj(c*pxy + d*pz) ⎠
    */
    el.mat1 = List.normalizeMax(List.matrix([
        [neg(cr), ci, neg(dr)],
        [ci, cr, di],
        [ar, neg(ai), br]
    ]));
    el.mat2 = List.normalizeMax(List.matrix([
        [neg(ci), neg(cr), neg(di)],
        [neg(cr), ci, neg(dr)],
        [ai, ar, bi]
    ]));
};

geoOps.TrMoebiusP = {};
geoOps.TrMoebiusP.kind = "P";
geoOps.TrMoebiusP.signature = ["Mt", "P"];
geoOps.TrMoebiusP.updatePosition = function(el) {
    var t = csgeo.csnames[(el.args[0])];
    var p = csgeo.csnames[(el.args[1])].homog;
    var l1 = List.productMV(t.mat1, p);
    var l2 = List.productMV(t.mat2, p);
    el.homog = List.normalizeMax(List.cross(l1, l2));
    el.homog = General.withUsage(el.homog, "Point");
};

geoOps._helper.TrMoebiusP = function(p, Tr) {
    var l1 = List.productMV(Tr.mat1, p);
    var l2 = List.productMV(Tr.mat2, p);
    return List.normalizeMax(List.cross(l1, l2));
};

geoOps.TrMoebiusL = {};
geoOps.TrMoebiusL.kind = "C";
geoOps.TrMoebiusL.signature = ["Mt", "L"];
geoOps.TrMoebiusL.updatePosition = function(el) {
    var t = csgeo.csnames[(el.args[0])];
    var l = csgeo.csnames[(el.args[1])].homog;

    var getRandLine = function() {
        var rline = List.realVector([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
        return List.normalizeMax(rline);
    };

    var a1 = List.cross(getRandLine(), l);
    var a2 = List.cross(getRandLine(), l);
    var a3 = List.cross(getRandLine(), l);

    var b1 = geoOps._helper.TrMoebiusP(a1, t);
    var b2 = geoOps._helper.TrMoebiusP(a2, t);
    var b3 = geoOps._helper.TrMoebiusP(a3, t);

    el.matrix = List.normalizeMax(geoOps._helper.ConicBy5(null, b1, b2, b3, List.ii, List.jj));
    el.matrix = General.withUsage(el.matrix, "Circle");
};


geoOps.TrMoebiusC = {};
geoOps.TrMoebiusC.kind = "C";
geoOps.TrMoebiusC.signature = ["Mt", "C"];
geoOps.TrMoebiusC.updatePosition = function(el) {
    var t = csgeo.csnames[(el.args[0])];
    var cir = csgeo.csnames[(el.args[1])].matrix;

    if (cir.usage !== "Circle") {
        console.log("applying Moebius transform to conics is not implemented yet");
        var th = CSNumber.real(3);
        el.matrix = List.zeromatrix(th, th);
    } else {
        var getRandLine = function() {
            var rline = List.realVector([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
            return List.normalizeMax(rline);
        };

        var pts1 = geoOps._helper.IntersectLC(getRandLine(), cir);
        var pts2 = geoOps._helper.IntersectLC(getRandLine(), cir);

        var a1 = pts1[0],
            a2 = pts1[1],
            a3 = pts2[1];

        var b1 = geoOps._helper.TrMoebiusP(a1, t);
        var b2 = geoOps._helper.TrMoebiusP(a2, t);
        var b3 = geoOps._helper.TrMoebiusP(a3, t);

        el.matrix = List.normalizeMax(geoOps._helper.ConicBy5(null, b1, b2, b3, List.ii, List.jj));
    }
    el.matrix = General.withUsage(el.matrix, "Circle");
};

geoOps.TrMoebiusArc = {};
geoOps.TrMoebiusArc.kind = "C";
geoOps.TrMoebiusArc.signature = ["Mt", "C"];
geoOps.TrMoebiusArc.updatePosition = function(el) {
    var t = csgeo.csnames[(el.args[0])];
    var Arc = csgeo.csnames[(el.args[1])];

    var a1 = Arc.startPoint;
    var a2 = Arc.viaPoint;
    var a3 = Arc.endPoint;

    var b1 = geoOps._helper.TrMoebiusP(a1, t);
    var b2 = geoOps._helper.TrMoebiusP(a2, t);
    var b3 = geoOps._helper.TrMoebiusP(a3, t);
    el.startPoint = b1;
    el.viaPoint = b2;
    el.endPoint = b3;

    el.isArc = true;
    el.matrix = List.normalizeMax(geoOps._helper.ConicBy5(null, b1, b2, b3, List.ii, List.jj));
    el.matrix = General.withUsage(el.matrix, "Circle");
};

// Produces the transformation matrix and its dual
geoOps._helper.trBuildMatrix = function(el, oneStep) {
    var m0 = oneStep(0);
    var m1 = oneStep(1);
    var m = List.productMM(m1, List.adjoint3(m0));
    el.matrix = List.normalizeMax(m);
    m = List.transpose(List.productMM(m0, List.adjoint3(m1)));
    el.dualMatrix = List.normalizeMax(m);
};

// Define a projective transformation given four points and their images
geoOps.TrProjection = {};
geoOps.TrProjection.kind = "Tr";
geoOps.TrProjection.signature = ["P", "P", "P", "P", "P", "P", "P", "P"];
geoOps.TrProjection.updatePosition = function(el) {
    geoOps._helper.trBuildMatrix(el, function(offset) {
        return eval_helper.basismap(
            csgeo.csnames[el.args[0 + offset]].homog,
            csgeo.csnames[el.args[2 + offset]].homog,
            csgeo.csnames[el.args[4 + offset]].homog,
            csgeo.csnames[el.args[6 + offset]].homog
        );
    });
};

// Define an affine transformation given three points and their images
// see https://github.com/CindyJS/CindyJS/pull/148 and
// https://gist.github.com/elkins0/f5a98a5ae98b8a8c7571
// https://github.com/CindyJS/CindyJS/files/65335/TrAffine.pdf
geoOps.TrAffine = {};
geoOps.TrAffine.kind = "Tr";
geoOps.TrAffine.signature = ["P", "P", "P", "P", "P", "P"];
geoOps.TrAffine.updatePosition = function(el) {
    var mult = CSNumber.mult;
    var sm = List.scalmult;
    var mat = List.turnIntoCSList;
    var t = List.transpose;
    var nm = List.normalizeMax;
    var mm = List.productMM;
    var adj = List.adjoint3;
    // Get the set of points
    var ps1 = mat([
        csgeo.csnames[el.args[0]].homog,
        csgeo.csnames[el.args[2]].homog,
        csgeo.csnames[el.args[4]].homog
    ]);
    // Get the set of thier images
    var ps2 = mat([
        csgeo.csnames[el.args[1]].homog,
        csgeo.csnames[el.args[3]].homog,
        csgeo.csnames[el.args[5]].homog
    ]);
    var ps1t = t(ps1);
    var ps2t = t(ps2);
    var z1 = ps1t.value[2].value;
    var z2 = ps2t.value[2].value;
    var u = [mult(z1[0], z2[2]), mult(z1[1], z2[0]), mult(z1[2], z2[1])];
    var w = adj(ps1t).value;
    el.matrix = nm(mm(ps2t, mat([
        sm(mult(u[0], z2[1]), w[0]),
        sm(mult(u[1], z2[2]), w[1]),
        sm(mult(u[2], z2[0]), w[2])
    ])));
    w = ps1.value;
    el.dualMatrix = nm(mm(adj(ps2), mat([
        sm(mult(z1[2], u[1]), w[0]),
        sm(mult(z1[0], u[2]), w[1]),
        sm(mult(z1[1], u[0]), w[2])
    ])));
};

// Define a similarity transformation given two points and their images
geoOps.TrSimilarity = {};
geoOps.TrSimilarity.kind = "Tr";
geoOps.TrSimilarity.signature = ["P", "P", "P", "P"];
geoOps.TrSimilarity.updatePosition = function(el) {
    geoOps._helper.trBuildMatrix(el, function(offset) {
        var a = csgeo.csnames[el.args[0 + offset]].homog,
            b = csgeo.csnames[el.args[2 + offset]].homog;
        return eval_helper.basismap(a, b, List.ii, List.jj);
    });
};

// Define a translation transformation given one point and its image
geoOps.TrTranslation = {};
geoOps.TrTranslation.kind = "Tr";
geoOps.TrTranslation.signature = ["P", "P"];
geoOps.TrTranslation.updatePosition = function(el) {
    /*
        Build this matrix when a is [aX, aY, aZ] and  b is [bX, bY, bZ]:
            ⎛aZ*bZ   0    aZ*bX-bZ*aX⎞
        m = ⎜  0   aZ*bZ  aZ*bY-bZ*aY⎟
            ⎝  0     0       aZ*bZ   ⎠
    */
    var a = csgeo.csnames[el.args[0]].homog,
        b = csgeo.csnames[el.args[1]].homog,
        c = List.cross(a, b).value,
        n = CSNumber.mult(a.value[2], b.value[2]),
        mat = List.turnIntoCSList,
        neg = CSNumber.neg,
        zero = CSNumber.zero,
        m = mat([
            mat([n, zero, c[1]]),
            mat([zero, n, neg(c[0])]),
            mat([zero, zero, n])
        ]);
    m = List.normalizeMax(m);
    el.matrix = m;
    // Transpose using already normalized values, negate diagonal values
    // Matrix may end up scaled by -1 if n was the max value
    n = neg(m.value[0].value[0]);
    m = mat([
        mat([n, zero, zero]),
        mat([zero, n, zero]),
        mat([m.value[0].value[2], m.value[1].value[2], n])
    ]);
    el.dualMatrix = m;
};

geoOps.TrInverse = {};
geoOps.TrInverse.kind = "Tr";
geoOps.TrInverse.signature = ["Tr"];
geoOps.TrInverse.updatePosition = function(el) {
    var tr = csgeo.csnames[(el.args[0])];
    var m = tr.matrix;
    el.dualMatrix = List.transpose(tr.matrix);
    el.matrix = List.transpose(tr.dualMatrix);
};

// Apply a projective transformation to a conic
geoOps.TransformC = {};
geoOps.TransformC.kind = "C";
geoOps.TransformC.signature = ["Tr", "C"];
geoOps.TransformC.updatePosition = function(el) {
    var d = csgeo.csnames[(el.args[0])].dualMatrix;
    var c = csgeo.csnames[(el.args[1])].matrix;
    var m = List.productMM(List.productMM(d, c), List.transpose(d));
    m = List.normalizeMax(m);
    el.matrix = General.withUsage(m, "Conic");
};


geoOps.TransformArc = {};
geoOps.TransformArc.kind = "C";
geoOps.TransformArc.signature = ["Tr", "C"];
geoOps.TransformArc.updatePosition = function(el) {
    var t = csgeo.csnames[(el.args[0])].matrix;
    var Arc = csgeo.csnames[(el.args[1])];

    var a1 = Arc.startPoint;
    var a2 = Arc.viaPoint;
    var a3 = Arc.endPoint;

    var b1 = List.normalizeMax(List.productMV(t, a1)),
        b2 = List.normalizeMax(List.productMV(t, a2)),
        b3 = List.normalizeMax(List.productMV(t, a3));

    el.startPoint = b1;
    el.viaPoint = b2;
    el.endPoint = b3;

    el.isArc = true;
    el.matrix = List.normalizeMax(geoOps._helper.ConicBy5(null, b1, b2, b3, List.ii, List.jj));
    el.matrix = General.withUsage(el.matrix, "Circle");
};

// Apply a projective transformation to a point
geoOps.TransformP = {};
geoOps.TransformP.kind = "P";
geoOps.TransformP.signature = ["Tr", "P"];
geoOps.TransformP.updatePosition = function(el) {
    var m = csgeo.csnames[(el.args[0])].matrix;
    var p = csgeo.csnames[(el.args[1])].homog;
    el.homog = List.normalizeMax(List.productMV(m, p));
    el.homog = General.withUsage(el.homog, "Point");
};

// Apply a projective transformation to a line
geoOps.TransformL = {};
geoOps.TransformL.kind = "L";
geoOps.TransformL.signature = ["Tr", "L"];
geoOps.TransformL.updatePosition = function(el) {
    var m = csgeo.csnames[(el.args[0])].dualMatrix;
    var l = csgeo.csnames[(el.args[1])].homog;
    el.homog = List.normalizeMax(List.productMV(m, l));
    el.homog = General.withUsage(el.homog, "Line");
};

// Apply a projective transformation to a line segment
geoOps.TransformS = {};
geoOps.TransformS.kind = "S";
geoOps.TransformS.signature = ["Tr", "S"];
geoOps.TransformS.updatePosition = function(el) {
    var tr = csgeo.csnames[(el.args[0])];
    var s = csgeo.csnames[(el.args[1])];
    el.homog = List.normalizeMax(List.productMV(tr.dualMatrix, s.homog));
    el.homog = General.withUsage(el.homog, "Line");
    el.startpos = List.normalizeMax(List.productMV(tr.matrix, s.startpos));
    el.endpos = List.normalizeMax(List.productMV(tr.matrix, s.endpos));
    el.farpoint = List.normalizeMax(List.productMV(tr.matrix, s.farpoint));
    //console.log(niceprint(List.turnIntoCSList([el.homog, el.startpos, el.endpos])));
};

geoOps._helper.pointReflection = function(center, point) {
    // If center is at infinity, the result will be center unless point
    // is also at infinity, then the result is the ideal point [0, 0, 0].
    return List.normalizeMax(List.sub(
        List.scalmult(CSNumber.realmult(2, point.value[2]), center),
        List.scalmult(center.value[2], point)));
};

geoOps._helper.conicOtherIntersection = function(conic, a, b) {
    // With A a point on conic M, find the point on
    // line AB which also lies on that conic.
    // return BMB*A - 2*AMB*B
    var mb = List.productMV(conic, b);
    var bmb = List.scalproduct(b, mb);
    var amb = List.scalproduct(a, mb);
    var amb2 = CSNumber.realmult(-2, amb);
    var bmba = List.scalmult(bmb, a);
    var amb2b = List.scalmult(amb2, b);
    var res = List.add(bmba, amb2b);
    res = List.normalizeMax(res);
    return res;
};

geoOps._helper.initializePoint = function(el) {
    var sx = 0;
    var sy = 0;
    var sz = 0;
    if (el.pos) {
        if (el.pos.ctype === "list" && List.isNumberVector(el.pos)) {
            return el.pos;
        }
        if (el.pos.length === 2) {
            sx = el.pos[0];
            sy = el.pos[1];
            sz = 1;
        }
        if (el.pos.length === 3) {
            sx = el.pos[0];
            sy = el.pos[1];
            sz = el.pos[2];
        }
    }
    var pos = List.turnIntoCSList([
        CSNumber._helper.input(sx),
        CSNumber._helper.input(sy),
        CSNumber._helper.input(sz)
    ]);
    pos = List.normalizeMax(pos);
    return pos;
};


var geoMacros = {};

/* Note: currently the expansion of a macro is simply included in the
 * gslp.  This means that objects from the expansion will currently
 * end up in the allpoints() resp. alllines() results.  It might make
 * sense to actively excude elements from these by setting some flag,
 * but that hasn't been implemented yet.
 */

geoMacros.CircleMFixedr = function(el) {
    el.pinned = true;
    el.type = "CircleMr";
    return [el];
};

geoMacros.CircleByRadius = function(el) {
    el.type = "CircleMr";
    return [el];
};

geoMacros.IntersectionConicLine = function(el) {
    el.args = [el.args[1], el.args[0]];
    el.type = "IntersectLC";
    return [el];
};

geoMacros.IntersectionCircleCircle = function(el) {
    el.type = "IntersectCirCir";
    return [el];
};

geoMacros.IntersectionConicConic = function(el) {
    el.type = "IntersectConicConic";
    return [el];
};

geoMacros.FreePoint = function(el) {
    el.type = "Free";
    return [el];
};

geoMacros.Orthogonal = function(el) {
    el.type = "Perp";
    return [el];
};

geoMacros.Parallel = function(el) {
    el.type = "Para";
    return [el];
};

geoMacros.Pole = function(el) {
    el.type = "PolarOfLine";
    return [el];
};

geoMacros.Polar = function(el) {
    el.type = "PolarOfPoint";
    return [el];
};

geoMacros.Calculation = function(el) {
    console.log("Calculation stripped from construction");
    return [];
};

geoMacros.Arc = function(el) {
    el.type = "ArcBy3";
    return [el];
};

geoMacros.Transform = function(el) {
    var arg = csgeo.csnames[el.args[1]];
    var tr = csgeo.csnames[el.args[0]];
    // workaround for Arcs since we treat them as circles
    var akind = arg.isArc ? "Arc" : arg.kind;

    var map = {
        Tr: "Transform",
        Mt: "TrMoebius"
    };
    var op = map[tr.kind] + akind;
    if (geoOps.hasOwnProperty(op)) {
        el.type = op;
        return [el];
    } else {
        console.log(op + " not implemented yet");
        return [];
    }
};
var geoscripts = {};
var lab = {};

var doPri45 = {};


doPri45.a = [
    [],
    [1 / 5],
    [3 / 40, 9 / 40],
    [44 / 45, -56 / 15, 32 / 9],
    [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
    [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
    [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]
];
doPri45.dt = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
doPri45.b1 = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
doPri45.b2 = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40];
doPri45.size = 7; //is this 5, 6 or 7

var fehlberg78 = {};

fehlberg78.a = [
    [],
    [2 / 27],
    [1 / 36, 1 / 12],
    [1 / 24, 0, 1 / 8],
    [5 / 12, 0, -25 / 16, 25 / 16],
    [1 / 20, 0, 0, 1 / 4, 1 / 5],
    [-25 / 108, 0, 0, 125 / 108, -65 / 27, 125 / 54],
    [31 / 300, 0, 0, 0, 61 / 225, -2 / 9, 13 / 900],
    [2, 0, 0, -53 / 6, 704 / 45, -107 / 9, 67 / 90, 3],
    [-91 / 108, 0, 0, 23 / 108, -976 / 135, 311 / 54, -19 / 60, 17 / 6, -1 / 12],
    [2383 / 4100, 0, 0, -341 / 164, 4496 / 1025, -301 / 82, 2133 / 4100, 45 / 82, 45 / 164, 18 / 41],
    [3 / 205, 0, 0, 0, 0, -6 / 41, -3 / 205, -3 / 41, 3 / 41, 6 / 41, 0],
    [-1777 / 4100, 0, 0, -341 / 164, 4496 / 1025, -289 / 82, 2193 / 4100, 51 / 82, 33 / 164, 12 / 41, 0, 1],
    [0, 0, 0, 0, 0, 34 / 105, 9 / 35, 9 / 35, 9 / 280, 9 / 280, 0, 41 / 840, 41 / 840]
];
fehlberg78.dt = [0, 2 / 27, 1 / 9, 1 / 6, 5 / 12, 1 / 2, 5 / 6, 1 / 6, 2 / 3, 1 / 3, 1, 0, 1];
fehlberg78.b1 = [0, 0, 0, 0, 0, 34 / 105, 9 / 35, 9 / 35, 9 / 280, 9 / 280, 0, 41 / 840, 41 / 840];
fehlberg78.b2 = [41 / 840, 0, 0, 0, 0, 34 / 105, 9 / 35, 9 / 35, 9 / 280, 9 / 280, 41 / 840, 0, 0];
fehlberg78.size = 13;


//var rk = fehlberg78;
var rk = doPri45;
var behaviors;
var masses = [];
var csPhysicsInited = false;

function csreinitphys(behavs) {
    behaviors.forEach(function(beh) {
        var geoname = beh.name;
        labObjects[beh.behavior.type].init(beh.behavior, csgeo.csnames[geoname]);

    });
}


function csinitphys(behavs) {
    csPhysicsInited = (behavs.length !== 0);
    //console.log(csPhysicsInited);

    behaviors = behavs;
    masses = [];


    behaviors.forEach(function(beh) {
            if (beh.name) {
                var geoname = beh.name;
                if (csgeo.csnames[geoname]) {
                    csgeo.csnames[geoname].behavior = beh.behavior;
                    labObjects[beh.behavior.type].init(beh.behavior, csgeo.csnames[geoname]);
                    if (beh.behavior.type === "Mass") {
                        masses.push(csgeo.csnames[geoname]);
                    }


                }
            } else {
                labObjects[beh.behavior.type].init(beh.behavior);
            }
        }


    );

}


lab.tick = function() {

    for (var i = 0; i < labObjects.env.accuracy; i++) {
        lab.tick1(labObjects.env.deltat / labObjects.env.accuracy);
        cs_simulationstep();
    }
};

lab.tick1 = function(deltat) {

    var mydeltat = deltat;


    var proceeded = 0;
    var actualdelta;

    while (deltat > 0 && proceeded < deltat * 0.999 || deltat < 0 && proceeded > deltat * 0.999) {


        actualdelta = lab.oneRKStep(mydeltat);

        proceeded += actualdelta;
        mydeltat = Math.min(actualdelta * 2, deltat - proceeded);
        mydeltat = Math.max(mydeltat, 0.0000000000000001);
        lab.restorePosition();
        lab.doCollisions();
        lab.calculateForces();
        lab.moveToFinalPos();
    }
    return true;
};

lab.restorePosition = function() {
    behaviors.forEach(function(b) {
        var beh = b.behavior;
        labObjects[beh.type].restorePos(beh, rk.size + 2);
    });
    //for (Behavior beh : all) {
    //    if (!beh.getBlock()) {
    //        beh.restorePos(rk.getSize() + 2);
    //    }
    //}
};

lab.doCollisions = function() {
    behaviors.forEach(function(b) {
        var beh = b.behavior;
        labObjects[beh.type].doCollisions(beh);
    });

};

lab.calculateForces = function() {
    behaviors.forEach(function(b) {
        var beh = b.behavior;
        labObjects[beh.type].calculateForces(beh);
    });
    //dispatcher.callScriptsForOccasion(Assignments.OCCASION_STEP);
    //for (Behavior anAll : all) {
    //    if (!anAll.getBlock()) {
    //        anAll.calculateForces();
    //    }
    //}
};
lab.moveToFinalPos = function() {
    behaviors.forEach(function(b) {
        var beh = b.behavior;
        labObjects[beh.type].move(beh);
    });
    //for (Behavior beh : all) {
    //    if (!beh.getBlock()) {
    //        beh.move();
    //    }
    //}
};


lab.oneRKStep = function(mydeltat) {

    var initRKTimeStep = function(deltat) {

        behaviors.forEach(function(b) {
            var beh = b.behavior;
            labObjects[beh.type].initRK(beh, deltat);
            labObjects[beh.type].storePosition(beh);
        });
        //for (Behavior anAll : all) {
        //    if (!anAll.getBlock()) {
        //        anAll.initRK(mydeltat);
        //        anAll.storePosition();
        //    }
        //}
    };

    var setToTimestep = function(j) {
        behaviors.forEach(function(b) {
            var beh = b.behavior;
            labObjects[beh.type].setToTimestep(beh, rk.dt[j]);
        });
        //   for (Behavior anAll : all) {
        //   if (!anAll.getBlock()) {
        //       anAll.setToTimestep(rk.getDt(j));
        //   }
        //}
    };

    var proceedMotion = function(j) {
        behaviors.forEach(function(b) {
            var beh = b.behavior;
            labObjects[beh.type].proceedMotion(beh, rk.dt[j], j, rk.a[j]);
        });
        //for (Behavior anAll : all) {
        //    if (!anAll.getBlock()) {
        //        anAll.proceedMotion(rk.getDt(j), j, rk.getA(j));
        //    }
        //}

    };

    var resetForces = function() {
        behaviors.forEach(function(b) {
            var beh = b.behavior;
            labObjects[beh.type].resetForces(beh);
        });
        //for (Behavior anAll : all) {
        //    if (!anAll.getBlock()) {
        //        anAll.resetForces();
        //    }
        //}
    };

    var calculateDelta = function(j) {
        behaviors.forEach(function(b) {
            var beh = b.behavior;
            labObjects[beh.type].calculateDelta(beh, j);
        });
        //for (Behavior anAll : all) {
        //    if (!anAll.getBlock()) {
        //        anAll.calculateDelta(j);
        //    }
        //}
    };


    var calculateError = function(j) {
        var error = 0;
        behaviors.forEach(function(b) {
            var beh = b.behavior;
            var j = rk.size;
            labObjects[beh.type].proceedMotion(beh, rk.dt[j - 1], j, rk.b1);
            labObjects[beh.type].savePos(beh, j + 1);
            labObjects[beh.type].proceedMotion(beh, rk.dt[j - 1], j, rk.b2);
            labObjects[beh.type].savePos(beh, j + 2);
            error += labObjects[beh.type].sqDist(beh, j + 1, j + 2);

        });

        error = Math.sqrt(error) / mydeltat;
        return error;

        //var error = 0;
        //for (Behavior beh : all) {
        //    if (!beh.getBlock()) {
        //        beh.proceedMotion(rk.getDt(rk.getSize() - 1), rk.getSize(), rk.getB1());
        //        beh.savePos(rk.getSize() + 1);
        //        beh.proceedMotion(rk.getDt(rk.getSize() - 1), rk.getSize(), rk.getB2());
        //        beh.savePos(rk.getSize() + 2);
        //        error += beh.sqDist(rk.getSize() + 1, rk.getSize() + 2);
        //    }
        //}
        //error = Math.sqrt(error) / mydeltat;
        //return error;
    };

    var recallInitialPosition = function(j) {
        behaviors.forEach(function(b) {
            var beh = b.behavior;
            labObjects[beh.type].recallPosition(beh);
        });

        //for (Behavior beh : all) {
        //    if (!beh.getBlock()) {
        //        beh.recallPosition();
        //    }
        //}
    };


    var rksize = rk.size;
    var madeIt = false;
    while (!madeIt) {
        initRKTimeStep(mydeltat);
        for (var j = 0; j < rksize; j++) {
            setToTimestep(j);
            proceedMotion(j);
            resetForces();
            lab.calculateForces();
            calculateDelta(j);

        }
        var error = calculateError(mydeltat);
        //console.log(error);
        //console.log(mydeltat);
        if (error > labObjects.env.errorbound && mydeltat > labObjects.env.lowestdeltat) {
            //          if (error > 0.0001 && mydeltat > 0.0000000001) {
            mydeltat /= labObjects.env.slowdownfactor;
            //            mydeltat /= 4;
            recallInitialPosition();
        } else {

            madeIt = true;
        }

    }


    return mydeltat;
};
var labObjects = {};

/*----------------------------MASS--------------------------*/


labObjects.Mass = {

    init: function(beh, elem) {
        beh.vel = [0, 0, 0]; //TODO: Das wird später mal die Velocity
        beh.pos = [0, 0, 0, 0]; //Position (homogen) 


        beh.el = elem;
        if (typeof(beh.mass) === 'undefined') beh.mass = 1;
        if (typeof(beh.charge) === 'undefined') beh.charge = 0;
        if (typeof(beh.friction) === 'undefined') beh.friction = 0;
        beh.lnfrict = 0;
        if (typeof(beh.limitspeed) === 'undefined') beh.limitspeed = false;
        if (typeof(beh.fixed) === 'undefined') beh.fixed = false;
        if (typeof(beh.radius) === 'undefined') beh.radius = 1;
        beh.internalmove = false;

        beh.fx = 0;
        beh.fy = 0;
        beh.fz = 0;
        beh.vx = beh.vx || 0;
        beh.vy = beh.vy || 0;
        beh.vz = beh.vz || 0;

        beh.mtype = 0; // TODO: Free, Online, OnCircle

        var x = 0;
        var y = 0;
        var z = 0;
        var xo = 0;
        var yo = 0;
        var zo = 0;
        var vxo = 0;
        var vyo = 0;
        var vzo = 0;
        /*  var x,y,z,xo,yo,zo,vxo,vyo,vzo,oldx,oldy,oldz;
        var oldx1,oldy1,oldz1;
        var oldx2,oldy2,oldz2;
        var oldx3,oldy3,oldz3;
        var oldx4,oldy4,oldz4;*/

        beh.env = labObjects.env; //TODO Environment

        //For Runge Kutta
        beh.deltat = 0;
        beh.mx = 0;
        beh.my = 0;
        beh.mz = 0;
        beh.mvx = 0;
        beh.mvy = 0;
        beh.mvz = 0;
        beh.dx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        beh.dy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        beh.dz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        beh.dvx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        beh.dvy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        beh.dvz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        beh.midx = 0;
        beh.midy = 0;
        beh.midz = 0;
        beh.lx = 0;
        beh.ly = 0;
        beh.lz = 0;


    },

    resetForces: function(beh) {
        beh.fx = 0;
        beh.fy = 0;
        beh.fz = 0;

    },

    getBlock: false,

    setToTimestep: function(beh, j, a) {},

    initRK: function(beh, dt) {
        var pt = eval_helper.extractPoint(beh.el.homog);

        beh.x = pt.x;
        beh.y = pt.y;
        beh.z = 0;
        beh.xo = beh.x;
        beh.yo = beh.y;
        beh.zo = beh.z;
        beh.vxo = beh.vx;
        beh.vyo = beh.vy;
        beh.vzo = beh.vz;
        beh.deltat = dt;

        beh.fx = 0;
        beh.fy = 0;
        beh.fz = 0;

        /* TODO Implement this
            if (type === TYPE_POINTONCIRCLE) {
                Vec mid = ((PointOnCircle) associatedPoint.algorithm).getCenter();
                midx = mid.xr / mid.zr;
                midy = mid.yr / mid.zr;
                
            }
        if (type === TYPE_POINTONLINE) {
            Vec line = ((PointOnLine) associatedPoint.algorithm).getLine().coord;
            lx = line.yr;
            ly = -line.xr;
            double n = Math.sqrt(lx * lx + ly * ly);
            lx /= n; //Das ist die normierte Geradenrichtung
            ly /= n;
        } 
        */
    },

    setVelocity: function(beh, vx, vy, vz) {
        if (!vz) vz = 0;
        //if (type === TYPE_FREE) {
        if (true) {
            beh.vx = vx;
            beh.vy = vy;
            beh.vz = vz;
        }

        /* TODO Implement
            if (type === TYPE_POINTONCIRCLE) {
                double x = associatedPoint.coord.xr / associatedPoint.coord.zr;
                double y = associatedPoint.coord.yr / associatedPoint.coord.zr;
                Vec mid = ((PointOnCircle) associatedPoint.algorithm).getCenter();
                double midx = mid.xr / mid.zr;
                double midy = mid.yr / mid.zr;
                double dix = y - midy;  //Steht senkrecht auf Radius
                double diy = -x + midx;
                double n = Math.sqrt(dix * dix + diy * diy);
                dix /= n;
                diy /= n;
                double scal = dix * vx + diy * vy;//Es wird nur die wirsame kraftmomponente berücksichtigt
                    
                    this.vx = dix * scal;
                    this.vy = diy * scal;
            }
        if (type === TYPE_POINTONLINE) {
            Vec line = ((PointOnLine) associatedPoint.algorithm).getLine().coord;
            double lx = line.yr;
            double ly = -line.xr;
            double n = Math.sqrt(lx * lx + ly * ly);
            lx /= n; //Das ist die normierte Geradenrichtung
            ly /= n;
            double scal = lx * vx + ly * vy;//Es wird nur die wirsame kraftmomponente berücksichtigt
                this.vx = lx * scal;
                this.vy = ly * scal;
        }
        */


    },


    move: function(beh) {
        // if (type === TYPE_FREE) {
        if (true) {
            beh.pos = [beh.x, beh.y, 1.0];
            beh.internalmove = true;
            if (!move || !mouse.down || beh.el !== move.mover)
                movepointscr(beh.el, List.realVector(beh.pos), "homog");
            (beh.el).sx = beh.x;
            (beh.el).sy = beh.y;

            beh.internalmove = false;
        }


        /*
         if (kernel.simulation.containsMover(associatedPoint)) {
             //Hier wird "werfen" implementiert
             voldx4 = voldx3;
             voldy4 = voldy3;
             voldx3 = voldx2;
             voldy3 = voldy2;
             voldx2 = voldx1;
             voldy2 = voldy1;
             voldx1 = x;
             voldy1 = y;
             x = associatedPoint.coord.xr / associatedPoint.coord.zr;
             y = associatedPoint.coord.yr / associatedPoint.coord.zr;
             //reset();
             fx = 0;
             fy = 0;
             vx = (x - voldx4) / 2.0;
             vy = (y - voldy4) / 2.0;
             return;
         }
         if (type === TYPE_FREE) {
             pos.assign(x, y, 1.0);
             internalmove = true;
             kernel.construction.simulateMoveUnlessFixedByMouse(associatedPoint, pos);
             internalmove = false;
         }
         if (type === TYPE_POINTONCIRCLE) {
             double dix = y - midy;  //Steht senkrecht auf radius
             double diy = -x + midx;
             double n = Math.sqrt(dix * dix + diy * diy);
             dix /= n;
             diy /= n;
             n = Math.sqrt(vx * vx + vy * vy);
             dix *= n;
             diy *= n;
             double scal = dix * vx + diy * vy;
             if (scal < 0) {
                 vx = -dix;
                 vy = -diy;
             } else {
                 vx = dix;
                 vy = diy;
             }
             pos.assign(x, y, 1.0);
             internalmove = true;
             kernel.construction.simulateMoveUnlessFixedByMouse(associatedPoint, pos);
             internalmove = false;
         }
         if (type === TYPE_POINTONLINE) {
             
             double scal = lx * vx + ly * vy;
             vx = scal * lx;
             vy = scal * ly;
             
             pos.assign(x, y, 1.0);
             internalmove = true;
             kernel.construction.simulateMoveUnlessFixedByMouse(associatedPoint, pos);
             internalmove = false;
         }
         
         */
    },

    proceedMotion: function(beh, dt, i, a) {

        if (!beh.fixed
            //&& !associatedPoint.appearance.isPinned()   //TODO
        ) {

            if (true) {

                beh.x = beh.mx;
                beh.y = beh.my;
                beh.z = beh.mz;
                beh.vx = beh.mvx;
                beh.vy = beh.mvy;
                beh.vz = beh.mvz;
                for (var j = 0; j < i; j++) {
                    beh.x += a[j] * beh.dx[j] * beh.deltat;
                    beh.y += a[j] * beh.dy[j] * beh.deltat;
                    beh.z += a[j] * beh.dz[j] * beh.deltat;
                    beh.vx += a[j] * beh.dvx[j] * beh.deltat;
                    beh.vy += a[j] * beh.dvy[j] * beh.deltat;
                    beh.vz += a[j] * beh.dvz[j] * beh.deltat;
                }
            } else {
                beh.vx = 0;
                beh.vy = 0;
                beh.vz = 0;
            }
        }
    },

    calculateForces: function(beh) {
        var bv = Math.sqrt(beh.vx * beh.vx + beh.vy * beh.vy + beh.vz * beh.vz);
        var bvv = (bv > 0.1 && beh.limitSpeed) ? 0.1 / bv : 1;
        var fri = (1 - beh.env.friction) * bvv;
        beh.lnfrict = -Math.log((1 - beh.friction) * fri);

        //        if (Double.isInfinite(lnfrict)) lnfrict = 10000000000000.0; TODO
        beh.fx += -beh.vx * beh.lnfrict * beh.mass; //Reibung F_R=v*f*m (richtige Formel ?)
        beh.fy += -beh.vy * beh.lnfrict * beh.mass;
        beh.fz += -beh.vz * beh.lnfrict * beh.mass;

    },

    calculateDelta: function(beh, i) {

        //  if (type === TYPE_FREE) {
        if (true) {
            beh.dx[i] = beh.vx; //x'=v
            beh.dy[i] = beh.vy;
            beh.dz[i] = beh.vz;
            beh.dvx[i] = beh.fx / beh.mass; //v'=F/m
            beh.dvy[i] = beh.fy / beh.mass;
            beh.dvz[i] = beh.fz / beh.mass;
        }
        /* TODO Implement
        if (type === TYPE_POINTONCIRCLE) {
            double dix = y - midy;  //Steht senkrecht auf Radius
            double diy = -x + midx;
            double n = Math.sqrt(dix * dix + diy * diy);
            dix /= n;
            diy /= n;
            double scal = dix * fx + diy * fy;//Es wird nur die wirsame kraftmomponente berücksichtigt
                dx[i] = vx;             //x'=v
                dy[i] = vy;
                dvx[i] = dix * scal / mass;       //v'=F/m
                dvy[i] = diy * scal / mass;
        }
        if (type === TYPE_POINTONLINE) {
            double scal = lx * fx + ly * fy;//Es wird nur die wirsame kraftmomponente berücksichtigt
            dx[i] = vx;             //x'=v
            dy[i] = vy;
            dvx[i] = lx * scal / mass;       //v'=F/m
            dvy[i] = ly * scal / mass;
        }
        */


    },

    savePos: function(beh, i) {
        beh.dx[i] = beh.x;
        beh.dy[i] = beh.y;
        beh.dz[i] = beh.z;
        beh.dvx[i] = beh.vx;
        beh.dvy[i] = beh.vy;
        beh.dvz[i] = beh.vz;
    },

    restorePos: function(beh, i) {

        if (!beh.fixed) {
            beh.x = beh.dx[i];
            beh.y = beh.dy[i];
            beh.z = beh.dz[i];
            beh.vx = beh.dvx[i];
            beh.vy = beh.dvy[i];
            beh.vz = beh.dvz[i];
        }
    },


    sqDist: function(beh, i, j) {
        var dist = (beh.dx[i] - beh.dx[j]) * (beh.dx[i] - beh.dx[j]);
        dist += (beh.dy[i] - beh.dy[j]) * (beh.dy[i] - beh.dy[j]);
        dist += (beh.dz[i] - beh.dz[j]) * (beh.dz[i] - beh.dz[j]);
        dist += (beh.dvx[i] - beh.dvx[j]) * (beh.dvx[i] - beh.dvx[j]);
        dist += (beh.dvy[i] - beh.dvy[j]) * (beh.dvy[i] - beh.dvy[j]);
        dist += (beh.dvz[i] - beh.dvz[j]) * (beh.dvz[i] - beh.dvz[j]);
        return dist;
    },

    kineticEnergy: function(beh) {
        var vsq = beh.vx * beh.vx + beh.vy * beh.vy + beh.vz * beh.vz;
        return 0.5 * beh.mass * vsq;
    },

    storePosition: function(beh) {
        beh.mx = beh.x;
        beh.my = beh.y;
        beh.mz = beh.z;
        beh.mvx = beh.vx;
        beh.mvy = beh.vy;
        beh.mvz = beh.vz;
    },

    recallPosition: function(beh) {
        if (!beh.fixed) {
            beh.x = beh.mx;
            beh.y = beh.my;
            beh.z = beh.mz;
            beh.vx = beh.mvx;
            beh.vy = beh.mvy;
            beh.vz = beh.mvz;
        }
    },

    doCollisions: function(beh) {}


};

/*----------------------------SUN--------------------------*/


labObjects.Sun = {

    init: function(beh, elem) {
        beh.vel = [0, 0, 0]; //TODO: Das wird später mal die Velocity
        beh.pos = [0, 0, 0, 0]; //Position (homogen) 

        beh.el = elem;
        if (typeof(beh.mass) === 'undefined') beh.mass = 10;
        if (typeof(beh.friction) === 'undefined') beh.friction = 0;

        beh.charge = 0;
        beh.x = 0;
        beh.y = 0;
        beh.z = 0;

    },

    resetForces: function(beh) {},

    getBlock: false,

    setToTimestep: function(beh, j, a) {},

    initRK: function(beh, dt) {
        var pt = eval_helper.extractPoint(beh.el.homog);

        beh.x = pt.x;
        beh.y = pt.y;
        beh.z = 0;
    },

    setVelocity: function(beh, vx, vy, vz) {},


    move: function(beh) {},

    proceedMotion: function(beh, dt, i, a) {},

    calculateDelta: function(beh, i) {},


    calculateForces: function(beh) {

        var x1 = beh.x;
        var y1 = beh.y;
        var z1 = beh.z;
        for (var i = 0; i < masses.length; i++) {
            var m = masses[i];
            var x2 = m.behavior.x;
            var y2 = m.behavior.y;
            var z2 = m.behavior.z;
            var l = Math.sqrt(
                (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2)
            );
            var fx = (x1 - x2) * beh.mass * m.behavior.mass / (l * l * l);
            var fy = (y1 - y2) * beh.mass * m.behavior.mass / (l * l * l);
            var fz = (z1 - z2) * beh.mass * m.behavior.mass / (l * l * l);
            m.behavior.fx += fx * m.behavior.mass;
            m.behavior.fy += fy * m.behavior.mass;
            m.behavior.fz += fz * m.behavior.mass;


        }


        /*    masses = kernel.simulation.masses;
              double x1 = p1.coord.xr / p1.coord.zr;
              double y1 = p1.coord.yr / p1.coord.zr;
              for (int i = 0; i < masses.size(); i++) {
                  Mass m = ((Mass) masses.elementAt(i));
                  double x2 = m.x;
                  double y2 = m.y;
                  double l = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                  double fx = (x1 - x2) * mass * m.mass / (l * l * l);
                  double fy = (y1 - y2) * mass * m.mass / (l * l * l);
                  m.fx += fx * m.mass;
                  m.fy += fy * m.mass;
              }
              */


    },

    savePos: function(beh, i) {},

    restorePos: function(beh, i) {},


    sqDist: function(beh, i, j) {
        return 0;
    },

    kineticEnergy: function(beh) {},

    storePosition: function(beh) {},

    recallPosition: function(beh) {},

    doCollisions: function(beh) {}


};


/*----------------------------GRAVITY--------------------------*/


labObjects.Gravity = {

    init: function(beh, elem) {
        beh.vel = [0, 0, 0]; //TODO: Das wird später mal die Velocity
        beh.pos = [0, 0, 0, 0]; //Position (homogen) 

        beh.el = elem;
        if (typeof(beh.strength) === 'undefined') beh.strength = 1;

        beh.namea = elem.args[0];
        beh.nameb = elem.args[1];
        beh.ma = csgeo.csnames[beh.namea];
        beh.mb = csgeo.csnames[beh.nameb];

    },

    resetForces: function(beh) {},

    getBlock: false,

    setToTimestep: function(beh, j, a) {},

    initRK: function(beh, dt) {

    },

    setVelocity: function(beh, vx, vy, vz) {},

    move: function(beh) {},

    proceedMotion: function(beh, dt, i, a) {},

    calculateDelta: function(beh, i) {},


    calculateForces: function(beh) {

        var pta = eval_helper.extractPoint(beh.ma.homog);
        var ptb = eval_helper.extractPoint(beh.mb.homog);

        var xa = pta.x;
        var ya = pta.y;
        var xb = ptb.x;
        var yb = ptb.y;

        var fx = (xb - xa) * beh.strength;
        var fy = (yb - ya) * beh.strength;
        var fz = 0;
        for (var i = 0; i < masses.length; i++) {
            var m = masses[i];

            m.behavior.fx += fx * m.behavior.mass;
            m.behavior.fy += fy * m.behavior.mass;
            m.behavior.fz += fz * m.behavior.mass;


        }


    },

    savePos: function(beh, i) {},

    restorePos: function(beh, i) {},


    sqDist: function(beh, i, j) {
        return 0;
    },

    kineticEnergy: function(beh) {},

    storePosition: function(beh) {},

    recallPosition: function(beh) {},

    doCollisions: function(beh) {}


};


/*-------------------------SPRING-----------------------*/
labObjects.Spring = {

    init: function(beh, elem) {

        beh.el = elem;
        if (typeof(beh.strength) === 'undefined') beh.strength = 1;
        if (typeof(beh.amplitude) === 'undefined') beh.amplitude = 0;
        if (typeof(beh.phase) === 'undefined') beh.phase = 0;
        if (typeof(beh.speed) === 'undefined') beh.speed = 1;
        if (typeof(beh.l0) === 'undefined') beh.l0 = 0;
        //0=HOOK, 1=RUBBER, 2=NEWTON, 3=ELECTRO
        if (typeof(beh.stype) === 'undefined') beh.stype = 1;
        if (typeof(beh.readOnInit) === 'undefined') beh.readOnInit = false;

        beh.namea = elem.args[0];
        beh.nameb = elem.args[1];
        beh.ma = csgeo.csnames[beh.namea];
        beh.mb = csgeo.csnames[beh.nameb];
        var pta = eval_helper.extractPoint(beh.ma.homog);
        var ptb = eval_helper.extractPoint(beh.mb.homog);
        if (true) {
            beh.l0 = (Math.sqrt((pta.x - ptb.x) * (pta.x - ptb.x) + (pta.y - ptb.y) * (pta.y - ptb.y)));
        }
        beh.env = labObjects.env; //TODO Environment


    },

    resetForces: function(beh) {},

    getBlock: false,

    setToTimestep: function(beh, j, a) {},

    initRK: function(beh, dt) {},

    setVelocity: function(beh, vx, vy, vz) {},

    move: function(beh) {},

    proceedMotion: function(beh, dt, i, a) {},

    calculateForces: function(beh) {
        var xa, xb, ya, yb;
        if (beh.ma.behavior && (!move || !mouse.down || beh.ma !== move.mover)) {
            xa = beh.ma.behavior.x;
            ya = beh.ma.behavior.y;
        } else {
            var pta = eval_helper.extractPoint(beh.ma.homog);
            xa = pta.x;
            ya = pta.y;
        }
        if (beh.mb.behavior && (!move || !mouse.down || beh.mb !== move.mover)) {
            xb = beh.mb.behavior.x;
            yb = beh.mb.behavior.y;
        } else {
            var ptb = eval_helper.extractPoint(beh.mb.homog);
            xb = ptb.x;
            yb = ptb.y;
        }


        var l = (Math.sqrt((xa - xb) * (xa - xb) + (ya - yb) * (ya - yb)));

        var lact = beh.l0; //TODO Motor
        var mytype = beh.stype;

        if (mytype === 1) {
            lact = 0;
        }

        var factor = 0;

        if (mytype === 2 || mytype === 3) {
            factor = beh.ma.behavior.mass * beh.mb.behavior.mass * beh.strength;
        }

        if (mytype === 2) factor = -factor; //NEWTON

        var fx, fy;
        if (l !== 0.0 && (mytype === 0 || mytype === 1)) {
            fx = -(xa - xb) * beh.strength * (l - lact) / l * beh.env.springstrength;
            fy = -(ya - yb) * beh.strength * (l - lact) / l * beh.env.springstrength;
        } else if (beh.ma.behavior && beh.mb.behavior && l !== 0.0) {
            var l3 = (l * l * l);
            if (mytype === 2 || mytype === 3) { //NEWTON //ELECTRO
                fx = (xa - xb) * factor / l3;
                fy = (ya - yb) * factor / l3;
            }
        } else {
            fx = fy = 0.0;
        }

        //if (a !== null) {
        if (beh.ma.behavior) {
            beh.ma.behavior.fx += fx;
            beh.ma.behavior.fy += fy;
        }
        //if (b !== null) {
        if (beh.mb.behavior) {
            beh.mb.behavior.fx -= fx;
            beh.mb.behavior.fy -= fy;
        }

    },

    calculateDelta: function(beh, i) {},

    savePos: function(beh, i) {},

    restorePos: function(beh, i) {},

    sqDist: function(beh, i, j) {
        return 0;
    },

    kineticEnergy: function(beh) {},

    storePosition: function(beh) {},

    recallPosition: function(beh) {},

    doCollisions: function(beh) {}


};


/*-------------------------Bouncer-----------------------*/
labObjects.det = function(x1, y1, x2, y2, x3, y3) {
    return x2 * y3 - x3 * y2 + x3 * y1 - x1 * y3 + x1 * y2 - x2 * y1;
};


labObjects.Bouncer = {


    init: function(beh, elem) {

        beh.el = elem;
        if (typeof(beh.xdamp) === 'undefined') beh.xdamp = 0;
        if (typeof(beh.ydamp) === 'undefined') beh.ydamp = 0;
        if (typeof(beh.motorchanger) === 'undefined') beh.motorchanger = true;

        beh.namea = elem.args[0];
        beh.nameb = elem.args[1];
        beh.ma = csgeo.csnames[beh.namea];
        beh.mb = csgeo.csnames[beh.nameb];
        var pta = eval_helper.extractPoint(beh.ma.homog);
        var ptb = eval_helper.extractPoint(beh.mb.homog);
        beh.x1o = pta.x * 1.01 - ptb.x * 0.01;
        beh.y1o = pta.y * 1.01 - ptb.y * 0.01;
        beh.x2o = ptb.x * 1.01 - pta.x * 0.01;
        beh.y2o = ptb.y * 1.01 - pta.y * 0.01;

        beh.env = labObjects.env; //TODO Environment


    },

    resetForces: function(beh) {},

    getBlock: false,

    setToTimestep: function(beh, j, a) {},

    initRK: function(beh, dt) {
        beh.deltat = dt;
    },

    setVelocity: function(beh, vx, vy, vz) {},

    move: function(beh) {},

    proceedMotion: function(beh, dt, i, a) {},

    calculateForces: function(beh) {},

    calculateDelta: function(beh, i) {},

    savePos: function(beh, i) {},

    restorePos: function(beh, i) {},

    sqDist: function(beh, i, j) {
        return 0;
    },

    kineticEnergy: function(beh) {},

    storePosition: function(beh) {},

    recallPosition: function(beh) {},

    doCollisions: function(beh) {


        var pta = eval_helper.extractPoint(beh.ma.homog);
        var ptb = eval_helper.extractPoint(beh.mb.homog);
        var x1 = pta.x;
        var y1 = pta.y;
        var x2 = ptb.x;
        var y2 = ptb.y;

        var x1o = beh.x1o;
        var y1o = beh.y1o;
        var x2o = beh.x2o;
        var y2o = beh.y2o;

        var n = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        var nx = (x1 - x2) / n;
        var ny = (y1 - y2) / n;


        for (var i = 0; i < masses.length; i++) {

            var mass = masses[i];

            //a1=x1o+i*y1o
            //b1=x2o+i*y2o
            //c1=mass.xo+i*mass.yo
            //a2=x1+i*y1
            //b2=x2+i*y2
            //Nun berechne (a1*b2-b1*a2+c1*a2-c1*b2)/(a1-b1);
            //Dass ist eine abgefahrene aber effektive Art eine Ähnlichkeitstransformation zu bestimmen

            /*          aa.assign(x1o, y1o).mul(x2, y2);
                        bb.assign(x2o, y2o).mul(x1, y1);
                        aa.sub(bb);
                        bb.assign(mass.xo, mass.yo).mul(x1, y1);
                        aa.add(bb);
                        bb.assign(mass.xo, mass.yo).mul(x2, y2);
                        aa.sub(bb);
                        bb.assign(x1o, y1o).sub(x2o, y2o);
                        aa.div(bb);
            */


            var mxo = mass.behavior.xo;
            var myo = mass.behavior.yo;
            var mx = mass.behavior.x;
            var my = mass.behavior.y;

            var aa = CSNumber.mult(CSNumber.complex(x1o, y1o), CSNumber.complex(x2, y2));
            var bb = CSNumber.mult(CSNumber.complex(x2o, y2o), CSNumber.complex(x1, y1));

            aa = CSNumber.sub(aa, bb);
            bb = CSNumber.mult(CSNumber.complex(mxo, myo), CSNumber.complex(x1, y1));
            aa = CSNumber.add(aa, bb);
            bb = CSNumber.mult(CSNumber.complex(mxo, myo), CSNumber.complex(x2, y2));
            aa = CSNumber.sub(aa, bb);
            bb = CSNumber.sub(CSNumber.complex(x1o, y1o), CSNumber.complex(x2o, y2o));
            aa = CSNumber.div(aa, bb);

            if (labObjects.det(x1, y1, x2, y2, mx, my) * labObjects.det(x1, y1, x2, y2, aa.value.real, aa.value.imag) < 0 &&
                labObjects.det(x1, y1, mx, my, aa.value.real, aa.value.imag) * labObjects.det(x2, y2, mx, my, aa.value.real, aa.value.imag) < 0) {


                // doHitScript(mass);//TODO


                //TODO                if (motorChanger)
                //                    kernel.simulation.motor.dir *= -1;

                var vvx = mass.behavior.mvx + beh.deltat * (-aa.value.real + mass.behavior.xo);
                var vvy = mass.behavior.mvy + beh.deltat * (-aa.value.imag + mass.behavior.yo);

                var ss1 = nx * vvx + ny * vvy;
                var ss2 = ny * vvx - nx * vvy;
                //TODO Nächsten zwei zeilen sind gepfuscht, erhalten aber die Energie

                mass.behavior.x = aa.value.real;
                mass.behavior.y = aa.value.imag;
                mass.behavior.vx = nx * ss1 * (1.0 - beh.xdamp);
                mass.behavior.vy = ny * ss1 * (1.0 - beh.xdamp);
                mass.behavior.vx += -ny * ss2 * (1.0 - beh.ydamp);
                mass.behavior.vy += nx * ss2 * (1.0 - beh.ydamp);

            }
        }
        beh.x1o = x1;
        beh.y1o = y1;
        beh.x2o = x2;
        beh.y2o = y2;
    }


};


/*-------------------------ENVIRONMENT-----------------------*/
labObjects.Environment = {


    init: function(beh) {
        if (typeof(beh.gravity) === 'undefined') beh.gravity = 0;
        if (typeof(beh.friction) === 'undefined') beh.friction = 0;
        if (typeof(beh.springstrength) === 'undefined') beh.springstrength = 1;
        if (typeof(beh.accuracy) === 'undefined') beh.accuracy = 10;
        if (typeof(beh.deltat) === 'undefined') beh.deltat = 0.3;
        if (typeof(beh.charges) === 'undefined') beh.charges = false;
        if (typeof(beh.balls) === 'undefined') beh.balls = false;
        if (typeof(beh.newton) === 'undefined') beh.newton = false;
        if (typeof(beh.ballInteractionBoosting) === 'undefined') beh.ballInteractionBoosting = 1;
        labObjects.env = beh;
        beh.errorbound = 0.001;
        beh.lowestdeltat = 0.0000001;
        beh.slowdownfactor = 2;


    },

    resetForces: function(beh) {},

    getBlock: false,

    setToTimestep: function(beh, j, a) {},

    initRK: function(beh, dt) {},

    setVelocity: function(beh, vx, vy, vz) {},

    move: function(beh) {},

    proceedMotion: function(beh, dt, i, a) {},

    calculateForces: function(beh) {
        var i, m1, x1, y1, j, m2, x2, y2, k, fx, fy, r, l;
        if (beh.newton) {
            for (i = 0; i < masses.length - 1; i++) {
                m1 = masses[i];
                x1 = m1.behavior.x;
                y1 = m1.behavior.y;
                for (j = i + 1; j < masses.length; j++) {

                    m2 = masses[j];
                    x2 = m2.behavior.x;
                    y2 = m2.behavior.y;
                    l = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                    fx = (x1 - x2) * m1.behavior.mass * m2.behavior.mass / (l * l * l);
                    fy = (y1 - y2) * m1.behavior.mass * m2.behavior.mass / (l * l * l);

                    m1.behavior.fx -= fx;
                    m1.behavior.fy -= fy;
                    m2.behavior.fx += fx;
                    m2.behavior.fy += fy;
                }
            }
        }

        if (beh.charges) {
            for (i = 0; i < masses.length - 1; i++) {
                m1 = masses[i];
                x1 = m1.behavior.x;
                y1 = m1.behavior.y;
                for (j = i + 1; j < masses.length; j++) {

                    m2 = masses[j];
                    x2 = m2.behavior.x;
                    y2 = m2.behavior.y;
                    l = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                    fx = (x1 - x2) * m1.behavior.charge * m2.behavior.charge / (l * l * l);
                    fy = (y1 - y2) * m1.behavior.charge * m2.behavior.charge / (l * l * l);

                    m1.behavior.fx += fx;
                    m1.behavior.fy += fy;
                    m2.behavior.fx -= fx;
                    m2.behavior.fy -= fy;
                }
            }
        }

        if (beh.balls) {

            for (i = 0; i < masses.length - 1; i++) {
                m1 = masses[i];
                if (m1.behavior.radius !== 0) {
                    x1 = m1.behavior.x;
                    y1 = m1.behavior.y;
                    for (j = i + 1; j < masses.length; j++) {

                        m2 = masses[j];
                        if (m2.behavior.radius !== 0) {

                            x2 = m2.behavior.x;
                            y2 = m2.behavior.y;

                            r = m1.behavior.radius + m2.behavior.radius;
                            l = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                            fx = 0;
                            fy = 0;

                            if (beh.ballInteractionBoosting === 0) {
                                fx = (x1 - x2) / (l * l * l) * (l > r ? 0 : (l - r) * (l - r));
                                fy = (y1 - y2) / (l * l * l) * (l > r ? 0 : (l - r) * (l - r));
                            } else {
                                if (beh.ballInteractionBoosting === 1) {

                                    fx = (x1 - x2) / (l * l * l * l) * (l > r ? 0 : (l - r) * (l - r));
                                    fy = (y1 - y2) / (l * l * l * l) * (l > r ? 0 : (l - r) * (l - r));
                                } else {
                                    fx = (x1 - x2) / (l * l * l * l * l) * (l > r ? 0 : (l - r) * (l - r));
                                    fy = (y1 - y2) / (l * l * l * l * l) * (l > r ? 0 : (l - r) * (l - r));
                                }
                            }


                            m1.behavior.fx += fx;
                            m1.behavior.fy += fy;
                            m2.behavior.fx -= fx;
                            m2.behavior.fy -= fy;
                        }
                    }
                }
            }
        }


        for (i = 0; i < masses.length; i++) {
            var m = masses[i];

            m.behavior.fx += 0;
            m.behavior.fy += beh.gravity;
            m.behavior.fz += 0;


        }
    },

    calculateDelta: function(beh, i) {},

    savePos: function(beh, i) {},

    restorePos: function(beh, i) {},

    sqDist: function(beh, i, j) {
        return 0;
    },

    kineticEnergy: function(beh) {},

    storePosition: function(beh) {},

    recallPosition: function(beh) {},

    doCollisions: function(beh) {}


};
    return globalInstance;
    }; // end newInstance method

    return createCindy;
    })();
    if (typeof process !== "undefined" &&
        typeof module !== "undefined" &&
        typeof module.exports !== "undefined" &&
        typeof window === "undefined")
        module.exports = createCindy;
//# sourceMappingURL=Cindy.plain.js.map
