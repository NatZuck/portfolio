import * as THREE from "three";
import Experience from "../experience";
import gsap from "gsap";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.theme = this.experience.theme;
    this.actualTheme = this.theme.theme;

    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.device = this.experience.sizes.device;

    this.roomChildren = {};

    this.width = 0.25;
    this.height = 0.5;
    this.intensity = 1;
    this.firstX = -2;
    this.firstY = 3;
    this.firstZ = -2;

    this.actualPalette = this.greenPalette;

    this.greenColor = 0x00ff04;
    this.redColor = 0xff0000;

    this.greenPalette = {
      first: { r: 0, g: 255, b: 4 },
      second: { r: 240, g: 0, b: 0 },
      third: { r: 0, g: 255, b: 4 },
    };

    this.redPalette = {
      first: { r: 255, g: 0, b: 0 },
      second: { r: 0, g: 0, b: 255 },
      third: { r: 0, g: 50, b: 170 },
    };

    this.obj = {
      colorObj: { r: 0, g: 0, b: 0 },
      intensity: this.intensity,
      position: { x: this.firstX, z: this.firstZ, y: this.firstY },
      width: this.width,
      height: this.height,
    };

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.setDeskLight();
    this.setTurrelLight();
    this.setAnimation();
    this.onMouseMove();
    this.switchTheme();
  }

  setTurrelLight() {
    this.firstX = -0.98;
    this.firstY = 3.5;
    this.firstZ = -2.02;

    // color, intensity, width, height
    this.firstLight = new THREE.RectAreaLight(0x00ff04, 0.05, 0.55, 0.4);
    this.firstLight.position.set(this.firstX, this.firstY, this.firstZ);
    this.firstLight.rotation.y = Math.PI / 4;
    this.firstLight.name = "firstLight";
    this.actualRoom.add(this.firstLight);

    this.secondX = -0.98;
    this.secondY = 3.5;
    this.secondZ = -2.02;

    this.secondLight = new THREE.RectAreaLight(0xf00000, 0.1, 0.3, 0.13);
    this.secondLight.position.set(this.secondX, this.secondY, this.secondZ);
    this.secondLight.rotation.y = Math.PI / 4;
    this.secondLight.name = "secondLight";
    this.actualRoom.add(this.secondLight);

    this.thirdX = -0.98;
    this.thirdY = 3.5;
    this.thirdZ = -2.02;

    this.thirdLight = new THREE.RectAreaLight(0xf0000, 0.15, 0.2, 0.05);
    this.thirdLight.position.set(this.thirdX, this.thirdY, this.thirdZ);
    this.thirdLight.rotation.y = Math.PI / 4;
    this.thirdLight.name = "thirdLight";
    this.actualRoom.add(this.thirdLight);

    this.rectLightHelper = new RectAreaLightHelper(this.firstLight);
  }

  setDeskLight() {
    this.width = 0.8;
    this.height = 0.1;
    this.intensity = 0.01;
    this.deskX = -2.57;
    this.deskY = 2;
    this.deskZ = -0.36;

    this.rectLight = new THREE.RectAreaLight(
      0x00ff04,
      this.intensity,
      this.width,
      this.height
    );
    this.rectLight.position.set(this.deskX, this.deskY, this.deskZ);
    this.rectLight.rotation.y = Math.PI / 4;
    this.rectLight.name = "rectLight";
    this.actualRoom.add(this.rectLight);

    this.rectLightHelper = new RectAreaLightHelper(this.rectLight);
  }

  switchTheme(theme) {
    if (theme === "dark") {
      gsap.to(this.firstLight.color, this.redPalette.first);

      gsap.to(this.secondLight.color, this.redPalette.second);

      gsap.to(this.thirdLight.color, this.redPalette.third);

      gsap.to(this.firstLight, {
        intensity: 0.05,
      });
      gsap.to(this.secondLight, {
        intensity: 0.1,
      });
      gsap.to(this.thirdLight, {
        intensity: 0.025,
      });

      gsap.to(this.rectLight.color, this.redPalette.first);
    } else {
      gsap.to(this.firstLight.color, this.greenPalette.first);

      gsap.to(this.secondLight.color, this.greenPalette.second);

      gsap.to(this.thirdLight.color, this.greenPalette.third);

      gsap.to(this.rectLight.color, this.greenPalette.first);
    }
  }

  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((child) => {
          child.castShadow = true;
          child.receiveShadow = true;
        });
      }

      if (child.name === "plane.002") {
        child.material = new THREE.MeshPhysicalMaterial();
        child.material.emessiveMap = "glow";
        child.material.emessive = new THREE.Color("00FF36");
      }

      if (child.name === "computer") {
        child.children[2].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }

      if (child.name === "stairs") {
        child.scale.set(0, 0, 0);
      }

      child.scale.set(0, 0, 0);

      if (child.name === "cube") {
        child.position.set(0, 0.5, 0);
      }

      this.roomChildren[child.name] = child;
    });

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.4, 0.4, 0.4);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 2;
      this.lerp.target = this.rotation;
    });
  }

  resize() {}

  update() {
    this.lerp.current = gsap.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current * 0.1;

    this.mixer.update(this.time.delta);
  }
}
