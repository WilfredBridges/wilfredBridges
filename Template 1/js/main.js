;(function ($) {
  "use strict"

  // Navbar on scrolling
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".navbar").fadeIn("slow").css("display", "flex")
    } else {
      $(".navbar").fadeOut("slow").css("display", "none")
    }
  })

  // Smooth scrolling on the navbar links
  $(".navbar-nav a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault()

      $("html, body").animate(
        {
          scrollTop: $(this.hash).offset().top - 45,
        },
        1500,
        "easeInOutExpo"
      )

      if ($(this).parents(".navbar-nav").length) {
        $(".navbar-nav .active").removeClass("active")
        $(this).closest("a").addClass("active")
      }
    }
  })

  // Modal Video
  $(document).ready(function () {
    var $videoSrc
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src")
    })
    console.log($videoSrc)

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      )
    })

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc)
    })
  })

  // Scroll to Bottom
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".scroll-to-bottom").fadeOut("slow")
    } else {
      $(".scroll-to-bottom").fadeIn("slow")
    }
  })

  // Portfolio isotope and filter
  var portfolioIsotope = $(".portfolio-container").isotope({
    itemSelector: ".portfolio-item",
    layoutMode: "fitRows",
  })
  $("#portfolio-flters li").on("click", function () {
    $("#portfolio-flters li").removeClass("active")
    $(this).addClass("active")

    portfolioIsotope.isotope({ filter: $(this).data("filter") })
  })

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".back-to-top").fadeIn("slow")
    } else {
      $(".back-to-top").fadeOut("slow")
    }
  })
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo")
    return false
  })

  // Gallery carousel
  $(".gallery-carousel").owlCarousel({
    autoplay: false,
    smartSpeed: 1500,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
      1200: {
        items: 5,
      },
    },
  })
})(jQuery)

// Set the date we're counting down to
var countDownDate = new Date("Dec 25, 2024 12:00:00").getTime()

// Update the countdown every 1 second
var x = setInterval(function () {
  // Get the current date and time
  var now = new Date().getTime()

  // Calculate the remaining time
  var distance = countDownDate - now

  // Calculate days, hours, minutes, and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24))
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = Math.floor((distance % (1000 * 60)) / 1000)

  // Display the countdown
  document.getElementById("countdown").innerHTML =
    "<span style='font-size: 100%'>" +
    days +
    "</span><span style='font-size: 50%'>d</span> " +
    "<span style='font-size: 100%'>" +
    hours +
    "</span><span style='font-size: 50%'>h</span> " +
    "<span style='font-size: 100%'>" +
    minutes +
    "</span><span style='font-size: 50%'>m</span> " +
    "<span style='font-size: 100%'>" +
    seconds +
    "</span><span style='font-size: 50%'>s</span> "

  // If the countdown is over, display a message
  if (distance < 0) {
    clearInterval(x)
    document.getElementById("countdown").innerHTML = "EXPIRED"
  }
}, 1000)

// JavaScript code to show the modal
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('myModal');
    var form = document.querySelector('form');

    // Show the modal
    function showModal() {
        modal.style.display = 'block';
    }

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(form);

        fetch('rsvp.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'success') {
                showModal();
            } else {
                'error'
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Close the modal when the user clicks on <span> (x)
    var span = document.getElementsByClassName('close')[0];
    span.onclick = function() {
        modal.style.display = 'none';
    };
});
