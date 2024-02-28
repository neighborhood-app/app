import styles from './Footer.module.css';

interface Props {
  variant?: 'landing' | 'layout';
}

const Footer = ({ variant = 'layout' }: Props) => (
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
    {variant === 'landing' ? (
      <div className={styles.signupAppPart}>
        <p>
          Join Neighborhood today and be a part of the movement to create stronger, more united
          neighborhoods.
        </p>
      </div>
    ) : null}
  </footer>
);

export default Footer;
