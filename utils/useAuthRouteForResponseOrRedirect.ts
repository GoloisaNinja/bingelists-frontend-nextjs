import React from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {authSelector, logout} from "@/features/auth/authSlice";
import {setAlert, removeAlert} from "@/features/alert/alertSlice";
import {CreateAlert} from "@/utils/alertFactory";
import useSWR from "swr";
import {BINGE_DEVAPI_BASE_URL} from "@/constants";

export interface ServerAuthProps {
    method: string,
    url: string,
    body: Object,
}

const useAuthRouteForResponseOrRedirect:React.FC<ServerAuthProps> = (props):any => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { token, isAuthenticated } = useSelector(authSelector);
    const fetcher = (url: string) => axios({
        method: props.method,
        url,
        headers: {"Content-type": "application/json", "Authorization": "Bearer " + token},
    }).then((res) => res.data);
    const { data, error, isLoading, mutate } = useSWR(BINGE_DEVAPI_BASE_URL + props.url, fetcher);
    if (error) {
        if (error.hasOwnProperty("response")) {
            if (error.response.status === 403) {
                router.push("/login").then(() => {
                    const alert = CreateAlert("danger", "please authenticate");
                    if (isAuthenticated) {
                        dispatch(logout());
                    }
                    dispatch(setAlert(alert));
                    setTimeout(() => {dispatch(removeAlert(alert.id))},5000)
                });
            }
        }  else {
            router.push("/login").then(() => {
                const alert = CreateAlert("danger", "server error - please try later");
                if (isAuthenticated) {
                    dispatch(logout());
                }
                dispatch(setAlert(alert));
                setTimeout(() => {dispatch(removeAlert(alert.id))},5000)
            });
        }
        return {
            data: null,
            isLoading: true,
        };
    }
    return {
        data, isLoading, mutate
    };
}
export default useAuthRouteForResponseOrRedirect;