import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Modal from "../components/Modal";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
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
