import styles from "./TimerBar.module.css";

const TimerBar = (props) => {
	return (
		<div className={styles.bar}>
			{props.isPaused && <span>Paused</span>}
			<div style={{ width: props.width + "%" }}></div>
		</div>
	);
};

export default TimerBar;
