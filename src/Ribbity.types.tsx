type RibbityUser = {
  bannerImgPath: string;
  bannerImgUrl: string;
  bio: string;
  followers: {
    [key: string]: boolean;
  };
  following: {
    [key: string]: boolean;
  };
  id: string;
  joinDate: string;
  location: string;
  profileImgPath: string;
  profileImgUrl: string;
  userHandle: string;
  userName: string;
  isVerified: boolean;
};

type RibbitType = {
  dislikedBy: {
    [key: string]: boolean;
  };
  handle: string;
  id: string;
  isComment: boolean;
  likedBy: {
    [key: string]: boolean;
  };
  replyingTo: {
    all: Array<string>;
    handle: string;
    id: string;
  };
  text: string;
  timeInMillisecond: number;
  timeStamp: {
    date: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    months: number;
    seconds: number;
    years: number;
  };
  userName: string;
  userProfileImg: string;
  creatorId: string;
  reribbitedBy: {
    [key: string]: number;
  };
  isVerified: boolean;
  mediaUrl: string;
  mediaPath: string;
};

export type { RibbitType, RibbityUser };
