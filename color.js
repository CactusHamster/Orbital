function byteHex(n) {
	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}
function RGB2Color(r,g,b) {
	return '#' + byteHex(r) + byteHex(g) + byteHex(b);
}
function newSolar(arrayLength=32,phase=0.1) {
	let center = 155;
	let width = 100;
	let ret = []
	let frequency = Math.PI*2/arrayLength;
	for (var i = 0; i < arrayLength; ++i) {
	 let red   = Math.sin(frequency*i+0.0+phase) * width + center;
	 let green = Math.sin(frequency*i+0.3+phase) * width + center;
	 let blue  = Math.sin(frequency*i+0.6+phase) * width + center;
	 ret.push(RGB2Color(red,green,blue))
	}
	return ret
}