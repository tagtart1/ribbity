import { useEffect } from "react";
import { getUserInfo } from "../scripts/firebaseHelperFns";

interface TwatProps {
  twatInfo: {
    handle: string;
    text: string;
    timeStamp: {
      date: number;
      hours: number;
      milliseconds: number;
      minutes: number;
      months: number;
      seconds: number;
      years: number;
    };
  };
}

const Twat = ({ twatInfo }: TwatProps) => {
  useEffect(() => {
    getUserInfo(twatInfo.handle);
  });

  return <div>{twatInfo.text}</div>;
};
export default Twat;
