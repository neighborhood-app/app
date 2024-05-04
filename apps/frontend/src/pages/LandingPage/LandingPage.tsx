import { CSSProperties, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ScrollReveal from 'scrollreveal';
import CustomBtn from '../../components/CustomBtn/CustomBtn';
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
// const img14 = require('./images/img-14.jpg');

ScrollReveal().reveal('.scroll-btn-animation', {
  delay: 1000,
  easing: 'ease-in',
  origin: 'top',
  distance: '30px',
  duration: 600,
});

export default function LandingPage() {
  useEffect(() => {
    ScrollReveal({ distance: '70px' });

    ScrollReveal().reveal('[class*="content"] h1', {
      delay: 200,
      easing: 'ease-in',
      origin: 'top',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="content"] p', {
      delay: 600,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="card"]', {
      delay: 1000,
      interval: 400,
      easing: 'ease-in',
      origin: 'top',
      distance: '40px',
      duration: 500,
    });

    ScrollReveal().reveal('[class*="gettingStarted"] h1', {
      delay: 400,
      easing: 'ease-in',
      origin: 'top',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="explore"] h1', {
      delay: 400,
      easing: 'ease-in',
      origin: 'top',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="container"]', {
      delay: 1000,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="followUs"] h2', {
      delay: 1000,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="followUsList"] i', {
      delay: 600,
      interval: 400,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 400,
    });

    ScrollReveal().reveal('[class*="signupAppPart"] p', {
      delay: 600,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });

    ScrollReveal().reveal('[class*="home"]', {
      delay: 600,
      easing: 'ease-in',
      origin: 'top',
      distance: '30px',
      duration: 600,
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <Navbar className={styles.header} expand="lg" sticky="top">
        <Navbar.Brand href="#home" className={styles.logo}>
          <i className="fa-solid fa-people-roof"></i>
          <span> Neighbourhood</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="">
          <Nav className="me-auto w-100 justify-content-end">
            <Nav.Link href="#home" className={styles.navItem}>
              Home
            </Nav.Link>
            <Nav.Link href="#howItWorks" className={styles.navItem}>
              How it works?
            </Nav.Link>
            <Nav.Link href="#whyNeighbourhood" className={styles.navItem}>
              Why Neighbourhood?
            </Nav.Link>
          </Nav>
          <Nav className="me-auto flex-row justify-content-center">
            <Nav.Link href="/signup" className={styles.navItem}>
              <CustomBtn className={styles.btn} variant="primary">
                Sign Up
              </CustomBtn>
            </Nav.Link>
            <Nav.Link href="/login" className={styles.navItem}>
              <CustomBtn className={styles.btn} variant="primary">
                Log in
              </CustomBtn>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <section id="home" className={styles.home}>
        <div className={styles.content}>
          <h1>Building Stronger Communities Together!</h1>
          <p>
            Are you ready to transform your community into a vibrant, connected hub of collaboration
            and support? Introducing Neighbourhood, the social-media app designed to foster
            meaningful connections, and build a stronger, more closely associated community.
          </p>
          <CustomBtn className={styles.btn} variant="primary">
            <Link to={'/signup'} className={styles.signUpLink}>
              Sign Up
            </Link>
          </CustomBtn>
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
            <h2>Join Your Neighbourhood</h2>
            <p>
              Sign up with a few easy steps and start connecting with your neighbours. Your
              community is just a click away.
            </p>
          </div>
          <div className={styles.card}>
            <h2>Connect and Contribute</h2>
            <p>
              Attend local events, and gatherings, or help your neighbours. Neighbourhood makes it
              easy to bring your community closer.
            </p>
          </div>
          <div className={styles.card}>
            <h2>Share Ideas and Updates</h2>
            <p>
              Keep everyone in the loop by sharing thoughts, updates, and exciting news with your
              neighbours. Communication is key to a thriving community.
            </p>
          </div>
        </div>
      </section>

      <section id="whyNeighbourhood" className={styles.explore}>
        <h1>Why Neighbourhood?</h1>
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
            speed={1000}
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
                  Neighbourhood allows you to turn ideas into action from organizing a neighbourhood
                  clean-up to starting a community garden. Engage with your neighbours and make a
                  positive impact together.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img12} alt="" />
                <h2>Connect with Your Neighbours</h2>
                <p>
                  Discover the incredible people who live right next door. From friendly faces to
                  local experts, the Neighbourhood connects you with your community.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={styles.swiperSlide}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img11} alt="" />
                <h2>Support Your Neighbours</h2>
                <p>
                  Extend a helping hand to your neighbour who needs help. From lending a cup of
                  sugar to assisting with a household task, Neighbourhood allows you to build a
                  network of support within arm's reach.
                </p>
              </div>
            </SwiperSlide>

            <SwiperSlide className={`${styles.swiperSlide}`}>
              <div className={styles.slideContent}>
                <img className={styles.img} src={img13} alt="" />
                <h2>Build a Supportive Network</h2>
                <p>
                  Need a helping hand or have a skill to share? Neighbourhood is your go-to platform
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
            <a href="https://github.com/neighborhood-app/app">
              {' '}
              <i className="bx bxl-github"></i>
            </a>
            {/* TODO: Add link to LinkedIn page for project */}
            <a href="https://www.linkedin.com/company/neighbourhood-community">
              {' '}
              <i className="bx bxl-linkedin"></i>
            </a>
          </div>
        </div>
        <div className={styles.signupAppPart}>
          <p>
            Join Neighbourhood today and be a part of the movement to create stronger, more united
            neighbourhoods.
          </p>
        </div>
      </footer>
    </div>
  );
}
