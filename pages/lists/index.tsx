import {FormEvent, useState} from 'react';
import axios from 'axios';
import {API_HEADER, BINGE_DEVAPI_BASE_URL} from "@/constants";
import {useSelector} from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import {useDispatchAlert} from "@/utils/alertFactory";
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import {useMinifiedListLoaders} from "@/utils/initialListLoaders";
import Spinner from "@/components/spinner";
import {IBingeListCard} from "@/utils/bingeListInterface";
import styles from "@/styles/BingeLists.module.scss";
import BingeListCard from "@/components/BingeListsPageComponents/BingeListCard";
import ModalWrapper from "@/components/modalWrapper";
import ConfirmCancelModal from "@/components/confirmCancelModal";
export default function BingeLists():JSX.Element {
    const { dispatchLoadingMinifiedBingeLists } = useMinifiedListLoaders();
    const { token } = useSelector(authSelector);
    const { dispatchAlert } = useDispatchAlert();
    const [createNew, setCreateNew] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalActionType, setModalActionType] = useState<string>("CREATE");
    const [modalMessage, setModalMessage] = useState<string>("");
    const [listName, setListName] = useState<string>("");
    const [listId, setListId] = useState<string>("");
    API_HEADER.headers.Authorization = "Bearer " + token;

    const s: ServerAuthProps = {
        method: "GET",
        url: "/bingelist/lists",
        body: {},
    }
    const {data, isLoading, mutate}: any = useAuthRouteForResponseOrRedirect(s);
    let lists:IBingeListCard[] = [];
    if (data) {
        lists = data;
    }
    const handleCreateToggle = () => {
        setCreateNew(!createNew);
        const isActiveClass: string = styles.isActive;
        const newListContainer:HTMLElement = document.getElementById("nl_form_container")!;
        if (newListContainer.classList.contains(isActiveClass)) {
            newListContainer.classList.remove(isActiveClass);
        } else {
            newListContainer.classList.add(isActiveClass);
        }
    }

    const listCreateControlFlow = async (decision: boolean) => {
        if (!decision) {
            setShowModal(false);
            handleCreateToggle();
        }
        if (decision) {
            const url = BINGE_DEVAPI_BASE_URL + "/bingelist/create";
            const body = {
                name: listName,
            }
            try {
                const res = await axios.post(url, body, API_HEADER);
                if (res.status === 200) {
                    await dispatchLoadingMinifiedBingeLists(token);
                    dispatchAlert("success", "list created successfully!");
                }
            } catch(e:any) {
                dispatchAlert("danger", e.message);
            } finally {
                setListName("");
                setShowModal(false);
                handleCreateToggle();
                mutate(BINGE_DEVAPI_BASE_URL + "/bingelist/lists");
            }
        }
    }
    const listDeleteControlFlow = async (decision: boolean) => {
        if (!decision) {
            setShowModal(false);
        }
        if (decision) {
            const url = BINGE_DEVAPI_BASE_URL + `/bingelist/delete?listId=${listId}`;
            try {
                const res = await axios.delete(url, API_HEADER);
                if (res.status === 200) {
                    await dispatchLoadingMinifiedBingeLists(token);
                    dispatchAlert("success", "list deleted successfully!");
                }
            } catch(e:any) {
                dispatchAlert("danger", "something went wrong!");
            } finally {
                setListId("");
                setShowModal(false);
                mutate(BINGE_DEVAPI_BASE_URL + "/bingelist/lists");
            }
        }
    }
    const handleModalDecision = (decision: boolean) => {
        if (modalActionType === "CREATE") {
            listCreateControlFlow(decision).then();
        } else {
            listDeleteControlFlow(decision).then();
        }
    }
    const handleDelete = (listNameToDelete:string, listIdToDelete:string) => {
        setListId(listIdToDelete);
        setModalMessage(`Delete list named: ${listNameToDelete}?`);
        setModalActionType("DELETE");
        setShowModal(true);
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setModalMessage("Are you sure you want to create a new list?")
        setModalActionType("CREATE");
        setShowModal(true);
    }

    return isLoading ? (<Spinner />) : (
        <>
            <div className={styles.page_container}>
                <div className={styles.bingelists_hero}>
                    <div className={styles.bingelists_hero_img}></div>
                    <h1>Your</h1>
                    <h1>BingeLists.</h1>
                </div>
                <div className={styles.bingelists_create}>
                    {createNew ? <button onClick={() => handleCreateToggle()}>close create new</button> : <button onClick={() => handleCreateToggle()}>+ create new list</button>}
                    <div id={"nl_form_container"} className={styles.bingelists_nl_form_container}>
                        <form id={"list_name_form"} onSubmit={(e) => handleSubmit(e)}>
                            <label>Name your new BingeList</label>
                            <div>
                                <input
                                    type={"text"}
                                    value={listName}
                                    onKeyDown={(e) => e.key === "Enter" && document.getElementById("list_name_form_btn")!.click()}
                                    onChange={(e) => setListName(e.target.value)}
                                />
                                <button id={"list_name_form_btn"} type={"submit"}>submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                {Array.isArray(lists) && lists.length > 0 ? (
                    <div className={styles.bingelist_card_grid}>
                        {lists.map((list:IBingeListCard) => <BingeListCard key={list.id} data={list} delete={handleDelete}/>)}
                    </div>
                ) : (
                    <div className={styles.bingelist_empty_container}>
                        <h2>{`You don't have any lists yet...try creating one!`}</h2>
                    </div>
                )}

            </div>
            {showModal && <ModalWrapper>
                <ConfirmCancelModal message={modalMessage} handleModalDecision={handleModalDecision} />
            </ModalWrapper>}
        </>
    );
}