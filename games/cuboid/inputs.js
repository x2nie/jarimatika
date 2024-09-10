class Inputs {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

		addEventListener("keydown", this.keyDown.bind(this));
		left.addEventListener("pointerdown", this.leftButtonDown.bind(this));
		right.addEventListener("pointerdown", this.rightButtonDown.bind(this));
        up.addEventListener("pointerdown", this.upButtonDown.bind(this));
		down.addEventListener("pointerdown", this.downButtonDown.bind(this));

		if (this.isTouchDevice()) {
			controls.style.display = 'flex';
		}
    }

    onKeyDown(func) {
        this.onKeyDown = func;
    }

    keyDown(e) {
        if (document.activeElement.id === "email") return;

        let keys = [37, 38, 39, 40, 65, 68, 83, 87 ];
        if (!keys.includes(e.keyCode)) return;

        e.preventDefault();
        this.onKeyDown();

        this.left = e.keyCode === 37 || e.keyCode === 65;
        this.right = e.keyCode === 39 || e.keyCode === 68;
        this.up = e.keyCode === 38 || e.keyCode === 87;
        this.down = e.keyCode === 40 || e.keyCode === 83;
    }

    leftButtonDown() {
        this.onKeyDown();
        this.left = true;
    }

    rightButtonDown() {
        this.onKeyDown();
        this.right = true;
    }

    upButtonDown() {
        this.onKeyDown();
        this.up = true;
    }

    downButtonDown() {
        this.onKeyDown();
        this.down = true;
    }

    anyKey() {
        return this.left || this.right || this.up || this.down;
    }

	isTouchDevice() {
		return (('ontouchstart' in window) ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0));
	}

    reset() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false; 
    }
}