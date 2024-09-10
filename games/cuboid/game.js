class Game {
	constructor() {
		[ this.scene, this.renderer ] = new Setup();
		this.sound = new Sound();
		this.camera = new Camera(this.scene);
		this.player = new Player(this.scene);
		this.levels = new Level(this.scene);
		this.inputs = new Inputs();
		this.moves = 0;

		this.levels.loadNext(() => {
			this.player.reset(this.levels.startPos);
		});

		this.player.onMove(() => {
			this.moves++;
			this.sound.play(50, 200 + Math.random() * 20, 0.3);
			const coord = this.player.coordinates();
			if (this.levels.isDeath(coord)) {
				this.playerDeath();
			} else if (this.levels.isWin(coord)) {
				this.playerWin();
			} 
		});

		this.inputs.onKeyDown(() => {
			this.sound.onGesture();
		});

		this.update(0);
	}

	update(time) {
		requestAnimationFrame(this.update.bind(this));

		const delta = time - this.previousTime;
		this.previousTime = time;

		this.player.update(delta, this.inputs);
		TWEEN.update(time);
		this.renderer.render(this.scene, this.camera.obj);
	}

	playerDeath() {
		this.sound.play(600, 100);
		this.player.fall(() => {
			this.inputs.reset();
			this.player.reset(this.levels.startPos);
		});
		this.levels.shakeLevel();
	}

	playerWin() {
		this.sound.plays(150, [ 261, 329, 392, 523 ], 0.4);
		this.player.win(() => {
			this.levels.remove(() => {
				this.levels.loadNext(() => {
					this.inputs.reset();
					this.player.reset(this.levels.startPos);
					if (this.levels.current + 1 <= 12) {
						instructions.innerText = `level: ${this.levels.current+1}/12`;
					} else {
						instructions.innerText = `you beat the game in ${this.moves} moves`;
					}
				});
			});
		});
	}
}

new Game();
