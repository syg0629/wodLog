import "./Table.css";

interface TableProps {
  title: string;
}

const Table = (props: TableProps) => {
  return (
    <div className="table_wrapper">
      <h3 className="table_title">{props.title}</h3>
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
            <td>1</td>
            <td>지유</td>
            <td>3R+16</td>
            <td>Rx’d</td>
          </tr>
          <tr>
            <td>2</td>
            <td>지유</td>
            <td>3R+16</td>
            <td>Rx’d</td>
          </tr>
          <tr>
            <td>3</td>
            <td>지유</td>
            <td>3R+16</td>
            <td>Rx’d</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
