import * as THREE from "three";
import Experience from "../experience";
import Controls from "./Controls";
import Environment from "./Environment";
import Floor from "./Floor";

import Room from "./Room";

import { EventEmitter } from "events";

export default class World extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.theme = this.experience.theme;

    this.resources.on("ready", () => {
      this.environment = new Environment();
      this.room = new Room();
      this.floor = new Floor();
      this.emit("worldready");
    });

    this.theme.on("switch", (theme) => {
      this.setTheme(theme);
    });
  }

  setTheme(theme) {
    if (this.environment) {
      this.environment.switchTheme(theme);
    }

    if (this.room) {
      this.room.switchTheme(theme);
    }
  }

  resize() {}

  update() {
    if (this.room) {
      this.room.update();
    }

    if (this.controls) {
      this.controls.update();
    }
  }
}
