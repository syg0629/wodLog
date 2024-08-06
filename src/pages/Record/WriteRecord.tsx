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
type RecordType = "number" | "round" | "time" | "unrecognizable";

interface ExtractedRecord {
  name: string;
  recordType: RecordType;
  sortableRecord: number;
  record: string;
  workoutType: string;
  writerUuid: string;
}

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
    // 이름 패턴: (\p{L}+), 공백 문지: \s, 값 패턴: ([\d:]+R?(?:\s*\+\s*\d+)?) 숫자, 콜론, R 문자 및 +숫자 패턴 캡처
    const regExp = /(\p{L}+)\s+([\d:]+R?(?:\s*\+\s*\d+)?)/gu;

    const extractedRecords: ExtractedRecord[] = [];
    let match;
    // regExp.exec(): 정규 표현식에 해당하는 문자열을 검색. 패턴이 존재하면 문자열의 배열 반환, 일치하는 패턴이 없으면 null반환
    while ((match = regExp.exec(result)) !== null) {
      const [, name, record] = match;

      try {
        const recordType = getRecordType(record);
        extractedRecords.push({
          name,
          record,
          recordType,
          sortableRecord: getSortValue(record, recordType),
          workoutType: type,
          writerUuid: userInfo.writerUuid,
        });
      } catch (error) {
        console.error(`기록 처리 중 오류 발생 >> ${name}: ${error}`);
        alert(
          `기록 처리 중 오류가 발생했습니다. 오류 발생 기록 : ${name}: ${error}`
        );
      }
    }
    saveToSupabase(extractedRecords);
  };

  // 기록 타입 판단
  const getRecordType = (record: string): RecordType => {
    if (Number(record)) return "number";
    if (record.includes(":")) return "time";
    if (record.includes("R")) return "round";
    return "unrecognizable";
  };

  // 기록 타입 정렬을 위한 값 계산
  const getSortValue = (record: string, type: RecordType): number => {
    switch (type) {
      case "number":
        return Number(record);
      case "round": {
        // 라운드의 경우, "R" 기준으로 분리하여 계산
        const [rounds, reps] = record.split("R");
        // R에 1000을 곱힘, "+"가 있다면 더함
        const additionNum = reps
          ? reps.startsWith("+")
            ? reps.slice(1)
            : reps
          : 0;
        return Number(rounds) * 1000 + Number(additionNum);
      }
      case "time": {
        // 시간일 경우, minutes에 60을 곱함
        const [minutes, seconds] = record.split(":").map(Number);
        return minutes * 60 + seconds;
      }
      case "unrecognizable":
        console.warn("인식 불가 기록 >> ", record);
        return 0;
    }
  };

  //추출된 이름과 기록을 supabase에 insert
  const saveToSupabase = async (extractedRecords: ExtractedRecord[]) => {
    try {
      const { data, error } = await supabase
        .from("record")
        .insert(extractedRecords)
        .select();

      if (error) throw error;
      if (data.length > 0) {
        alert(
          "이미지에서 텍스트 추출이 완료되어 새로운 기록이 등록되었습니다."
        );
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
