// @ts-nocheck

import { db } from "./firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

const kFormatter = (num: number) => {
  return Math.abs(num) > 9999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : (Math.sign(num) * Math.abs(num)).toLocaleString();
};

const getMonthName = () => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();

  return month[d.getMonth()];
};

const getFullYear = () => {
  const d = new Date();
  return d.getFullYear();
};

const generateUserHandle = async (name: string | undefined) => {
  let valid = false;
  let userHandle = `${name?.replaceAll(" ", "")}`;
  while (!valid) {
    const ref = collection(db, "user-info");
    const q = query(ref, where("userHandle", "==", userHandle));
    const querySnap = await getDocs(q);
    if (querySnap.size === 0) valid = true;
    else {
      userHandle = name + Math.floor(Math.random() * 10000);
    }
  }
  console.log(userHandle);
  return userHandle;
};

export { kFormatter, getMonthName, getFullYear, generateUserHandle };
