import "./Table.css";
import { Database } from "../api/supabase/supabase";

type Record = Database["public"]["Tables"]["record"]["Row"];

const Table = ({ rank, name, record, workoutType }: Record) => {
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
          <tr>
            <td>{rank}</td>
            <td>{name}</td>
            <td>{record}</td>
            <td>{workoutType}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
