import "./TextRecognizer.css";
import Tesseract from "tesseract.js";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/common/Loader";

interface TextRecognizerProps {
  imgUrl: string;
  id: number;
  type: string;
  onTextRecognition: (text: string, id: number, type: string) => void;
}

const TextRecognizer = ({
  imgUrl,
  id,
  type,
  onTextRecognition,
}: TextRecognizerProps) => {
  const { data: recognizedText, isLoading } = useQuery({
    queryKey: ["recognizeImgText", imgUrl],
    queryFn: async () => {
      if (imgUrl) {
        return await recognizeImgText(imgUrl, id, type);
      }
    },
  });

  const recognizeImgText = async (imgUrl: string, id: number, type: string) => {
    try {
      const result = await Tesseract.recognize(imgUrl, "eng+kor");

      if (result && result.data.text) {
        onTextRecognition(result.data.text, id, type);
        return result.data.text;
      }
    } catch (error) {
      console.log("텍스트 추출 중 에러 >> ", (error as Error).message);
      throw error;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return <div className="write_record_tesseract">{recognizedText}</div>;
};
export default TextRecognizer;
