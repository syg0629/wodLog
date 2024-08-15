import axios from "axios";
import { KAKAO_CLIENT_ID, REDIRECT_URI } from "../../config/oAuth";

interface KakaoTokenResponse {
  access_token: string;
}

export const getKakaoToken = async (
  code: string
): Promise<KakaoTokenResponse> => {
  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code,
    });

    const response = await axios.post<KakaoTokenResponse>(
      "https://kauth.kakao.com/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("카카오 토큰 요청 실패 >> ", error.response?.data);
      throw new Error(
        `카카오 토큰 요청 실패 >> ${
          error.response?.data?.error_description || error.message
        }`
      );
    }
    console.error("카카오 토큰 요청 중 오류 >> ", error);
    throw new Error("카카오 토큰 요청 중 알 수 없는 오류가 발생했습니다.");
  }
};

export const getKakaoUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    return response.data;
  } catch (error) {
    console.error("카카오 유저 정보 요청 중 오류 >> ", error);
    throw new Error("카카오 유저 정보 요청 중 알 수 없는 오류가 발생했습니다.");
  }
};
