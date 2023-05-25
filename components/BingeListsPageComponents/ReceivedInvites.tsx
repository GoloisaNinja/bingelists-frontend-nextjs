import React, {useState, useRef} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from "react-redux";
import {useDispatchAlert} from "@/utils/alertFactory";
import {FaChevronRight, FaChevronDown} from "react-icons/fa";
import {authSelector, processInvite} from "@/features/auth/authSlice";
import {BINGE_BASE_URL, API_HEADER} from "@/constants";
import {Invite} from "@/utils/inviteInterface";
import ModalWrapper from "@/components/modalWrapper";
import styles from "@/styles/PendingInvites.module.scss";
import ConfirmCancelModal from "@/components/confirmCancelModal";
import InfoMapModal from "@/components/infoMapModal";
import {mutate} from "swr";

interface ReceivedProps {
    mutate: () => void
}

const ReceivedInvites:React.FC<ReceivedProps> = (props) => {
    const dispatch = useDispatch();
    const {dispatchAlert} = useDispatchAlert();
    const {token, invites} = useSelector(authSelector)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    const [showReceived, setShowReceived] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [inviteIdToProcess, setInviteIdToProcess] = useState<string>("");
    const [inviteAction, setInviteAction] = useState<string>("");
    const infoMap = useRef<Map<string,string>>(new Map());
    const showInviteDetails = (invitedBy: string, message: string) => {
        infoMap.current.set("Invited By: ", invitedBy);
        infoMap.current.set("Message: ", message);
        setShowInfoModal(true);
    }

    const closeInfoModal = () => {
        setShowInfoModal(false);
    }

    const expand = () => {
        const table = document.getElementById("invitedTo_table")!
        setShowReceived(!showReceived);
        if (table.classList.contains(styles.show)) {
            table.classList.remove(styles.show)
        } else {
            table.classList.add(styles.show)
        }
    }

    const handleInviteAction = (id:string, listName:string, action:string) => {
        if (action === "ACCEPT") {
            setInviteAction("accept");
        } else {
            setInviteAction("decline");
        }
        setInviteIdToProcess(id);
        setModalMessage(`Are you sure you want to ${action.toLowerCase()} the invite to ${listName}?`)
        setShowModal(true);
    }

    const handleModalDecision = async (decision: boolean) => {
        if (decision) {
            const url = BINGE_BASE_URL + `/invites/process?id=${inviteIdToProcess}&action=${inviteAction}`;
            API_HEADER.headers.Authorization = "Bearer " + token.token;
            try {
                const res = await axios.post(url, {}, API_HEADER);
                if (res.status === 200) {
                    dispatch(processInvite(inviteIdToProcess));
                    setShowModal(false);
                    props.mutate();
                    dispatchAlert("success", `invite action: ${inviteAction} - succeeded`)
                }
            } catch(e: any) {
                console.log(e);
                setShowModal(false);
                dispatchAlert("danger", e.message)
            }
        } else {
            setShowModal(false)
        }
    }


    return invites.length > 0 ? (
        <>
        <div className={styles.pending_container}>
            <div className={styles.invites_header}>
                <h3><span className={styles.blue_span}>Received</span> Invites</h3>
                <button onClick={() => expand()}>
                    {showReceived ? <FaChevronDown /> : <FaChevronRight />}
                </button>
            </div>
            <div>
                <table
                    id={"invitedTo_table"}
                    className={styles.pending_table}>
                    <thead>
                    <tr>
                        <th>List</th>
                        <th>Details</th>
                        <th>Accept</th>
                        <th>Decline</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invites.map((invite:Invite) => (
                        <tr key={invite._id}>
                            <td>{invite.bingeListName}</td>
                            <td>
                                <button
                                    className={styles.invite_showdetails_btn}
                                    onClick={() => showInviteDetails(invite.invitedByName, invite.message)}
                            >details
                                </button></td>
                            <td>
                                <button
                                    className={styles.invite_action_acceptbtn}
                                    onClick={() => handleInviteAction(invite._id, invite.bingeListName ,"ACCEPT")}
                                >accept</button>
                            </td>
                            <td>
                                <button
                                    className={styles.invite_action_declinebtn}
                                    onClick={() => handleInviteAction(invite._id, invite.bingeListName,"DECLINE")}
                                >decline</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
            {showInfoModal && (
                <ModalWrapper>
                    <InfoMapModal info={infoMap.current} closeModal={closeInfoModal} />
                </ModalWrapper>
            )}
            {showModal && (
                <ModalWrapper>
                    <ConfirmCancelModal message={modalMessage} handleModalDecision={handleModalDecision} />
                </ModalWrapper>
            )}
            </>
    ) : null;
}
export default ReceivedInvites