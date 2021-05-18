export const timeFromMilliseconds = (milliseconds) => {
	const hours = Math.floor(milliseconds / 3600000);
	const minutes = Math.floor((milliseconds - hours * 3600000) / 60000);
	const seconds = Math.round(
		((milliseconds - hours * 3600000 - ((hours * 3600000) % 3600)) / 1000) %
			60
	);

	return {
		hours,
		minutes,
		seconds,
	};
};

export const timerOutput = (time) => {
	const hours = time.hours > 9 ? time.hours : "0" + time.hours;
	const minutes = time.minutes > 9 ? time.minutes : "0" + time.minutes;
	const seconds = time.seconds > 9 ? time.seconds : "0" + time.seconds;
	return `${hours}:${minutes}:${seconds}`;
};

export const signUpUrl =
	"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAV99CpqWOjFq2LxBbn-630eT10R7BrGTg";
export const signInUrl =
	"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAV99CpqWOjFq2LxBbn-630eT10R7BrGTg";
