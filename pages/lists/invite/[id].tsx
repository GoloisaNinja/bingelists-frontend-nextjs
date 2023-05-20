import {useRouter} from "next/router";
export default function InviteList() {
    const router = useRouter();
    console.log(router.query.id)
    return (
        <div>
            <h1>Share your list!</h1>
        </div>
    );
}