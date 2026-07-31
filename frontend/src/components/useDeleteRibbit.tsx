import { useCallback } from "react";
import {
  collection,
  where,
  getDocs,
  writeBatch,
  query,
  deleteDoc,
  doc,
  WriteBatch,
} from "firebase/firestore";
import { db } from "../scripts/firebaseConfig";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { RibbitType } from "../Ribbity.types";
import {
  StorageReference,
  deleteObject,
  getStorage,
  ref,
} from "firebase/storage";

interface useDeleteRibbitProps {
  ribbitInfo: RibbitType;
  refreshRibbits?: Function;
  tab?: string;
  inShowcase: boolean;
}

const useDeleteRibbit = ({
  ribbitInfo,
  refreshRibbits,
  tab,
  inShowcase,
}: useDeleteRibbitProps) => {
  const navigate: NavigateFunction = useNavigate();
  const notifySuccess = () => toast("Your Ribbit was deleted.");
  const notifyError = () => toast.error("Your Ribbit failed to delete.");

  const deleteAttachedMedia = async (mediaPath: string): Promise<void> => {
    if (mediaPath) {
      // IF there is attached media, delete it from firebase storage
      const mediaRef: StorageReference = ref(getStorage(), mediaPath);
      await deleteObject(mediaRef);
    }
  };

  const deleteRibbit = useCallback(async () => {
    const deleteChildrenRibbits = async (): Promise<void> => {
      const batch: WriteBatch = writeBatch(db);
      // Query all ribbits the contain the ribbit up for deletion's id
      const childrenQuery = query(
        collection(db, "ribbits"),
        where("replyingTo.all", "array-contains", ribbitInfo.id)
      );

      const childrenDocs = await getDocs(childrenQuery);
      if (childrenDocs.empty) {
        return;
      }
      // Add docs to batch
      childrenDocs.forEach((doc) => {
        batch.delete(doc.ref);
        deleteAttachedMedia(doc.data().mediaPath);
      });
      // Commit batch
      await batch.commit();
    };

    try {
      await deleteDoc(doc(db, "ribbits", ribbitInfo.id));
      deleteAttachedMedia(ribbitInfo.mediaPath);
      deleteChildrenRibbits();
      notifySuccess();
    } catch (error) {
      notifyError();
    }
    document.documentElement.style.overflowY = "visible";
    if (refreshRibbits) {
      refreshRibbits(tab, ribbitInfo.id);
    }
    // If we are inside a showcase then re-navigate out or to a different ribbi within the thread
    if (ribbitInfo.replyingTo.id && inShowcase) {
      navigate(`/${ribbitInfo.handle}/ribbit/${ribbitInfo.replyingTo.id}`);
    } else if (inShowcase) navigate(`/${ribbitInfo.handle}`);
  }, [ribbitInfo, tab, refreshRibbits, navigate, inShowcase]);

  return deleteRibbit;
};

export default useDeleteRibbit;
