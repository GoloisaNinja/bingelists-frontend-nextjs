import React, { PropsWithChildren } from "react";
import Navbar from "@/components/navbar";
import Alert from "@/components/alert";
import Footer from "@/components/footer";
import styles from "@/styles/Landing.module.scss";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.main_div}>
            <Navbar />
            <Alert />
            {children}
            <Footer />
        </div>
    );
}
export default Layout;
