import styles from "./Input.module.css";

const Input = (props) => {
	let placeholder = "";
	switch (props.input.type) {
		case "email":
			placeholder = "your@email.com";
			break;

		case "password":
			placeholder = "Min 6 characters";
			break;
		default:
			break;
	}

	return (
		<div className={styles["input-container"]}>
			<label htmlFor={props.input.id}>{props.label}</label>
			<input
				{...props.input}
				placeholder={placeholder}
				value={props.value}
				onChange={props.onChangeHandler}
				disabled={props.disabled}
				className={props.invalid ? "invalid" : ""}
			/>
		</div>
	);
};

export default Input;
