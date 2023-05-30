import {FormEvent, useState, useEffect} from 'react';
import {useRouter} from "next/router";
import {useSelector, useDispatch} from "react-redux";
import {authSelector, logout} from "@/features/auth/authSlice";
import {IMediaCard} from "@/utils/mediaCardInterface";
import {useDispatchAlert} from "@/utils/alertFactory";
import axios from "axios";
import {API_HEADER, BINGE_BASE_URL} from "@/constants";
import styles from "@/styles/Search.module.scss";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import {nanoid} from "nanoid";
import Spinner from "@/components/spinner";

export default function SearchPage(): JSX.Element {
    const dispatch = useDispatch();
    const {dispatchAlert} = useDispatchAlert();
    const router = useRouter();
    const {query} = router.query
    let querystring: string = "";
    if (typeof query === "string") {
        querystring = query;
    }
    const {token, isAuthenticated} = useSelector(authSelector);
    const [titleSearch, setTitleSearch] = useState<string>(querystring);
    const [movieSearchResults, setMovieSearchResults] = useState<IMediaCard[]>([]);
    const [tvSearchResults, setTvSearchResults] = useState<IMediaCard[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const handleQueryParam = (e: FormEvent) => {
        e.preventDefault();
        const ts = titleSearch as string;
        const encoded = encodeURI(ts);
        setLoading(true);
        router.replace(`/search?query=${encoded}`).then();
    }
    const handleSearch = async () => {
        const url = BINGE_BASE_URL + `/search?query=${titleSearch}`;
        API_HEADER.headers.Authorization = "Bearer " + token.token;
        try {
            const res = await axios.get(url, API_HEADER);
            setMovieSearchResults(res.data.data.movie.results)
            setTvSearchResults(res.data.data.tv.results);
            setTitleSearch("");
        } catch (e: any) {
            if (e.response.status === 403) {
                router.push("/login").then(() => {
                    if (isAuthenticated) {
                        dispatch(logout());
                    }
                    dispatchAlert("danger", "please authenticate");
                });
                return;
            }
            dispatchAlert("danger", "something went wrong!");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (query) {
            handleSearch().then();
        }
    }, [query])
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login").then();
        }
    },[isAuthenticated])
    return loading || !isAuthenticated ? (<Spinner />) : (
        <div className={styles.search_page_container}>
            <div className={styles.search_hero}>
                <div className={styles.search_bgimg}></div>
                <h1>Search</h1>
                <h1><span className={styles.yellow_span}>Titles</span>.</h1>
            </div>
            <div className={styles.form_container}>
                <form onSubmit={(e) => handleQueryParam(e)}>
                    <input
                        type={"text"}
                        name={"title"}
                        placeholder={"enter title to search for..."}
                        value={titleSearch}
                        autoFocus={true}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleQueryParam(e)}/>
                    <button type={"submit"}>search</button>
                </form>
            </div>
            {!movieSearchResults.length && !tvSearchResults.length && (
                <div className={styles.search_noresult_container}>
                    <h2>No results to display...</h2>
                </div>
            )}
            {movieSearchResults.length ? (
                <>
                    <div className={styles.search_grid_container}>
                        <h2 className={styles.searchresult_header}><span
                            className={styles.blue_span}>Movie</span> Results</h2>
                        <MediaGrid>
                            {movieSearchResults.map((media) => {
                                media.media_type = "movie";
                                return <MediaCard key={nanoid(5)} details={media}/>
                            })}
                        </MediaGrid>
                    </div>
                </>
            ) : null}
            {tvSearchResults.length ? (
                <>
                    <div className={styles.search_grid_container}>
                        <h2 className={styles.searchresult_header}><span
                            className={styles.yellow_span}>Tv</span> Results</h2>
                        <MediaGrid>
                            {tvSearchResults.map((media) => {
                                media.media_type = "tv";
                                return <MediaCard key={nanoid(5)} details={media}/>
                            })}
                        </MediaGrid>
                    </div>
                </>
            ) : null}
        </div>
    );
}