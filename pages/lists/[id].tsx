import {useRouter} from "next/router";
import React from 'react';
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
//import BingeMediaCard from "@/components/BingeListPageComponents/BingeMediaCard";
import ListCard from "@/components/listCard";
import {IBingeList} from "@/utils/bingeListInterface";
import Spinner from "@/components/spinner";
import styles from "@/styles/Landing.module.scss";
import Link from "next/link";
import MediaGrid from "@/components/mediaGrid";

export default function BingeListPage() {
    const router = useRouter();
    const listId: string = router.query.id as string;
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
    if (data) {
        list = data.data
    }

    return isLoading ? (<Spinner/>) :
        (
            <div className={styles.landing_container}>
                <div className={styles.hero_intro_container}>
                    <h1>Binge</h1>
                    <h1><span className={styles.blue_span}>{list.name}</span>.</h1>
                    <Link href={"/lists"}>
                        <button className={styles.btn_trending_clean}>Back To Lists</button>
                    </Link>
                    {list.titles.length > 0 ? (
                        <MediaGrid>
                            {
                                list.titles.map((title) => (
                                    <ListCard key={title.type + title.mediaId} details={title}/>))
                            }
                        </MediaGrid>

                    ) : <h2 className={styles.empty_list}>No Bingeables! Go add some!</h2>}
                </div>
            </div>
        );
}