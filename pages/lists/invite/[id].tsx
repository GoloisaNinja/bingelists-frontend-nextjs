import React, {useState, useMemo, useEffect} from 'react';
import axios from 'axios';
import {useRouter} from "next/router";
import {useSelector, useDispatch} from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import {useDispatchAlert} from "@/utils/alertFactory";
import Link from "next/link";
import {API_HEADER, BINGE_BASE_URL} from "@/constants";
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import Spinner from "@/components/spinner";
import {IInviteData} from "@/utils/inviteInterface";
import ConfirmCancelModal from "@/components/confirmCancelModal";
import ModalWrapper from "@/components/modalWrapper";
import styles from "@/styles/Invite.module.scss";

interface IPublicUser {
    _id: string,
    name: string,
    isPrivate: boolean,
    createdAt: string,
}

export default function InviteList() {
    const router = useRouter();
    const dispatch = useDispatch();
    const {dispatchAlert} = useDispatchAlert();
    const listId = router.query.id as string;
    const listName = router.query.name as string;
    const {_id, name, token} = useSelector(authSelector)
    const baseFormData: IInviteData = {
        bingeListId: listId,
        bingeListName: listName,
        invitedByName: name,
        invitedById: _id,
        invitedName: "",
        invitedId: "",
        message: "",
    }
    const [inviteData, setInviteData] = useState<IInviteData>(baseFormData)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [searchString, setSearchString] = useState<string>("")
    const [filteredUsers, setFilteredUsers] = useState<IPublicUser[]>([]);
    const s: ServerAuthProps = {
        method: "GET",
        url: "/user/users",
        body: {},
    }
    const {data, isLoading}: any = useAuthRouteForResponseOrRedirect(s)

    const initializeUsers = ():IPublicUser[] => {
        return []
    }

    let cleanUsers = useMemo(():IPublicUser[] => initializeUsers(), []);

    if (data) {
        cleanUsers = data.data;
    }
    const resetInviteData = () => {
        setInviteData(baseFormData)
    }
    const unCheckAllUsers = (selectedId:string = "") => {
        let checked: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input[type="checkbox"]:checked`)
        checked.forEach((el: HTMLInputElement) => {
            if (el.value !== selectedId) {
                el.checked = false;
            }
        })
    }
    const handleUserSelect = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        if (e.target.checked) {
            unCheckAllUsers(e.target.value)
            setInviteData({...inviteData, invitedId: e.target.value, invitedName: name})
        } else {
            resetInviteData()
        }
    }

    const attemptInvite = async() => {
        const body = JSON.stringify(inviteData)
        API_HEADER.headers.Authorization = "Bearer " + token.token
        try {
            const res = await axios.post(BINGE_BASE_URL + "/invites/create", body, API_HEADER)
            if (res.status === 200) {
                dispatchAlert("success", "invite success!")
            }
        } catch(e: any) {
            console.log(e)
            dispatchAlert("danger", e.message)
        }
    }

    const handleModalDecision = async (decision: boolean) => {
        if (decision) {
            await attemptInvite();
            unCheckAllUsers()
            resetInviteData()
        }
        setShowModal(false)
    }

    const handleUserSearch = (search: string) => {
        setSearchString(search);
        let filtered = cleanUsers.filter((user) => user.name.includes(search));
        setFilteredUsers(filtered);
    }

    useEffect(() => {
        if (cleanUsers !== undefined && cleanUsers.length > 0) {
            setFilteredUsers(cleanUsers)
        }
    }, [cleanUsers])

    return isLoading ? (<Spinner/>) : (
        <>
            <div className={styles.invite_page_container}>
                <div className={styles.invite_hero}>
                    <h1>Binge</h1>
                    <h1>Together.</h1>
                    <Link href={"/lists"}>
                        <button className={styles.hero_btn}>back to lists</button>
                    </Link>
                </div>
                {cleanUsers.length > 0 ? (
                    <div className={styles.invite_main}>
                        <h2><span className={styles.blue_span}>Step 1:</span> Choose a user</h2>
                        <input
                            className={styles.invite_search}
                            autoFocus={true}
                            placeholder={"search by username"}
                            value={searchString}
                            onChange={(e) => handleUserSearch(e.target.value)}
                        ></input>
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
                                {filteredUsers.map((user: IPublicUser) => (
                                    <tr key={user._id}>
                                        <td>
                                            <input
                                                type={"checkbox"}
                                                value={user._id}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUserSelect(e, user.name)}
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
                        maxLength={200}
                        value={inviteData.message}
                        onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                        placeholder={"ex. Hey <friend>, this is <you>! I am inviting you to join my BingeList dedicated to trashy reality TV!"}
                    >
                    </textarea>
                        </div>
                        <h2><span className={styles.blue_span}>Step 3:</span> Confirm & send</h2>
                        {inviteData.invitedName ? (
                            <button
                                className={styles.invite_btn}
                                onClick={() => setShowModal(true)}
                            >Send invite</button>
                        ) : (
                            <p className={styles.invite_nouser}>a user must be selected...</p>
                        )}

                    </div>
                    ) : (
                    <div className={styles.invite_main}>
                        <h2>Tell your friends about BingeLists - we need more users for invites to work!</h2>
                    </div>
                )}
            </div>
            {showModal && (
                <ModalWrapper>
                    <ConfirmCancelModal
                        message={`Are you sure you want to invite ${inviteData.invitedName} to the BingeList named ${inviteData.bingeListName}?`}
                        handleModalDecision={handleModalDecision}/>
                </ModalWrapper>
            )}
        </>
    );
}