import React from "react";
import ReactDOM from "react-dom/client";

import * as THREE from "three";

import SceneInit from "./lib/SceneInit";
import css from "./index.css";
import {MTLLoader} from 'three-obj-mtl-loader'
import {OBJLoader} from './lib/OBJLoader';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.scene = new SceneInit(canvas);
    this.init(this.scene);
    this.changeFlowersAmount(document.getElementById("flowers_amount").value);
  }
  init(test) {
    test.initialize();
    test.animate();

    let mtlLoader = new MTLLoader();
    let objLoader = new OBJLoader();

    mtlLoader.load('src/resources/bouquet/paper.mtl', (materials) => {
      materials.preload()
      objLoader.setMaterials(materials)
      objLoader.load('src/resources/bouquet/paper.obj', (object) => {
        test.scene.add(object)
      })
    })
  }
  setSelectedObject(selectedObject) {
    this.scene.setSelectedObject(selectedObject);
  }
  setObjectColor(color) {
    this.scene.setObjectColor(color);
  }
  changeFlowersAmount(amount){
    this.scene.changeFlowersAmount(amount);
  }
  render() {
    let buttons = [
      ["Гербера", "gerbera"],
      ["Роза", "rose"],
      ["Лилия", "lily"],
      ["Хризантема", "chrysantemium"],
    ];  

    return (
    <div id="workspace">
      <div id="panel" className="panel">
        <div id="header">
          <h3>3D Flowers</h3>
        </div>
        <div id="contentWrapper">
          <div id="inputWrapper">
            <input placeholder="" type="text" id="filterInput" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
          </div>
          <div className="buttonsContainer">
            {buttons.map(function(btn, index){
              return (
                <button
                key={index+1}
                id={"btn-"+(index+1)}
                name={btn[1]}
                onClick={
                  (e) => {
                  this.setSelectedObject(e.target.name);}
                }
              >
                {btn[0]}
              </button>
              )
            },this)}
            <input type="range" id="flowers_amount" name="Amount" min="1" max="5" defaultValue={3} 
             onChange={(e)=>this.changeFlowersAmount(e.target.value)}/>
            <label id="amount_value" htmlFor="flowers_amount">{this.defaultValue}</label>

            <select id="colors" onChange={(e)=>this.setObjectColor(e.target.value)}>
              <option value="pink">Pink</option>
              <option value="white">White</option>
            </select>
          </div>
        </div>
      </div>
      <div className="canvasContainer">
        <canvas id="myCanvas" ref={this.canvasRef} />
      </div>
    </div>
    );
  }
}
export default App;
