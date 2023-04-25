import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  DocumentReference,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, db } from "./firebaseConfig";
import {
  base64ToFile,
  generateUserHandle,
  getFullYear,
  getMonthDate,
} from "./HelperFns";
import defaultpfpImg from "../media/defaultpfp.jpg";
import defaultBannerImg from "../media/defaultBanner.png";
import { RibbityUser } from "../Ribbity.types";

const nullUser: RibbityUser = {
  bannerImgPath: "",
  bannerImgUrl: "",
  bio: "",
  followers: {},
  following: {},
  id: "",
  joinDate: "",
  location: "",
  profileImgPath: "",
  profileImgUrl: "",
  userHandle: "",
  userName: "",
  isVerified: false,
};

export const signInUserNative = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const createUserNative = async (
  name: string,
  email: string,
  password: string,
  setIsLoadingUser: Function
) => {
  await createUserWithEmailAndPassword(auth, email, password);
  // Should create an entire user in firestore and then return that user, set the loading function as well
  if (auth.currentUser?.uid) {
    const docRef: DocumentReference = doc(
      db,
      "user-info",
      auth.currentUser.uid
    );
    const userInfoDoc = await getDoc(docRef);

    if (!userInfoDoc.exists()) {
      setIsLoadingUser(true);
      const defaultImgFile = base64ToFile(defaultpfpImg, "default.jpg");
      const defaultBannerFile = base64ToFile(
        defaultBannerImg,
        "defaultBanner.png"
      );

      let newBannerImgPath: string;
      let bannerImgUrl: string;

      let newProfileImgPath: string;
      let publicImgUrl: string;

      const bannerFilePath: string = `${auth.currentUser.uid}/${defaultBannerFile.name}`;
      const filePath: string = `${auth.currentUser.uid}/${defaultImgFile.name}`;

      const newBannerImgRef = ref(getStorage(), bannerFilePath);
      const newProfileImgRef = ref(getStorage(), filePath);

      const bannerFileSnapshot = await uploadBytesResumable(
        newBannerImgRef,
        defaultBannerFile
      );
      const fileSnapshot = await uploadBytesResumable(
        newProfileImgRef,
        defaultImgFile
      );
      bannerImgUrl = await getDownloadURL(newBannerImgRef);
      newBannerImgPath = bannerFileSnapshot.metadata.fullPath;

      publicImgUrl = await getDownloadURL(newProfileImgRef);
      newProfileImgPath = fileSnapshot.metadata.fullPath;

      const newHandle = await generateUserHandle(name);
      const newUser: RibbityUser = {
        bio: "",
        joinDate: `${getMonthDate()} ${getFullYear()}`,
        profileImgUrl: publicImgUrl,
        userHandle: newHandle,
        userName: name,
        location: "",
        profileImgPath: newProfileImgPath,
        bannerImgUrl: bannerImgUrl,
        bannerImgPath: newBannerImgPath,
        followers: {},
        following: {
          [`${newHandle}`]: true,
        },
        id: auth.currentUser.uid,
        isVerified: false,
      };

      await setDoc(doc(db, "user-info", auth.currentUser.uid), newUser);
      setIsLoadingUser(false);
      return newUser;
    }
  }
};
/**
 * A custom sign in function for firebase's GoogleAuthProvider
 * @param setIsLoadingUser  The callback to display a loading screen accross the screen
 * @returns The new user if the user signing is new. If not, returns void while signing the user in
 */

export const signIn = async (setIsLoadingUser: Function) => {
  let provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider); //Triggers the authObserver

  if (auth.currentUser?.uid) {
    const docRef = doc(db, "user-info", auth.currentUser.uid);
    const userInfoDoc = await getDoc(docRef);

    if (!userInfoDoc.exists()) {
      setIsLoadingUser(true);
      const defaultImgFile = base64ToFile(defaultpfpImg, "default.jpg");
      const defaultBannerFile = base64ToFile(
        defaultBannerImg,
        "defaultBanner.png"
      );

      let newBannerImgPath: string;
      let bannerImgUrl: string;

      let newProfileImgPath: string;
      let publicImgUrl: string;

      const bannerFilePath: string = `${auth.currentUser.uid}/${defaultBannerFile.name}`;
      const filePath: string = `${auth.currentUser.uid}/${defaultImgFile.name}`;

      const newBannerImgRef = ref(getStorage(), bannerFilePath);
      const newProfileImgRef = ref(getStorage(), filePath);

      const bannerFileSnapshot = await uploadBytesResumable(
        newBannerImgRef,
        defaultBannerFile
      );
      const fileSnapshot = await uploadBytesResumable(
        newProfileImgRef,
        defaultImgFile
      );
      bannerImgUrl = await getDownloadURL(newBannerImgRef);
      newBannerImgPath = bannerFileSnapshot.metadata.fullPath;

      publicImgUrl = await getDownloadURL(newProfileImgRef);
      newProfileImgPath = fileSnapshot.metadata.fullPath;

      const newHandle = await generateUserHandle(getUserName());
      const newUser: RibbityUser = {
        bio: "",
        joinDate: `${getMonthDate()} ${getFullYear()}`,
        profileImgUrl: publicImgUrl,
        userHandle: newHandle,
        userName: getUserName(),
        location: "",
        profileImgPath: newProfileImgPath,
        bannerImgUrl: bannerImgUrl,
        bannerImgPath: newBannerImgPath,
        followers: {},
        following: {
          [`${newHandle}`]: true,
        },
        id: auth.currentUser.uid,
        isVerified: false,
      };

      await setDoc(doc(db, "user-info", auth.currentUser.uid), newUser);
      setIsLoadingUser(false);
      return newUser;
    }
  }
};

export const isUserSignedIn = () => {
  return !auth.currentUser;
};

export const initFirebaseAuth = (observer: any) => {
  onAuthStateChanged(auth, observer);
};

export const getUserName = (): string => {
  if (auth.currentUser?.displayName) {
    return auth.currentUser.displayName;
  } else return "";
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

export const getUserInfo = async (
  handle: string | undefined
): Promise<RibbityUser> => {
  const ref = collection(db, "user-info");
  const q = query(ref, where("userHandle", "==", handle));
  const querySnap = await getDocs(q);
  let handleDoc: RibbityUser = nullUser;
  querySnap.forEach((doc: any) => {
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
