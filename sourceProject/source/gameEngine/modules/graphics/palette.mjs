


const htmlPalette = {
	'0':'#333',
	'1':'#555',
	'2':'#666',
	'3':'#777',
	'4':'#888',
	'5':'#999',
	'6':'#aaa',
	'7':'#bbb',
	'8':'#ddd',
	'9':'#fff',
	a:'#009',
	b:'#209',
	c:'#407',
	d:'#505',
	e:'#501',
	f:'#500',
	g:'#420',
	h:'#330',
	i:'#130',
	j:'#031',
	k:'#044',
	l:'#046',
	m:'#04d',
	n:'#51e',
	o:'#70e',
	p:'#90b',
	q:'#a05',
	r:'#930',
	s:'#840',
	t:'#660',
	u:'#360',
	v:'#060',
	w:'#065',
	x:'#058',
	A:'#48f',
	B:'#77f',
	C:'#94f',
	D:'#b4e',
	E:'#c59',
	F:'#d64',
	G:'#c80',
	H:'#ba0',
	I:'#7b0',
	J:'#2b2',
	K:'#2b7',
	L:'#2bc',
	M:'#9cf',
	N:'#aaf',
	O:'#b9f',
	P:'#d9f',
	Q:'#e9d',
	R:'#eaa',
	S:'#eb9',
	T:'#ed8',
	U:'#bd8',
	V:'#9d9',
	W:'#9db',
	X:'#9de',
	y:'#000',
	z:'#f0f',
	Y:'#f00',
	Z:'',
};

//for future use.
const uint8ClampLookup = {
	'0':0x00,
	'1':0x11,
	'2':0x22,
	'3':0x33,
	'4':0x44,
	'5':0x55,
	'6':0x66,
	'7':0x77,
	'8':0x88,
	'9':0x99,
	'a':0xaa,
	'b':0xbb,
	'c':0xcc,
	'd':0xdd,
	'e':0xee,
	'f':0xff,
}


/**
 * @function getColor
 * @memberof module:graphics2d
 * @param {any} char A string or number to indicate where in the palette you will read.
 * @returns the HTML hex code of that color.
 */

export function getColor(char) {
	if (typeof char === 'number') {
		const keys = Object.keys(htmlPalette);
		return htmlPalette[keys[char%keys.length]]
	}
	if (!htmlPalette[char]) {
		return '#f0f';
	}
	return htmlPalette[char];
}