import ExploreTweetTopic from "./ExploreTweetTopic";

const ExploreTopicFeedRandom = () => {
  return (
    <>
      <ExploreTweetTopic
        topicTitle="$AAPL"
        tweets={5300}
        trendingTopic="Businesss and finance"
      />
      <ExploreTweetTopic
        topicTitle="White House"
        tweets={438500}
        trendingTopic="Politics"
      />
      <ExploreTweetTopic
        topicTitle="#FrogsAreCool"
        tweets={98400}
        trendingTopic="News"
      />
      <ExploreTweetTopic
        topicTitle="Asensio"
        tweets={10300}
        trendingGenre="United States"
      />
      <ExploreTweetTopic
        topicTitle="Kansas City"
        tweets={4800}
        trendingGenre="Missouri"
      />
      <ExploreTweetTopic
        topicTitle="Vince"
        tweets={70300}
        trendingTopic="Sports"
      />
      <ExploreTweetTopic
        topicTitle="Budweiser"
        tweets={24500}
        trendingTopic="Food"
      />
      <ExploreTweetTopic
        topicTitle="NBA Street"
        tweets={2740}
        trendingGenre="United States"
      />
      <ExploreTweetTopic
        topicTitle="Gen Z"
        tweets={45100}
        trendingGenre="United States"
      />
      <ExploreTweetTopic
        topicTitle="Banks"
        tweets={55500}
        trendingGenre="United States"
      />
      <ExploreTweetTopic
        topicTitle="Crumbl"
        tweets={33800}
        trendingTopic="Food"
      />
      <ExploreTweetTopic
        topicTitle="White House"
        tweets={131000}
        trendingGenre="United States"
      />
    </>
  );
};

export default ExploreTopicFeedRandom;
