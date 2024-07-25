import "./Record.css";
import { useSuspenseQuery } from "@tanstack/react-query";
import { recordQueryKeys } from "../../queries/recordQueries";
import { useEffect, useState } from "react";

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
  const [isRegistered, setIsRegistered] = useState(false);
  const { data: recognizedText } = useSuspenseQuery({
    ...recordQueryKeys.recognizeText(imgUrl, id, type),
  });

  useEffect(() => {
    if (recognizedText && !isRegistered) {
      onTextRecognition(recognizedText, id, type);
      setIsRegistered(true);
    }
  }, [recognizedText, id, type, onTextRecognition, isRegistered]);

  return <div className="write_record_tesseract">{recognizedText}</div>;
};
export default TextRecognizer;
