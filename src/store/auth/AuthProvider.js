import { useCallback, useReducer } from "react";
import AuthContext from "./AuthContext";

const initialState = {
	user: null,
	token: null,
};

const authReducer = (state, action) => {
	switch (action.type) {
		case "SIGN_IN":
			localStorage.setItem("user", action.payload.user);
			localStorage.setItem("token", action.payload.token);
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
			};

		case "LOGOUT":
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			return initialState;

		case "CHECK":
			const user = localStorage.getItem("user");
			const token = localStorage.getItem("token");
			if (user) {
				return {
					...state,
					user,
					token,
				};
			}
			return state;

		default:
			console.warn("Unknown action");
			return state;
	}
};

const Authprovider = (props) => {
	let [state, dispatch] = useReducer(authReducer, initialState);

	const signInHandler = (user, token) => {
		dispatch({ type: "SIGN_IN", payload: { user, token } });
	};

	const logoutHandler = () => {
		dispatch({ type: "LOGOUT" });
	};

	const checkLoginHandler = useCallback(() => {
		dispatch({ type: "CHECK" });
	}, []);

	const context = {
		user: state.user,
		token: state.token,
		signInUrl: state.signInUrl,
		signUpUrl: state.signUpUrl,
		signIn: signInHandler,
		logout: logoutHandler,
		checkLogin: checkLoginHandler,
	};

	return (
		<AuthContext.Provider value={context}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default Authprovider;
