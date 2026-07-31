import { useEffect, useState } from "react";
import {
  Query,
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../scripts/firebaseConfig";

interface RibbitReplyCounterProps {
  ribbitId: string;
}

const TwatReplyCounter = ({ ribbitId }: RibbitReplyCounterProps) => {
  const [replyCount, setReplyCount] = useState<number | null>(null);

  useEffect(() => {
    const getReplyCount = async () => {
      const q: Query = query(
        collection(db, "ribbits"),
        where("replyingTo.id", "==", ribbitId)
      );
      const snap = await getCountFromServer(q);
      const count: number = snap.data().count;

      if (count === 0) {
        setReplyCount(null);
        return;
      }
      setReplyCount(count);
    };

    getReplyCount();
  }, [ribbitId]);

  if (!replyCount) return null;

  return <div className="reply-count">{replyCount}</div>;
};

export default TwatReplyCounter;
