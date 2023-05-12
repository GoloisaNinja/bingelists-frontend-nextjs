import React, {ReactElement} from 'react';
import {useSelector} from "react-redux";
import {alertSelector, Alert} from "@/features/alert/alertSlice";
import styles from "../styles/Alert.module.scss";
const AlertBanner:React.FC = (): ReactElement | null  => {
    const alerts = useSelector(alertSelector)
    return (
        <div className={styles.alert_container}>
            {alerts !== undefined && alerts.length > 0 ? alerts.map((alert: Alert) => (
                <div key={alert.id} className={styles[`alert_${alert.type}`]}>
                    {alert.message}
                </div>
            )): null}
        </div>
    )
}
export default AlertBanner