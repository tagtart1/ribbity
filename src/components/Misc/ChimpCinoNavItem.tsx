import CasinoCardIcon from "../../media/svg/CasinoCardIcon";

const CHIMP_CINO_URL = "https://www.chimpcino.com";

const ChimpCinoNavItem = () => {
  return (
    <li className="tab-list-item">
      <a
        href={CHIMP_CINO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Chimp Cino in a new tab"
      >
        <div className="tab-items">
          <CasinoCardIcon />
          <p>Chimp Cino</p>
        </div>
      </a>
    </li>
  );
};

export default ChimpCinoNavItem;
