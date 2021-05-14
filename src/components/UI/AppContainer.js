import styles from "./AppContainer.module.css";

const AppContainer = (props) => {
  return (
    <div className={styles.container}>
      {props.children}
    </div>
  )
}

export default AppContainer;