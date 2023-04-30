import React, {ChangeEvent, useState} from 'react';
import {ListIdAndName} from "@/components/MediaPageComponents/profileActions";
import styles from "@/styles/AddRemoveMediaModal.module.scss";


interface AddRemoveMediaProps {
    lists: ListIdAndName[],
    type: string,
    handleModal: (decision: boolean, listId: string) => void
}

const AddRemoveMediaModal:React.FC<AddRemoveMediaProps> = (props) => {
    const {lists, type} = props;
    const labelText = type === "REMOVE" ? "Choose a list to remove media item from:" : "Choose a list to add media item to:";
    const [listId, setListId] = useState<string>("");
    const handleModal = (decision: boolean) => {
        props.handleModal(decision, listId);
    }
    const handleOption = (e: ChangeEvent<HTMLSelectElement>) => {
        setListId(e.target.value);
    }
    return (
        <div className={styles.modal_container}>
            <label htmlFor={"add_remove_list_choices"}>{labelText}</label>
            <select  onChange={(e) => handleOption(e)} name={"list choices"} id={"add_remove_list_choices"}>
                <option value={""}>choose a list...</option>
                {lists.map((list) => <option
                    key={list.id}
                    value={list.id}>{list.name}
                </option>)}
            </select>
            <div className={styles.btn_container}>
                {listId && (
                    <button onClick={() => handleModal(true)}>confirm</button>
                )}
                <button onClick={() => handleModal(false)}>cancel</button>
            </div>
        </div>
    );
}
export default AddRemoveMediaModal