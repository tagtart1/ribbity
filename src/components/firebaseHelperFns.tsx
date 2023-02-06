import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../scripts/firebaseConfig";

export const signIn = async () => {
  let provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const isUserSignedIn = () => {
  return !auth.currentUser;
};

export const initFirebaseAuth = (observer: any) => {
  onAuthStateChanged(auth, observer);
};

export const getUserName = () => {
  if (auth.currentUser) return auth.currentUser.displayName;
};

export const signOutUser = () => {
  signOut(auth);
};
