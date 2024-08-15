import { TiWarningOutline } from "react-icons/ti";
import "../../styles/NotFound.css";

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="not_found">
      <TiWarningOutline />
      <div>잘못된 접근입니다.</div>
      <div>찾으시는 페이지가 존재하지 않습니다.</div>
      <button className="go_back_btn" onClick={handleGoBack}>
        이전 페이지로
      </button>
    </div>
  );
};

export default NotFound;
