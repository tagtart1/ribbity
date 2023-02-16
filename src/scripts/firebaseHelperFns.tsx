import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { generateUserHandle, getFullYear, getMonthName } from "./HelperFns";
import defaultpfpImg from "../media/defaultpfp.jpg";

/// DELETE ALL THIS BOZO STUFF AND WHEN YOU ROUTE TO THE USER PROFILE JUST  CALL THESE GETTER FUNCTIONS IN USER EFFECT, DO NOT STASH IT IN CURRENTUSERINFO
// REMEMBER THIS GREEN TEXT HERE HELLO FOR SUNDAY
// WHEN YOU MAKE A TWEET ALSO CALL THESE FUNCTION, NEVER JUST STORE IT SOMEWHERE, DEFEATS THE PRUPOSE, WHEN YOU SIGN IN YOU SHOULD STILL SET THE USER DOC BUT NO CURRENUSERINFO VARIABLE

/*export let currentUserInfo: currentUserInfoProps = {
  bio: " ",
  joinDate: " ",
  profileImgUrl: " ",
userHandle: " ",
    userName: " ",
};  */

export const signIn = async () => {
  let provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);

  if (auth.currentUser) {
    const docRef = doc(db, "user-info", auth.currentUser.uid);
    const userInfoDoc = await getDoc(docRef);

    if (!userInfoDoc.exists()) {
      const newUser = {
        bio: "",
        joinDate: `${getMonthName()} ${getFullYear()}`,
        profileImgUrl: getProfilePicUrl(),
        userHandle: await generateUserHandle(getUserName()),
        userName: getUserName(),
      };

      await setDoc(doc(db, "user-info", auth.currentUser.uid), newUser);
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

export const getUserHandle = async () => {
  if (auth.currentUser) {
    const docRef = doc(db, "user-info", auth.currentUser.uid);
    const userInfoDoc = await getDoc(docRef);
    if (userInfoDoc.exists()) {
      return userInfoDoc.data().userHandle;
    }
  }
};

export const getUserInfo = async (id: string | undefined) => {
  const ref = collection(db, "user-info");
  const q = query(ref, where("userHandle", "==", id));
  const querySnap = await getDocs(q);
  let handleDoc;
  querySnap.forEach((doc) => {
    handleDoc = doc.data();
  });

  return handleDoc;
};

export const signOutUser = () => {
  signOut(auth);
};

export const getProfilePicUrl = () => {
  if (auth.currentUser) return auth.currentUser.photoURL || defaultpfpImg;
};
