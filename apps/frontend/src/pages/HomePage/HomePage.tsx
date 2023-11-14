import NeighborhoodsBox from '../../components/NeighborhoodsBox/NeighborhoodsBox';

const neighborhoodImg1 = require('./images/palm-tree.jpeg');
const neighborhoodImg2 = require('./images/up-north.jpg');

export default function HomePage() {
  return (
    <>
      <NeighborhoodsBox />
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
