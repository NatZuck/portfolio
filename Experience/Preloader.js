import { EventEmitter } from "events";
import Experience from "./experience";
import GSAP from "gsap";
import convert from "./Utils/convertDivsToSpans";

export default class Preloader extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.device = this.sizes.device;

    this.world = this.experience.world;

    this.sizes.on("switchdevice", (device) => {
      this.device = device;
    });

    this.world.on("worldready", () => {
      this.setAssets();
      this.playIntro();
    });
  }

  setAssets() {
    convert(document.querySelector(".intro-text"));
    convert(document.querySelector(".hero-title"));
    convert(document.querySelector(".hero-description"));

    this.room = this.world.room.actualRoom;
    this.roomChildren = this.world.room.roomChildren;
  }

  firstIntro() {
    return new Promise((resolve) => {
      this.timeline = new GSAP.timeline();
      this.timeline
        .to(".toggle-bar, .hero-second-main, .menu-wrapper", {
          display: "none",
          opacity: 0,
        })
        .to(".preloader", {
          delay: 1,
          opacity: 0,
          onComplete: () => {
            document.querySelector(".preloader").classList.add("hidden");
          },
        });
      if (this.device === "desktop") {
        this.timeline
          .to(this.roomChildren.cube.scale, {
            x: 0.75,
            y: 0.75,
            z: 0.75,
            ease: "back.out(2.5)",
            duration: 0.75,
          })
          .to(this.room.position, {
            x: -1.6,
            ease: "power1.out",
            duration: 0.75,
          });
      } else {
        this.timeline
          .to(this.roomChildren.cube.scale, {
            x: 0.7,
            y: 0.7,
            z: 0.7,
            ease: "back.out(2.5)",
            duration: 0.75,
          })
          .to(this.room.position, {
            z: -1.5,
            ease: "power1.out",
            duration: 0.75,
          });
      }

      // Intro animation
      this.timeline.to(".intro-text .animatedis", {
        yPercent: -100,
        stagger: 0.07,
        ease: "back.out(1.5)",
        onComplete: resolve,
      });
    });
  }

  secondIntro() {
    return new Promise((resolve) => {
      this.objectsDuration = 0.2;

      this.secondTimeline = new GSAP.timeline();

      // Intro animation
      if (this.device === "desktop") {
        this.timeline.to(this.roomChildren.cube.scale, {
          x: 0.75,
          y: 0.75,
          z: 0.75,
          // ease: "back.out(2.5)",
        });
      } else {
        this.timeline.to(this.roomChildren.cube.scale, {
          x: 0.7,
          y: 0.7,
          z: 0.7,
          // ease: "back.out(2.5)",
        });
      }

      this.secondTimeline
        .to(".intro-text .animatedis", {
          yPercent: 100,
          stagger: 0.07,
          ease: "back.in(1.5)",
        })
        .to(".hero-animation", {
          opacity: 0,
        });

      this.secondTimeline
        .to(
          this.room.position,
          {
            x: 0,
            y: 0,
            z: 0,
            ease: "power1.out",
          },
          "same"
        )
        .to(
          this.roomChildren.cube.rotation,
          {
            y: Math.PI * (3 / 2) - Math.PI / 4,
            ease: "power1.out",
          },
          "same"
        )
        .to(
          this.roomChildren.cube.position,
          {
            y: 3,
            ease: "power1.out",
          },
          "same"
        )
        .to(
          this.roomChildren.cube.scale,
          {
            x: 3.5,
            y: 3,
            z: 3.5,
            ease: "power1.out",
          },
          "same"
        )
        .to(this.roomChildren.walls.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: "power1.out",
        })
        .to(this.roomChildren.table.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: "power1.out",
          duration: this.objectsDuration,
        })
        .to(this.roomChildren.cube.scale, {
          x: 0,
          y: 0,
          z: 0,
          ease: "power1.out",
        })

        // Intro animation
        .to(
          ".hero-title .animatedis",
          {
            yPercent: -100,
            stagger: 0.07,
            ease: "back.out(1.5)",
          },
          "heroTitle"
        )
        .to(
          ".toggle-bar",
          {
            display: "flex",
            opacity: 1,
            // duration: 1,
          },
          "<0.01"
        )
        .to(
          ".hero-description .animatedis",
          {
            yPercent: -100,
            stagger: 0.07,
            ease: "back.out(1.5)",
          },
          "heroTitle"
        );

      this.secondTimeline
        .to(
          this.roomChildren.bed.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.1"
        )
        .to(
          this.roomChildren.shelves.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.computer.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.1"
        )
        .to(
          this.roomChildren.pen.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.booksNft.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.stereo.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.panels.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.tableLamp.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.chairs.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )

        .to(
          this.roomChildren.porsche.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          this.roomChildren.katana.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: this.objectsDuration,
          },
          "<0.3"
        )
        .to(
          ".menu-wrapper",
          {
            ease: "power1.out",
            opacity: 1,
            display: "block",
            duration: 0.75,
          },
          "<0.5"
        );

      if (this.device === "desktop") {
        this.secondTimeline.to(
          ".hero-second-main",
          {
            opacity: 1,
            // duration: 1,
            display: "block",
          },
          "<0.01"
        );
      }

      this.secondTimeline.to(".hero-animation", {
        opacity: 1,
        onComplete: resolve,
      });
    });
  }

  onScroll(e) {
    if (e.deltaY > 0) {
      this.removeEventListeners();
      this.playSecondIntro();
    }
  }

  onTouch(e) {
    this.initialY = e.touches[0].clientY;
  }

  onTouchMove(e) {
    let currentY = e.touches[0].clientY;
    let difference = this.initialY - currentY;
    if (difference > 0) {
      this.removeEventListeners();
      this.playSecondIntro();
    }
    this.initialY = null;
  }

  removeEventListeners() {
    window.removeEventListener("wheel", this.scrollOnceEvent);
    window.removeEventListener("touchstart", this.touchStart);
    window.removeEventListener("touchmove", this.touchMove);
  }

  async playIntro() {
    this.scaleFlag = true;
    await this.firstIntro();
    this.moveFlag = true;
    this.scrollOnceEvent = this.onScroll.bind(this);
    this.touchStart = this.onTouch.bind(this);
    this.touchMove = this.onTouchMove.bind(this);

    window.addEventListener("wheel", this.scrollOnceEvent);
    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.touchMove);
  }

  async playSecondIntro() {
    this.moveFlag = false;
    await this.secondIntro();
    this.scaleFlag = false;
    this.emit("enablecontrols");
  }

  move() {
    if (this.device === "desktop") {
      this.room.position.set(-1.6, 0, 0);
    } else {
      this.room.position.set(0, 0, -1.5);
    }
  }

  scale() {
    if (this.device === "desktop") {
      this.room.scale.set(0.4, 0.4, 0.4);
    } else {
      this.room.scale.set(0.3, 0.3, 0.3);
    }
  }

  update() {
    if (this.moveFlag) {
      this.move();
    }
    if (this.scaleFlag) {
      this.scale();
    }
  }
}
