import React from 'react';
import styles from "@/styles/ConfirmCancelModal.module.scss";

interface ConfirmCancelProps {
    message: string,
    handleModalDecision: (confirmed: boolean) => void
}

const ConfirmCancelModal:React.FC<ConfirmCancelProps> = (props) => {
    const handleModal = (confirmed: boolean) => {
        props.handleModalDecision(confirmed);
    }

    return (
        <div className={styles.modal_container}>
            <h4>{props.message}</h4>
            <div className={styles.modal_btn_container}>
                <button onClick={() => handleModal(true)}>confirm</button>
                <button onClick={() => handleModal(false)}>cancel</button>
            </div>
        </div>
    );
}
export default ConfirmCancelModal