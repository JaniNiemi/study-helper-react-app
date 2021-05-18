import "./App.css";
import Study from "./views/Study";
import History from "./views/History";
import LoginPage from "./views/LoginPage";
import SignupPage from "./views/SignupPage";
import AppContainer from "./components/UI/AppContainer";
import Header from "./components/UI/Header";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "./store/auth/AuthContext";

function App() {
	const context = useContext(AuthContext);
	const { checkLogin } = context;

	useEffect(() => {
		checkLogin();
	}, [checkLogin]);

	let redirect = null;

	if (context.user !== null) {
		redirect = <Redirect to="/" />;
	}

	return (
		<BrowserRouter>
			<AppContainer>
				<Header />
				<Switch>
					<Route exact path="/" component={Study} />
					<Route path="/history" component={History} />
					<Route path="/login" component={LoginPage}>
						{redirect}
					</Route>
					<Route path="/signup" component={SignupPage}>
						{redirect}
					</Route>

					{/* Redirect to main page if route not found */}
					<Route path="*">
						<Redirect to="/" />
					</Route>
				</Switch>
			</AppContainer>
		</BrowserRouter>
	);
}

export default App;
