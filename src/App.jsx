import React from "react";
import ReactDOM from "react-dom/client";

import * as THREE from "three";

import SceneInit from "./lib/SceneInit";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.scene = new SceneInit(canvas);
    this.init(this.scene);
  }
  init(test) {
    test.initialize();
    test.animate();

    const boxGeometry = new THREE.BoxGeometry(3, 16, 3);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.name = "box";
    test.scene.add(boxMesh);

    const sphere1Geometry = new THREE.SphereGeometry(2);
    const sphere1Material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const sphere1Mesh = new THREE.Mesh(sphere1Geometry, sphere1Material);
    sphere1Mesh.name = "sphere1";
    test.scene.add(sphere1Mesh);

    sphere1Mesh.position.x = 3;
    sphere1Mesh.position.y = 10;
    sphere1Mesh.position.z = 3;

    const sphere2Geometry = new THREE.SphereGeometry(2);
    const sphere2Material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const sphere2Mesh = new THREE.Mesh(sphere2Geometry, sphere2Material);
    sphere2Mesh.name = "sphere2";
    test.scene.add(sphere2Mesh);

    sphere2Mesh.position.x = -3;
    sphere2Mesh.position.y = 10;
    sphere2Mesh.position.z = 3;

    const sphere3Geometry = new THREE.SphereGeometry(2);
    const sphere3Material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
    });
    const sphere3Mesh = new THREE.Mesh(sphere3Geometry, sphere3Material);
    sphere3Mesh.name = "sphere3";
    test.scene.add(sphere3Mesh);

    sphere3Mesh.position.x = 3;
    sphere3Mesh.position.y = 10;
    sphere3Mesh.position.z = -3;
  }
  changeObject(shapeName) {
    this.scene.changeObject(shapeName);
  }
  render() {
    return (
      <div class="canvasContainer">
        <button
          id="btn-sphere"
          name="sphere"
          onClick={(e) => {
            this.changeObject(e.target.name);
          }}
        >
          Шар
        </button>
        <button
          id="btn-cone"
          name="cone"
          onClick={(e) => {
            this.changeObject(e.target.name);
          }}
        >
          Конус
        </button>
        <button
          id="btn-ring"
          name="ring"
          onClick={(e) => {
            this.changeObject(e.target.name);
          }}
        >
          Кольцо
        </button>
        <canvas id="myCanvas" ref={this.canvasRef} />
      </div>
    );
  }
}
export default App;
