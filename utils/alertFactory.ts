import {Alert, removeAlert, setAlert} from "@/features/alert/alertSlice";
import {nanoid} from "nanoid";
import {useDispatch} from "react-redux";

export function CreateAlert(type: string, message: string): Alert {
    const id = nanoid(6);
    return {
        id,
        type,
        message,
    };
}

export function useDispatchAlert() {
    const dispatch = useDispatch();
    const dispatchAlert = (type: string, message: string) => {
        const alert =  CreateAlert(type, message);
        dispatch(setAlert(alert));
        setTimeout(() => {dispatch(removeAlert(alert.id))}, 5000);
    }
    return { dispatchAlert };
}