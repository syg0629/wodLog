import axios from "axios";
import { GOOGLE_CLIENT_ID, REDIRECT_URI } from "../../utils/oAuth";

interface GoogleTokenResponse {
  access_token: string;
}

export const getGoogleToken = async (
  code: string
): Promise<GoogleTokenResponse> => {
  try {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    });

    const response = await axios.post<GoogleTokenResponse>(
      "https://oauth2.googleapis.com/token",
      params
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("구글 토큰 요청 실패 >> ", error.response?.data);
      throw new Error(
        `구글 토큰 요청 실패 >> ${
          error.response?.data?.error_description || error.message
        }`
      );
    }
    console.error("구글 토큰 요청 중 오류 >> ", error);
    throw new Error("구글 토큰 요청 중 알 수 없는 오류가 발생했습니다.");
  }
};

export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("구글 유저 정보 요청 중 오류 >> ", error);
    throw new Error("구글 유저 정보 요청 중 알 수 없는 오류가 발생했습니다.");
  }
};
