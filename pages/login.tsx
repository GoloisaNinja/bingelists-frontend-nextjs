import {ChangeEvent, FormEvent, useState} from "react";
import Head from 'next/head';
import Link from "next/link";
import {useRouter} from "next/router";
import axios, {AxiosResponse} from "axios";
import { useDispatch } from "react-redux";
import { authenticate, User } from "@/features/auth/authSlice";
import styles from '@/styles/Login.module.scss';
import {BINGE_DEVAPI_BASE_URL} from "@/constants";
import {CreateAlert} from "@/utils/alertFactory";
import {removeAlert, setAlert} from "@/features/alert/alertSlice";

export default function Login(): JSX.Element {
    const dispatch = useDispatch();
    const router = useRouter();
    type FormData = {
        email: string,
        password: string,
    }
    const initialForm: FormData = {
        email: "",
        password: "",
    }
    const [formData, setFormData] = useState<FormData>(initialForm);
    const { email, password } = formData;

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-type": "application/json",
            }
        }
        const body = JSON.stringify(formData);
        try {
            const resp: AxiosResponse<User> = await axios.post(BINGE_DEVAPI_BASE_URL + "/auth/new/authenticate", body, config);
            if (resp.status === 200) {
                dispatch(authenticate(resp.data))
                router.push("/trending/landing").then(() => {
                    const alert = CreateAlert("success", "logged in!")
                    dispatch(setAlert(alert));
                    setTimeout(() => {dispatch(removeAlert(alert.id))}, 5000);
                });
            }
        } catch(e: any) {
            console.log(e.message)
            const alert = CreateAlert("danger", e.message);
            dispatch(setAlert(alert));
            setTimeout(() => {dispatch(removeAlert(alert.id))}, 5000);
        }

    }
    return (
        <>
            <Head>
                <title>Binge Lists | Login Page</title>
                <meta name={"description"} content={"Login to Binge Lists to manage your Movies, Tv, Favourites, and share what to Binge next!"} />
            </Head>
            <div className={styles.page_container}>
                <div className={styles.container}>
                    <div className={styles.bgimg}></div>
                    <div className={styles.form_container}>
                        <h1><span className={styles.span_blue}>B</span>inge <span className={styles.span_yellow}>L</span>ogin</h1>
                        <div className={styles.form_wrapper}>
                            <form className={styles.login_form} onSubmit={(e) => handleSubmit(e)}>
                                <label>Email</label>
                                <input type={"email"}
                                       name={"email"}
                                       autoFocus={true}
                                       autoComplete={"email-address"}
                                       value={email}
                                       onChange={(e) => handleInput(e)}
                                ></input>
                                <label>Password</label>
                                <input type={"password"}
                                       name={"password"}
                                       autoComplete={"current-password"}
                                       value={password}
                                       onChange={(e) => handleInput(e)}
                                ></input>
                                <button type={"submit"} className={styles.btn_submit}>login</button>
                            </form>
                            <h4>No Account? Register <Link href={"/register"}>here</Link></h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}