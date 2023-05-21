import React, {useState} from 'react';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import Link from "next/link";
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import Spinner from "@/components/spinner";
import styles from "@/styles/Invite.module.scss";

interface IPublicUser {
    _id: string,
    name: string,
    isPrivate: boolean,
    createdAt: string,
}
interface IInviteData {
    bingeListId: string,
    bingeListName: string,
    invitedByName: string,
    invitedById: string,
    invitedUserName: string,
    invitedId: string,
    message: string,
}
export default function InviteList() {
    const router = useRouter();
    const listId = router.query.id as string;
    const listName = router.query.name as string;
    const { _id, name } = useSelector(authSelector)
    const baseFormData: IInviteData = {
        bingeListId: listId,
        bingeListName: listName,
        invitedByName: name,
        invitedById: _id,
        invitedUserName: "",
        invitedId: "",
        message: "",
    }
    const [inviteData, setInviteData] = useState<IInviteData>(baseFormData)

    const s: ServerAuthProps = {
        method: "GET",
        url: "/user/users",
        body: {},
    }
    const {data, isLoading}:any = useAuthRouteForResponseOrRedirect(s)
    const resetInviteDate = () => {
        setInviteData({...inviteData, invitedId: "", invitedUserName: ""})
    }
    const handleUserSelect = (e:React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (e.target.checked) {
            let checked: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input[type="checkbox"]:checked`)
            checked.forEach((el:HTMLInputElement) => {
                if (el.value !== e.target.value) {
                    el.checked = false;
                }
            })
            setInviteData({...inviteData, invitedId: e.target.value, invitedUserName: name})
        } else {
            resetInviteDate()
        }
    }

    return isLoading ? (<Spinner />) : (
        <div className={styles.invite_page_container}>
            <div className={styles.invite_hero}>
                <h1>Binge</h1>
                <h1>Together.</h1>
                <Link href={"/lists"}>
                    <button className={styles.hero_btn}>back to lists</button>
                </Link>
            </div>
            <div className={styles.invite_main}>
                <h2><span className={styles.blue_span}>Step 1:</span> Choose a user</h2>
                <div className={styles.table_container}>
                    <table className={styles.invite_table}>
                        <thead>
                        <tr>
                            <th>Select</th>
                            <th>User</th>
                            <th>User Since</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.data.length > 0 && data.data.map((user:IPublicUser) => user._id !== _id &&(
                            <tr key={user._id}>
                                <td>
                                    <input
                                        type={"checkbox"}
                                        value={user._id}
                                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleUserSelect(e, user.name)}
                                    />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.createdAt.slice(0, 10)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <h2><span className={styles.blue_span}>Step 2:</span> Write a short message</h2>
                <div className={styles.invite_msg_container}>
                    <textarea
                        className={styles.invite_msg}
                        maxLength={500}
                        onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                        placeholder={"ex. Hey Wifers! This is an invite to our bingelist! - from your adoring hubs"}
                    >
                    </textarea>
                </div>
                <h2><span className={styles.blue_span}>Step 3:</span> Confirm & send</h2>
                {inviteData.invitedUserName ? (
                    <button className={styles.invite_btn}>Send invite</button>
                ) : (
                    <p className={styles.invite_nouser}>a user must be selected...</p>
                )}

            </div>
        </div>
    );
}