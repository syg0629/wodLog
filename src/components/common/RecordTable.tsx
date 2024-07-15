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
  const columnTitles = ["순위", "이름", "기록", "Rx’d/Scaled"];

  // Record table body
  const renderBody = (records: Record[]) => (
    <tbody>
      {records
        .sort((a, b) => {
          const aRecord = a.record ?? 0;
          const bRecord = b.record ?? 0;
          return bRecord - aRecord;
        })
        .map((record, index) => (
          <tr key={record.id}>
            <td>{index + 1}</td>
            <td>{record.name}</td>
            <td>
              {record.record && !Number.isInteger(record.record)
                ? record.record.toString().replace(".", "R ")
                : record.record}
            </td>
            <td>{record.workoutType}</td>
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
