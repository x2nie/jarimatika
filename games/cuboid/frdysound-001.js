class Sound {
	constructor() {
		this._audioCtx = null;
	}

	onGesture() {
		if (this._audioCtx) return;

		let AudioContext = window.AudioContext || window.webkitAudioContext;
		this._audioCtx = new AudioContext(); 
	}

	play(duration, frequency, volume = 1) {
		this._play(duration, frequency, volume, 0);
	}

	plays(duration, frequencies, volume = 1) {
		frequencies.map((f, i) => {
			this._play(duration, f, volume, duration * i);
		});
	}

	_play(duration, frequency, volume, delta) {
		if (!this._audioCtx) return;

		let oscillator = this._audioCtx.createOscillator();
		let gainNode = this._audioCtx.createGain();
		let currentTime = this._audioCtx.currentTime + delta / 1000;
		
		duration = duration / 1000;
		oscillator.frequency.value = frequency; 
		gainNode.gain.setValueAtTime(volume, currentTime);
		gainNode.gain.linearRampToValueAtTime(volume, currentTime + duration * 0.80);
		gainNode.gain.linearRampToValueAtTime(0, currentTime + duration * 1);
		oscillator.connect(gainNode);
		gainNode.connect(this._audioCtx.destination);
		oscillator.type = 'triangle';

		oscillator.start(currentTime);
		oscillator.stop(currentTime + duration);
	}
}
