import * as m from './keyboardInput.mjs';

describe(`keyboardInput::getKey()`,() => {
	it(`getKey shall not add keys to the keyMap.`, () => {
		const startKeys = m.debug__GetKeyMap();
		const fakeKey = m.getKey('myKey');
		expect(fakeKey).toEqual({pressed:false,held:false,released:false});
		const endKeys = m.debug__GetKeyMap();
		expect(startKeys).toEqual(endKeys);
	});
	it(`getKey shall return accurate key states.`, () => {
		const code = 'aksCode';
		m.test__pressKey({code:code});
		let test = m.getKey(code);
		expect(test).toEqual({pressed:true,held:false,released:false});
		m.flushKeys();
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:true,released:false});
		m.flushKeys();
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:true,released:false});
		m.test__releaseKey({code:code});
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:true,released:false});
		m.flushKeys();
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:false,released:true});
		m.flushKeys();
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:false,released:false});
	});
	it(`shall return copies of the key states`, () => {
		const code = 'copiesCode';
		m.test__pressKey({code:code});
		const test1 = m.getKey(code);
		expect(test1).toEqual({pressed:true,held:false,released:false});
		m.flushKeys();
		const test2 = m.getKey(code);
		expect(test1.pressed===test2.pressed).toBeFalsy();
		expect(test1.held===test2.held).toBeFalsy();
		expect(test1.released===test2.released).toBeTruthy();
	});
	it(`shall skip the held state on frame perfect input..`, () => {
		const code = 'fastCode';
		m.test__pressKey({code:code});
		m.test__releaseKey({code:code});
		let test = m.getKey(code);
		expect(test).toEqual({pressed:true,held:false,released:false});
		m.flushKeys();
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:false,released:true});
		m.flushKeys();
		test = m.getKey(code);
		expect(test).toEqual({pressed:false,held:false,released:false});
	});
});