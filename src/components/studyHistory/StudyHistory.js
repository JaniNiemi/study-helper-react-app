import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../UI/loader/Loader";
import AuthContext from "../../store/auth/AuthContext";
import styles from "./History.module.css";

const History = (props) => {
	const [loading, setLoading] = useState(true);
	const [history, setHistory] = useState([]);

	const context = useContext(AuthContext);

	const fetchStudyHistory = useCallback(async () => {
		if (context.user === null) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const response = await fetch(
			`https://study-helper-app-default-rtdb.europe-west1.firebasedatabase.app/${context.user}.json`
		);
		const data = await response.json();

		let newHistory = [];
		for (const key in data) {
			newHistory.push(data[key]);
		}
		setHistory(newHistory);
		setLoading(false);
	}, [context.user]);

	useEffect(() => {
		fetchStudyHistory();
	}, [fetchStudyHistory]);

	if (loading) {
		return <Loader />;
	}

	let content = "";

	if (context.user === null) {
		content = (
			<Link to="/login">
				<p>Log in to start saving your study sessions</p>
			</Link>
		);
	} else {
		content = (
			<table>
				<thead>
					<tr>
						<th>Session name</th>
						<th>Date</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					{history.map((item) => (
						<tr key={item.finished}>
							<td>{item.sessionName}</td>
							<td>
								{new Date(item.finished).toLocaleString(
									"en-GB"
								)}
							</td>
							<td>{item.timeString}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	}

	return (
		<main className={styles.history}>
			<h2>Your study history</h2>
			{content}
		</main>
	);
};

export default History;
