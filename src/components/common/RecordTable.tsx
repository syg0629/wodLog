import "../common/Common.css";
import { Record } from "../../types/type";
import Table from "../../components/common/Table";

const RecordTable = ({
  workoutType,
  records,
}: {
  workoutType: string;
  records: Record[];
}) => {
  // Record table header
  const columnTitles = ["순위", "이름", "기록"];

  // Record table body
  const renderBody = (records: Record[]) => (
    <tbody>
      {records.map((record, index) => (
        <tr key={record.id}>
          <td>{index + 1}</td>
          <td>{record.name}</td>
          <td>
            {record.recordType === "unrecognizable"
              ? `기록 추출 시도 실패: ${record.record}`
              : record.record}
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="table_wrapper">
      <div className="table_title">{workoutType}</div>
      <Table
        columnTitles={columnTitles}
        data={records}
        renderBody={renderBody}
        post="Record"
      />
    </div>
  );
};

export default RecordTable;
