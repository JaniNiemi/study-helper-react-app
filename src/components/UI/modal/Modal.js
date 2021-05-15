import React, { useState } from "react";
import Button from "../button/Button";
import styles from "./Modal.module.css";

const Modal = (props) => {
	const [modalClasses, setModalClasses] = useState(`${styles.modal} ${styles["slide-in"]}`)

	const closeModalHandler = () => {
		setModalClasses(`${styles.modal} ${styles["slide-out"]}`);
		setTimeout(()=> {
			props.onClose();
		}, 300);
	}

	return (
		<React.Fragment>
			<div
				onClick={props.onClickHandler}
				className={styles.backdrop}
			></div>
			<div className={modalClasses}>
				<h2>{props.title}</h2>
				<section>{props.children}</section>
				<div className={styles.actions}>
					{props.onConfirm && <Button
						btnClass=""
						onClickHandler={props.onConfirm}
					>
						Confirm
					</Button>}
					<Button
						btnClass="btn-danger"
						onClickHandler={closeModalHandler}
					>
						Close
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Modal;
