import React from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {authSelector, logout} from "@/features/auth/authSlice";
import {useDispatchAlert} from "@/utils/alertFactory";
import useSWR from "swr";
import {BINGE_BASE_URL} from "@/constants";

export interface ServerAuthProps {
    method: string,
    url: string,
    body: Object,
}

const useAuthRouteForResponseOrRedirect:React.FC<ServerAuthProps> = (props):any => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { dispatchAlert } = useDispatchAlert();
    const { token, isAuthenticated } = useSelector(authSelector);
    const fetcher = (url: string) => axios({
        method: props.method,
        url,
        headers: {"Content-type": "application/json", "Authorization": "Bearer " + token.token},
    }).then((res) => res.data);
    const { data, error, isLoading, mutate } = useSWR(BINGE_BASE_URL + props.url, fetcher);
    if (error) {
        if (error.hasOwnProperty("response")) {
            let location = window.location;
            if (error.response.status === 403 && location.href !== 'https://bingelists.app/login') {
                router.push("/login").then(() => {
                    if (isAuthenticated) {
                        dispatch(logout());
                    }
                    dispatchAlert("danger", "please authenticate");
                });
            }
        }
        return {
            data: null,
            isLoading: false,
            mutate,
        };
    }
    return {
        data, isLoading, mutate
    };
}
export default useAuthRouteForResponseOrRedirect;