import "../styles/ExploreTweetTopic.css";
import { kFormatter } from "../scripts/HelperFns";

interface ExploreTweetTopicProps {
  topicTitle: string;
  tweets: number;

  trendingTopic?: string;
  rankIndex?: number;

  trendingGenre?: string;
}

const ExploreTweetTopic = ({
  topicTitle,
  tweets,
  trendingTopic,
  rankIndex,

  trendingGenre,
}: ExploreTweetTopicProps) => {
  return (
    <div className="explore-tweet-topic-container">
      <div className="tweet-topic-top">
        {trendingTopic ? <div>{trendingTopic} · Trending</div> : null}
        {trendingGenre ? <div>Trending in {trendingGenre}</div> : null}
        {rankIndex ? (
          <div>
            {rankIndex} · {trendingTopic} · Trending
          </div>
        ) : null}
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="#71767B">
          <g>
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
          </g>
        </svg>
      </div>
      <h1>{topicTitle}</h1>
      <p>{kFormatter(tweets)} Tweets</p>
    </div>
  );
};

export default ExploreTweetTopic;
