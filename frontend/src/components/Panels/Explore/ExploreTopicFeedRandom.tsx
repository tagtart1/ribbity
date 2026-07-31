import ExploreRibbitTopic from "./ExploreRibbitTopic";

// Static list of random explore page topics
const ExploreTopicFeedRandom = () => {
  return (
    <>
      <ExploreRibbitTopic
        topicTitle="$AAPL"
        ribbits={5300}
        trendingTopic="Businesss and finance"
      />
      <ExploreRibbitTopic
        topicTitle="White House"
        ribbits={438500}
        trendingTopic="Politics"
      />
      <ExploreRibbitTopic
        topicTitle="#FrogsAreCool"
        ribbits={98400}
        trendingTopic="News"
      />
      <ExploreRibbitTopic
        topicTitle="Asensio"
        ribbits={10300}
        trendingGenre="United States"
      />
      <ExploreRibbitTopic
        topicTitle="Kansas City"
        ribbits={4800}
        trendingGenre="Missouri"
      />
      <ExploreRibbitTopic
        topicTitle="Vince"
        ribbits={70300}
        trendingTopic="Sports"
      />
      <ExploreRibbitTopic
        topicTitle="Budweiser"
        ribbits={24500}
        trendingTopic="Food"
      />
      <ExploreRibbitTopic
        topicTitle="NBA Street"
        ribbits={2740}
        trendingGenre="United States"
      />
      <ExploreRibbitTopic
        topicTitle="Gen Z"
        ribbits={45100}
        trendingGenre="United States"
      />
      <ExploreRibbitTopic
        topicTitle="Banks"
        ribbits={55500}
        trendingGenre="United States"
      />
      <ExploreRibbitTopic
        topicTitle="Crumbl"
        ribbits={33800}
        trendingTopic="Food"
      />
      <ExploreRibbitTopic
        topicTitle="White House"
        ribbits={131000}
        trendingGenre="United States"
      />
    </>
  );
};

export default ExploreTopicFeedRandom;
