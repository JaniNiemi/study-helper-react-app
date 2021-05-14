import { createContext } from "react";

const AuthContext = createContext({
	user: "",
	token: null,
	signInUrl: "",
	signUpUrl: "",
	signIn: () => {},
	logout: () => {},
});

export default AuthContext;
