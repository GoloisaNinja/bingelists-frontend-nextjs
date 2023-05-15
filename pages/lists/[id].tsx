import {useRouter} from "next/router";
import React, {useState, useEffect} from 'react';
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import ListCard from "@/components/listCard";
import {IBingeList} from "@/utils/bingeListInterface";
import {IListTitle} from "@/utils/sharedInterfaces";
import Spinner from "@/components/spinner";
import styles from "@/styles/Landing.module.scss";
import Link from "next/link";
import MediaGrid from "@/components/mediaGrid";

export default function BingeListPage() {
    const router = useRouter();
    const listId: string = router.query.id as string;
    let page = "1";
    if (router.query.page !== undefined) {
        page = router.query.page as string;
    }
    const [paginatedTitles, setPaginatedTitles] = useState<IListTitle[]>([]);
    const limit = 20;
    const skip = limit * (parseInt(page) - 1);
    const s: ServerAuthProps = {
        method: "GET",
        url: `/bingelist?id=${listId}`,
        body: {},
    }
    const {data, isLoading}: any = useAuthRouteForResponseOrRedirect(s);
    let list: IBingeList = {
        _id: "",
        name: "",
        owner: "",
        titles: [],
        users: [],
        mediaCount: 0,
        createdAt: ""
    }
    let totalPages = 0;
    let prevPage = 0;
    let nextPage = 0;

    if (data) {
        list = data.data
        totalPages = Math.ceil(list.titles.length / 20);
        if (parseInt(page) > totalPages) {
            router.replace(`/lists/${listId}?page=${parseInt(page) - 1}`).then();
        }
        prevPage = parseInt(page) - 1 < 1 ? 1 : parseInt(page) - 1;
        nextPage = parseInt(page) + 1 > totalPages ? totalPages : parseInt(page) + 1;
    }
    useEffect(() => {
        if (list.titles !== undefined && list.titles.length > 0) {
            setPaginatedTitles(list.titles.slice(skip, skip + limit))
        }
    }, [page, list])
    return isLoading ? (<Spinner/>) :
        (
            <div className={styles.landing_container}>
                <div className={styles.hero_intro_container}>
                    <h1>Binge</h1>
                    <h1><span className={styles.blue_span}>{list.name}</span>.</h1>
                    <Link href={"/lists"}>
                        <button className={styles.btn_trending_clean}>Back To Lists</button>
                    </Link>
                    {paginatedTitles.length > 0 ? (
                        <>
                        <MediaGrid>
                            {
                                paginatedTitles.map((title) => (
                                    <ListCard key={title.type + title.mediaId} details={title}/>))
                            }
                        </MediaGrid>
                            <div className={styles.see_more}>
                                {parseInt(page) > 1 && (
                                    <Link href={`/lists/${listId}?page=${prevPage}`}><span className={styles.blue_span}>{`< Prev`}</span> Page</Link>
                                )}
                                {parseInt(page) < totalPages && (
                                    <Link href={`/lists/${listId}?page=${nextPage}`}><span className={styles.yellow_span}>Next</span> {`Page >`}</Link>
                                )}
                            </div>
                        </>
                    ) : <h2 className={styles.empty_list}>No Bingeables! Go add some!</h2>}
                </div>
            </div>
        );
}