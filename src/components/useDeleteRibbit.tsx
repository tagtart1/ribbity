import { useState, useEffect, useCallback } from "react";
import {
  collection,
  where,
  getDocs,
  writeBatch,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface useDeleteRibbitProps {
  twatInfo: any;
  refreshTwats?: Function;
  tab?: string;
  inShowcase: boolean;
}

const useDeleteRibbit = ({
  twatInfo,
  refreshTwats,
  tab,
  inShowcase,
}: useDeleteRibbitProps) => {
  const navigate = useNavigate();
  const notifySuccess = () => toast("Your Twat was deleted.");
  const notifyError = () => toast.error("Your Twat failed to delete.");

  const deleteRibbit = useCallback(async () => {
    const deleteChildrenTwats = async () => {
      const batch = writeBatch(db);
      // Query all twats the contain the twat up for deletion's id
      const childrenQuery = query(
        collection(db, "twats"),
        where("replyingTo.all", "array-contains", twatInfo.id)
      );

      const childrenDocs = await getDocs(childrenQuery);
      if (childrenDocs.empty) {
        return;
      }
      // Add docs to batch
      childrenDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      // Commit batch
      await batch.commit();
    };

    try {
      await deleteDoc(doc(db, "twats", twatInfo.id));
      deleteChildrenTwats();
      notifySuccess();
    } catch (error) {
      notifyError();
    }
    document.documentElement.style.overflowY = "visible";
    if (refreshTwats) {
      refreshTwats(tab, twatInfo.id);
    }
    // If we are inside a showcase then renaviage out or to a different twat within the thread
    if (twatInfo.replyingTo.id && inShowcase) {
      navigate(`/${twatInfo.handle}/twat/${twatInfo.replyingTo.id}`);
    } else if (inShowcase) navigate(`/${twatInfo.handle}`);
  }, [twatInfo, tab, refreshTwats, navigate, inShowcase]);

  return deleteRibbit;
};

export default useDeleteRibbit;
