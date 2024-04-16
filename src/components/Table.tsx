import "./Table.css";
import { Database } from "../api/supabase/supabase";

type Record = Database["public"]["Tables"]["record"]["Row"];

const Table = ({
  workoutType,
  records,
}: {
  workoutType: string;
  records: Record[];
}) => {
  return (
    <div className="table_wrapper">
      <h3 className="table_title">{workoutType}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>기록</th>
            <th>Rx’d/Scaled</th>
          </tr>
        </thead>
        <tbody>
          {records && records.length > 0 ? (
            records
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
              ))
          ) : (
            <div className="no_record">등록된 기록이 없습니다!</div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
