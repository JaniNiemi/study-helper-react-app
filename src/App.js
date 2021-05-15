import "./App.css";
import Study from "./views/Study";
import History from "./views/History";
import Login from "./views/Login";
import Signup from "./views/Signup";
import AppContainer from "./components/UI/AppContainer";
import Header from "./components/UI/Header";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./store/auth/AuthContext";

function App() {
	const context = useContext(AuthContext);

	let redirect = null;

	if (context.user !== "") {
		redirect = <Redirect from="login" to="/" />;
	}

	return (
		<BrowserRouter>
			<AppContainer>
				<Header />
				<Switch>
					<Route exact path="/" component={Study} />
					<Route path="/history" component={History} />
					<Route path="/login" component={Login}>
						{redirect}
					</Route>
					<Route path="/signup" component={Signup} />
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
