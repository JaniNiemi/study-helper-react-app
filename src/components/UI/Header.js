import styles from "./Header.module.css";
import Nav from "./nav/Nav";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Study Helper</h1>
      <Nav />
    </header>
  )
}

export default Header;