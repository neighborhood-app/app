export default function LandingPage() {
  return (
    <>
    <header>
      <a href="#" className="logo">
        <i className="fa-solid fa-people-roof"></i>
        <span>Neighborhood App</span>
      </a>

      <ul className="navbar">
        <li><a href="#home" className="nav-item active">Home</a></li>
        <li><a href="#gettingstarted" className="nav-item">Getting Started</a></li>
        <li><a href="#explore" className="nav-item">Explore</a></li>
        <li><a href="#contact" className="nav-item">Contact</a></li>
      </ul>

      <div className="right-nav">
        <button className="btn">
          Sign Up
          <div className="btn-hover-effect">
            <div></div>
          </div>
        </button>
        <div className="bx bx-menu" id="menu-icon"></div>
      </div>
    </header>

    <section id="home">
      <div className="content">
        <h1>Building Stronger Communities Together!</h1>
        <p>
          Are you ready to transform your community into a vibrant, connected hub of collaboration
          and support? Introducing Neighborhood App, the social-media app designed to foster
          meaningful connections, and build a stronger, more closely associated community.
        </p>
        <div className="scroll-btn-animation">
          <a href="#gettingstarted" className="btn">
            More about
            <div className="btn-hover-effect">
              <div></div>
            </div>
          </a>
        </div>
      </div>

      <div className="image-container">
        <img className="item" src="images/splitted-home-img/1-1.jpg" style="--i: 2" alt="" />

        <img className="item" src="images/splitted-home-img//1-2.jpg" style="--i: 3" alt="" />

        <img className="item" src="images/splitted-home-img//2-1.jpg" style="--i: 4" alt="" />

        <img className="item" src="images/splitted-home-img//2-2.jpg" style="--i: 1" alt="" />
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

    <section id="contact">
      <div className="contact-container">
        <div className="contact-content">
          <h1>Contact</h1>
          <p>
            Whether you're seeking information, encountering a challenge, or just want to share your
            thoughts, your communication matters to us. You can fill out the contact form, and we
            will get back to you as soon as possible.
          </p>
        </div>
        <form className="form-container">
          <div className="form-card">
            <label className="form-label" for="full_name">Full Name</label>
            <input className="form-input" type="text" name="full_name" required="required" />
          </div>

          <div className="form-card">
            <label className="form-label" for="email">Email</label>
            <input className="form-input" type="email" name="email" required="required" />
          </div>

          <div className="form-card">
            <label className="form-textarea-label" for="message">Message</label>
            <textarea
              className="form-textarea"
              maxlength="420"
              rows="3"
              name="message"
              required="required"></textarea>
          </div>
          <div className="btn-wrap">
            <button className="btn">
              Submit
              <div className="btn-hover-effect">
                <div></div>
              </div>
            </button>
          </div>
        </form>
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
        <div className="scroll-btn-animation">
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </footer>
    <script src="app.js"></script>
    </>
  )
}