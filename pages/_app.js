import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";
import { AuthContextProvider } from "../context/AuthContext";

const noAuthRequired = ["/login", "/signup"];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <AuthContextProvider>
      <RecoilRoot>
        {noAuthRequired.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Header></Header>
            <Component {...pageProps} />
          </ProtectedRoute>
        )}
      </RecoilRoot>
    </AuthContextProvider>
  );
}

export default MyApp;
