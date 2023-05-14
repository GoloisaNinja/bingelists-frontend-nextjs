import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {bingeSelector, addToMinifiedBingeList, removeFromMinifiedBingeList, IListAction} from "@/features/binge/bingeSlice";
import {authSelector} from "@/features/auth/authSlice";
import {favoriteSelector, addToFavorites, removeFromFavorites, IFavoriteAction} from "@/features/favorite/favoriteSlice";
import {useDispatch} from "react-redux";
import axios from 'axios';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {BINGE_DEVAPI_BASE_URL, API_HEADER} from "@/constants";
import {useDispatchAlert} from "@/utils/alertFactory";
import ModalWrapper from "@/components/modalWrapper";
import AddRemoveMediaModal from "@/components/addRemoveMediaModal";
import styles from "@/styles/ProfileActions.module.scss";
import {IPAMediaProps} from "@/components/MediaPageComponents/mediaDetails";

interface ProfileActionProps {
    media: IPAMediaProps,
}

export type ListIdAndName = {
    id: string,
    name: string,
}
const ProfileActions: React.FC<ProfileActionProps> = (props) => {
    const {
        media_id,
        media_type,
        media_title,
        poster_path,
        primaryGenreId
    } = props.media;
    const mId = media_id as string;
    const mType = media_type as string;
    const {lists} = useSelector(bingeSelector);
    const {token} = useSelector(authSelector);
    const {movie, tv} = useSelector(favoriteSelector);
    const {dispatchAlert} = useDispatchAlert();
    const dispatch = useDispatch();
    const [canBeAddedToLists, setCanBeAddedToLists] = useState<ListIdAndName[]>([]);
    const [canBeRemovedFromLists, setCanBeRemovedFromLists] = useState<ListIdAndName[]>([]);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [actionType, setActionType] = useState<string>("ADD");
    const [showModal, setShowModal] = useState<boolean>(false);
    API_HEADER.headers.Authorization = "Bearer " + token.token;
    useEffect(() => {
        if (lists !== null && lists.length > 0) {
            // lists that we can add the media item to
            let aLists: ListIdAndName[] = [];
            // lists that we can remove the media item from
            let rLists: ListIdAndName[] = [];
            for (let list of lists) {
                let currentListAsListIdAndName: ListIdAndName = {id: list.id, name: list.name}
                let listIds: string[] = [];
                if (media_type !== undefined) {
                    listIds = list[media_type];
                }
                if (listIds.length === 0) {
                    aLists.push(currentListAsListIdAndName);
                } else {
                    if (!listIds.includes(media_id!)) {
                        aLists.push(currentListAsListIdAndName);
                    }
                    if (listIds.includes(media_id!)) {
                        rLists.push(currentListAsListIdAndName);
                    }
                }
            }
            setCanBeAddedToLists(aLists);
            setCanBeRemovedFromLists(rLists);
        }
    }, [lists, media_id, media_type])

    useEffect(() => {
        let result: boolean = false;
        if (media_type === "movie") {
            if (movie.includes(media_id)) {
                result = true;
            }
        } else {
            if (tv.includes(media_id)) {
                result = true;
            }
        }
        setIsFavorite(result);
    }, [media_id, media_type, movie, tv])

    const mediaItemAsRequestBody = ():string => {
        return JSON.stringify({
            mediaId: media_id,
            title: media_title,
            type: media_type,
            posterPath: poster_path,
            primaryGenreId: primaryGenreId
        })
    }
    const handleFavorites = async () => {
        let url: string;
        let message: string;
        const payload: IFavoriteAction = {
            type: mType,
            favoriteId: mId,
        }
        let body: string = "";
        if (isFavorite) {
            url = BINGE_DEVAPI_BASE_URL + `/favorites/remove?id=${mId}&type=${mType}`;
            message = "removed from favorites";
        } else {
            url = BINGE_DEVAPI_BASE_URL + "/favorites/add";
            body = mediaItemAsRequestBody();
            message = "added to favorites!";
        }
        try {
            const res = await axios.post(url, body, API_HEADER);
            if (res.status === 200) {
                if (isFavorite) {
                    dispatch(removeFromFavorites(payload));
                } else {
                    dispatch(addToFavorites(payload));
                }
            } else {
                dispatchAlert("danger", "something went wrong!");
            }
            setIsFavorite(!isFavorite);
        } catch(e: any) {
            dispatchAlert("danger", e.message);
        }
    }

    const handleBingeList = async (listId: string) => {
        let url: string;
        let message:string;
        const payload: IListAction = {
            id: listId,
            media_id: mId,
            type: mType,
        }
        let body:string = "";
        if (actionType === "ADD") {
            url = BINGE_DEVAPI_BASE_URL + `/bingelist/add?id=${listId}`;
            body = mediaItemAsRequestBody()
            message = "title added successfully!";
        } else {
            url = BINGE_DEVAPI_BASE_URL + `/bingelist/remove?id=${listId}&mediaId=${mId}&type=${mType}`;
            message = "title removed successfully!";
        }
        try {
            const res = await axios.post(url, body, API_HEADER);
            if (res.status === 200) {
                if (actionType === "ADD") {
                    dispatch(addToMinifiedBingeList(payload));
                } else {
                    dispatch(removeFromMinifiedBingeList(payload));
                }
                dispatchAlert("success", message);
            } else {
                dispatchAlert("danger", "something went wrong!");
            }
        } catch(e: any) {
            dispatchAlert("danger", e.message);
        }
    }

    const handleModalDecision = (decision: boolean, listId: string) => {
        if (decision) {
            handleBingeList(listId).then();
        }
        setShowModal(false);
    }
    const handleBingeBtns = (type: string) => {
        setActionType(type);
        setShowModal(true);
    }

    return (
        <>
            <div className={styles.profile_btn_group}>
                {canBeAddedToLists.length > 0 && (
                    <button
                        className={styles.binge_btn}
                        onClick={() => handleBingeBtns("ADD")}
                    >Binge</button>
                )}
                {canBeRemovedFromLists.length > 0 && (
                    <button
                        className={styles.unbinge_btn}
                        onClick={() => handleBingeBtns("REMOVE")}
                    >UnBinge</button>
                )}
                {isFavorite ? (
                    <button onClick={() => handleFavorites()}>
                        <FaHeart />
                    </button>
                ) : (
                    <button onClick={() => handleFavorites()}>
                        <FaRegHeart />
                    </button>
                )}
            </div>
            {showModal && (
                <ModalWrapper>
                    <AddRemoveMediaModal lists={actionType === "ADD" ? canBeAddedToLists : canBeRemovedFromLists}
                                         type={actionType} handleModal={handleModalDecision}/>
                </ModalWrapper>
            )}

        </>
    );
}
export default ProfileActions