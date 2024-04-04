import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import "./ActionButton.css";

interface ActionButtonProps {
  path: string;
  text: string;
  cssType: string;
}

const ActionButton = ({ path, text, cssType }: ActionButtonProps) => {
  const ActionButtonRoot = document.getElementById("action_button_root");
  if (!ActionButtonRoot) return;

  return createPortal(
    <Link to={path} className={cssType}>
      {text}
    </Link>,
    ActionButtonRoot
  );
};

export default ActionButton;
