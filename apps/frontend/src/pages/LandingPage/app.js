// Navbar - Mobile

const menu = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('header');

menu.addEventListener('click', () => {
  menu.classList.toggle('bx-x');
  navbar.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  });
});

// Navbar - Active Nav Item

const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
  const fromTop = window.scrollY;

  document.querySelectorAll('section').forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`ul li a[href="#${sectionId}"]`);

    if (sectionTop <= fromTop && sectionTop + section.offsetHeight > fromTop) {
      navItems.forEach((link) => {
        link.classList.remove('active');
      });

      navLink.classList.add('active');
    } else {
      navLink.classList.remove('active');
    }
  });
});

// Slider

var swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 10,
  speed: 400,
  preventClicks: true,
  noSwiping: true,
  freeMode: false,
  navigation: {
    nextEl: '.next',
    prevEl: '.prev',
  },
  loop: true,
  autoplay: {
    delay: 2500,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    550: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    950: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
});

// ScrollReveal JS

ScrollReveal({ distance: '70px' });

ScrollReveal().reveal('.content h1', {
  delay: 200,
  easing: 'ease-in',
  origin: 'top',
  duration: 800,
});

ScrollReveal().reveal('.content p', {
  delay: 800,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

ScrollReveal().reveal('.scroll-btn-animation', {
  delay: 1400,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

ScrollReveal().reveal('#gettingstarted h1', {
  delay: 500,
  easing: 'ease-in',
  origin: 'top',
  duration: 800,
});

ScrollReveal().reveal('.card', {
  delay: 1400,
  interval: 400,
  easing: 'ease-in',
  origin: 'top',
  distance: '40px',
  duration: 500,
});

ScrollReveal().reveal('#explore h1', {
  delay: 500,
  easing: 'ease-in',
  origin: 'top',
  duration: 800,
});

ScrollReveal().reveal('.container', {
  delay: 1400,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

ScrollReveal().reveal('#contact', {
  delay: 500,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

ScrollReveal().reveal('#contact h1', {
  delay: 1000,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

ScrollReveal().reveal('#contact p', {
  delay: 1600,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

ScrollReveal().reveal('.form-container', {
  delay: 2200,
  easing: 'ease-in',
  origin: 'top',
  distance: '50px',
  duration: 800,
});

ScrollReveal().reveal('.follow-us h2', {
  delay: 1000,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 600,
});

ScrollReveal().reveal('.follow-us-list i', {
  delay: 800,
  interval: 400,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 400,
});

ScrollReveal().reveal('.signup-app-part p', {
  delay: 800,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 600,
});
