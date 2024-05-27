import { Link } from "react-router-dom";
import "./Header.css";
import weightlift from "../../assets/weightLifting.svg";

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header_logo">
        wodLog
        <img className="weightLiftIcon" src={weightlift} />
        &nbsp;&nbsp;
      </Link>
      <div className="header_menu_wrapper">
        <Link to="/notice" className="header_menu_btn">
          NOTICE
        </Link>
        <Link to="/wod" className="header_menu_btn">
          WOD
        </Link>
        <Link to="/record" className="header_menu_btn">
          RECORD
        </Link>
        <Link to="/hold" className="header_menu_btn">
          HOLD
        </Link>
        <Link to="/login" className="header_menu_btn_login">
          LOGIN
        </Link>
      </div>
    </header>
  );
};
export default Header;
