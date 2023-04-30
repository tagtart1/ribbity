// @ts-nocheck

import { db } from "./firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";
import moment from "moment";
import { RibbitType } from "../Ribbity.types";

const kFormatter = (num: number) => {
  return Math.abs(num) > 9999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : (Math.sign(num) * Math.abs(num)).toLocaleString();
};

const getMonthDate = (monthNum?: Number): string => {
  const month: string[] = [
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
  const d: Date = new Date();
  if (monthNum) {
    return month[monthNum];
  }
  return month[d.getMonth()];
};

const getShortMonthDate = (monthNum: Number): string => {
  const month: string[] = [
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

const getFullYear = (): number => {
  const d: Date = new Date();
  return d.getFullYear();
};
const getDayOfMonth = (): number => {
  const d: Date = new Date();
  return d.getDate();
};

const checkForBannedNames = (word: string): boolean => {
  const invalidWords = new Set([
    "Home",
    "Explore",
    "home",
    "explore",
    "notifications",
    "Notifications",
    "bookmarks",
    "Bookmarks",
  ]);
  return invalidWords.has(word);
};

const generateUserHandle = async (
  name: string | undefined
): Promise<string> => {
  // Add feature where your name cannot be home or explore or any main route
  let valid: boolean = false;
  let userHandle: string = `${name?.replaceAll(" ", "")}`;
  while (!valid) {
    const ref = collection(db, "user-info");
    const q = query(ref, where("userHandle", "==", userHandle));
    const querySnap = await getDocs(q);
    if (querySnap.size === 0 && !checkForBannedNames(userHandle)) valid = true;
    else {
      userHandle = userHandle + Math.floor(Math.random() * 1000);
    }
  }

  return userHandle;
};

export const getTimestamp = () => {
  const d = moment().toObject();

  return d;
};

export const getDateFromTimeStamp = (timeStampObject): string => {
  return `${getShortMonthDate(timeStampObject.months)} ${
    timeStampObject.date
  }, ${timeStampObject.years}`;
};

export const getTimeFromTimeStamp = (timeStampObject): string => {
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

const getTimeSincePosted = (twatInfo: RibbitType): string => {
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
// Sorts an array of objects by the timeInMilliseconds
function sortByTimeInSecondsDescending(array) {
  return array
    .slice()
    .sort((a, b) => b.timeInMillisecond - a.timeInMillisecond);
}

function base64ToFile(base64String, fileName): File {
  const byteString = atob(base64String.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer]);
  const contentType = blob.type;
  const file = new File([blob], fileName, { type: contentType });
  return file;
}

function isValidString(input): boolean {
  // Check if the string is null or empty
  if (!input) {
    return false;
  }

  // Check if the string only contains spaces
  const trimmedInput: string = input.trim();
  if (trimmedInput.length === 0) {
    return false;
  }

  return true;
}

async function cropBanner(file): Promise<File> {
  return new Promise((resolve) => {
    const sizeX = 600;
    const sizeY = 200;

    const createImageElement = (src) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
      });
    };

    const createDataURL = (image) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = sizeX;
      canvas.height = sizeY;

      const aspectRatio = image.width / image.height;
      const targetAspectRatio = sizeX / sizeY;

      let sourceWidth, sourceHeight;

      if (aspectRatio > targetAspectRatio) {
        sourceWidth = image.height * targetAspectRatio;
        sourceHeight = image.height;
      } else {
        sourceWidth = image.width;
        sourceHeight = image.width / targetAspectRatio;
      }

      const offsetX = (image.width - sourceWidth) / 2;
      const offsetY = (image.height - sourceHeight) / 2;

      ctx.drawImage(
        image,
        offsetX,
        offsetY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        sizeX,
        sizeY
      );
      return canvas.toDataURL(file.type);
    };

    const dataURLToFile = (dataURL, fileName, mimeType) => {
      const byteString = atob(dataURL.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new File([ab], fileName, { type: mimeType });
    };

    const reader = new FileReader();
    reader.onload = async (e) => {
      const originalImage = await createImageElement(e.target.result);
      const croppedDataURL = createDataURL(originalImage);
      const croppedFile = dataURLToFile(croppedDataURL, file.name, file.type);
      resolve(croppedFile);
    };
    reader.readAsDataURL(file);
  });
}

async function cropImage(file): Promise<File> {
  return new Promise((resolve) => {
    const size = 130;

    const createImageElement = (src) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
      });
    };

    const createDataURL = (image) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      const minDimension = Math.min(image.width, image.height);
      const offsetX = (image.width - minDimension) / 2;
      const offsetY = (image.height - minDimension) / 2;

      ctx.drawImage(
        image,
        offsetX,
        offsetY,
        minDimension,
        minDimension,
        0,
        0,
        size,
        size
      );
      return canvas.toDataURL(file.type);
    };

    const dataURLToFile = (dataURL, fileName, mimeType) => {
      const byteString = atob(dataURL.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new File([ab], fileName, { type: mimeType });
    };

    const reader = new FileReader();
    reader.onload = async (e) => {
      const originalImage = await createImageElement(e.target.result);
      const croppedDataURL = createDataURL(originalImage);
      const croppedFile = dataURLToFile(croppedDataURL, file.name, file.type);
      resolve(croppedFile);
    };
    reader.readAsDataURL(file);
  });
}

function sortRibbitsWithReRibbits(array, handle): RibbitType[] {
  return array.sort((a, b) => {
    // Get the timeInSeconds value for object a
    const aTimeInSeconds =
      a.handle === handle ? a.timeInMillisecond : a.reribbitedBy[handle];

    // Get the timeInSeconds value for object b
    const bTimeInSeconds =
      b.handle === handle ? b.timeInMillisecond : b.reribbitedBy[handle];

    // Sort in descending order
    return bTimeInSeconds - aTimeInSeconds;
  });
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
  base64ToFile,
  isValidString,
  cropImage,
  cropBanner,
  sortRibbitsWithReRibbits,
};
