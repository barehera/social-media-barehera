import Head from "next/head";
import Feed from "../components/Feed/Feed";
import Modal from "../components/NewPostModal/Modal";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen ">
      <Head>
        <title>Barehera</title>
        <meta
          name="description"
          content="Barehera Social Media app created with next.js and firebase. link is barehera.cf"
        />
      </Head>
      <Feed></Feed>
      <Modal></Modal>
    </div>
  );
}
