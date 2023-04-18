import {Alert} from "@/features/alert/alertSlice";
import {nanoid} from "nanoid";

export function CreateAlert(type: string, message: string): Alert {
    const id = nanoid(6);
    return {
        id,
        type,
        message,
    };
}
