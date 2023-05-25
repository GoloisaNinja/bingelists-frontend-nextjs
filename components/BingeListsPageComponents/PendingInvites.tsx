import React, {useState} from 'react';
import axios from 'axios';
import {useSelector} from "react-redux";
import {FaChevronRight, FaChevronDown} from 'react-icons/fa'
import {authSelector} from "@/features/auth/authSlice";
import {BINGE_BASE_URL} from "@/constants";
import {Invite} from "@/utils/inviteInterface";
import useSWR from "swr";
import styles from "@/styles/PendingInvites.module.scss";

const PendingInvites:React.FC = () => {
    const {token} = useSelector(authSelector)
    const [showSent, setShowSent] = useState<boolean>(false);
    const url = BINGE_BASE_URL + "/invites"
    const fetcher = () => axios({
        method: "GET",
        url,
        headers: {"Content-type": "application/json", "Authorization": `Bearer ${token.token}`}
    }).then((res) => res.data)
    const {data, isLoading, error} = useSWR(url, fetcher)
    const expand = () => {
        const table = document.getElementById("invite_table")!
        setShowSent(!showSent);
        if (table.classList.contains(styles.show)) {
            table.classList.remove(styles.show)
        } else {
            table.classList.add(styles.show)
        }
    }
    return !isLoading && data.data !== null ? (
        <div className={styles.pending_container}>
            <div className={styles.invites_header}>
                <h3><span className={styles.blue_span}>Sent</span> Invites</h3>
                <button onClick={() => expand()}>
                    {showSent ? <FaChevronDown /> : <FaChevronRight />}
                </button>
            </div>
            <div className={styles.table_container}>
                <table
                    id={"invite_table"}
                    className={styles.pending_table}>
                    <thead>
                        <tr>
                            <th>List</th>
                            <th>Invited</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.data.map((invite:Invite) => (
                        <tr key={invite._id}>
                            <td>{invite.bingeListName}</td>
                            <td>{invite.invitedName}</td>
                            <td>{invite.pending ? "pending accept" : "no longer pending"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : null;
}
export default PendingInvites