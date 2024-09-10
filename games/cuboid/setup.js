class Setup {
	constructor() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x3498db);
		
		const canvas = document.querySelector("canvas");
		const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
		const size = Math.min(650, window.innerWidth);
		renderer.setSize(size, size);
		renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); 
		renderer.shadowMap.enabled = true;
		//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		
		const ambiantLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambiantLight);
		
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
		directionalLight.position.set(0, 10, 0);
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.left = -6.5;
		directionalLight.shadow.camera.right = 6.5;  
		directionalLight.shadow.camera.bottom = -6.5;  
		directionalLight.shadow.camera.top = 6.5;
		directionalLight.shadow.mapSize.width = 256; 
		directionalLight.shadow.mapSize.height = 256; 
		scene.add(directionalLight);
	
		window.addEventListener("resize", () => {
			const size = Math.min(650, window.innerWidth);
			if (canvas.width !== size) {
				renderer.setSize(size, size);
			}
		}, false);

        document.addEventListener('dblclick', e => e.preventDefault());

		return [ scene, renderer ];
	}
}