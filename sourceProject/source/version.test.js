import { version } from "./version.mjs";

//Smoke tests.
if (version.match(/^[a-z0-9 .]{0,30}$/g) === null) {
	throw new Error(`the version contains invalid characters.  Version is '${version}'`)
}



if (version.trim() !== version) {
	throw new Error(`version.trim() does not equal version.\n        Version is: '${version}'\nTrimmed version is: '${version.trim()}'`)
}

if (version.split(' ').length !== 2) {
	throw new Error(`version.split(' ') does not equal two. Got ${version.split(' ').length}.\nThe version that caused this is '${version}'`)
}

const vArr = version.split(' ');

const validStages = [
	'alpha','beta','release'
];

if (validStages.includes(vArr[0]) === false)  {
	throw new Error(`release stage is not a valid value.  Got '${vArr[0]}'. \nValid release stages are ['${validStages.join(`', '`)}']`)
}

if (vArr[1].split('.').length !== 3) {
	throw new Error(`the version number does not split into three parts deliminated by dots. Got ${vArr[1].split(' ').length}.\nThe version that caused this is '${version}'`)
}

function strictIsNaN(allegedNumber) {
	return (
		Number.isNaN(allegedNumber)
		|| isNaN(allegedNumber)
		|| Array.isArray(allegedNumber)
	);
}


vArr[1].split('.').forEach((e,i) => {
	const numVal = Number(e);
	if (strictIsNaN(numVal) === true) {
		throw new Error(`the version number at index ${i} is not a number.  Version is ${version}`)
	}
	if (numVal < 0) {
		throw new Error(`the version number at index ${i} is out of range.  Version is ${version}`)
	}
});



describe('version', () => {
	it('shall survive the smoke tests',() => {
		//no real testing because the above smoke checks are the real test.
		expect(1).toEqual(1);
	})
})