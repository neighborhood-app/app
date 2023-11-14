export default function NeighborhoodsBox() {
  return (
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
  );
}
