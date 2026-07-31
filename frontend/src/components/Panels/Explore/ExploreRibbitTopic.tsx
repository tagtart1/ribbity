import "../../../styles/ExploreRibbitTopic.css";
import { kFormatter } from "../../../scripts/HelperFns";

interface ExploreRibbitTopicProps {
  topicTitle: string;
  ribbits: number;

  trendingTopic?: string;
  rankIndex?: number;

  trendingGenre?: string;
  image?: string;
}

const ExploreRibbitTopic = ({
  topicTitle,
  ribbits,
  trendingTopic,
  rankIndex,
  image,
  trendingGenre,
}: ExploreRibbitTopicProps) => {
  return (
    <div className="explore-ribbit-topic-wrapper">
      <div className="explore-ribbit-topic-container">
        <div className="ribbit-topic-top">
          {trendingTopic ? <div>{trendingTopic} · Trending</div> : null}
          {trendingGenre ? <div>Trending in {trendingGenre}</div> : null}
          {rankIndex ? (
            <div>
              {rankIndex} · {trendingTopic} · Trending
            </div>
          ) : null}
          {image ? null : (
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="#71767B">
              <g>
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
              </g>
            </svg>
          )}
        </div>
        <h1 className="topic-title">{topicTitle}</h1>
        <p>{kFormatter(ribbits)} Ribbits</p>
      </div>
      {image ? <img src={image} alt={"topic"} className="topic-image" /> : null}
    </div>
  );
};

export default ExploreRibbitTopic;
