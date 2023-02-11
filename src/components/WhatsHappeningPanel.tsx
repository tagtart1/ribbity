import "../styles/WhatsHappeningPanel.css";
import ExploreTweetTopic from "./ExploreTweetTopic";
import ShowMoreButton from "./ShowMoreButton";
import frogImg from "../media/rainfrog.jpg";

const WhatsHappeningPanel = () => {
  return (
    <div className="whats-happening-container">
      <h1>What's Happening</h1>
      <ExploreTweetTopic
        topicTitle="Rain Frog Spotted"
        tweets={98300}
        trendingTopic="Frogs"
        image={frogImg}
      />

      <ExploreTweetTopic
        topicTitle="Twinkies"
        tweets={82900}
        trendingTopic="Food"
      />

      <ExploreTweetTopic
        topicTitle="Rihanna"
        tweets={143000}
        trendingGenre="United States"
      />
      <ExploreTweetTopic
        topicTitle="#TeamFortress2"
        tweets={34600}
        trendingTopic="Gaming"
      />
      <ExploreTweetTopic
        topicTitle="Russel Westbrook"
        tweets={74200}
        trendingGenre="United States"
      />
      <ShowMoreButton />
    </div>
  );
};

export default WhatsHappeningPanel;
