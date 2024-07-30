import { Link } from "react-router-dom";
import "./Header.css";
import weightlift from "../../assets/weightLifting.svg";
import { logoutAtom } from "../../store/atoms";
import { useSetAtom } from "jotai";
import { useAuthSetup } from "../../hooks/useAuthSetup";

const Header = () => {
  const { isLogged } = useAuthSetup();
  const logout = useSetAtom(logoutAtom);

  return (
    <header className="header">
      <Link to="/" className="header_logo">
        wodLog
        <img
          className="weight_lift_icon"
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
          <Link to="/login" className="header_menu_btn" onClick={logout}>
            LOGOUT
          </Link>
        ) : (
          <Link to="/login" className="header_menu_btn">
            LOGIN
          </Link>
        )}
      </nav>
    </header>
  );
};
export default Header;
