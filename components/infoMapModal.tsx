import React from 'react';
import styles from "@/styles/InfoMapModal.module.scss";

interface InfoMap {
    info: Map<string, string>
    closeModal: () => void
}
const InfoMapModal:React.FC<InfoMap> = (props) => {
    const infoArray:string[][] = [];
    props.info.forEach((value, key) => {
        infoArray.push([key, value]);
    })
    return (
        <div className={styles.modal_container}>
            {infoArray.map((set) => (
                <div key={set[0] + set[1]}>
                    <p>{set[0]}</p>
                    <p>{set[1]}</p>
                </div>
            ))}
            <div className={styles.btngroup}>
                <button
                    onClick={() => props.closeModal()}
                >close</button>
            </div>

        </div>
    );
}
export default InfoMapModal