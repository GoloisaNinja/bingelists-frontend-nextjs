import React, { PropsWithChildren } from "react";
import Navbar from "@/components/navbar";
import Alert from "@/components/alert";
import styles from "@/styles/Landing.module.scss";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.main_div}>
            <Navbar />
            <Alert />
            {children}
        </div>
    );
}
export default Layout;
