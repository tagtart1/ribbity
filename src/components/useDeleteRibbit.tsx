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
  ribbitInfo: any;
  refreshTwats?: Function;
  tab?: string;
  inShowcase: boolean;
}

const useDeleteRibbit = ({
  ribbitInfo,
  refreshTwats,
  tab,
  inShowcase,
}: useDeleteRibbitProps) => {
  const navigate = useNavigate();
  const notifySuccess = () => toast("Your Ribbit was deleted.");
  const notifyError = () => toast.error("Your Ribbit failed to delete.");

  const deleteRibbit = useCallback(async () => {
    const deleteChildrenRibbits = async () => {
      const batch = writeBatch(db);
      // Query all twats the contain the twat up for deletion's id
      const childrenQuery = query(
        collection(db, "twats"),
        where("replyingTo.all", "array-contains", ribbitInfo.id)
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
      await deleteDoc(doc(db, "twats", ribbitInfo.id));
      deleteChildrenRibbits();
      notifySuccess();
    } catch (error) {
      notifyError();
    }
    document.documentElement.style.overflowY = "visible";
    if (refreshTwats) {
      refreshTwats(tab, ribbitInfo.id);
    }
    // If we are inside a showcase then re-navigate out or to a different ribbi within the thread
    if (ribbitInfo.replyingTo.id && inShowcase) {
      navigate(`/${ribbitInfo.handle}/twat/${ribbitInfo.replyingTo.id}`);
    } else if (inShowcase) navigate(`/${ribbitInfo.handle}`);
  }, [ribbitInfo, tab, refreshTwats, navigate, inShowcase]);

  return deleteRibbit;
};

export default useDeleteRibbit;