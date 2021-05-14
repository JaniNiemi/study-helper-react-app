import React, { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth/AuthContext";
import Button from "../UI/button/Button";
import Input from "../UI/input/Input";
import Modal from "../UI/modal/Modal";
import SuccessfulSession from "./SuccessfulSession";
import styles from "./Timer.module.css";
import TimerBar from "./TimerBar";

const Timer = () => {
	const history = useHistory();

	const [isTimerSet, setIsTimerSet] = useState(false);
	const [isTimerPaused, setIsTimerPaused] = useState(false);
	const [timer, setTimer] = useState(null);

	const [hoursInput, setHoursInput] = useState(0);
	const [minutesInput, setMinutesInput] = useState(0);
	const [secondsInput, setSecondsInput] = useState(0);

	const [initialTime, setInitialTime] = useState(null);
	const [initialSeconds, setInitialSeconds] = useState(0);
	const [barWidth, setBarWidth] = useState(0);

	const [isSessionFinished, setIsSessionFinished] = useState(false);
	const [sessionResetConfirm, setSessionResetConfirm] = useState(false);

	const [sessionName, setSessionName] = useState("");

	const [targetTime, setTargetTime] = useState(0);
	const [pauseTime, setPauseTime] = useState(0);

	const context = useContext(AuthContext);

	const timeFromMilliseconds = (milliseconds) => {
		const hours = Math.floor(milliseconds / 3600000);
		const minutes = Math.floor((milliseconds - hours * 3600000) / 60000);
		const seconds = Math.round(
			((milliseconds - hours * 3600000 - ((hours * 3600000) % 3600)) /
				1000) %
				60
		);

		return {
			hours,
			minutes,
			seconds,
		};
	};

	const sessionNameChangeHandler = (event) => {
		setSessionName(event.target.value);
	};

	const timerHandler = useCallback(() => {
		const remainingTime = targetTime - new Date().getTime();

		if (remainingTime < 0) {
			setIsTimerSet(false);
			setIsSessionFinished(true);
			return;
		}

		const newTimer = timeFromMilliseconds(remainingTime);
		setTimer(newTimer);

		// set current timer as seconds
		const secondsNow = remainingTime / 1000;
		// calculate percentage
		setBarWidth((secondsNow / initialSeconds) * 100);
	}, [initialSeconds, targetTime]);

	const hoursInputHandler = (event) => {
		if (event.target.value > 23) {
			setHoursInput(23);
		} else if (event.target.value < 0) {
			setHoursInput(0);
		} else {
			setHoursInput(event.target.value);
		}
	};
	const minutesInputHandler = (event) => {
		if (event.target.value > 59) {
			setMinutesInput(59);
		} else if (event.target.value < 0) {
			setMinutesInput(0);
		} else {
			setMinutesInput(event.target.value);
		}
	};
	const secondsInputHandler = (event) => {
		if (event.target.value > 59) {
			setSecondsInput(59);
		} else if (event.target.value < 0) {
			setSecondsInput(0);
		} else {
			setSecondsInput(event.target.value);
		}
	};

	const timerStartHandler = () => {
		setIsTimerSet(true);

		const milliseconds =
			(Number(secondsInput) +
				Number(minutesInput) * 60 +
				Number(hoursInput) * 60 * 60) *
			1000;

		setTargetTime(new Date().getTime() + milliseconds);
		setTimer(timeFromMilliseconds(milliseconds));
		setInitialTime(timeFromMilliseconds(milliseconds));

		setInitialSeconds(
			Number(secondsInput) +
				Number(minutesInput) * 60 +
				Number(hoursInput) * 60 * 60
		);
		setBarWidth(100);

		setHoursInput(0);
		setMinutesInput(0);
		setSecondsInput(0);
	};

	const timerPauseHandler = () => {
		if (!isTimerPaused) {
			setPauseTime(new Date().getTime());
		} else {
			const unpauseTime = new Date().getTime();
			setTargetTime((prevTime) => unpauseTime - pauseTime + prevTime);
		}
		setTimer(timeFromMilliseconds(targetTime - new Date().getTime()));
		setIsTimerPaused((prevVal) => !prevVal);
	};

	const timerOutput = (time) => {
		const hours = time.hours > 9 ? time.hours : "0" + time.hours;
		const minutes = time.minutes > 9 ? time.minutes : "0" + time.minutes;
		const seconds = time.seconds > 9 ? time.seconds : "0" + time.seconds;
		return `${hours}:${minutes}:${seconds}`;
	};

	const resetHandler = () => {
		setIsTimerPaused(true);
		setSessionResetConfirm(true);
	};

	const resetSessionHandler = (confirmed) => {
		if (confirmed) {
			setIsTimerSet(false);
			setIsTimerPaused(false);
			setTimer(null);
		}
		setSessionResetConfirm(false);
	};

	const handleSessionName = () => {
		if (sessionName.trim() === "") {
			return "Session finished in " + new Date().toLocaleDateString();
		} else {
			return sessionName;
		}
	};

	const saveSession = async () => {
		await fetch(
			"https://study-helper-app-default-rtdb.europe-west1.firebasedatabase.app/" +
				context.user +
				".json",
			{
				method: "POST",
				body: JSON.stringify({
					sessionName: handleSessionName(),
					finished: new Date(),
					sessionDuration: initialTime,
					timeString: timerOutput(initialTime),
				}),
			}
		);
		// Switch page to history once session is finished and saved
		setIsSessionFinished(false);
		history.push("/history");
	};

	useEffect(() => {
		let countdown;
		if (isTimerSet && !isTimerPaused) {
			countdown = setTimeout(() => timerHandler(), 1000);
		}
		return () => {
			clearTimeout(countdown);
		};
	}, [isTimerSet, timer, isTimerPaused, timerHandler, targetTime]);

	let modalContent = null;

	/* Modal for when session has finished */
	if (isSessionFinished) {
		modalContent = (
			<Modal
				title="Congratulations on finishing your study session!"
				onConfirm={saveSession}
				onClose={() => setIsSessionFinished(false)}
			>
				<SuccessfulSession
					sessionName={sessionName}
					onSessionNameChange={sessionNameChangeHandler}
					time={initialTime}
				/>
			</Modal>
		);
	}
	/* Modal for confirming study session reset */
	if (sessionResetConfirm) {
		modalContent = (
			<Modal
				title="Reset your session?"
				onClose={resetSessionHandler.bind(null, false)}
				onConfirm={resetSessionHandler.bind(null, true)}
			>
				<p>Your progress will not be saved</p>
			</Modal>
		);
	}

	return (
		<React.Fragment>
			{modalContent}
			<main className={styles.timer}>
				<h3>How long are you going to study today?</h3>
				<div className={styles["inputs-container"]}>
					<Input
						label="Hours"
						input={{
							type: "number",
							min: "0",
							max: "23",
							step: "1",
							id: "hours",
						}}
						disabled={isTimerSet}
						value={hoursInput}
						onChangeHandler={hoursInputHandler}
					/>

					<Input
						label="Minutes"
						input={{
							type: "number",
							min: "0",
							max: "59",
							step: "1",
							id: "minutes",
						}}
						disabled={isTimerSet}
						value={minutesInput}
						onChangeHandler={minutesInputHandler}
					/>

					<Input
						label="Seconds"
						input={{
							type: "number",
							min: "0",
							max: "59",
							step: "1",
							id: "seconds",
						}}
						disabled={isTimerSet}
						value={secondsInput}
						onChangeHandler={secondsInputHandler}
					/>
				</div>
				<Button
					disabled={isTimerSet}
					onClickHandler={timerStartHandler}
				>
					Start
				</Button>
				<Button
					onClickHandler={timerPauseHandler}
					disabled={!isTimerSet}
				>
					<i className="fa fa-play" aria-hidden="true"></i>/
					<i className="fa fa-pause" aria-hidden="true"></i>
				</Button>
				<Button onClickHandler={resetHandler} disabled={!isTimerSet}>
					Reset
				</Button>
				{isTimerSet && (
					<div className={styles.time}>{timerOutput(timer)}</div>
				)}
				{isTimerSet && (
					<TimerBar isPaused={isTimerPaused} width={barWidth} />
				)}
			</main>
		</React.Fragment>
	);
};

export default Timer;