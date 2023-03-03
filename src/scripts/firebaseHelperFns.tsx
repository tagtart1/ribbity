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
import { generateUserHandle, getFullYear, getMonthDate } from "./HelperFns";
import defaultpfpImg from "../media/defaultpfp.jpg";

export const signIn = async () => {
  let provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);

  if (auth.currentUser) {
    const docRef = doc(db, "user-info", auth.currentUser.uid);
    const userInfoDoc = await getDoc(docRef);

    if (!userInfoDoc.exists()) {
      const newUser = {
        bio: "",
        joinDate: `${getMonthDate()} ${getFullYear()}`,
        profileImgUrl: getProfilePicUrl(),
        userHandle: await generateUserHandle(getUserName()),
        userName: getUserName(),
        location: "",
        profileImgPath: "",
        bannerImg: "",
        bannerImgPath: "",
        followers: {},
        following: {},
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
  try {
    if (auth.currentUser) {
      const docRef = doc(db, "user-info", auth.currentUser.uid);
      const userInfoDoc = await getDoc(docRef);
      if (userInfoDoc.exists()) {
        return userInfoDoc.data().userHandle;
      }
      console.log("here");
    }
  } catch (error) {
    console.error("Failed to retrieve user handle", error);
  }
};

export const getUserInfo = async (handle: string | undefined) => {
  const ref = collection(db, "user-info");
  const q = query(ref, where("userHandle", "==", handle));
  const querySnap = await getDocs(q);
  let handleDoc;
  querySnap.forEach((doc) => {
    handleDoc = doc.data();
    handleDoc.id = doc.id;
  });

  return handleDoc;
};

export const signOutUser = () => {
  signOut(auth);
};

export const getProfilePicUrl = () => {
  if (auth.currentUser) return auth.currentUser.photoURL || defaultpfpImg;
};
