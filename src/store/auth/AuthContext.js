import { createContext } from "react";

const AuthContext = createContext({
	user: "",
	token: null,
	signInUrl: "",
	signUpUrl: "",
	signIn: () => {},
	logout: () => {},
	checkLogin: () => {},
});

export default AuthContext;
