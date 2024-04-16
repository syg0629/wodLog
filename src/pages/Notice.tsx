import { Link } from "react-router-dom";
import ActionButton from "../components/ActionButton";

const Notice = () => {
  return (
    <div>
      Notice
      <ActionButton>
        <Link to="/notice/write" className="write_button">
          +
        </Link>
      </ActionButton>
    </div>
  );
};

export default Notice;
