import { EventEmitter } from "events";
import Experience from "./experience";
import Room from "./World/Room";

export default class Theme extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.room = this.experience.room;

    this.theme = "light";
    this.toggleButton = document.querySelector(".toggle-button");
    this.toggleCircle = document.querySelector(".toggle-circle");

    this.setEventListener();
  }

  setEventListener() {
    this.toggleButton.addEventListener("click", () => {
      this.toggleCircle.classList.toggle("slide");
      this.theme = this.theme === "light" ? "dark" : "light";
      document.body.classList.toggle("dark-theme");

      this.emit("switch", this.theme);
    });
  }
}
