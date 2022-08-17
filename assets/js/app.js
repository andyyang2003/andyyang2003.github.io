// load screen
$(window).on("load", function() {
    

    //load menu
    $(".loader-div").fadeOut(2000);
    // hide button from scroll
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


/*
    // fading divs
    $(window).scroll(function () {
        var winBot = $(this).scrollTop() + $(this).innerHeight();
        $(".fade").each(function() {
            var objectBottom = $(this).offset().top + $(this).outerHeight();
            
            if (objectBottom < winBot) {
                if ($(this).css("opacity")==0) {$(this).fadeTo(250,1);}
            } else {
                if ($(this).css("opacity")==1) {$(this).fadeTo(250,0);}
            }
        }); 
    }).scroll(); */   
}); 









