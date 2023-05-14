import React from 'react';
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import {FaTrashAlt} from "react-icons/fa";
import styles from "@/styles/BingeListCard.module.scss";
import {IBingeListCard} from "@/utils/bingeListInterface";

interface BingeListCardProps {
    data: IBingeListCard,
    delete: (listName: string, listId: string) => void,
}

const BingeListCard:React.FC<BingeListCardProps> = (props) => {
    const router = useRouter();
    const { _id } = useSelector(authSelector);
    const {createdAt, users, mediaCount, name, owner} = props.data;
    const listId = props.data._id;
    const firstLetterOfNameForIcon: string = name.split("")[0].toUpperCase();
    const isOwner: boolean = _id === owner;
    const handleDelete = () => {
        props.delete(name, listId);
    }
    return (
        <div className={styles.card_container}>
            <p className={styles.list_icon}>{firstLetterOfNameForIcon}</p>
            <p className={styles.list_name}>{name}</p>
            <p className={styles.is_owner}>Owner: {isOwner.toString()}</p>
            <p className={styles.shared_with_count}>Shared Count: {users.length}</p>
            <p className={styles.media_count}>Total Items: {mediaCount}</p>
            <div className={styles.btngroup}>
                <button className={styles.viewList_btn}
                        onClick={() => router.push(`/lists/${listId}`)}
                >View List</button>
                {isOwner && (<button className={styles.invite_btn}>Invite</button>)}
            </div>
            <div className={styles.card_bottom_container}>
                {isOwner && (
                    <button onClick={() => handleDelete()}>
                        <FaTrashAlt />
                    </button>
                )}
                <p className={styles.created}>{createdAt}</p>
            </div>
        </div>
    );
}
export default BingeListCard