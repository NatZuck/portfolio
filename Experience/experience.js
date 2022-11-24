import * as THREE from "three";

import Sizes from "./Utils/Sizes";

import Camera from "./Utils/Camera";

import Renderer from "./Utils/Renderer";

import Time from "./Utils/Time";

import Resources from "./Utils/Resources";
import assets from "./Utils/assets";
import Theme from "./Theme";
import World from "./World/World";
import Room from "./World/Room";
import Preloader from "./Preloader";

import Controls from "./World/Controls";

export default class Experience {
  static instance;

  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.time = new Time();
    this.sizes = new Sizes();
    this.camera = new Camera();
    this.theme = new Theme();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.world = new World();
    this.preloader = new Preloader();

    this.preloader.on("enablecontrols", () => {
      this.controls = new Controls();
    });

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("update", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.world.resize();
    this.renderer.resize();
  }

  update() {
    this.preloader.update();
    this.camera.update();
    this.renderer.update();
    this.world.update();
    if (this.controls) {
      this.controls.update();
    }
  }
}
