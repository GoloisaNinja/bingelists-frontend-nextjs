import React from "react";
import Head from 'next/head';
import Link from "next/link";
import {useRouter} from "next/router";
import useSWR from 'swr';
import axios from "axios";
import { useSelector } from "react-redux";
import { authSelector } from "@/features/auth/authSlice";
import Spinner from "@/components/spinner";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import {IMediaCard} from "@/utils/mediaCardInterface";
import styles from "../../styles/Landing.module.scss";

export default function TrendingPage(): JSX.Element {
    const router = useRouter();
    const q = router.query;
    const media_type: string = q.media_type as string;
    const page: string = q.page as string;
    const { token } = useSelector(authSelector);
    const config = {
        headers: {
            "Authorization": "Bearer " + token,
        }
    }
    const fetcher = (url: string) => axios.get(url, config).then(res => res.data);
    const {data, error} = useSWR(`http://localhost:8080/api/v1/trending?media_type=${media_type}&page=${page}`, fetcher);
    if (error) {
        if (error.response.status === 403) {
            router.push("/login").then();
        }
    }
    let respData: IMediaCard[] = [];
    let total_pages: number = 0;
    if (data) {
        respData = data.results;
        total_pages = data.total_pages
    }
    let currentPage = parseInt(page);
    let prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1;
    let nextPage = currentPage + 1 > total_pages ? total_pages : currentPage + 1;
    let headerText = "";
    let headerStyle = styles.blue_span;
    if (media_type !== undefined) {
        headerText = media_type.split("").map((letter: string, index: number) => index === 0 ? letter.toUpperCase() : letter).join("");
        if (media_type === "tv") {
            headerStyle = styles.yellow_span;
        }
    }


    return !data ? (
        <Spinner />
    ) : (
        <>
            <Head>
                <title>{`Binge Lists | Trending ${media_type} results page ${page}`}</title>
                <meta name={"description"} content={"Browse Trending movies and tv on the Binge List app"} />
            </Head>
            <div className={styles.landing_container}>
                <h1 className={styles.grid_intro}>{`${headerText}`} <span className={headerStyle}>{`Page ${page}`}</span>.</h1>
                <Link href={"/trending/landing"}>
                    <button className={styles.btn_trending}>Back To Trending</button>
                </Link>
                <MediaGrid>
                    {respData.map((media) => <MediaCard key={media.id} details={media} />)}
                </MediaGrid>
                <div className={styles.see_more}>
                    {currentPage <= 1 ? null : (
                        <Link href={`/trending/${media_type}?page=${prevPage}`}><span className={styles.blue_span}>{`< Prev`}</span> Page</Link>
                    )}
                    {currentPage >= total_pages ? null : (
                        <Link href={`/trending/${media_type}?page=${nextPage}`}><span className={styles.yellow_span}>Next</span> {`Page >`}</Link>
                    )}
                </div>
            </div>
        </>
    )
}

