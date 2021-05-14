import styles from "./Nav.module.css";
import { Link } from "react-router-dom"

const Nav = () => {
	return (
		<nav className={styles.nav}>
			<ul>
				<li>
					<Link to="/">Study</Link>
				</li>
				<li>
					<Link to="/history">History</Link>
				</li>
				<li>
					<Link className={styles["login-btn"]} to="/login">
						Login
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;
