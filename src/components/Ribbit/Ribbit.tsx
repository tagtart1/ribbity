import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import "../../styles/Ribbit.css";
import { getTimeSincePosted } from "../../scripts/HelperFns";

import DeleteOptionDropdown from "./DeleteOptionDropdown";
import BackgroundTransparent from "../Misc/BackgroundTransparent";

import { useParams, Link, useNavigate } from "react-router-dom";

import RibbitReplyButton from "./RibbitReplyButton";

import RibbitReactionButtons from "./RibbitReactionButtons";
import toast from "react-hot-toast";
import useDeleteRibbit from "../useDeleteRibbit";
import { RibbitType } from "../../Ribbity.types";
import ReRibbitButton from "./ReRibbitButton";
import ReRibbitIcon from "../../media/svg/ReRibbitIcon";
import RibbityVerifyIcon from "../../media/svg/RibbityVerifyIcon";

interface RibbitProps {
  ribbitInfo: RibbitType;

  isDeletable: boolean;
  currentHandle: string;
  refreshRibbits?: Function;
  isThreaded: boolean;
  inShowcase: boolean;
  isReRibbit: boolean;
  ReRibbitedByInfo?: {
    userName: string;
    userHandle: string;
  };
}
// To delete make sure the user opening the tab is the user that owns the tweet. Find the doc by the id in firebase and remove it, with delete confirmation
const Ribbit = ({
  ribbitInfo,
  isDeletable,
  currentHandle,
  refreshRibbits,
  isThreaded,
  inShowcase,
  isReRibbit,
  ReRibbitedByInfo,
}: RibbitProps) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [attachedImageLoaded, setAttachedImageLoaded] =
    useState<boolean>(false);

  const [adjustedWidth, setAdjustedWidth] = useState<any>();
  const attachedImageRef: any = useRef();

  const { handle, tab } = useParams();
  const deleteRibbit = useDeleteRibbit({
    ribbitInfo,
    refreshRibbits: refreshRibbits,
    tab,
    inShowcase,
  });

  const maxImageHeight = 510;

  const notifyClipboard = () => toast("Copied to clipboard");

  const navigate = useNavigate();

  const openDeleteOption = (): void => {
    if (!isDeletable) return;
    setOpenDelete(true);
  };

  const handleDeleteRibbit = async (): Promise<void> => {
    deleteRibbit();
    setOpenDelete(false);
  };

  const handleOpeningRibbit = (e: any): void => {
    // Pointer events are set to off in the style sheet for all child elements except the ones that need to register a click
    if (e.currentTarget === e.target) {
      navigate(`/${ribbitInfo.handle}/ribbit/${ribbitInfo.id}`);
    }
  };

  const copyRibbitLinkToClipboard = (): void => {
    const currentPath: string = window.location.href;
    const ribbitPath: string = currentPath + `/ribbit/${ribbitInfo.id}`;
    navigator.clipboard.writeText(ribbitPath);
    notifyClipboard();
  };

  const adjustSizing = (e: any) => {
    const img = e.target;

    if (attachedImageRef.current.clientHeight > maxImageHeight) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;

      const newHeight = maxImageHeight;
      const newWidth = newHeight * aspectRatio;
      setAdjustedWidth(newWidth);
    }
  };

  useEffect(() => {
    // Draw a line between the threaded tweets
    const profileImgs: any = document.querySelectorAll(".threaded-profile-img");
    if (profileImgs.length === 0) return;

    for (let i = 0; i < profileImgs.length - 1; i++) {
      const circle1 = profileImgs[i].getBoundingClientRect();
      const circle2 = profileImgs[i + 1].getBoundingClientRect();
      const distance = circle2.top - circle1.bottom;

      profileImgs[i].style.setProperty("--distance", `${distance}px`);
    }
  }, [attachedImageLoaded]);

  // If there is no URL then  just instantly set true so there is no wait
  useEffect(() => {
    if (!ribbitInfo.mediaUrl) {
      setAttachedImageLoaded(true);
    }
  }, [ribbitInfo.mediaUrl]);

  return (
    <motion.div layout>
      <article
        className={
          isThreaded ? "ribbit-container" : "ribbit-container border-bottom"
        }
      >
        {isReRibbit ? (
          <div className="reribbited-top-info">
            <ReRibbitIcon />
            {ReRibbitedByInfo?.userHandle === currentHandle
              ? "You"
              : `${ReRibbitedByInfo?.userName}`}{" "}
            Reribbited
          </div>
        ) : null}
        <div className="ribbit-container-main" onClick={handleOpeningRibbit}>
          <Link to={`/${ribbitInfo.handle}`}>
            <div className={isThreaded ? "threaded-profile-img" : ""}>
              <img
                className="user-profile-image"
                src={ribbitInfo.userProfileImg}
                alt="User"
              ></img>
            </div>
          </Link>
          <div className="ribbit-container-right-side">
            <header>
              <Link to={`/${ribbitInfo.handle}`}>
                <div
                  className={`header-user-names ${
                    ribbitInfo.isVerified ? "verified" : null
                  } `}
                >
                  <div className="username">{ribbitInfo.userName}</div>
                  {ribbitInfo.isVerified ? <RibbityVerifyIcon /> : null}
                  <div className="grey userhandle">@{ribbitInfo.handle}</div>

                  <div className="grey">·</div>
                  <div className="grey date-posted">
                    {getTimeSincePosted(ribbitInfo)}
                  </div>
                </div>
              </Link>
              <div>
                <div
                  className="more-icon-wrapper"
                  onClick={openDeleteOption}
                  role="button"
                  aria-label="open delete option"
                >
                  <DeleteOptionDropdown
                    isVisible={openDelete}
                    deleteRibbit={handleDeleteRibbit}
                  />
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path
                        fill="#71767B"
                        className="ribbit-path"
                        d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
            </header>
            {ribbitInfo.replyingTo.handle ? (
              <p className="replying-to-text">
                Replying to{" "}
                <Link to={`/${ribbitInfo.replyingTo.handle}`}>
                  <span className="replying-to-handle">
                    @{ribbitInfo.replyingTo.handle}
                  </span>
                </Link>
              </p>
            ) : null}
            <div>
              <p className="ribbit-main-text">{ribbitInfo.text}</p>
              {ribbitInfo.mediaUrl ? (
                <img
                  className="attached-ribbit-image"
                  src={ribbitInfo.mediaUrl}
                  alt="attached media"
                  onLoad={adjustSizing}
                  style={{ width: adjustedWidth }}
                  ref={attachedImageRef}
                />
              ) : null}
            </div>
            <div className="ribbit-icon-button-row">
              <RibbitReplyButton
                ribbitId={ribbitInfo.id}
                ribbitHandle={ribbitInfo.handle}
              />
              <ReRibbitButton
                ribbitInfo={ribbitInfo}
                currentHandle={currentHandle}
              />
              <RibbitReactionButtons
                currentHandle={currentHandle}
                ribbitInfo={ribbitInfo}
              />
              <button
                className="ribbit-option-icon copy-option-icon"
                onClick={copyRibbitLinkToClipboard}
                aria-label="copy link to clipboard"
              >
                <svg viewBox="0 0 24 24">
                  <g>
                    <path
                      fill="#71767B"
                      d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <BackgroundTransparent
          isVisible={openDelete}
          toggleVisibility={setOpenDelete}
        />
      </article>
    </motion.div>
  );
};
export default Ribbit;
