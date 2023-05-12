import React from 'react'
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {authSelector, logout} from "@/features/auth/authSlice";
import {useDispatchAlert} from "@/utils/alertFactory";
import {API_HEADER, BINGE_DEVAPI_BASE_URL} from "@/constants";
import styles from "../styles/Navbar.module.scss";

const Navbar: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {dispatchAlert} = useDispatchAlert();
    const auth = useSelector(authSelector);
    const handleHamburger = () => {
        const hamburger = document.getElementById("hamburger")!;
        const dropdown = document.getElementById("dropdown")!;
        if (hamburger.classList.contains(styles.close)) {
            hamburger.classList.remove(styles.close);
            dropdown.classList.remove(styles.isActive);
        } else {
            hamburger.classList.add(styles.close);
            dropdown.classList.add(styles.isActive);
        }
    }
    const toggleProfileDrop = () => {
        const drop = document.getElementById("profile_dropdown")!;
        if (drop.classList.contains(styles.show)) {
            drop.classList.remove(styles.show);
        } else {
            drop.classList.add(styles.show);
        }
    }
    const handleLogout = async () => {
        API_HEADER.headers.Authorization = "Bearer " + auth.token.token;
        try {
            const resp = await axios.post(BINGE_DEVAPI_BASE_URL + "/user/logout", {}, API_HEADER);
            if (resp.status === 200) {
                dispatch(logout());
                router.push("/login").then(() => {
                    dispatchAlert("success", "come back soon!");
                })
            }
        } catch (e: any) {
            dispatch(logout());
            router.push("/login").then(() => {
                dispatchAlert("danger", "logged out...with issues...")
            })
        }

    }
    const handleDropLinks = (url: string) => {
        if (url === "logout") {
            toggleProfileDrop();
            handleLogout().then(() => {
                return;
            })
        }
        toggleProfileDrop();
        router.push(url).then();
    }
    const handleHamburgerLogout = () => {
        handleHamburger();
        handleLogout().then();
    }
    return !auth.isAuthenticated ? (
            <nav className={styles.navbar}>
                <div>
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
                </div>
                <div>
                    <div className={styles.dropdown_container}
                         id={"dropdown"}>
                        <Link className={styles.links} href={"/"}>
                            <button onClick={() => handleHamburger()}>Home</button>
                        </Link>
                        <Link className={styles.links} href={"/login"}>
                            <button onClick={() => handleHamburger()}>Login</button>
                        </Link>
                        <Link className={styles.links} href={"/register"}>
                            <button onClick={() => handleHamburger()}>Register</button>
                        </Link>
                    </div>
                </div>
            </nav>
    ) : (
        <nav className={styles.navbar}>
            <div>
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
                <div className={styles.profile_icon_wrapper}>
                    <button className={styles.profile_link} onClick={() => toggleProfileDrop()}>
                        {auth.name.split("")[0].toUpperCase()}
                    </button>
                    <div id={"profile_dropdown"} className={styles.profile_dropdown}>
                        <button className={styles.links} onClick={() => handleDropLinks("/trending/landing")}>Favorites</button>
                        <button className={styles.links} onClick={() => handleDropLinks("/trending/landing")}>Profile</button>
                        <button className={styles.links} onClick={() => handleDropLinks("logout")}>Logout</button>
                    </div>
                </div>

            </div>
            </div>
            <div>
                <div className={styles.auth_dropdown_container}
                     id={"dropdown"}>
                    <p className={styles.drop_intro}>Welcome <span className={styles.yellow_span}>{auth.name.toUpperCase()}</span>!</p>
                    <Link className={styles.links} href={"/trending/landing"}>
                        <button onClick={() => handleHamburger()}>Trending</button>
                    </Link>
                    <Link className={styles.links} href={"/categories"}>
                        <button onClick={() => handleHamburger()}>Categories</button>
                    </Link>
                    <Link className={styles.links} href={"/lists"}>
                        <button onClick={() => handleHamburger()}>Lists</button>
                    </Link>
                    <Link className={styles.links} href={"/lists"}>
                        <button onClick={() => handleHamburger()}>Favorites</button>
                    </Link>
                    <Link className={styles.links} href={"/search"}>
                        <button onClick={() => handleHamburger()}>Search</button>
                    </Link>
                    <Link className={styles.links} href={"/trending/landing"}>
                        <button onClick={() => handleHamburger()}>Profile</button>
                    </Link>
                    <button className={styles.logout_link} onClick={() => handleHamburgerLogout()}>Logout</button>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;