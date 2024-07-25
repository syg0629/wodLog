import { useAtom } from "jotai";
import { userInfoAtom } from "../store/atoms";
import { useNavigate } from "react-router-dom";

// 사용자 정보가 필요한 페이지에서 userInfo가 null일 경우 로그인 페이지로 이동하는 hook
export const useAuthenticatedUserInfo = () => {
  const navigate = useNavigate();
  const [userInfo] = useAtom(userInfoAtom);

  if (userInfo === null) {
    alert("로그인이 필요한 페이지입니다.");
    navigate("/login");
    throw new Error("사용자 인증 필요");
  }

  return userInfo;
};
