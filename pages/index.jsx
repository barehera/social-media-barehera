import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed/Feed";
import Modal from "../components/NewPostModal/Modal";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Router from "next/router";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (session) {
        await setDoc(doc(db, "users", `${session.user.uid}`), {
          username: session.user.username,
          profileImg: session.user.image,
        });
        await setDoc(
          doc(db, "users", `${session.user.uid}`, "follows", "empty"),
          { empty: null }
        );
        await setDoc(
          doc(db, "users", `${session.user.uid}`, "followers", "empty"),
          { empty: null }
        );
      }
    };
    addUserToDatabase();
  }, [session]);

  useEffect(() => {
    if (!session) {
      Router.push("/auth/signin");
    } else {
      Router.push("/");
    }
  }, [session]);

  return (
    <div className="bg-gray-100 min-h-screen ">
      <Head>
        <title>Instagram</title>
        <meta
          name="description"
          content="The website that uses next.js and firebase to clone Instagram"
        />
      </Head>
      <Header></Header>
      <Feed></Feed>
      <Modal></Modal>
    </div>
  );
}
