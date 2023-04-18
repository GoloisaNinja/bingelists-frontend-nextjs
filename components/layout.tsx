import React, { PropsWithChildren } from "react";
import Navbar from "@/components/navbar";
import Alert from "@/components/alert";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Alert />
            <Navbar />
            {children}
        </>
    );
}
export default Layout;
