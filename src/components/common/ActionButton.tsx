import { createPortal } from "react-dom";
import "./ActionButton.css";

interface ActionButtonProps {
  children: React.ReactElement;
}

const ActionButton = ({ children }: ActionButtonProps) => {
  const actionButtonRoot = document.getElementById("action_button_root");
  if (!actionButtonRoot) return;

  return createPortal(children, actionButtonRoot);
};

export default ActionButton;
