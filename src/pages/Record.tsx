import "./Record.css";
import Table from "../components/Table";

const tableTopTitle = ["Rx’d", "A"];
const tableBottomTitle = ["B", "C"];

const Record = () => {
  return (
    <div className="record_wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade_top">
        {tableTopTitle.map((title, idx) => (
          <Table key={idx} title={title} />
        ))}
      </div>
      <div className="record_grade_botton">
        {tableBottomTitle.map((title, idx) => (
          <Table key={idx} title={title} />
        ))}
      </div>
    </div>
  );
};

export default Record;
