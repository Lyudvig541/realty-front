; (function ($) {
    "use strict";

    $(document).ready(function () {

        /**-----------------------------
         *  Navbar fix
         * ---------------------------*/
        $(document).on('click', '.navbar-area .navbar-nav li.menu-item-has-children>a', function (e) {
            e.preventDefault();
        })

        /*-------------------------------------
            menu
        -------------------------------------*/
        $('.menu').click (function(){
            $(this).toggleClass('open');
        });

        // mobile menu
        if ($(window).width() < 992) {
            $(".in-mobile").clone().appendTo(".sidebar-inner");
            $(".in-mobile ul li.menu-item-has-children").append('<i class="fas fa-chevron-right"></i>');
            $('<i class="fas fa-chevron-right"></i>').insertAfter("");

            $(".menu-item-has-children a").click(function(e) {
                // e.preventDefault();

                $(this).siblings('.sub-menu').animate({
                    height: "toggle"
                }, 300);
            });
        }

        var menutoggle = $('.menu-toggle');
        var mainmenu = $('.navbar-nav');
        var burgerMenu = $('.toggle-btn');
        var mainMenuTop = $(".navbar-area");
        var navContainer = $(".nav-container");





        burgerMenu.on('click', function (){
            if(burgerMenu[0].classList.contains('open') ){
                //navContainer.addClass('d-block');

                mainMenuTop.addClass('navbar-area-fixed');
                $(".logo-black").removeClass('hidden-for-scroll');
                $(".logo").addClass('hidden-for-scroll');
            }
            else if(!burgerMenu[0].classList.contains('open') && $(window).scrollTop() === 0){
                if(getComputedStyle(document.getElementById('navbar')).backgroundColor === 'rgb(255, 255, 255)'){
                } else{
                    $(".logo-black").addClass('hidden-for-scroll');
                    $(".logo").removeClass('hidden-for-scroll');
                    mainMenuTop.removeClass('navbar-area-fixed');
                }
                //navContainer.removeClass('d-block');


            }
            else{
                //navContainer.removeClass('d-block');
                $(".logo-black").addClass('hidden-for-scroll');
                $(".logo").removeClass('hidden-for-scroll');
                mainMenuTop.removeClass('navbar-area-fixed');
            }

        })
        menutoggle.on('click', function() {
            if (menutoggle.hasClass('is-active')) {
                mainmenu.removeClass('menu-open');
            } else {
                mainmenu.addClass('menu-open');
            }

        });



        /*-------------------------------------------------
           back to top
       --------------------------------------------------*/
        $(document).on('click', '.back-to-top', function () {
            $("html,body").animate({
                scrollTop: 0
            }, 400);
        });

    });

    $(window).on("scroll", function() {
        /*---------------------------------------
        sticky menu activation && Sticky Icon Bar
        -----------------------------------------*/
        var mainMenuTop = $(".navbar-area");
        var burgerMenu = $('.toggle-btn');
        if ($(window).scrollTop() >= 1) {

                $(".logo-black").removeClass('hidden-for-scroll')
                $(".logo").addClass('hidden-for-scroll')
                mainMenuTop.addClass('navbar-area-fixed');


        } else {
            // if($(".navbar").classList.contains("main-navbar-area")) {
            if(document.querySelector(".navbar") && document.querySelector(".navbar").classList.contains("main-navbar-area") && !burgerMenu[0].classList.contains('open')){
                $(".logo-black").addClass('hidden-for-scroll')
                $(".logo").removeClass('hidden-for-scroll')
                mainMenuTop.removeClass('navbar-area-fixed');
            }
        }

        var ScrollTop = $('.back-to-top');
        if ($(window).scrollTop() > 1000) {
            ScrollTop.fadeIn(1000);
        } else {
            ScrollTop.fadeOut(1000);
        }
    });


    $(window).on('load', function () {

        /*-----------------
            back to top
        ------------------*/
        var backtoTop = $('.back-to-top')
        backtoTop.fadeOut();

    });

     $('.sq-top').find('a').click(function(){
            $(window).scrollTop(0);
    });



})(jQuery);
