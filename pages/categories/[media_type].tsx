import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import useAuthRouteForResponseOrRedirect,{ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import {IMediaCard} from "@/utils/mediaCardInterface";
import Spinner from "@/components/spinner";
import styles from "@/styles/Landing.module.scss";
import Head from "next/head";
import Link from "next/link";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import React from "react";

export default function CategoryGenrePage():JSX.Element {
    const router = useRouter();
    const q = router.query;
    let {media_type, genre, page, catName}: ParsedUrlQuery = q;
    const mt: string = media_type as string;
    const g: string = genre as string;
    const p: string = page as string;
    const cn: string = catName as string;
    const s:ServerAuthProps = {
        method: "GET",
        url: `/category?media_type=${mt}&genre=${g}&page=${p}`,
        body: {},
    }
    const {data, isLoading }:any = useAuthRouteForResponseOrRedirect(s);
    let res:IMediaCard[] = [];
    let totalPages: number = 0;
    if (data) {
        res = data.results;
        totalPages = data.total_pages;
    }
    let currentPage = parseInt(p);
    let prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1;
    let nextPage = currentPage + 1 > totalPages ? totalPages : currentPage + 1;
    let headerText:string = "";
    let headerStyle:string = styles.blue_span;
    if (catName) {
        headerText = cn.split("").map((letter, index) => index === 0 ? letter.toUpperCase() : letter).join("");
        if (mt === "tv") {
            headerStyle = styles.yellow_span;
        }
    }
    return !isLoading ? (
        <>
            <Head>
                <title>{`Binge Lists | Category genre ${cn} - ${mt} results page ${p}`}</title>
                <meta name={"description"} content={"Browse Categories for movies and tv on the Binge List app"} />
            </Head>
            <div className={styles.landing_container}>
                <div className={styles.hero_intro_container}>
                    <h1>{`${headerText}`}</h1>
                    <h1><span className={headerStyle}>{`Page ${p}`}</span>.</h1>
                    <Link href={"/categories"}>
                        <button className={styles.btn_trending_clean}>Back To Categories</button>
                    </Link>
                </div>
                <MediaGrid>
                    {res.map((media) => {
                        media.media_type = mt;
                        return (<MediaCard key={media.id} details={media} />)
                        }
                    )}
                </MediaGrid>
                <div className={styles.see_more}>
                    {currentPage <= 1 ? null : (
                        <Link href={`/categories/${mt}?genre=${g}&page=${prevPage}&catName=${cn}`}><span className={styles.blue_span}>{`< Prev`}</span> Page</Link>
                    )}
                    {currentPage >= totalPages ? null : (
                        <Link href={`/categories/${mt}?genre=${g}&page=${nextPage}&catName=${cn}`}><span className={styles.yellow_span}>Next</span> {`Page >`}</Link>
                    )}
                </div>
            </div>
        </>
    ) : (<Spinner />);
}