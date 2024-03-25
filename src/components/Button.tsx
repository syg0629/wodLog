import "./Button.css";

type ButtonProps = {
  text: string;
  onClick: () => void;
};

const Button = ({ text, onClick }) => {
  return (
    <button className="Button" onClick={onClick}>
      {text}
    </button>
  );
};
export default Button;
