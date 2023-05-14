import React from 'react';
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import ListCard from "@/components/listCard";
import {useSelector} from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import {IFavorites} from "@/utils/favoritesInterface";
import Spinner from "@/components/spinner";
import styles from "@/styles/Landing.module.scss";
import Link from "next/link";
import MediaGrid from "@/components/mediaGrid";

export default function FavoritesPage() {
    const { name } = useSelector(authSelector);
    const s: ServerAuthProps = {
        method: "GET",
        url: "/favorites",
        body: {},
    }
    const {data, isLoading}: any = useAuthRouteForResponseOrRedirect(s);
    let favorites: IFavorites = {
        _id: "",
        owner: "",
        favorites: []
    }
    if (data) {
        favorites = data.data
    }

    return isLoading ? (<Spinner/>) :
        (
            <div className={styles.landing_container}>
                <div className={styles.hero_intro_container}>
                    <h1>{`${name}'s`}</h1>
                    <h1><span className={styles.blue_span}>Favorites</span>.</h1>
                    <Link href={"/trending/landing"}>
                        <button className={styles.btn_trending_clean}>See Trending</button>
                    </Link>
                    {favorites.favorites.length > 0 ? (
                        <MediaGrid>
                            {
                                favorites.favorites.map((title) => (
                                    <ListCard key={title.type + title.mediaId} details={title}/>))
                            }
                        </MediaGrid>
                    ) : <h2 className={styles.empty_list}>No Favorites! Go browse trending and add some!</h2>}
                </div>
            </div>
        );
}