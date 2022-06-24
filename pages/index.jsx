import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed/Feed";
import Modal from "../components/NewPostModal/Modal";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Router from "next/router";

export default function Home() {
  const { data: session } = useSession();
  //add session user to database
  useEffect(() => {
    const addUserToDatabase = async () => {
      // CHECKED USER EXISTS NEED UPDATE!!!!!!!!!!!!!!!!!!!
      if (session) {
        const sessionUserRef = doc(db, "users", session.user.uid);
        const sessionUserDoc = await getDoc(sessionUserRef);
        if (sessionUserDoc.data().username === session.user.username) {
          console.log("user exists");
        } else {
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
        <title>Barehera</title>
        <meta
          name="description"
          content="barehera barehera.cf Social Media App Barehera"
        />
      </Head>
      <Header></Header>
      <Feed></Feed>
      <Modal></Modal>
    </div>
  );
}
