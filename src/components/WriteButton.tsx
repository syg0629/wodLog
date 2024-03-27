import { Link, useLocation } from "react-router-dom";
import "./WriteButton.css";

const WriteButton = () => {
  const { pathname } = useLocation();
  const targetPath = pathname !== "/record" ? "/write" : "/addrecord";
  return (
    <Link to={targetPath} className="write_button">
      +
    </Link>
  );
};

export default WriteButton;
