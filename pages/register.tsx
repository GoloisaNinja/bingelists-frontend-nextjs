import {FormEvent, useState} from 'react';
import {useRouter} from "next/router";
import {useDispatchAlert} from "@/utils/alertFactory";
import {useDispatch} from "react-redux";
import {authenticate} from "@/features/auth/authSlice";
import {useMinifiedListLoaders} from "@/utils/initialListLoaders";
import axios from "axios";
import {BINGE_BASE_URL} from "@/constants";
import Head from 'next/head';
import Link from "next/link";
import styles from '@/styles/Register.module.scss';
export default function Register(): JSX.Element {
    const {dispatchAlert} = useDispatchAlert();
    const dispatch = useDispatch();
    const router = useRouter();
    const { dispatchLoadingMinifiedBingeLists, dispatchLoadingMinifiedFavorites} = useMinifiedListLoaders();
    type Registration  = {
        username: string
        email: string;
        password: string;
        confirmPassword: string;
        appearPublic: boolean
    }
    const initRegistration:Registration = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        appearPublic: false
    }
    const [formData, setFormData] = useState<Registration>(initRegistration!);
    const { username, email, password, confirmPassword, appearPublic} = formData;
    const handleRegistration = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            dispatchAlert("danger", "passwords must match!")
            return;
        }
        const body = JSON.stringify({
            name: username,
            email,
            password,
            isPrivate: !appearPublic
        })
        try {
            const resp = await axios.post(BINGE_BASE_URL + "/user/register", body)
            if (resp.status === 200) {
                let user = resp.data.data;
                dispatch(authenticate(user));
                await dispatchLoadingMinifiedBingeLists(user.token.token)
                await dispatchLoadingMinifiedFavorites(user.token.token);
                router.push("/trending/landing").then(() => {
                    dispatchAlert("success", `Welcome to BingeLists ${username}!`)
                })
            }
        } catch(e: any) {
            console.log(e)
            dispatchAlert("danger", e.message)
        }
    }
    return (
        <>
            <Head>
                <title>Binge Lists | Register Page</title>
                <meta name={"description"} content={"Register an account with Binge Lists to manage your Movies, Tv, Favourites, and share what to Binge next!"} />
            </Head>
            <div className={styles.page_container}>
                <div className={styles.container}>
                    <div className={styles.bgimg}></div>
                    <div className={styles.form_container}>
                        <h1><span className={styles.span_blue}>B</span>inge <span className={styles.span_yellow}>R</span>egister</h1>
                        <div className={styles.form_wrapper}>
                            <form className={styles.login_form} onSubmit={(e) => handleRegistration(e)}>
                                <label>Username</label>
                                <input type={"text"}
                                       name={"username"}
                                       required={true}
                                       value={username}
                                       onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                                       autoFocus={true}></input>
                                <label>Email</label>
                                <input type={"email"}
                                       name={"email"}
                                       required={true}
                                       value={email}
                                       onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                                ></input>
                                <label>Password (min length 9 chars)</label>
                                <input type={"password"}
                                       minLength={9}
                                       name={"password"}
                                       required={true}
                                       autoComplete={"current-password"}
                                       value={password}
                                       onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                                ></input>
                                <label>Confirm Password</label>
                                <input type={"password"}
                                       minLength={9}
                                       name={"confirmPassword"}
                                       autoComplete={"current-password"}
                                       required={true}
                                       value={confirmPassword}
                                       onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                                ></input>
                                <label>Appear Public*</label>
                                <input className={styles.checkbox}
                                       id={"appearPublic"}
                                       type={"checkbox"}
                                       name={"appearPublic"}
                                       value={appearPublic.toString()}
                                       onChange={(e) => setFormData({...formData, [e.target.name]: e.target.checked})}
                                ></input>
                                <p>*Appearing public allows other users to see your username and invite you to BingeLists. Only your username can be seen. This can be changed later in profile settings.</p>
                                <button className={styles.btn_submit}
                                        type={"submit"}
                                >register</button>
                            </form>
                            <h4>Have an Account? Login <Link href={"/login"}>here</Link></h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}