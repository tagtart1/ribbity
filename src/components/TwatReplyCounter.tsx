import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";

interface TwatReplyCounterProps {
  twatId: string;
}

const TwatReplyCounter = ({ twatId }: TwatReplyCounterProps) => {
  const [replyCount, setReplyCount] = useState<number | null>(null);

  useEffect(() => {
    const getReplyCount = async () => {
      const q = query(
        collection(db, "twats"),
        where("replyingTo", "==", twatId)
      );
      const snap = await getCountFromServer(q);
      const count = snap.data().count;

      if (count === 0) {
        setReplyCount(null);
        return;
      }
      setReplyCount(count);
    };

    getReplyCount();
  }, [twatId]);

  if (!replyCount) return null;

  return <div className="reply-count">{replyCount}</div>;
};

export default TwatReplyCounter;
