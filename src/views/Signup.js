import { useContext, useState } from "react";
import Button from "../components/UI/button/Button";
import Input from "../components/UI/input/Input";
import AuthContext from "../store/auth/AuthContext";
import styles from "./Login.module.css";

const Signup = (props) => {
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);

	const [password, setPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(true);

	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(true);

	const [error, setError] = useState("");

	const context = useContext(AuthContext);

	const emailChangeHandler = (event) => {
		setEmail(event.target.value);
		console.log(context);
	};

	const passwordChangeHandler = (event) => {
		setPassword(event.target.value);
	};

	const passwordConfirmChangeHandler = (event) => {
		setPasswordConfirm(event.target.value);
	};

	// Move to authprovider eventually...
	const signup = async () => {
		await context.signUp(email, password);
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
		} else if (password !== passwordConfirm) {
			setError("Passwords do not match");
			setIsPasswordConfirmValid(false)
		} else {
			return true;
		}
	};

	const formSubmitHandler = (event) => {
		event.preventDefault();
		setIsEmailValid(true);
		setIsPasswordValid(true);
		setIsPasswordConfirmValid(true);
		const formIsValid = checkFormValidity();
		if (!formIsValid) return;
		signup();
	};

	return (
		<form onSubmit={formSubmitHandler} className={styles.form}>
			{error ? <p className="invalid">{error}</p> : null}
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

			<Input
				label="Confirm password"
				input={{
					type: "password",
					id: "confirm-password",
				}}
				invalid={!isPasswordConfirmValid}
				value={passwordConfirm}
				onChangeHandler={passwordConfirmChangeHandler}
			/>
			<Button type="submit">Register</Button>
		</form>
	);
};

export default Signup;
