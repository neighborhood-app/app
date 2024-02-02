import { Link } from 'react-router-dom';
import { CSSProperties, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import ScrollReveal from 'scrollreveal';
import styles from './LandingPage.module.css';

interface CustomCSS extends CSSProperties {
  '--i': number;
}

const homeImg1 = require('./images/splitted-home-img/1-1.jpg');
const homeImg2 = require('./images/splitted-home-img/1-2.jpg');
const homeImg3 = require('./images/splitted-home-img/2-1.jpg');
const homeImg4 = require('./images/splitted-home-img/2-2.jpg');

const img10 = require('./images/img-10.jpg');
const img11 = require('./images/img-11.jpg');
const img12 = require('./images/img-12.jpg');
const img13 = require('./images/img-13.jpg');
const img14 = require('./images/img-14.jpg');

ScrollReveal().reveal('.scroll-btn-animation', {
  delay: 1400,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 800,
});

export default function LandingPage() {
  useEffect(() => {
    ScrollReveal({ distance: '70px' });

    ScrollReveal().reveal('[class*="content"] h1', {
      delay: 200,
      easing: 'ease-in',
      origin: 'top',
      duration: 800,
    });

    ScrollReveal().reveal('[class*="content"] p', {
      delay: 800,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 800,
    });

    ScrollReveal().reveal('[class*="card"]', {
      delay: 1400,
      interval: 400,
      easing: 'ease-in',
      origin: 'top',
      distance: '40px',
      duration: 500,
    });

    ScrollReveal().reveal('[class*="gettingStarted"] h1', {
      delay: 500,
      easing: 'ease-in',
      origin: 'top',
      duration: 800,
    });

    ScrollReveal().reveal('[class*="explore"] h1', {
      delay: 500,
      easing: 'ease-in',
      origin: 'top',
      duration: 800,
    });

    ScrollReveal().reveal('[class*="container"]', {
      delay: 1400,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 800,
    });

    ScrollReveal().reveal('[class*="followUs"] h2', {
      delay: 1000,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="followUsList"] i', {
      delay: 800,
      interval: 400,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 400,
    });

    ScrollReveal().reveal('[class*="signupAppPart"] p', {
      delay: 800,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="signupBtn"] p', {
      delay: 800,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <a href="#" className={styles.logo}>
          <i className="fa-solid fa-people-roof"></i>
          <span>Neighborhood</span>
        </a>

        <ul className={styles.navBar}>
          <li>
            <a href="#home" className={`${styles.navItem}`}>
              Home
            </a>
          </li>
          <li>
            <a href="#howItWorks" className={styles.navItem}>
              How it works?
            </a>
          </li>
          <li>
            <a href="#whyNeighborhood" className={styles.navItem}>
              Why Neighborhood?
            </a>
          </li>
        </ul>

        <div className={styles.rightNav}>
          <Link to="/signup">
            <button className={styles.btn}>
              Sign Up
              <div className={styles.btnHoverEffect}>
                <div></div>
              </div>
            </button>
          </Link>

          <div className={`bx bx-menu ${styles.menuIcon}`}></div>
        </div>
      </header>

      <section id="home" className={styles.home}>
        <div className={styles.content}>
          <h1>Building Stronger Communities Together!</h1>
          <p>
            Are you ready to transform your community into a vibrant, connected hub of collaboration
            and support? Introducing Neighborhood, the social-media app designed to foster
            meaningful connections, and build a stronger, more closely associated community.
          </p>
        </div>

        <div className={styles.imageContainer}>
          <img className={styles.item} src={homeImg1} style={{ '--i': 2 } as CustomCSS} alt="" />

          <img className={styles.item} src={homeImg2} style={{ '--i': 3 } as CustomCSS} alt="" />

          <img className={styles.item} src={homeImg3} style={{ '--i': 4 } as CustomCSS} alt="" />

          <img className={styles.item} src={homeImg4} style={{ '--i': 1 } as CustomCSS} alt="" />
        </div>
      </section>

      <section id="howItWorks" className={styles.gettingStarted}>
        <h1>How It Works?</h1>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2>Join Your Neighborhood</h2>
            <p>
              Sign up with a few easy steps and start connecting with your neighbors. Your community
              is just a click away.
            </p>
          </div>
          <div className={styles.card}>
            <h2>Connect and Contribute</h2>
            <p>
              Attend local events, and gatherings, or help your neighbors. Neighborhood makes it
              easy to bring your community closer.
            </p>
          </div>
          <div className={styles.card}>
            <h2>Share Ideas and Updates</h2>
            <p>
              Keep everyone in the loop by sharing thoughts, updates, and exciting news with your
              neighbors. Communication is key to a thriving community.
            </p>
          </div>
        </div>
      </section>

      <section id="whyNeighborhood" className={styles.explore}>
        <h1>Why Neighborhood?</h1>
        <div className={styles.container}>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={2}
            preventClicks={true}
            noSwiping={true}
            freeMode={false}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
            loop={true}
            autoplay={{
              delay: 2500,
              pauseOnMouseEnter: true,
            }}
            speed={400}
            breakpoints={{
              300: {
                slidesPerView: 1,
                spaceBetween: 1,
              },
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
            }}>
            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img10} alt="" />
                <h2>Collaborate on Local Projects</h2>
                <p>
                  Neighborhood allows you to turn ideas into action from organizing a neighborhood
                  clean-up to starting a community garden. Engage with your neighbors and make a
                  positive impact together.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img12} alt="" />
                <h2>Connect with Your Neighbors</h2>
                <p>
                  Discover the incredible people who live right next door. From friendly faces to
                  local experts, the Neighborhood connects you with your community.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img11} alt="" />
                <h2>Support Your Neighbors</h2>
                <p>
                  Extend a helping hand to your neighbor who needs help. From lending a cup of sugar
                  to assisting with a household task, Neighborhood allows you to build a network of
                  support within arm's reach.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img14} alt="" />
                <h2>Stay Informed</h2>
                <p>
                  Receive real-time updates on local events, news, and important announcements.
                  Whether it's a neighborhood gathering or a safety alert, stay connected to what
                  matters most in your community.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={`${styles.swiperSlide}`}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img13} alt="" />
                <h2>Build a Supportive Network</h2>
                <p>
                  Need a helping hand or have a skill to share? Neighborhood is your go-to platform
                  for exchanging favors, skills, and support. Strengthen the bonds that make a
                  community resilient.
                </p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.followUs}>
          <h2>Follow us</h2>
          <div className={styles.followUsList}>
            {/*
              Icons are too small
            */}
            <a href="#">
              <i className="bx bxl-facebook-square"></i>
            </a>
            <a href="#">
              {' '}
              <i className="bx bxl-instagram"></i>
            </a>
            <a href="#">
              <i className="bx bxl-twitter"></i>
            </a>
            <a href="#">
              {' '}
              <i className="bx bxl-github"></i>
            </a>
          </div>
        </div>
        <div className={styles.signupAppPart}>
          <p>
            Join Neighborhood today and be a part of the movement to create stronger, more united
            neighborhoods.
          </p>
          {/* 
        Check it out later!!!
        */}
          <Link to="/signup">
            <div className="scroll-btn-animation">
              <button className={styles.signupBtn}>Sign Up</button>
            </div>
          </Link>
        </div>
      </footer>
      {/* <script src="app.js"></script> */}
    </div>
  );
}
