import "../styles/HomePanel.css";
import { signOutUser } from "../scripts/firebaseHelperFns";
import HomePanelNavbar from "./HomePanelNavbar";
import ExploreTweetTopic from "./ExploreTweetTopic";
import HomePanelTweetInput from "./HomePanelTweetInput";

interface HomePanelProps {
  currentUser?: {
    profileImgUrl?: string;
  };
}

const Home = ({ currentUser }: HomePanelProps) => {
  return (
    <div className="home-panel-container">
      <div className="home-panel-header">
        <HomePanelNavbar />
      </div>
      <div className="home-panel-main-feed">
        <HomePanelTweetInput currentUser={currentUser} />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />

        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
      </div>
    </div>
  );
};

export default Home;
