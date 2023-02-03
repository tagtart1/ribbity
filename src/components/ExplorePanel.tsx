import "../styles/ExplorePanel.css";
import ExplorePanelNavbar from "./ExplorePanelNavbar";
import ExplorePanelSearch from "./ExplorePanelSearch";
import ExploreTweetTopic from "./ExploreTweetTopic";
import SectionTabsNoAuth from "./SectionTabNoAuth";
import SignUpModal from "./SignUpModal";

const ExplorePanel = () => {
  return (
    <div className="explore-panel-container">
      <div className="explore-panel-header">
        <ExplorePanelSearch />
        <ExplorePanelNavbar />
      </div>
      <div className="main-feed">
        <ExploreTweetTopic
          topicTitle="$AAPL"
          tweets={5300}
          trendingTopic="Businesss and finance"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={27300}
          trendingTopic="Sports"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Matt B"
          tweets={74300}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Crumbl"
          tweets={33800}
          trendingGenre="United States"
        />
        <ExploreTweetTopic
          topicTitle="Asensio"
          tweets={4800}
          trendingGenre="United States"
        />
      </div>
    </div>
  );
};

export default ExplorePanel;
