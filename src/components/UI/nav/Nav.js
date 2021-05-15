import styles from "./Nav.module.css";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../store/auth/AuthContext";

const Nav = () => {
	const context = useContext(AuthContext);
	const history = useHistory();

	const logoutHandler = () => {
		context.logout();
		history.replace("/");
	};

	let loginEl = (
		<Link className={styles["login-btn"]} to="/login">
			Login
		</Link>
	);

	if (context.user !== "") {
		loginEl = (
			<span onClick={logoutHandler} className={styles["login-btn"]}>
				Logout
			</span>
		);
	}

	return (
		<nav className={styles.nav}>
			<ul>
				<li>
					<Link to="/">Study</Link>
				</li>
				<li>
					<Link to="/history">History</Link>
				</li>
				<li>{loginEl}</li>
			</ul>
		</nav>
	);
};

export default Nav;
