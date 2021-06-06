import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../store/auth/AuthContext";
import Button from "../UI/button/Button";
import Input from "../UI/input/Input";
import Modal from "../UI/modal/Modal";
import SuccessfulSession from "./SuccessfulSession";
import styles from "./Timer.module.css";
import TimerBar from "./TimerBar";
import { Prompt } from "react-router-dom";
import { timeFromMilliseconds, timerOutput } from "../../utils/utils";

const Timer = () => {
	const history = useHistory();

	const [timerIsSet, setTimerIsSet] = useState(false);
	const [timerIsPaused, setTimerIsPaused] = useState(false);
	const [timer, setTimer] = useState(null);

	const [hoursInput, setHoursInput] = useState(0);
	const [minutesInput, setMinutesInput] = useState(0);
	const [secondsInput, setSecondsInput] = useState(0);

	const [initialTime, setInitialTime] = useState(null);
	const [initialSeconds, setInitialSeconds] = useState(0);
	const [barWidth, setBarWidth] = useState(0);

	const [sessionIsFinished, setSessionIsFinished] = useState(false);
	const [sessionResetConfirm, setSessionResetConfirm] = useState(false);

	const [sessionName, setSessionName] = useState("");

	const [targetTime, setTargetTime] = useState(0);
	const [pauseTime, setPauseTime] = useState(0);

	const context = useContext(AuthContext);

	const sessionNameChangeHandler = (event) => {
		setSessionName(event.target.value);
	};

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
		setTimerIsSet(true);

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

	const timerPauseHandler = (reset = true) => {
		if (!timerIsPaused) {
			setPauseTime(new Date().getTime());
		} else {
			const unpauseTime = new Date().getTime();
			setTargetTime((prevTime) => unpauseTime - pauseTime + prevTime);
		}
		setTimer(timeFromMilliseconds(targetTime - new Date().getTime()));
		if (reset) {
			setTimerIsPaused((prevVal) => !prevVal);
		}
	};

	const resetHandler = () => {
		setTimerIsPaused(true);
		timerPauseHandler(false);
		setSessionResetConfirm(true);
	};

	const resetSessionHandler = (confirmed) => {
		if (confirmed) {
			setTimerIsSet(false);
			setTimerIsPaused(false);
			setTimer(null);
		}
		setSessionResetConfirm(false);
	};

	const saveSession = async () => {
		const handleSessionName = () => {
			if (sessionName.trim() === "") {
				return "Session finished " + new Date().toLocaleDateString();
			} else {
				return sessionName;
			}
		};
		console.log("SAVING???");
		const saveData = {
			sessionName: handleSessionName(),
			finished: new Date(),
			sessionDuration: initialTime,
			timeString: timerOutput(initialTime),
		};

		// if user is not logged in
		if (context.user === null) {
			let continueToLogin = window.confirm(
				"Not logged in. Login to save your session?"
			);
			setSessionIsFinished(false);
			if (continueToLogin) {
				localStorage.setItem(
					"studySessionData",
					JSON.stringify(saveData)
				);
				history.push("/login");
			}
			return;
		}

		try {
			const response = await fetch(
				"https://study-helper-app-default-rtdb.europe-west1.firebasedatabase.app/" +
					context.user +
					".json",
				{
					method: "POST",
					body: JSON.stringify(saveData),
				}
			);
			if (!response.ok) throw new Error("Failed to save session data");
		} catch (error) {
			console.log("error", error.message);
		}
		// Switch page to history once session is finished and saved
		setSessionIsFinished(false);
		history.push("/history");
	};

	// Check if unsaved study session data exists in localStorage
	useEffect(() => {
		let unsavedSession = JSON.parse(
			localStorage.getItem("studySessionData")
		);

		// Delete study session if user went to login page but returned
		if (context.user === null) {
			localStorage.removeItem("studySessionData");
			return;
		}

		if (unsavedSession) {
			console.log("Unsaved session", unsavedSession);

			fetch(
				"https://study-helper-app-default-rtdb.europe-west1.firebasedatabase.app/" +
					context.user +
					".json",
				{
					method: "POST",
					body: JSON.stringify(unsavedSession),
				}
			)
				.then((res) => {
					// console.log(res);
					if (!res.ok) {
						throw new Error("Failed to save data");
					}
				})
				.catch((error) => {
					console.log("ERROR", error);
				})
				.finally(() => {
					localStorage.removeItem("studySessionData");
					history.push("/history");
				});
		}
	}, [context.user, history]);

	useEffect(() => {
		const timerHandler = () => {
			const remainingTime = targetTime - new Date().getTime();

			if (remainingTime < 0) {
				setTimerIsSet(false);
				setSessionIsFinished(true);
				return;
			}

			const newTimer = timeFromMilliseconds(remainingTime);
			setTimer(newTimer);

			// set current timer as seconds
			const secondsNow = remainingTime / 1000;
			// calculate percentage
			setBarWidth((secondsNow / initialSeconds) * 100);
		};

		let countdown;
		if (timerIsSet && !timerIsPaused) {
			countdown = setTimeout(() => timerHandler(), 1000);
		}
		return () => {
			clearTimeout(countdown);
		};
	}, [timerIsSet, timer, timerIsPaused, targetTime, initialSeconds]);

	let modalContent = null;

	/* Modal for when session has finished */
	if (sessionIsFinished) {
		modalContent = (
			<Modal
				title="Congratulations on finishing your study session!"
				onConfirm={saveSession}
				onClose={() => setSessionIsFinished(false)}
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
			<Prompt
				when={timerIsSet}
				message="Are you sure you want to leave the page? Unsaved data will be lost."
			/>
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
						disabled={timerIsSet}
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
						disabled={timerIsSet}
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
						disabled={timerIsSet}
						value={secondsInput}
						onChangeHandler={secondsInputHandler}
					/>
				</div>
				<Button
					disabled={timerIsSet}
					onClickHandler={timerStartHandler}
				>
					Start
				</Button>
				<Button
					onClickHandler={timerPauseHandler}
					disabled={!timerIsSet}
				>
					<i className="fa fa-play" aria-hidden="true"></i>/
					<i className="fa fa-pause" aria-hidden="true"></i>
				</Button>
				<Button onClickHandler={resetHandler} disabled={!timerIsSet}>
					Reset
				</Button>
				{timerIsSet && (
					<div className={styles.time}>{timerOutput(timer)}</div>
				)}
				{timerIsSet && (
					<TimerBar isPaused={timerIsPaused} width={barWidth} />
				)}
			</main>
		</React.Fragment>
	);
};

export default Timer;
