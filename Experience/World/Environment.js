import * as THREE from "three";
import Experience from "../experience";
import gsap from "gsap";
import GUI from "lil-gui";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    this.obj = {
      colorObj: { r: 0, g: 0, b: 0 },
      intensity: 3,
    };

    this.setSunlight();
  }

  setSunlight() {
    this.sunLight = new THREE.DirectionalLight("#fef4c3", 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(-1.5, 7, 3);

    this.scene.add(this.sunLight);

    this.ambientLight = new THREE.AmbientLight("#fef4c3", 1);
    this.scene.add(this.ambientLight);
  }

  switchTheme(theme) {
    if (theme === "dark") {
      gsap.to(this.sunLight.color, {
        r: 0.3411764705882353,
        g: 0.28627450980392155,
        b: 0.7725490196078432,
      });

      gsap.to(this.ambientLight.color, {
        r: 0.3411764705882353,
        g: 0.28627450980392155,
        b: 0.7725490196078432,
      });

      gsap.to(this.sunLight, {
        intensity: 1.2,
      });

      gsap.to(this.ambientLight, {
        intensity: 1.2,
      });
    } else {
      gsap.to(this.sunLight.color, {
        r: 1,
        g: 0.9568627450980393,
        b: 0.7411764705882353,
      });
      gsap.to(this.ambientLight.color, {
        r: 1,
        g: 0.9568627450980393,
        b: 0.7411764705882353,
      });
      gsap.to(this.sunLight, {
        intensity: 3,
      });
      gsap.to(this.ambientLight, {
        intensity: 0.5,
      });
    }
  }

  resize() {}

  update() {}
}
