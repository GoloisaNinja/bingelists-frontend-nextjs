import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link";
import styles from '@/styles/Home.module.scss'
import ProviderImage from '../public/images/providers.webp';

export default function Home() {
    return (
        <>
            <Head>
                <title>BingeLists | Landing Page - Create Binge Lists for Movies and Tv!</title>
                <meta name="description" content="BingeLists | The app that lets you share movie and tv binge lists!"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/images/blFooterLogo.webp"/>
                <meta name="og:title" content="BingeLists | Create Binge Lists for Movies and Tv!" />
                <meta name="og:description" content="BingeLists | The app that lets you share movie and tv binge lists!" />
                <meta name="og:imgae" content="https://res.cloudinary.com/jcodescms/image/upload/v1685036911/BingeLists/bl_noimage_backdrop_dseyap.webp" />
                <meta name="og:url" content="https://bingelists.app" />
                <meta name="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="BingeLists | Create Binge Lists for Movies and Tv!" />
                <meta name="twitter:description" content="BingeLists | The app that lets you share movie and tv binge lists!" />
                <meta name="twitter:image" content="https://res.cloudinary.com/jcodescms/image/upload/v1685036911/BingeLists/bl_noimage_backdrop_dseyap.webp" />
            </Head>
            <div className={styles.page_container}>
                <header className={styles.header}>
                    <div className={styles.imgb}></div>
                    <h1 className={styles.brand}><span className={styles.blue_span}>B</span>inge <span className={styles.orange_span}>L</span>ists.</h1>
                </header>
                <div className={styles.header_overlay}>
                    <p className={styles.intro}>{`Finally a place to browse what's trending.`}</p>
                    <p className={styles.intro}>
                        {`Save your favourites, and find where they're available.`}
                    </p>
                    <p className={styles.intro}>
                        {`Create sharable Binge Lists.`}
                    </p>
                    <p className={styles.intro}>
                        {`Live your best life.`}
                    </p>
                </div>
                <main className={styles.main}>
                    <div className={styles.btn_group}>
                        <Link href={"/register"}>
                            <button className={styles.register_btn}>Register</button>
                        </Link>
                        <Link href={"/login"}>
                            <button className={styles.login_btn}>Login</button>
                        </Link>
                    </div>
                    <div className={styles.features}>
                        <div className={styles.features_text}>
                            <h2>Everything is everywhere...</h2>
                            <p className={styles.intro}>{`Let's face it - all our favourite shows and movies are 
              spread across the multiverse of services and apps. We have watch lists
              in every app. This is unmanageable.`}</p>
                        </div>
                        <div className={styles.features_image}>
                            <Image src={ProviderImage} alt={`collage of different streaming providers`} fill={true} sizes={"(max-width: 500px) 25vw, 35vw"}/>
                        </div>
                    </div>
                    <div className={styles.features_lower}>
                        <h2>Everything in one app...</h2>
                        <p className={styles.intro}>{`Binge Lists makes centralizing your favorites and watch lists simple, like it should be. 
                        When streaming first started, you had one, maybe two, watch lists. But now? You have dozens. So what do you do? 
                        You end up spending all your time switching between apps, seeing what is where, wasting time. Binge Lists 
                        lets you create a list with searchable titles, across all providers. Stop spending movie night just trying to DECIDE on 
                        the movie! 
                        Here is why people love us.`}</p>
                        <div className={styles.features_grid}>
                            <div className={`${styles.features_grid_card} ${styles.orange}`}>
                                <p>{`"They don't ask you to hook up all your accounts, you start clean new binge lists and you can add people!"`}</p>
                            </div>
                            <div className={`${styles.features_grid_card} ${styles.blue}`}>
                                <p>{`"The application uses The Movie Database so you can see trending content and ratings!"`}</p>
                            </div>
                            <div className={`${styles.features_grid_card} ${styles.darkblue}`}>
                                <p>{`"You get a searchable favourites list to store all the content you watched and loved."`}</p>
                            </div>
                            <div className={`${styles.features_grid_card} ${styles.purple}`}>
                                <p>{`"Create the ultimate Binge List across all services and share it with your binge buddies!"`}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
