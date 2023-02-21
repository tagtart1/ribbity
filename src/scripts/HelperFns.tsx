// @ts-nocheck

import { db } from "./firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";
import moment from "moment";

const kFormatter = (num: number) => {
  return Math.abs(num) > 9999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : (Math.sign(num) * Math.abs(num)).toLocaleString();
};

const getMonthDate = (monthNum?: Number) => {
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
  if (monthNum) {
    return month[monthNum];
  }
  return month[d.getMonth()];
};

const getShortMonthDate = (monthNum: Number) => {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return month[monthNum];
};

const getFullYear = () => {
  const d = new Date();
  return d.getFullYear();
};
const getDayOfMonth = () => {
  const d = new Date();
  return d.getDate();
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
      userHandle = userHandle + Math.floor(Math.random() * 10000);
    }
  }
  console.log(userHandle);
  return userHandle;
};

export const getTimestamp = () => {
  const d = moment().toObject();

  return d;
};

export {
  kFormatter,
  getMonthDate,
  getFullYear,
  generateUserHandle,
  getDayOfMonth,
  getShortMonthDate,
};
