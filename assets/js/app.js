// hide from scroll
const showPx = 300;
const backToTopButton = document.getElementById("topbutton")

const scrollContainer = () => {
    return document.documentElement || document.body;
};

document.addEventListener("scroll", () => {
    if (scrollContainer().scrollTop > showPx) {
        backToTopButton.classList.remove("hidden")
    } else {
        backToTopButton.classList.add("hidden")
    }
})




const goToTop = () => {
    document.body.scrollIntoView({
        behavior: "smooth",
    });
};
backToTopButton.addEventListener("click", goToTop);

//hamburger 

const burger = document.querySelector("#burger-menu");
const ul = document.querySelector("nav ul");
const nav = document.querySelector("nav"); 

burger.addEventListener("click", () => {
    ul.classList.toggle("show");
});

const navLink = document.querySelectorAll(".nav-link");
navLink.forEach((link) => link.addEventListener("click", () => {
    ul.classList.remove("show");
}) );

$(document).on("scroll", function() {
    var pageTop = $(document).scrollTop();
    var pageBottom = pageTop + $(window).height();
    var tags = $(".tag");
  
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      if ($(tag).position().top < pageBottom) {
        $(tag).addClass("visible");
      } else {
        $(tag).removeClass("visible");
      }
    }
  });