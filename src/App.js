import "./App.css";
import Study from "./views/Study";
import History from "./views/History";
import Login from "./views/Login";
import Signup from "./views/Signup";
import AppContainer from "./components/UI/AppContainer";
import Header from "./components/UI/Header";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Authprovider from "./store/auth/AuthProvider";

function App() {
	return (
		<Authprovider>
			<BrowserRouter>
				<AppContainer>
					<Header />
					<Switch>
						<Route exact path="/" component={Study} />
						<Route path="/history" component={History} />
						<Route path="/login" component={Login} />
						<Route path="/signup" component={Signup} />
						{/* Redirect to main page if route not found */}
						<Route path="*">
							<Redirect to="/" />
						</Route>
					</Switch>
				</AppContainer>
			</BrowserRouter>
		</Authprovider>
	);
}

export default App;
