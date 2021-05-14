import { useReducer } from "react";
import AuthContext from "./AuthContext";

const initialState = {
	user: "qLZaxxhhNYQQJc3K20Bhu0VHAwp2", //Placeholder until login functionality finished
	token: null,
	signUpUrl:
		"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAV99CpqWOjFq2LxBbn-630eT10R7BrGTg",
	signInUrl:
		"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAV99CpqWOjFq2LxBbn-630eT10R7BrGTg",
};

const authReducer = (state, action) => {
	switch (action.type) {
		case "SIGN_IN":
			return {
				...state,
				user: action.payload.user,
			};

		case "LOGOUT":
			return initialState;

		default:
			console.warn("Unknown action");
			return state;
	}
};

const Authprovider = (props) => {
	let [state, dispatch] = useReducer(authReducer, initialState);

	const signInHandler = (user) => {
		dispatch({ type: "SIGN_IN", payload: { user } });
	};

	const logoutHandler = () => {
		dispatch({ type: "LOGOUT" });
	};

	const context = {
		user: state.user,
		token: state.token,
		signInUrl: state.signInUrl,
		signUpUrl: state.signUpUrl,
		signIn: signInHandler,
		logout: logoutHandler,
	};

	return (
		<AuthContext.Provider value={context}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default Authprovider;
