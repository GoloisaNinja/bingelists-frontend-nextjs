import Link from 'next/link';
import Image from "next/image";
import {FaRegCopyright, FaHeart} from "react-icons/fa";
import Logo from '@/public/images/footer.webp';
import styles from '@/styles/Footer.module.scss';
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles.footer_container}>
            <div className={styles.footer_grid}>
                <div className={styles.logo}>
                    <Image src={Logo} alt={"a logo for bingelists - the i in binge is a soda cup and the i in list is popcorn container"} width={196} height={131}/>
                </div>
                <div className={styles.links}>
                    <p><span className={styles.blue_span}>Site</span> Links</p>
                    <Link href={"/"}>Home</Link>
                    <Link href={"/login"}>Login</Link>
                    <Link href={"/register"}>Register</Link>
                </div>
                <div className={styles.copyright}>
                    <p>Made with <span className={styles.pink_span}><FaHeart /></span></p>
                    <p>BingeLists.app <FaRegCopyright /> <span className={styles.yellow_span}>{currentYear}</span></p>
                </div>
                <div className={styles.personalLinks}>
                    <p><span className={styles.pink_span}>Creator</span> Links</p>
                    <Link href={"https://github.com/GoloisaNinja"}>My Github</Link>
                    <Link href={"https://github.com/GoloisaNinja/bingelists-frontend-nextjs"}>Site Github</Link>
                    <Link href={"https://joncollins.dev"}>My Portfolio</Link>
                </div>
            </div>
        </footer>
    )
}