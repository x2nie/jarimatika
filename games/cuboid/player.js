
class Player {
	constructor(scene) {
		this.scene = scene;
		this.obj = new THREE.Mesh(
			new THREE.BoxGeometry(1, 2, 1), 
			new THREE.MeshLambertMaterial({ color: 0x555555 })
		);

		this.obj.position.set(0, 0, 0);
		this.obj.scale.set(0, 0, 0);
		this.obj.castShadow = true;
		
		this.pivot = new THREE.Group();
		this.pivot.position.set(0, 1, 0);
		// this.pivot.add(new THREE.AxesHelper(5));
		this.pivot.add(this.obj);
		this.scene.add(this.pivot);
		
		this.position = "|";
		this.canMove = true;
	}

	update(delta, inputs) {
		if (!inputs.anyKey() || !this.canMove) return;

		this.canMove = false;
		this.computePosition();

		if (inputs.left) {
			this.rotateLeft();
		} else if (inputs.right) { 
			this.rotateRight();
		} else if (inputs.up) { 
			this.rotateUp();
		} else if (inputs.down) { 
			this.rotateDown();
		}

		inputs.reset();
	}

	onMove(func) {
		this.onMove = func;
	}

	computePosition() {
		const xAngle = Math.round(this.obj.rotation.x / Math.PI * 10) /10;
		const zAngle = Math.round(this.obj.rotation.z / Math.PI * 10) /10;

		if (xAngle %1 === 0 && zAngle %1 === 0) {
			this.position = "|";
		} else if (Math.abs(zAngle %1) === 0.5) {
			this.position = "_";
		} else if (Math.abs(xAngle %1) === 0.5) {
			this.position = ".";
		}
	}

	rotateLeft() {
		let delta;
		if (this.position === "|") {
			delta = { x: -0.5, y: -1, z: 0 };
		} else if (this.position === "_") {
			delta = { x: -1, y: -0.5, z: 0 };
		} else if (this.position === ".") {
			delta = { x: -0.5, y: -0.5, z: 0 };
		}
		this.setPivot(delta);

		this.tween = new TWEEN.Tween(this.pivot.rotation)
			.to({ z: Math.PI / 2}, 300)
			.easing(TWEEN.Easing.Quadratic.In)
			.onComplete(() => this.finishMove(delta))
			.start();
	}

	rotateRight() {
		let delta;
		if (this.position === "|") {
			delta = { x: 0.5, y: -1, z: 0 };
		} else if (this.position === "_") {
			delta = { x: 1, y: -0.5, z: 0 };
		} else if (this.position === ".") {
			delta = { x: 0.5, y: -0.5, z: 0 };
		}
		this.setPivot(delta);

		this.tween = new TWEEN.Tween(this.pivot.rotation)
			.to({ z: -Math.PI / 2}, 300)
			.easing(TWEEN.Easing.Quadratic.In)
			.onComplete(() => this.finishMove(delta))
			.start();
	}

	rotateUp() {
		let delta;
		if (this.position === "|") {
			delta = { x: 0, y: -1, z: -0.5 };
		} else if (this.position === ".") {
			delta = { x: 0, y: -0.5, z: -1 };
		} else if (this.position === "_") {
			delta = { x: 0, y: -0.5, z: -0.5 };
		}
		this.setPivot(delta);

		this.tween = new TWEEN.Tween(this.pivot.rotation)
			.to({x: -Math.PI / 2}, 300)
			.easing(TWEEN.Easing.Quadratic.In)
			.onComplete(() => this.finishMove(delta))
			.start();
	}

	rotateDown() {
		let delta;
		if (this.position === "|") {
			delta = { x: 0, y: -1, z: 0.5 };
		} else if (this.position === ".") {
			delta = { x: 0, y: -0.5, z: 1 };
		} else if (this.position === "_") {
			delta = { x: 0, y: -0.5, z: 0.5 };
		}
		this.setPivot(delta);

		this.tween = new TWEEN.Tween(this.pivot.rotation)
			.to({x: Math.PI / 2}, 300)
			.easing(TWEEN.Easing.Quadratic.In)
			.onComplete(() => this.finishMove(delta))
			.start();
	}

	setPivot(delta) {
		this.pivot.position.x += delta.x;
		this.pivot.position.y += delta.y;
		this.pivot.position.z += delta.z;
		this.obj.position.x -= delta.x;
		this.obj.position.y -= delta.y;
		this.obj.position.z -= delta.z;
	}

	finishMove(delta) {
		this.resetPivot(delta);
		this.canMove = true;
		this.computePosition();
		this.onMove();
	}

	resetPivot(delta) {
		let posObj = new THREE.Vector3();
		this.obj.localToWorld(posObj);
		let tmp = new THREE.Quaternion();
		this.obj.getWorldQuaternion(tmp);
		let rotObj = new THREE.Euler().setFromQuaternion(tmp);

		this.pivot.position.set(posObj.x, posObj.y, posObj.z);
		this.pivot.rotation.set(0, 0, 0);
		this.obj.rotation.set(rotObj.x, rotObj.y, rotObj.z);

		this.obj.position.x += delta.x;
		this.obj.position.y += delta.y;
		this.obj.position.z += delta.z;
	}

	coordinates() {
		let posObj = new THREE.Vector3();
		this.obj.localToWorld(posObj);
		
		if (this.position === "|") {
			return { x1: posObj.x, z1: posObj.z };
		} else if (this.position === "_") {
			return { 
				x1: posObj.x -0.5, z1: posObj.z,
				x2: posObj.x +0.5, z2: posObj.z,
			};
		} else if (this.position === ".") {
			return { 
				x1: posObj.x, z1: posObj.z -0.5,
				x2: posObj.x, z2: posObj.z +0.5,
			};
		}
	}

	reset({ x, z }) {
		if (this.tween) {
			this.tween.pause();
		}
		
		this.pivot.position.set(x, 1, z);
		this.pivot.rotation.set(0, 0, 0);
		this.obj.position.set(0, 0, 0);
		this.obj.rotation.set(0, 0, 0);
		this.canMove = false;

		this.obj.scale.set(0, 0, 0);
		new TWEEN.Tween(this.obj.scale)
			.to({x: 1, y: 1, z: 1}, 300)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start()
			.onComplete(() => this.canMove = true);
	}

	win(callback) {
		this.canMove = false;
		const scale = new TWEEN.Tween(this.obj.scale)
			.to({x: 0, y: 0, z: 0}, 300)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onComplete(callback);
		const rotate = new TWEEN.Tween(this.pivot.rotation)
			.to({y : Math.PI}, 600)
			.easing(TWEEN.Easing.Quadratic.InOut);
			
		rotate.chain(scale).start();
	}

	fall(callback) {
		this.canMove = false;
		// new TWEEN.Tween(this.obj.position)
		// 	.to({y: -10}, 300)
		// 	.easing(TWEEN.Easing.Quadratic.Out)
		// 	.start()
		// 	.onComplete(callback);	
		new TWEEN.Tween(this.obj.scale)
			.to({x: 0, y: 0, z: 0}, 300)
			.easing(TWEEN.Easing.Quadratic.Out)
			.start()
			.onComplete(callback);	
	}
}