import React from 'react'
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {authSelector, logout} from "@/features/auth/authSlice";
import {removeAlert, setAlert} from "@/features/alert/alertSlice";
import {CreateAlert} from "@/utils/alertFactory";
import {API_HEADER, BINGE_DEVAPI_BASE_URL} from "@/constants";
import styles from "../styles/Navbar.module.scss";

const Navbar: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const handleHamburger = () => {
        const hamburger = document.getElementById("hamburger")!;
        if (hamburger.classList.contains(styles.close)) {
            hamburger.classList.remove(styles.close)
        } else {
            hamburger.classList.add(styles.close)
        }
    }
    const handleLogout = async() => {
        API_HEADER.headers.Authorization = auth.token;
        try {
            const resp = await axios.post(BINGE_DEVAPI_BASE_URL + "/auth/logout", API_HEADER);
            if (resp.status === 200) {
                const alert = CreateAlert("success", "come back soon!");
                dispatch(logout());
                router.push("/login").then(() => {
                    dispatch(setAlert(alert));
                    setTimeout(() => {dispatch(removeAlert(alert.id))}, 5000)
                })
            }
        } catch(e: any) {
            const alert = CreateAlert("danger", e.message + "...forced logout");
            dispatch(logout());
            router.push("/login").then(() => {
                dispatch(setAlert(alert))
                setTimeout(() => {dispatch(removeAlert(alert.id))}, 5000)
            })
        }

    }
    return !auth.isAuthenticated ? (
        <nav className={styles.navbar}>
            <div tabIndex={0}
                 id={"hamburger"}
                 onClick={() => handleHamburger()}
                 className={styles.menu_container}>
                <div id={styles.menu_line} className={styles.menu_line}></div>
                <div id={styles.menu_line} className={styles.menu_line}></div>
                <div id={styles.menu_line} className={styles.menu_line}></div>
            </div>
            <div className={styles.links_container}>
                <Link className={styles.links} href={"/"}>Home</Link>
                <Link className={styles.links} href={"/login"}>Login</Link>
                <Link className={styles.links} href={"/register"}>Register</Link>

            </div>
        </nav>
    ) : (
        <nav className={styles.navbar}>
            <div tabIndex={0}
                 id={"hamburger"}
                 onClick={() => handleHamburger()}
                 className={styles.menu_container}>
                <div id={styles.menu_line} className={styles.menu_line}></div>
                <div id={styles.menu_line} className={styles.menu_line}></div>
                <div id={styles.menu_line} className={styles.menu_line}></div>
            </div>
            <div className={styles.links_container}>
                <Link className={styles.links} href={"/trending/landing"}>Trending</Link>
                <Link className={styles.links} href={"/categories"}>Categories</Link>
                <Link className={styles.links} href={"/lists"}>Lists</Link>
                <Link className={styles.links} href={"/search"}>Search</Link>
                <button className={styles.links} onClick={() => handleLogout()}>Logout</button>
                <Link className={styles.profile_link} href={"/trending/landing"}>
                    {auth.name.split("")[0].toUpperCase()}
                </Link>
            </div>
        </nav>
    );
}
export default Navbar;