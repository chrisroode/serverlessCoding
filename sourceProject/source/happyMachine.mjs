


export function happyMachine() {
	const bob = 'happy';
	const joe = 'sad';
	//Funky Comment here
	const cheerUp = (person) => {
		switch (person) {
			case 'bob': return 'Bob is already happy.';
			case 'joe': return 'Yay! you cheered Joe up!';
			default: return `I don't know who that is... :(`;
		}
	}
	return {
		getBob:()=>bob,
		getJoe:()=>joe,
		gravityAcceleration:9.8,
		cheerUp,
	}
}


