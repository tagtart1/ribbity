import { Link } from "react-router-dom";
import "../../styles/ShowMoreButton.css";

const ShowMoreButton = () => {
  return (
    <Link to={"/explore"}>
      <button className="show-more-button">Show more</button>
    </Link>
  );
};
export default ShowMoreButton;
