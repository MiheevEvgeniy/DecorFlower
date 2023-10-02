import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from './OBJLoader';
import {MTLLoader} from 'three-obj-mtl-loader'


export default class SceneInit {
  constructor(canvasId) {

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    
    this.selectedObject = undefined;
    this.objectColor = undefined;

    this.fov = 80;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    this.ambientLight = undefined;
    this.directionalLight = undefined;
    
    this.width = window.innerWidth*0.8;
    this.height = window.innerHeight*0.8; 
  }

  initialize() {

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.z = 98;
    this.camera.position.y = 120;
    this.camera.position.x = 98;

    const axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
    

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasId,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const intersectionPoint = new THREE.Vector3();
    const planeNormal = new THREE.Vector3();
    const plane = new THREE.Plane();
    this.canvasId.addEventListener('mousemove', event => {
          let canvasBounds = this.renderer.getContext().canvas.getBoundingClientRect();

          pointer.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
          pointer.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
          
        
          planeNormal.copy(this.camera.position).normalize();
          plane.setFromNormalAndCoplanarPoint(planeNormal, this.scene.position);
          raycaster.setFromCamera(pointer, this.camera);
          raycaster.ray.intersectPlane(plane, intersectionPoint);
    })

    this.canvasId.addEventListener('click', event => {

          let canvasBounds = this.renderer.getContext().canvas.getBoundingClientRect();
        
          pointer.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
          pointer.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
          raycaster.setFromCamera(pointer, this.camera);
          const intersects = raycaster.intersectObjects(this.scene.children);

          let objectName;
          if (intersects[0].object.name.startsWith('sphere')) {
            objectName = intersects[0].object.name;            
          }else{
            objectName = intersects[0].object.parent.name;
          }

          const group = this.scene.getObjectByName('spheresGroup');
          let obj = this.scene.getObjectByName(objectName);

          if (intersects.length > 0  && this.selectedObject!=null && this.objectColor!=null) 
          {
            if (obj.parent.name == 'spheresGroup') {
              group.remove(obj);                
            }else{
              group.remove(group.getObjectByName(obj.parent.name));
              obj = obj.parent;
            }

            let mtlLoader = new MTLLoader();
            let objLoader = new OBJLoader();
        
            mtlLoader.load('src/resources/flowers/'+this.selectedObject+'/textures/'+this.objectColor+'.mtl', (material)=> {
              material.preload()
              objLoader.setMaterials(material)
              objLoader.load('src/resources/flowers/'+this.selectedObject+'/model.obj', (object)=> {
                object.name = objectName;
                object.parent = group;
                group.add(object);
                object.position.x = obj.position.x;
                object.position.y = obj.position.y;
                object.position.z = obj.position.z;
              })
            })
          }
          event.stopPropagation();
          event.preventDefault();
    })

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }
  setSelectedObject(selectedObject){
    this.selectedObject = selectedObject;
  }
  setObjectColor(color){
    this.objectColor = color;
  }

  changeFlowersAmount(amount){
    let coords;
    switch (amount) {
      case '1':
        coords = [[0,0]];
        document.getElementById('amount_value').textContent = "Amount "+amount;
        this.createSphere(amount, coords);
        break;
      case '2':
        coords = [[-2,-2], [2,2]];
        document.getElementById('amount_value').textContent = "Amount "+amount;
        this.createSphere(amount, coords);
        break;
      case '3':
        coords = [[0,2], [2,0],[-1,-1]];
        document.getElementById('amount_value').textContent = "Amount "+amount;
        this.createSphere(amount, coords);
        break;
      case '4':
        coords = [[0,3],[3,0],[-3,0],[0,-3]];
        document.getElementById('amount_value').textContent = "Amount "+amount;
        this.createSphere(amount, coords);
        break;
      case '5':
        coords = [[0,3],[3,0],[-3,0],[0,-3],[0,0]];
        document.getElementById('amount_value').textContent = "Amount "+amount;
        this.createSphere(amount, coords);
        break; 
      default:
        break;
    }
  }
  createSphere(amount, coords){
    const obj = this.scene.getObjectByName("spheresGroup");
    if(obj != null){
      this.scene.remove(obj);
    }

    const group = new THREE.Group();
    group.name = 'spheresGroup';
    for (let index = 0; index < amount; index++) {
      const sphereGeometry = new THREE.SphereGeometry(6);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        wireframe: true,
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.name = "sphere"+(index+1);
      group.add(sphereMesh);      
      sphereMesh.position.x = coords[index][0]*5;
      sphereMesh.position.y = 70;
      sphereMesh.position.z = coords[index][1]*5;
    }
    this.scene.add(group);

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
    console.log(1);  
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

  
    this.renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8, true);
  }
  
} 

