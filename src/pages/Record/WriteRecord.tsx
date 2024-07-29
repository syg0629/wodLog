import { useState } from "react";
import "./Record.css";
import { supabase } from "../../api/supabase/supabaseClient";
import ImageUploader from "../Record/ImgUploader";
import TextRecognizer from "../Record/TextRecognizer";
import { useAuthenticatedUserInfo } from "../../hooks/useAuthenticatedUserInfo";

const workoutType = [
  { id: 0, type: "Rx’d" },
  { id: 1, type: "A" },
  { id: 2, type: "B" },
  { id: 3, type: "C" },
];

const WriteRecord = () => {
  const userInfo = useAuthenticatedUserInfo();
  const [uploadImgUrls, setUploadImgUrls] = useState<string[] | null>(
    Array(workoutType.length).fill(null)
  );
  const [results, setResults] = useState<string[]>([]);

  // 이미지 업로드, 업로드된 이미지 url로 변환
  const handleImgChange = (imgUrl: string, id: number) => {
    if (uploadImgUrls) setUploadImgUrls(uploadImgUrls.with(id, imgUrl));
  };

  // 이미지에서 변환된 url로 텍스트 추출(테서렉서 라이브러리 사용)
  const handleTextRecognition = (text: string, id: number, type: string) => {
    const newResults = [...results];
    newResults[id] = text;
    setResults(newResults);
    handleExtract(newResults[id], type);
  };

  // 텍스트로 추출된 문자열을 정규식으로 이름, 기록으로 각각 추출
  const handleExtract = (result: string, type: string) => {
    const regExp = /(\p{L}+)\s+(\d+)(?:\s*R\s*\+\s*(\d+))?|\p{L}+\s+\d+/gu;
    const extractedRecords = [];
    let match;
    // regExp.exec(): 정규 표현식에 해당하는 문자열을 검색. 패턴이 존재하면 문자열의 배열 반환, 일치하는 패턴이 없으면 null반환
    while ((match = regExp.exec(result)) !== null) {
      const name = match[1];
      let record: number;

      // 이름 뒤에 숫자만 있는 경우, "R"과 함께 record를 만듬
      if (!match[3]) {
        record = parseFloat(match[2]);
      } else {
        // supabase 저장될 때는 R를 .으로 바꿔서 소수로 저장
        record = parseFloat(`${match[2]}.${match[3]}`);
      }
      const workoutType = type;
      extractedRecords.push({
        name,
        record,
        workoutType,
        writerUuid: userInfo.writerUuid,
      });
    }
    tesseractTosupabase(extractedRecords);
  };

  //추출된 이름과 기록을 supabase에 insert
  const tesseractTosupabase = async (
    extractedRecords: {
      name: string;
      record: number;
      workoutType: string;
      writerUuid: string;
    }[]
  ) => {
    try {
      const { data, error } = await supabase
        .from("record")
        .insert(extractedRecords)
        .select();

      if (error) {
        throw error;
      } else {
        const newId: number = data[0].id;
        if (newId) {
          alert(
            "이미지에서 텍스트 추출이 완료되어 새로운 기록이 등록되었습니다."
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("신규 기록 등록 시 오류 발생 >> ", error.message);
        alert("신규 기록 등록 시 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">Record</h1>
      <div className="write_record_wrapper">
        {workoutType.map(({ id, type }) => (
          <div className="write_record_grade_wrapper" key={id}>
            <div className="write_record_img_uploader">
              <ImageUploader
                onImgChange={handleImgChange}
                id={id}
                type={type}
              />
            </div>
            <div className="write_record_text_recognizer">
              <TextRecognizer
                imgUrl={uploadImgUrls ? uploadImgUrls[id] : ""}
                id={id}
                type={type}
                onTextRecognition={handleTextRecognition}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WriteRecord;
