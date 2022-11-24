import * as THREE from "three";
import Experience from "../experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import all from "gsap/all";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    this.room.children.forEach((child) => {
      if (child.name === "rectLight") {
        this.deskLight = child;
      } else if (child.name === "firstLight") {
        this.firstLight = child;
      } else if (child.name === "secondLight") {
        this.secondLight = child;
      } else if (child.name === "thirdLight") {
        this.thirdLight = child;
      }
    });
    GSAP.registerPlugin(ScrollTrigger);

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setSmoothScroll();
    this.setScrollTrigger();
  }

  assScrollSetUp() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      disableRaf: true,
      customScrollbar: false,
      disableNativeScrollbar: false,
    });

    gsap.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.assScrollSetUp();

    this.checkboxes = document.querySelectorAll(".checkbox");

    this.checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.asscroll.resize({
          height: window.innerHeight,
        });
      });
    });
  }

  setScrollTrigger() {
    this.mm = GSAP.matchMedia();

    // Desktop
    this.mm.add("(min-width: 993px)", () => {
      document.querySelector(".page").style.overflowY = "hidden";
      document.querySelector(".hero-second-main").style.display = "block";
      document.querySelector(".hero-second-main").style.opacity = "1";

      // desktop settings
      this.scaleRatio = 0.4;
      this.room.scale.set(this.scaleRatio, this.scaleRatio, this.scaleRatio);
      this.deskLight.width = 0.8;

      this.room.position.set(0, 0, 0);

      // First movement
      this.firstMoveTimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".first-move",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      this.firstMoveTimeline.to(this.room.position, {
        x: () => {
          return this.sizes.width * 0.0014;
        },
      });

      // Second movement
      this.secondTimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".second-move",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })

        .to(
          this.room.position,
          {
            x: () => {
              return -0.25;
            },

            z: () => {
              return this.sizes.height * 0.004;
            },
          },
          "same"
        )

        .to(
          this.room.scale,
          {
            x: 0.8,
            y: 0.8,
            z: 0.8,
          },
          "same"
        )

        //Lights
        .to(
          this.deskLight,
          {
            width: 0.8 * 2,
            height: 0.1 * 2,
          },
          "same"
        )

        .to(
          this.firstLight,
          {
            width: 0.55 * 2,
            height: 0.4 * 2,
          },
          "same"
        )

        .to(
          this.secondLight,
          {
            width: 0.3 * 2,
            height: 0.13 * 2,
          },
          "same"
        )

        .to(
          this.thirdLight,
          {
            width: 0.2 * 2,
            height: 0.05 * 2,
          },
          "same"
        );

      // Third movement
      this.thirdTimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".third-move",
          // markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
        .to(
          this.camera.orthographicCamera.position,
          {
            y: 3.5,
          },
          "same"
        )

        .to(
          this.room.scale,
          {
            x: 0.6,
            y: 0.6,
            z: 0.6,
          },
          "same"
        );

      this.stairsAnimationFunction();
      // this.languagesAnimationFunction();
    });

    // Mobile
    this.mm.add("(max-width: 992px)", () => {
      document.querySelector(".hero-second-main").style.display = "none";
      document.querySelector(".page").style.overflowY = "auto";

      // mobile settings
      this.scaleRatio = 0.3;
      this.mobileScaleSecondRatio = 1.5;
      this.room.position.set(0, 0, 0);
      this.room.scale.set(this.scaleRatio, this.scaleRatio, this.scaleRatio);
      this.deskLight.width = 0.65;

      // First movement
      this.firstMoveTimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".first-move",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      this.firstMoveTimeline.to(this.room.scale, {
        x: this.scaleRatio + 0.025,
        y: this.scaleRatio + 0.025,
        z: this.scaleRatio + 0.025,
      });

      // Second movement
      this.secondTimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".second-move",
          // markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })

        .to(
          this.room.position,
          {
            x: () => {
              return 0.75;
            },
          },
          "same"
        )

        .to(
          this.room.scale,
          {
            x: 0.325 * this.mobileScaleSecondRatio,
            y: 0.325 * this.mobileScaleSecondRatio,
            z: 0.325 * this.mobileScaleSecondRatio,
          },
          "same"
        )

        //Lights
        .to(
          this.deskLight,
          {
            width: 0.8 * this.mobileScaleSecondRatio,
            height: 0.1 * this.mobileScaleSecondRatio,
          },
          "same"
        )

        .to(
          this.firstLight,
          {
            width: 0.55 * this.mobileScaleSecondRatio,
            height: 0.4 * this.mobileScaleSecondRatio,
          },
          "same"
        )

        .to(
          this.secondLight,
          {
            width: 0.3 * this.mobileScaleSecondRatio,
            height: 0.13 * this.mobileScaleSecondRatio,
          },
          "same"
        )

        .to(
          this.thirdLight,
          {
            width: 0.2 * this.mobileScaleSecondRatio,
            height: 0.05 * this.mobileScaleSecondRatio,
          },
          "same"
        );

      // Third movement
      this.thirdTimeline = new GSAP.timeline({
        scrollTrigger: {
          trigger: ".third-move",
          // markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      }).to(
        this.camera.orthographicCamera.position,
        {
          y: 5,
        },
        "same"
      );

      this.stairsAnimationFunction();
      // this.languagesAnimationFunction();
    });
  }

  stairsAnimationFunction() {
    // Stairs animation
    this.stairsTimeline = new GSAP.timeline({
      scrollTrigger: {
        trigger: ".third-move",
        // markers: true,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    this.room.children.forEach((child) => {
      if (child.name === "stairs") {
        this.stairsAnimation = GSAP.to(child.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: "back.out(2)",
          duration: 2,
        });
      }
    });

    this.stairsTimeline.add(this.stairsAnimation);
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );
  }
}
