import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import axios from 'axios';
import {BINGE_BASE_URL, API_HEADER} from "@/constants";
import {useDispatchAlert} from "@/utils/alertFactory";
import {authSelector, changeName, changePrivacy} from "@/features/auth/authSlice";
import styles from "@/styles/Profile.module.scss";
import {useRouter} from "next/router";
import Spinner from "@/components/spinner";

export default function ProfilePage() {
    const {name, isPrivate, isAuthenticated, token} = useSelector(authSelector);
    const dispatch = useDispatch()
    const {dispatchAlert} = useDispatchAlert();
    const router = useRouter();
    const [newName, setNewName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    API_HEADER.headers.Authorization = "Bearer " + token.token;
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login").then();
        }
    },[isAuthenticated, router])

    useEffect(() => {}, [name, isPrivate])
    const handleNameChange = async () => {
        setIsLoading(true);
        const nameChange = newName.trim();
        if (!nameChange.length) {
            dispatchAlert("danger", "username cannot be blank");
            setIsLoading(false);
            setNewName("");
            return;
        }
        const url = BINGE_BASE_URL + "/user/change/name"
        const body = JSON.stringify({"name": nameChange})
        try {
            const res = await axios.post(url, body, API_HEADER);
            if (res.status === 200) {
                dispatchAlert("success", "username changed successfully")
                const user = res.data.data;
                dispatch(changeName(user));
            }
        } catch(e: any) {
            let alertMessage = e.message;
            if (e.hasOwnProperty("response")) {
                if (e.response.data) {
                    alertMessage = e.response.data.message;
                }
            }
            dispatchAlert("danger", alertMessage);
        } finally {
            setIsLoading(false);
            setNewName("");
        }
    }

    const handlePrivacy = async () => {
        setIsLoading(true);
        const url = BINGE_BASE_URL + "/user/change/privacy";
        const body = JSON.stringify({"isPrivate": !isPrivate})
        try {
            const res = await axios.post(url, body, API_HEADER);
            if (res.status === 200) {
                const user = res.data.data
                dispatchAlert("success", "privacy changed")
                dispatch(changePrivacy(user))
            }
        } catch(e: any) {
            let alertMessage = e.message;
            if (e.hasOwnProperty("response")) {
                if (e.response.data) {
                    alertMessage = e.response.data.message;
                }
            }
            dispatchAlert("danger", alertMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return !isAuthenticated || isLoading ? (<Spinner />) : (
        <div className={styles.profile_container}>
            <div className={styles.profile_hero}>
                <div className={styles.profile_bg}></div>
                <h1>Hello</h1>
                <h1>{name}!</h1>
            </div>
            <div className={styles.profile_actions_container}>
                <h2><span className={styles.blue_span}>Profile</span> Overview</h2>
                <h3>Current Username:</h3>
                <h3 className={styles.profile_current_value}>{name}</h3>
                <h3>Account Privacy:</h3>
                <h3 className={styles.profile_current_value}>{isPrivate ? "Private" : "Public"}</h3>
                <hr></hr>
                <h3><span className={styles.yellow_span}>Name</span> Change</h3>
                <input
                    className={styles.profile_input}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    maxLength={10}
                    placeholder={"new username"} />
                <button
                    className={newName ? `${styles.profile_btn}` : `${styles.profile_btn} ${styles.isDisabled}`}
                    onClick={() => handleNameChange()}
                >change name</button>
                <h3><span className={styles.yellow_span}>Privacy</span> Change*</h3>
                <button
                    className={styles.profile_btn}
                    onClick={() => handlePrivacy()}
                >{isPrivate ? "go public" : "go private"}</button>
                <p className={styles.profile_disclaimer_heading}>*Quick note on privacy setting</p>
                <p className={styles.profile_disclaimer}>If your account privacy is public, only your username is displayed to other users, and only
                    when other users are searching for binge partners via the BingeList invite action. None of your other
                    user data, such as email or security settings, are displayed. Many users choose to change their account
                    privacy to public just long enough to receive an invite/invites from their friends before changing
                    their accounts back to private, thereby preventing any further invites from users they may not know.
                    The privacy setting can always be changed and can be toggled as much as you like to suit your needs.
                </p>
            </div>

        </div>
    );
}