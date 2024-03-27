import { useLocation } from "react-router-dom";
import WriteButton from "./WriteButton";
import "./Footer.css";

const Footer = () => {
  const { pathname } = useLocation();
  const showAddBtnPath = ["/notice", "/wod", "/record", "/hold", "/shop"];

  return (
    <footer className="footer">
      {showAddBtnPath.includes(pathname) && (
        <div className="footer_write_button">
          <WriteButton />
        </div>
      )}
    </footer>
  );
};

export default Footer;
