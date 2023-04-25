import Head from 'next/head';
import Link from "next/link";
import styles from '@/styles/Register.module.scss';
export default function Register(): JSX.Element {
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
                            <form className={styles.login_form}>
                                <label>Email</label>
                                <input type={"email"} name={"email"}
                                autoFocus={true}></input>
                                <label>Password</label>
                                <input type={"text"} name={"password"}></input>
                                <label>Confirm Password</label>
                                <input type={"text"} name={"password"}></input>
                                <button className={styles.btn_submit}>register</button>
                            </form>
                            <h4>Have an Account? Login <Link href={"/login"}>here</Link></h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}