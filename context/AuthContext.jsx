import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useRouter } from "next/router";

{
  /*Creating Context and using it */
}
const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  {
    /*Listener for user logged in or logged out */
  }
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (userResult) => {
      if (userResult) {
        const docRef = doc(db, "users", userResult.uid);
        const docSnap = await getDoc(docRef);

        setUser({
          uid: userResult.uid,
          email: userResult.email,
          displayName: docSnap.data().displayName,
          photoURL: docSnap.data().photoURL,
          bio: docSnap.data().bio,
          age: docSnap.data().age,
          gender: docSnap.data().gender,
          username: docSnap.data().username,
          phoneNumber: userResult.phoneNumber,
          metadata: userResult.metadata,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsub;
  }, [db]);

  {
    /*signup function for email and password */
  }
  const signup = async (data) => {
    return createUserWithEmailAndPassword(auth, data.email, data.password).then(
      async (result) => {
        await setDoc(doc(db, "users", result.user.uid), {
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/instagram-clone-c9ee1.appspot.com/o/placeholder%2Fplaceholder.png?alt=media&token=7c51e53f-201f-441e-8b73-57f66a604e2f",
          bio: null,
          age: null,
          gender: null,
          displayName: null,
          username: data.username,
        });
        await setDoc(doc(db, "users", result.user.uid, "follows", "empty"), {
          empty: null,
        });
        await setDoc(doc(db, "users", result.user.uid, "followers", "empty"), {
          empty: null,
        });
      }
    );
  };

  {
    /*login function for email and password */
  }
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  {
    /*logout function */
  }
  const logout = async () => {
    setUser(null);
    await signOut(auth);
    router.reload(window.location.pathname);
  };
  {
    /*Login function for google provider
    const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        //checking if user already exists in firestore
        const googleDocRef = doc(db, "users", result.user.uid);
        const googleDocSnapshot = await getDoc(googleDocRef);

        //adding user to firestore if it doesnt exists
        if (!googleDocSnapshot.exists()) {
          await setDoc(doc(db, "users", result.user.uid), {
            photoURL: result.user.photoURL,
            bio: null,
            age: null,
            gender: null,
            displayName: result.user.displayName,
            username: result.user.email.split("@")[0] + randomNum,
          });
          await setDoc(doc(db, "users", result.user.uid, "follows", "empty"), {
            empty: null,
          });
          await setDoc(
            doc(db, "users", result.user.uid, "followers", "empty"),
            {
              empty: null,
            }
          );
        }
      })
      .catch((err) => alert(err));
  }; */
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
