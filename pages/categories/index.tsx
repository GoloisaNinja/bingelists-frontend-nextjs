import {useRouter} from "next/router";
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import Spinner from "@/components/spinner";
import styles from "@/styles/Categories.module.scss";
import {IGenre} from "@/utils/mediaPageInterface";
export default function CategoriesPage():JSX.Element {
    const router = useRouter();
    const s: ServerAuthProps = {
        method: "GET",
        url: "/category/list",
        body: {},
    }
    const data: any = useAuthRouteForResponseOrRedirect(s);
    let mCats:IGenre[] = [];
    let tCats:IGenre[] = [];
    if (data) {
        mCats = data.movie.genres;
        tCats = data.tv.genres;
    }

    return !data ? (<Spinner />) : (
        <div className={styles.categories_page_container}>
            <div className={styles.categories_container}>
                <div className={styles.categories_hero}>
                    <div className={styles.categories_hero_bg}></div>
                    <h1 className={styles.categories_hero_text}>Categories</h1>
                </div>
                <h2><span className={styles.blue_span}>Movie</span> Categories</h2>
                <div className={styles.category_grid}>
                    {mCats.map((cat) => (
                        <div className={styles.category_card_movie} key={cat.id}>
                            <button className={styles.category_btn}
                                    onClick={() => router.push(`/categories/movie?genre=${cat.id}&page=1&catName=${cat.name}`)}
                            ><h3>{cat.name}</h3></button>
                        </div>
                    ))}
                </div>
                <h2><span className={styles.yellow_span}>Tv</span> Categories</h2>
                <div className={styles.category_grid}>
                    {tCats.map((cat) => (
                        <div className={styles.category_card_tv} key={cat.id}>
                            <button className={styles.category_btn}
                                    onClick={() => router.push(`/categories/tv?genre=${cat.id}&page=1&catName=${cat.name}`)}
                            ><h3>{cat.name}</h3></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}