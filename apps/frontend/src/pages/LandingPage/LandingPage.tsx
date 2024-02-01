import {CSSProperties} from 'react'
import styles from './LandingPage.module.css';

interface CustomCSS extends CSSProperties {
  '--i': number
}

export default function LandingPage() {
  return (
    <div className={styles.wrapper}>
    <header className={styles.header}>
      <a href="#" className={styles.logo}>
        <i className="fa-solid fa-people-roof"></i>
        <span>Neighborhood App</span>
      </a>

      <ul className={styles.navBar}>
        <li><a href="#home" className={`${styles.navItem} ${styles.active}`}>Home</a></li>
        <li><a href="#gettingstarted" className={styles.navItem}>Getting Started</a></li>
        <li><a href="#explore" className={styles.navItem}>Explore</a></li>
        <li><a href="#contact" className={styles.navItem}>Contact</a></li>
      </ul>

      <div className={styles.rightNav}>
        <button className={styles.btn}>
          Sign Up
          <div className={styles.btnHoverEffect}>
            <div></div>
          </div>
        </button>
        <div className={`bx bx-menu ${styles.menuIcon}`}></div>
      </div>
    </header>

    <section className={styles.home}>
      <div className={styles.content}>
        <h1>Building Stronger Communities Together!</h1>
        <p>
          Are you ready to transform your community into a vibrant, connected hub of collaboration
          and support? Introducing Neighborhood App, the social-media app designed to foster
          meaningful connections, and build a stronger, more closely associated community.
        </p>
        <div className="scroll-btn-animation">
          <a href="#gettingstarted" className={styles.btn}>
            More about
            <div className="btn-hover-effect">
              <div></div>
            </div>
          </a>
        </div>
      </div>

      <div className="image-container">
        <img className="item" src="images/splitted-home-img/1-1.jpg" style={{"--i": 2} as CustomCSS }  alt="" />

        <img className="item" src="images/splitted-home-img//1-2.jpg" style={{"--i": 3} as CustomCSS } alt="" />

        <img className="item" src="images/splitted-home-img//2-1.jpg" style={{"--i": 4} as CustomCSS } alt="" />

        <img className="item" src="images/splitted-home-img//2-2.jpg" style={{"--i": 1} as CustomCSS } alt="" />
      </div>
    </section>

    <section id="gettingstarted">
      <h1>How It Works?</h1>
      <div className="card-container">
        <div className="card">
          <h2>Join Your Neighborhood</h2>
          <p>
            Sign up with a few easy steps and start connecting with your neighbors. Your community
            is just a click away.
          </p>
        </div>
        <div className="card">
          <h2>Connect and Contribute</h2>
          <p>
            Attend local events, and gatherings, or help your neighbors. Neighborhood App makes it
            easy to bring your community closer.
          </p>
        </div>
        <div className="card">
          <h2>Share Ideas and Updates</h2>
          <p>
            Keep everyone in the loop by sharing thoughts, updates, and exciting news with your
            neighbors. Communication is key to a thriving community.
          </p>
        </div>
      </div>
    </section>

    <section id="explore">
      <h1>Why Neighborhood App?</h1>
      <div className="container">
        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="slide-content">
                <img src="images/img-10.jpg" alt="" />
                <h2>Collaborate on Local Projects</h2>
                <p>
                  Neighborhood App allows you to turn ideas into action from organizing a
                  neighborhood clean-up to starting a community garden. Engage with your neighbors
                  and make a positive impact together.
                </p>
              </div>
            </div>

            <div className="swiper-slide">
              <div className="slide-content">
                <img src="images/img-12.jpg" alt="" />
                <h2>Connect with Your Neighbors</h2>
                <p>
                  Discover the incredible people who live right next door. From friendly faces to
                  local experts, the Neighborhood App connects you with your community.
                </p>
              </div>
            </div>

            <div className="swiper-slide">
              <div className="slide-content">
                <img src="images/img-11.jpg" alt="" />
                <h2>Support Your Neighbors</h2>
                <p>
                  Extend a helping hand to your neighbor who needs help. From lending a cup of sugar
                  to assisting with a household task, Neighborhood App allows you to build a network
                  of support within arm's reach.
                </p>
              </div>
            </div>

            <div className="swiper-slide">
              <div className="slide-content">
                <img src="images/img-14.jpg" alt="" />
                <h2>Stay Informed</h2>
                <p>
                  Receive real-time updates on local events, news, and important announcements.
                  Whether it's a neighborhood gathering or a safety alert, stay connected to what
                  matters most in your community.
                </p>
              </div>
            </div>

            <div className="swiper-slide swiper-no-swiping">
              <div className="slide-content">
                <img src="images/img-13.jpg" alt="" />
                <h2>Build a Supportive Network</h2>
                <p>
                  Need a helping hand or have a skill to share? Neighborhood App is your go-to
                  platform for exchanging favors, skills, and support. Strengthen the bonds that
                  make a community resilient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div className="follow-us">
        <h2>Follow us</h2>
        <div className="follow-us-list">
          <a href="#"><i className="bx bxl-facebook-square"></i></a>
          <a href="#"> <i className="bx bxl-instagram"></i></a>
          <a href="#"><i className="bx bxl-twitter"></i></a>
          <a href="#"> <i className="bx bxl-github"></i></a>
        </div>
      </div>
      <div className="signup-app-part">
        <p>
          Join Neighborhood App today and be a part of the movement to create stronger, more united
          neighborhoods.
        </p>
        {/* 
        Check it out later!!!
        */}
        <div className="scroll-btn-animation">
          <button className={styles.signupBtn}>Sign Up</button>
        </div>
      </div>
    </footer>
    <script src="app.js"></script>
    </ div>
  )
}