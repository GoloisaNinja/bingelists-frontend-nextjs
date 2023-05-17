import {useRouter} from "next/router";
import React, {useState, useEffect, useMemo} from 'react';
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import ListCard from "@/components/listCard";
import {IBingeTitles} from "@/utils/bingeListInterface";
import {IListQueryData, IListTitle} from "@/utils/sharedInterfaces";
import Spinner from "@/components/spinner";
import styles from "@/styles/Landing.module.scss";
import Link from "next/link";
import MediaGrid from "@/components/mediaGrid";
import Selectors from "@/components/selectors";

export default function BingeListPage() {
    const router = useRouter();
    const listId: string = router.query.id as string;
    const page: string = router.query.page as string;
    let pathParam: string = "";
    const filterType: string | undefined = router.query.typeFilter as string | undefined;
    const filterGenre: string | undefined = router.query.genreFilter as string | undefined;
    let urlToUse = `/bingelist?id=${listId}`;
    if (filterType) {
        urlToUse = urlToUse + `&type=${filterType}`;
        pathParam = pathParam + `&typeFilter=${filterType}`;
    }
    if (filterGenre) {
        urlToUse = urlToUse + `&genre=${filterGenre}`;
        pathParam = pathParam + `&genreFilter=${filterGenre}`;
    }

    const [paginatedTitles, setPaginatedTitles] = useState<IListTitle[]>([]);

    const limit = 20;
    const skip = limit * (parseInt(page) - 1);
    const s: ServerAuthProps = {
        method: "GET",
        url: urlToUse,
        body: {},
    }
    const {data, isLoading}: any = useAuthRouteForResponseOrRedirect(s);
    const initializeTitles = ():IBingeTitles => {
        return {name: "", titles: []};
    }

    let titles: IBingeTitles = useMemo(():IBingeTitles => initializeTitles(), [])

    let totalPages = 0;
    let prevPage = 0;
    let nextPage = 0;

    const listData: IListQueryData = {
        skip,
        limit,
        typeFilter: filterType,
        genreFilter: filterGenre
    }

    if (data) {
        titles = data.data
        totalPages = Math.ceil(titles.titles.length / 20);
        if (parseInt(page) > totalPages) {
            router.replace(`/lists/${listId}?page=${totalPages}` + pathParam).then();
        }
        prevPage = parseInt(page) - 1 < 1 ? 1 : parseInt(page) - 1;
        nextPage = parseInt(page) + 1 > totalPages ? totalPages : parseInt(page) + 1;
    }
    useEffect(() => {
        if (titles.titles !== undefined && titles.titles.length > 0) {
            setPaginatedTitles(titles.titles.slice(skip, skip + limit))
        }
    }, [page, titles, skip])

    return isLoading ? (<Spinner/>) :
        (
            <div className={styles.landing_container}>
                <div className={styles.hero_intro_container}>
                    <h1>Binge</h1>
                    <h1><span className={styles.blue_span}>{titles.name}</span>.</h1>
                    <Link href={"/lists"}>
                        <button className={styles.btn_trending_clean}>Back To Lists</button>
                    </Link>
                    <Selectors
                        titles={titles.titles}
                        basePath={`/lists/${listId}`}
                        pathParams={pathParam}
                        setTitles={setPaginatedTitles}
                        listData={listData}
                    />
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
                                    <Link href={`/lists/${listId}?page=${prevPage}` + pathParam}><span className={styles.blue_span}>{`< Prev`}</span> Page</Link>
                                )}
                                {parseInt(page) < totalPages && (
                                    <Link href={`/lists/${listId}?page=${nextPage}` + pathParam}><span className={styles.yellow_span}>Next</span> {`Page >`}</Link>
                                )}
                            </div>
                        </>
                    ) : <h2 className={styles.empty_list}>No Bingeables! Go add some!</h2>}
                </div>
            </div>
        );
}