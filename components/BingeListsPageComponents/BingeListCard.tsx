import React from 'react';
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
    const { id } = useSelector(authSelector);
    const {createdAt, listUsers, mediaCount, name, owner} = props.data;
    const listId = props.data.id;
    const firstLetterOfNameForIcon: string = name.split("")[0].toUpperCase();
    const isOwner: boolean = id === owner;
    const handleDelete = () => {
        props.delete(name, listId);
    }
    return (
        <div className={styles.card_container}>
            <p className={styles.list_icon}>{firstLetterOfNameForIcon}</p>
            <p className={styles.list_name}>{name}</p>
            <p className={styles.is_owner}>Owner: {isOwner.toString()}</p>
            <p className={styles.shared_with_count}>Shared Count: {listUsers.length}</p>
            <p className={styles.media_count}>Total Items: {mediaCount}</p>
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