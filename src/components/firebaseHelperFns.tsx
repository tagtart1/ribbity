import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../scripts/firebaseConfig";

interface currentUserInfoProps {
  bio?: string;
  joinDate?: string;
  profileImgUrl?: string;
  userHandle?: string;
  userName?: string;
}
/// DELETE ALL THIS BOZO STUFF AND WHEN YOU ROUTE TO THE USER PROFILE JUST  CALL THESE GETTER FUNCTIONS IN USER EFFECT, DO NOT STASH IT IN CURRENTUSERINFO
// REMEMBER THIS GREEN TEXT HERE HELLO FOR SUNDAY
// WHEN YOU MAKE A TWEET ALSO CALL THESE FUNCTION, NEVER JUST STORE IT SOMEWHERE, DEFEATS THE PRUPOSE, WHEN YOU SIGN IN YOU SHOULD STILL SET THE USER DOC BUT NO CURRENUSERINFO VARIABLE
export let currentUserInfo: currentUserInfoProps = {
  bio: " ",
  joinDate: " ",
  profileImgUrl: " ",
  userHandle: " ",
  userName: " ",
};

export const signIn = async () => {
  let provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);

  if (auth.currentUser) {
    const docRef = doc(db, "user-info", auth.currentUser.uid);
    const userInfoDoc = await getDoc(docRef);

    if (userInfoDoc.exists()) {
      currentUserInfo = userInfoDoc.data();
    } else {
      const newUser = {
        bio: "",
        joinDate: "February 2023",
        profileImgUrl: getProfilePicUrl(),
        userHandle: "@h4kosdfmasd",
        userName: getUserName(),
      };

      await setDoc(doc(db, "user-info", auth.currentUser.uid), newUser);

      currentUserInfo = newUser;
    }
  }
};

export const isUserSignedIn = () => {
  return !auth.currentUser;
};

export const initFirebaseAuth = (observer: any) => {
  onAuthStateChanged(auth, observer);
};

export const getUserName = () => {
  if (auth.currentUser) return auth.currentUser.displayName || "null";
};

export const signOutUser = () => {
  signOut(auth);
};

export const getProfilePicUrl = () => {
  if (auth.currentUser)
    return auth.currentUser.photoURL || "placeholderUPDATETHIS";
};
