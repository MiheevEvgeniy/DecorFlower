import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class SceneInit {
  constructor(canvasId) {
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;

    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
  }

  initialize() {
    this.scene = new THREE.Scene(window.innerWidth/3);
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 38;
    this.camera.position.y = 30;
    this.camera.position.x = 38;

    const axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
    

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasId,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth*0.85, window.innerHeight*0.85);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    window.addEventListener('click', event => {
          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(pointer, this.camera);

          const intersects = raycaster.intersectObjects(this.scene.children);
          if (intersects.length > 0)
          {
              const objectName = intersects[0].object.name;
              const obj = this.scene.getObjectByName(objectName);
              this.scene.remove(obj);

              const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
              const boxMaterial = new THREE.MeshNormalMaterial();
              const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
              boxMesh.name = obj.name;
              this.scene.add(boxMesh);
              boxMesh.position.x = obj.position.x;
              boxMesh.position.y = obj.position.y;
              boxMesh.position.z = obj.position.z;
          }
      
    })

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    window.addEventListener('resize', () => this.onWindowResize(), false);
    
    
  }
  changeObject(objectType){
    const obj = this.scene.getObjectByName(this.scene.children[2].name);
    this.scene.remove(obj);
    let shape;
    console.log(objectType);
    if(objectType=="sphere"){
      shape = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshNormalMaterial());
      shape.name = obj.name;
    }else if(objectType=="cone"){
      shape = new THREE.Mesh(new THREE.ConeGeometry(2,3), new THREE.MeshNormalMaterial());
      shape.name = obj.name;
    }else {
      shape = new THREE.Mesh(new THREE.RingGeometry(2,5), new THREE.MeshNormalMaterial());
      shape.name = obj.name;
    }
    this.scene.add(shape);
    shape.position.x = obj.position.x;
    shape.position.y = obj.position.y;
    shape.position.z = obj.position.z;
  }
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
} 

