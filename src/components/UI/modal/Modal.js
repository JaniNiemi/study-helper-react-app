import React from "react";
import Button from "../button/Button";
import styles from "./Modal.module.css";

const Modal = (props) => {
	return (
		<React.Fragment>
			<div
				onClick={props.onClickHandler}
				className={styles.backdrop}
			></div>
			<div className={styles.modal}>
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
						onClickHandler={props.onClose}
					>
						Close
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Modal;
