import styles from "../styles/Spinner.module.css";
export default function Spinner(): JSX.Element {
    return (
        <>
            <div className={styles.spinner}></div>
            <div className={styles.overlay}></div>
        </>
    );
}