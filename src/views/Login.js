import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/UI/button/Button";
import Input from "../components/UI/input/Input";
import Loader from "../components/UI/loader/Loader";
import AuthContext from "../store/auth/AuthContext";
import styles from "./Login.module.css";

const Login = (props) => {
	const context = useContext(AuthContext);

	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);

	const [password, setPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(true);

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const emailChangeHandler = (event) => {
		setEmail(event.target.value);
	};

	const passwordChangeHandler = (event) => {
		setPassword(event.target.value);
	};

	const checkFormValidity = () => {
		if (
			!email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			setIsEmailValid(false);
			setError("Email is not valid");
			return false;
		} else if (password.length < 6) {
			setIsPasswordValid(false);
			setError("Password is too short");
			return false;
		} else {
			setError(null);
			return true;
		}
	};

	const formSubmitHandler = async (event) => {
		event.preventDefault();
		setError(null);
		setIsEmailValid(true);
		setIsPasswordValid(true);
		let data = null;
		// Validate email and password
		const formIsValid = checkFormValidity();
		if (!formIsValid) return;
		// After validation...
		setLoading(true);
		try {
			const response = await fetch(context.signInUrl, {
				method: "POST",
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true,
				}),
			});
			data = await response.json();
			if (!response.ok) throw new Error(data.error.message);
			// Check route params
			// If saved session data exists -> save data after logging in
		} catch (error) {
			console.log("error", error);
			data = null;
			setError(error.message || "Invalid input");
		}
		setLoading(false);
		if (data) {
			context.signIn(data.localId);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<form onSubmit={formSubmitHandler} className={styles.form}>
			{error && <p className="invalid">{error}</p>}
			<Input
				label="Email"
				input={{
					type: "email",
					id: "email",
				}}
				invalid={!isEmailValid}
				value={email}
				onChangeHandler={emailChangeHandler}
			/>
			<Input
				label="Password"
				input={{
					type: "password",
					id: "password",
				}}
				invalid={!isPasswordValid}
				value={password}
				onChangeHandler={passwordChangeHandler}
			/>
			<Link to="/signup">Don't have an account yet? Sign up here!</Link>
			<Button type="submit">Login</Button>
		</form>
	);
};

export default Login;
