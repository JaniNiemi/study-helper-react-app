import styles from "./Button.module.css";

const Button = (props) => {
  const btnClasses = props.btnClass ? `${styles.btn} ${styles[props.btnClass]}` : `${styles.btn}`

  return (
    <button type={props.type || "button"} className={btnClasses} disabled={props.disabled} onClick={props.onClickHandler}>
				{props.children}
		</button>
  )
}

export default Button;