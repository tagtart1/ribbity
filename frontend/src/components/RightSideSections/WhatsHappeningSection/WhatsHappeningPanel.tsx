import "../../../styles/WhatsHappeningPanel.css";
import ExploreRibbitTopic from "../../Panels/Explore/ExploreRibbitTopic";
import ShowMoreButton from "../ShowMoreButton";
import frogImg from "../../../media/rainfrog.jpg";

const WhatsHappeningPanel = () => {
  return (
    <aside className="whats-happening-container">
      <h1>What's Happening</h1>
      <ExploreRibbitTopic
        topicTitle="Rain Frog Spotted"
        ribbits={98300}
        trendingTopic="Frogs"
        image={frogImg}
      />

      <ExploreRibbitTopic
        topicTitle="Twinkies"
        ribbits={82900}
        trendingTopic="Food"
      />

      <ExploreRibbitTopic
        topicTitle="Rihanna"
        ribbits={143000}
        trendingGenre="United States"
      />
      <ExploreRibbitTopic
        topicTitle="#TeamFortress2"
        ribbits={34600}
        trendingTopic="Gaming"
      />
      <ExploreRibbitTopic
        topicTitle="Russel Westbrook"
        ribbits={74200}
        trendingGenre="United States"
      />
      <ShowMoreButton />
    </aside>
  );
};

export default WhatsHappeningPanel;
