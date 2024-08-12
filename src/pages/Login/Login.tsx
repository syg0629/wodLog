import { PiUser, PiLock } from "react-icons/pi";
import "./Login.css";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../../api/supabase/supabaseClient";
import { FaExclamationCircle } from "react-icons/fa";
import { useSetAtom, useAtomValue } from "jotai";
import {
  accessTokenAtom,
  isAuthenticatedAtom,
  userInfoAtom,
} from "../../store/atoms";
import kakaoLoginBtn from "../../assets/btnKakao.svg";
import googleLoginBtn from "../../assets/btnGoogle.svg";
import { useEffect, useRef } from "react";
import { KAKAO_AUTH_URI, GOOGLE_AUTH_URI } from "../../utils/oAuth";

interface LoginFormData {
  userId: string;
  userPw: string;
}

const Login = () => {
  const navigate = useNavigate();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const location = useLocation();
  const alertShown = useRef(false);

  useEffect(() => {
    if (location.state?.from && !isAuthenticated && !alertShown.current) {
      alert("로그인 후 이용 가능한 페이지입니다.");
      alertShown.current = true;
    } else if (isAuthenticated) {
      const from = location.state?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    }
  }, [location, isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      userId: "test@example.com",
      userPw: "testP@ssw0rd",
    },
  });

  const handleLogin = async (formData: LoginFormData) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.userId,
          password: formData.userPw,
        });

      if (authError) throw authError;

      const { data: userInfoData, error: userInfoError } = await supabase
        .from("userInfo")
        .select("userName, auth")
        .eq("email", formData.userId)
        .single();

      if (userInfoError) throw userInfoError;

      const userName = userInfoData.userName;

      if (authData.session.access_token) {
        setAccessToken(authData.session.access_token);
        setUserInfo({
          userName,
          writerUuid: authData.user.id,
          auth: userInfoData.auth,
        });
        alert(`${userName}님 안녕하세요~🏋🏻`);

        const from = location.state?.from?.pathname ?? "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("로그인 중 오류 발생 >> ", error);
      alert("아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleOAuthLogin = async (provider: "kakao" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error(`${provider} 로그인 중 오류 발생 >> `, error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login_wrapper">
      <h1 className="title">Login</h1>
      <form className="login_form" onSubmit={handleSubmit(handleLogin)}>
        <div className="login_box">
          <div className="login_box_id">
            <PiUser />
            <input
              type="text"
              placeholder="아이디"
              className="login_input_id"
              {...register("userId", { required: true })}
            />
          </div>
          <div className="login_box_pw">
            <PiLock />
            <input
              type="password"
              placeholder="비밀번호"
              className="login_input_pw"
              {...register("userPw", { required: true })}
            />
          </div>
          {errors?.userId?.type === "required" && (
            <div className="error_message">
              <FaExclamationCircle /> 아이디를 입력해주세요.
            </div>
          )}
          {errors?.userPw?.type === "required" && (
            <div className="error_message">
              <FaExclamationCircle /> 비밀번호를 입력해주세요.
            </div>
          )}
        </div>
        <button className="login_btn">로그인</button>
      </form>
      <div className="easy_login">
        <hr />
        <span className="easy_login_title">간편 로그인</span>
        <div className="easy_login_button">
          <Link to={KAKAO_AUTH_URI}>
            <div
              className="kakao_login"
              onClick={() => handleOAuthLogin("kakao")}
            >
              <img src={kakaoLoginBtn} alt="카카오 로그인" />
            </div>
          </Link>
          <Link to={GOOGLE_AUTH_URI}>
            <div
              className="google_login"
              onClick={() => handleOAuthLogin("google")}
            >
              <img src={googleLoginBtn} alt="구글 로그인" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
