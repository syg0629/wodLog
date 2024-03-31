import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import "./WriteButton.css";

interface WriteButtonProps {
  writePath: string;
}

const WriteButton = ({ writePath }: WriteButtonProps) => {
  const writeButtonRoot = document.getElementById("write_btn_root");
  if (!writeButtonRoot) return;

  return createPortal(
    <Link to={writePath} className="write_button">
      +
    </Link>,
    writeButtonRoot
  );
};

export default WriteButton;
