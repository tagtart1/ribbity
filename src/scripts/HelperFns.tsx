// @ts-nocheck

import { db } from "./firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";
import moment from "moment";
import { timeStamp } from "console";

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
  // Add feature where your name cannot be home or explore or any main route
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

  return userHandle;
};

export const getTimestamp = () => {
  const d = moment().toObject();

  return d;
};

export const getDateFromTimeStamp = (timeStampObject) => {
  return `${getShortMonthDate(timeStampObject.months)} ${
    timeStampObject.date
  }, ${timeStampObject.years}`;
};

export const getTimeFromTimeStamp = (timeStampObject) => {
  let hours12: number = timeStampObject.hours % 12;
  if (hours12 === 0) {
    hours12 = 12;
  }

  //Determine AM or PM

  let period: string = timeStampObject.hours < 12 ? "AM" : "PM";

  //Pad minutes with a leading zero if necessary
  let paddedMinutes: string =
    timeStampObject.minutes < 10
      ? "0" + timeStampObject.minutes
      : timeStampObject.minutes;

  //Format string

  let timeString: string = hours12 + ":" + paddedMinutes + " " + period;

  return timeString;
};

const getTimeSincePosted = (twatInfo: any) => {
  let minutesWhenPost: number = twatInfo.timeInMillisecond / 60000;
  let minutesNow: number = Date.now() / 60000;
  let timeDiff: number = minutesNow - minutesWhenPost;

  if (timeDiff < 1) {
    return `${Math.ceil(timeDiff * 60)}s`;
  }
  if (timeDiff < 60) {
    return `${Math.floor(timeDiff)}m`;
  }
  if (timeDiff < 1440) {
    return `${Math.floor(timeDiff / 60)}h`;
  }
  if (timeDiff > 1440 && getFullYear() === twatInfo.timeStamp.years) {
    return `${getShortMonthDate(twatInfo.timeStamp.months)} ${
      twatInfo.timeStamp.date
    }`;
  }
  if (timeDiff > 1440) {
    return `${getShortMonthDate(twatInfo.timeStamp.months)} ${
      twatInfo.timeStamp.date
    }, ${twatInfo.timeStamp.years}`;
  }
};

function sortByTimeInSecondsDescending(array) {
  return array
    .slice()
    .sort((a, b) => b.timeInMillisecond - a.timeInMillisecond);
}

export {
  kFormatter,
  getMonthDate,
  getFullYear,
  generateUserHandle,
  getDayOfMonth,
  getShortMonthDate,
  getDateFromTimeStamp as getDateStringFromTimestamp,
  getTimeFromTimeStamp as get12hourFromTimestamp,
  getTimeSincePosted,
  sortByTimeInSecondsDescending,
};
