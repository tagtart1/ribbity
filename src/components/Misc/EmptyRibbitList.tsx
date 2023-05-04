import "../../styles/EmptyRibbitList.css";

interface EmptyRibbitListProps {
  tab: string;
  isMainUser: boolean;
  visitedUserHandle: string | undefined;
}

const EmptyRibbitList = ({
  tab,
  isMainUser,
  visitedUserHandle,
}: EmptyRibbitListProps) => {
  if (tab === "likes") {
    if (isMainUser) {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>You don't have any likes yet</h1>
            <p>
              Tap the heart on any Ribbit to show it some love. When you do,
              it'll show up here.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>@{visitedUserHandle} hasn't liked any Ribbits</h1>
            <p>When they do, those Ribbits will show up here.</p>
          </div>
        </div>
      );
    }
  }

  if (tab === "replies") {
    if (isMainUser) {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>You haven't made any replies yet</h1>
            <p>
              Reply to someone else's Ribbit to share your opinion. When you do,
              it'll show up here.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>@{visitedUserHandle} hasn't replied to any Ribbits</h1>
            <p>When they do, those Ribbits will show up here.</p>
          </div>
        </div>
      );
    }
  }

  if (tab === "media") {
    if (isMainUser) {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>You haven't posted any media yet</h1>
            <p>
              Send out a ribbit with a picture. When you do, it'll show up here.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>@{visitedUserHandle} hasn't posted any media</h1>
            <p>When they do, those Ribbits will show up here.</p>
          </div>
        </div>
      );
    }
  }

  if (tab === "ribbits") {
    if (isMainUser) {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>You haven't Ribbited yet</h1>
            <p>
              Send out a twat to share some news. When you do, it'll show up
              here.
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>@{visitedUserHandle} hasn't posted any Ribbits yet</h1>
            <p>When they do, those Ribbits will show up here.</p>
          </div>
        </div>
      );
    }
  }

  if (tab === "followers") {
    if (isMainUser) {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>You haven't gained any followers yet</h1>
            <p>
              Twat some more. Follow others. Share some news. Get noticed and
              the followers may come!
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>@{visitedUserHandle} doesn't have any followers yet</h1>
            <p>When they do, those people will show up here.</p>
          </div>
        </div>
      );
    }
  }
  if (tab === "following") {
    if (isMainUser) {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>You aren't following anyone yet</h1>
            <p>Check out the 'For you' tab to discover some now people!</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="empty-ribbit-list-wrapper">
          <div>
            <h1>@{visitedUserHandle} isn't following anyone yet</h1>
            <p>When they do, those people will show up here.</p>
          </div>
        </div>
      );
    }
  }

  return <div></div>;
};

export default EmptyRibbitList;
