import { createContext } from "react";

const AuthContext = createContext({
	user: null,
	token: null,
	signIn: () => {},
	logout: () => {},
	checkLogin: () => {},
});

export default AuthContext;
