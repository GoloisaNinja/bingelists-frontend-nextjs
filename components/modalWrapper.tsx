import React, { PropsWithChildren } from "react";
import Overlay from "@/components/overlay";
const ModalWrapper = ({ children }: PropsWithChildren) => {
    return (
        <>
            {children}
            <Overlay />
        </>
    );
}
export default ModalWrapper;
