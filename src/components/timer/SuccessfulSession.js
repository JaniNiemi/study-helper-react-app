import Input from "../UI/input/Input";
import styles from "./SuccessfulSession.module.css";
import bellAudio from "../../assets/bell.wav";
import { useCallback, useEffect } from "react";

const SuccessfulSession = (props) => {
	const playAudio = useCallback(() => {
		const audioEl = document.querySelector("#audio");
		audioEl.play();
	}, []);

	useEffect(()=> {
		playAudio();
	}, [playAudio])

	const hours =
		props.time.hours < 10 ? `0${props.time.hours}` : props.time.hours;
	const minutes =
		props.time.minutes < 10 ? `0${props.time.minutes}` : props.time.minutes;
	const seconds =
		props.time.seconds < 10 ? `0${props.time.seconds}` : props.time.seconds;

	const time = `${hours}:${minutes}:${seconds}`;

	return (
		<div className={styles.container}>
			<h3>You studied for: {time}</h3>
			<Input
				label="Name this session"
				input={{
					type: "text",
					id: "session-name",
				}}
				value={props.sessionName}
				onChangeHandler={props.onSessionNameChange}
			/>
			<p>
				*An automatic name will be generated for your session if the
				name is left blank
			</p>
			<audio id="audio">
				<source src={bellAudio} />
			</audio>
		</div>
	);
};

export default SuccessfulSession;
