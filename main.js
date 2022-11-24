import "./style.css";
import Experience from "./Experience/experience";

const experience = new Experience(document.querySelector(".experience-canvas"));

const box = document.querySelectorAll(".box");

function unwrap() {
  var x = document.getElementById("");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

const div = document.getElementById("contact-button-div");
let bgColor = "light";

/*  Page scroll animations   ---------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const hiddenElementsLeft = document.querySelectorAll(".hidden-left");
hiddenElementsLeft.forEach((el) => {
  observer.observe(el);
});

const hiddenElementsRight = document.querySelectorAll(".hidden-right");
hiddenElementsRight.forEach((el) => {
  observer.observe(el);
});
