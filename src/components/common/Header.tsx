import { Link } from "react-router-dom";
import "./Header.css";
import weightlift from "../../assets/weightLifting.svg";
import { userAuthAtom, logoutAtom } from "../../store/atoms";
import { useAtom } from "jotai";

const Header = () => {
  const [accessToken] = useAtom(userAuthAtom);
  const [, logout] = useAtom(logoutAtom);
  const isLogged = !!accessToken;

  return (
    <header className="header">
      <Link to="/" className="header_logo">
        wodLog
        <img
          className="weightLiftIcon"
          src={weightlift}
          alt="Weightlifting Icon"
        />
        &nbsp;&nbsp;
      </Link>
      <nav className="header_menu_wrapper">
        <Link to="/notice" className="header_menu_btn">
          NOTICE
        </Link>
        <Link to="/wod" className="header_menu_btn">
          WOD
        </Link>
        <Link to="/record" className="header_menu_btn">
          RECORD
        </Link>
        {isLogged && (
          <Link to="/hold" className="header_menu_btn">
            HOLD
          </Link>
        )}
        {isLogged ? (
          <Link to="/login" className="header_menu_btn_login" onClick={logout}>
            LOGOUT
          </Link>
        ) : (
          <Link to="/login" className="header_menu_btn_login">
            LOGIN
          </Link>
        )}
      </nav>
    </header>
  );
};
export default Header;
