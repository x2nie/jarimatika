class Level {
	constructor(scene) {
		this.scene = scene;
		this.geo = new THREE.BoxGeometry(1, 0.25, 1);
		this.matX = new THREE.MeshLambertMaterial({ color: 0xffffff });
		this.matO = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
		this.matZ = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
		this.current = -1;

		this.layer = new THREE.Group();
		this.scene.add(this.layer);
	}

	remove(callback) {
		this.layer.children.map(e => {
			new TWEEN.Tween(e.scale)
				.to({x: 0, y: 0, z: 0}, 300)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.start();
		});
		new TWEEN.Tween({})
			.duration(500)
			.start()
			.onComplete(() => {
				this.layer.remove(...this.layer.children);
				this.layer.scale.set(1, 1, 1);
				callback();
			});
	}

	loadNext(callback) {
		this.current ++;
		this.loadLevel();
		new TWEEN.Tween({})
			.duration(500)
			.start()
			.onComplete(() => callback());
	}

	loadLevel() {
		const level = levels[this.current];
		const offsetX = -level[0].length/2 +0.5;
		const offsetZ =  -level.length/2 +0.5;
		this.layer.position.set(offsetX, 0, offsetZ);

		for (let z = 0; z < level.length; z++) {
			for (let x = 0; x < level[z].length; x++) {
				if (level[z][x] == "@") {
					this.startPos = { x: offsetX + x, z: offsetZ + z };
					this.createTile(this.matX, x, z);
				} else if (level[z][x] == "x") {
					this.createTile(this.matX, x, z);
				} else if (level[z][x] == "o") {
					this.createTile(this.matO, x, z);
				} else if (level[z][x] == "z") {
					this.createTile(this.matZ, x, z);
				}
			}
		}
	}

	shakeLevel() {
		this.layer.children.map(e => {
			new TWEEN.Tween(e.position)
				.to({y: Math.random()/2 - 0.25}, 300)
				.easing(TWEEN.Easing.Quadratic.Out)
				.yoyo(true)
				.repeat(1)
				.start();
			const rand = {y: Math.random()-0.5, x: Math.random()-0.5, z: Math.random()-0.5};
			new TWEEN.Tween(e.rotation)
				.to(rand, 300)
				.easing(TWEEN.Easing.Quadratic.Out)
				.yoyo(true)
				.repeat(1)
				.start();
		});	
	}

	createTile(mat, x, z) {
		const obj = new THREE.Mesh(this.geo, mat);
		obj.position.set(x, -0.125, z);
		obj.scale.set(0, 1, 0);
		obj.receiveShadow = true;
		this.layer.add(obj);
		new TWEEN.Tween(obj.scale)
			.delay((x+z) * 30)
			.to({ x: 1, z: 1 }, 300)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start();
	}

	isDeath({ x1, z1, x2, z2 }) {
		if (x2 !== undefined) {
			const isRed = this.get(x1, z1) === "z" || this.get(x2, z2) === "z";
			const isEmpty = this.get(x1, z1) === "." && this.get(x2, z2) === ".";
			return isRed || isEmpty;
		} 
		return this.get(x1, z1) === "z" || this.get(x1, z1) === ".";
	}

	isWin({ x1, z1, x2, z2 }) {
		if (x2 !== undefined) {
			return this.get(x1, z1) === "o" && this.get(x2, z2) === "o";
		} 

		return false;
	}

	get(x, z) {
		const level = levels[this.current];
		const offsetX = level[0].length/2 - 0.5;
		const offsetZ =  level.length/2 - 0.5;
		x = Math.round(x + offsetX);
		z = Math.round(z + offsetZ);

		if (x < 0 || x >= level[0].length || z < 0 || z >= level.length) {
			return '.';
		}

		return level[z][x];
	}
}