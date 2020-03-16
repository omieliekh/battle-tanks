function getClientHeightWidth() {
	var out = {};
	if (document.compatMode=='CSS1Compat' && !window.opera){
		out.w = document.documentElement.clientWidth;
		out.h = document.documentElement.clientHeight;
	} else {
		out.w = document.body.clientWidth;
		out.h = document.body.clientHeight;
	}
	return out;
}

function getRandomInt(min, max)	{
	// ������������� Math.round() ���� ������������� �������������!
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//http://techpatterns.com/downloads/javascript_cookies.php

function setCookie (name, value, expires, path, domain, secure) {
	document.cookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + expires : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
}

function getCookie(name) {
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}

LibCanvas.extract();

var glob = {
		fps: 30, // ���������� ������ � �������
		bs : 45, // ������� ������� - ������������ ���� ����� �������������� ��� �������
		bls : null, // ������ ���� (��������� ����)
		exs : null, // ������ ������ (��������� ����)
		ts : 100, // ������ �������� �������� ��-���������
		bts : 16, // ������ �������� ����
		exts : 64, // ������ �������� ������
		exf : 13, // ���������� ������ ������
		ids : 0,		
		field: [
			[0,6,1,1,1,7,0,1,6,7,8,0,0],
			[1,6,7,6,9,1,1,6,7,1,1,6,7],
			[7,0,8,6,1,1,1,6,7,1,1,0,7],
			[0,1,1,1,0,1,7,0,0,1,9,6,0],
			[1,1,1,8,9,1,6,0,7,1,1,6,7],
			[1,1,1,8,9,1,7,0,7,1,1,0,1],
			[6,1,7,0,1,9,0,6,7,1,1,6,1],
			[1,6,7,8,9,1,7,1,1,6,7,6,0],
			[1,6,0,0,0,0,0,0,0,1,1,1,7],
			[0,0,7,8,0,1,6,1,0,1,1,0,7],
			[1,6,7,8,0,0,0,0,0,1,9,6,0],
			[0,6,7,8,0,1,1,1,0,1,1,6,7],
			[1,0,7,8,9,1,0,1,7,1,1,0,0]
		], //���� ����
		fs :{
			w:null,
			h:null
		}, // ������ ���� (��������� ����)
		fspx :{
			w:null,
			h:null
		}, // ������ ���� � �������� (��������� ����)
		pathArr : null,
		dirs : [
			[{k:-1,m:0}, {k:1,m:0}, {k:0,m:-1}, {k:0,m:1}],
			[{k:-1,m:0}, {k:1,m:0}, {k:0,m:1}, {k:0,m:-1}],
			[{k:-1,m:0}, {k:0,m:-1}, {k:1,m:0}, {k:0,m:1}],
			[{k:-1,m:0}, {k:0,m:-1}, {k:0,m:1}, {k:1,m:0}],
			[{k:-1,m:0}, {k:0,m:1}, {k:1,m:0}, {k:0,m:-1}],
			[{k:-1,m:0}, {k:0,m:1}, {k:0,m:-1}, {k:1,m:0}],
			[{k:1,m:0}, {k:-1,m:0}, {k:0,m:-1}, {k:0,m:1}],
			[{k:1,m:0}, {k:-1,m:0}, {k:0,m:1}, {k:0,m:-1}],
			[{k:1,m:0}, {k:0,m:-1}, {k:-1,m:0}, {k:0,m:1}],
			[{k:1,m:0}, {k:0,m:-1}, {k:0,m:1}, {k:-1,m:0}],
			[{k:1,m:0}, {k:0,m:1}, {k:-1,m:0}, {k:0,m:-1}],
			[{k:1,m:0}, {k:0,m:1}, {k:0,m:-1}, {k:-1,m:0}],
			[{k:0,m:-1}, {k:-1,m:0}, {k:1,m:0}, {k:0,m:1}],
			[{k:0,m:-1}, {k:-1,m:0}, {k:0,m:1}, {k:1,m:0}],
			[{k:0,m:-1}, {k:1,m:0}, {k:-1,m:0}, {k:0,m:1}],
			[{k:0,m:-1}, {k:1,m:0}, {k:0,m:1}, {k:-1,m:0}],
			[{k:0,m:-1}, {k:0,m:1}, {k:-1,m:0}, {k:1,m:0}],
			[{k:0,m:-1}, {k:0,m:1}, {k:1,m:0}, {k:-1,m:0}],
			[{k:0,m:1}, {k:-1,m:0}, {k:1,m:0}, {k:0,m:-1}],
			[{k:0,m:1}, {k:-1,m:0}, {k:0,m:-1}, {k:1,m:0}],
			[{k:0,m:1}, {k:1,m:0}, {k:-1,m:0}, {k:0,m:-1}],
			[{k:0,m:1}, {k:1,m:0}, {k:0,m:-1}, {k:-1,m:0}],
			[{k:0,m:1}, {k:0,m:-1}, {k:-1,m:0}, {k:1,m:0}],
			[{k:0,m:1}, {k:0,m:-1}, {k:1,m:0}, {k:-1,m:0}]
		],
		dirsItemLen : 4,
		dirsLen : 24		
	};
// ��������, ��������� �� ������ ��������� glob �������

/*var cl = getClientHeightWidth();
if (cl.w < cl.h) {
	glob.bs = parseInt((cl.w-15)/13);
} else {
	glob.bs = parseInt((cl.h-15)/13);
}

if (glob.bs < 10) {
	glob.bs = 10;
}else if (glob.bs > 100) {
	glob.bs = 100;
}*/


glob.bls = parseFloat((glob.bs*glob.bts/glob.ts).toFixed(3)); //������ ���� (�� ���� 0.16)
glob.exs = parseFloat((glob.bs*glob.exts/glob.ts).toFixed(3)); //������ ������ (�� ���� 0.64)

glob.fs = {w:glob.field[0].length, h:glob.field.length}; // ������ ���� ������� ���������
glob.fspx = {w:glob.fs.w*glob.bs, h:glob.fs.h*glob.bs}; // ������ ���� � ��������
	
var k,m;
var k_to = glob.field[0].length;
var m_to = glob.field.length;
var gridArr = new Array(k_to);
for (k=0; k<k_to; k++) {
	gridArr[k] = new Array(m_to);
	for (m=0; m<m_to; m++) {
		gridArr[k][m] = new Array();
	}
}
	
var globObj = [];
var fldBricks = [];

var Tanks = {};

atom.dom(function () {
	new Tanks.Controller();
	
	var myCookie = getCookie('myCookie');
	
	if (!myCookie) {
		setCookie('myCookie',1);
		console.log('myCookie is not set');
	} else {
		console.log('myCookie = ' + myCookie);
		setCookie('myCookie', (parseInt(myCookie)+1) );
	}
	
	
});
