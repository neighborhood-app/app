const neighborhoodImg1 = require('./images/palm-tree.jpeg');
const neighborhoodImg2 = require('./images/up-north.jpg');

export default function HomePage() {
  return (
    <>
      <section>
        <h1>My Neighborhoods</h1>
        <div className="all-neighborhoods">
          <figure className="card">
            <img src={neighborhoodImg1} alt="neighborhood" />
            <figcaption>
              <span className="info">
                <h2>
                  Palm Springs <span>(Admin)</span>
                </h2>
                <p>You can join other neighborhoods!</p>
              </span>
              <button className="explore-neighborhood">Explore</button>
            </figcaption>
          </figure>

          <figure className="card">
            <img src={neighborhoodImg2} alt="neighborhood" />
            <figcaption>
              <span className="info">
                <h2>
                  Up North <span>(Member)</span>
                </h2>
                <p>You can join other neighborhoods!</p>
              </span>
              <button className="explore-neighborhood">Explore</button>
            </figcaption>
          </figure>
        </div>
      </section>

      <section>
        <h1>My active requests</h1>
        <div className="all-active-requests">
          <div className="request-card">
            <img src="images/image.jpeg" alt="active request in neighborhood app" />

            <div className="request-card-content">
              <p>Help! My cat is drowning</p>
              <p>Created 11 Mar 2022 in Palm Springs Neighborhood</p>
              <p>2 responses</p>
            </div>
          </div>

          <div className="request-card">
            <img src="images/image.jpeg" alt="active requests on neighborhood app" />

            <div className="request-card-content">
              <p>Help with acute lazyness</p>
              <p>Created 12 Mar 2022 in Up North Neighborhood</p>
              <p>No responses</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h1>Requests I've responded to</h1>
        <div className="all-responded-requests">
          <div className="responded-request-card">
            <div className="profile-info">
              <img src="images/profile-2.jpg" alt="active user on neighborhood app" />
              <p>Laura Keith</p>
            </div>

            <img src="images/cat.jpg" alt="responded requests on neighborhood app" />

            <div className="responded-request-card-content">
              <p>Help! My cat is drowning</p>
              <p>Created 11 Mar 2022 in Palm Springs Neighborhood</p>
            </div>
          </div>

          <div className="responded-request-card">
            <div className="profile-info">
              <img src="images/profile.jpg" alt="active user on neighborhood app" />
              <p>John Smith</p>
            </div>

            <img src="images/request.jpeg" alt="responded requests on neighborhood app" />

            <div className="responded-request-card-content">
              <p>Meeting 20.02.2022</p>
              <p>Created 20 Feb 2022 in Palm Springs Neighborhood</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
