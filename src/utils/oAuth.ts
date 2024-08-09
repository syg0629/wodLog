export const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;
export const GOOGLE_AUTH_URI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile`;
