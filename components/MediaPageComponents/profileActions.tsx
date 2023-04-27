import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {bingeSelector} from "@/features/binge/bingeSlice";
import ModalWrapper from "@/components/modalWrapper";
import ConfirmCancelModal from "@/components/confirmCancelModal";
interface ProfileActionProps {
    media_id: string,
    media_type: string,
}
type ListIdAndName = {
    id: string,
    name: string,
}
const ProfileActions:React.FC<ProfileActionProps> = (props) => {
    const { media_id, media_type } = props;
    const { lists } = useSelector(bingeSelector);
    const [canBeAddedToLists, setCanBeAddedToLists] = useState<ListIdAndName[]>([]);
    const [canBeRemovedFromLists, setCanBeRemovedFromLists] = useState<ListIdAndName[]>([]);
    const [showModal, setShowModal] = useState<boolean>(true);
    const handleModalDecision = () => {
        console.log("modal handled");
        setShowModal(false);
    }
    useEffect(() => {
        if (lists.length > 0) {
            // lists that we can add the media item to
            let aLists: ListIdAndName[] = [];
            // lists that we can remove the media item from
            let rLists: ListIdAndName[] = [];
            for (let list of lists) {
                let currentListAsListIdAndName: ListIdAndName = {id: list.id, name: list.name}
                const listIds:string[] = list.minifiedMediaItems[media_type];
                if (listIds.length === 0) {
                    aLists.push(currentListAsListIdAndName);
                } else {
                    if (!listIds.includes(media_id)) {
                        aLists.push(currentListAsListIdAndName);
                    } else {
                        rLists.push(currentListAsListIdAndName);
                    }
                }
            }
            if (aLists.length > 0) {
                setCanBeAddedToLists(aLists);
            }
            if (rLists.length > 0) {
                setCanBeRemovedFromLists(rLists);
            }
        }
    }, [lists, media_id, media_type])

    return (
        <>
            <div>
                <h3>Available lists to add to:</h3>
                {canBeAddedToLists.map((list) => <p key={list.id}>{list.name}</p>)}
                <h3>List to remove media from: </h3>
                {canBeRemovedFromLists.map((list) => <p key={list.id}>{list.name}</p>)}
            </div>
            {showModal && (
                <ModalWrapper>
                    <ConfirmCancelModal message={"testing"} handleModalDecision={handleModalDecision}/>
                </ModalWrapper>
            )}

        </>
    );
}
export default ProfileActions