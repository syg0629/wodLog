import "./Record.css";
import "../../components/common/Common.css";
import ActionButton from "../../components/common/ActionButton";
import RecordTable from "../../components/common/RecordTable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";
import NoPost from "../../components/common/NoPost";
import { Record } from "../../types/type";
import { userInfoAtom } from "../../store/atoms";
import { useAtom } from "jotai";
import { recordQueryKeys } from "../../queries/recordQueries";

const RecordList = () => {
  const [userInfo] = useAtom(userInfoAtom);
  const { data: records } = useSuspenseQuery(recordQueryKeys.list());

  const groupedRecords = records?.reduce((acc, record) => {
    if (!acc[record.workoutType]) {
      acc[record.workoutType] = [];
    }
    acc[record.workoutType].push(record);
    return acc;
  }, {} as { [key: string]: Record[] });

  const sortedRecords = ["Rx’d", "A", "B", "C"]
    .filter((type) => groupedRecords && groupedRecords[type])
    .map((type) => [type, groupedRecords[type]] as [string, Record[]]);

  return (
    <div className="wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade">
        {records && records.length > 0 ? (
          <>
            <div className="record_grade_1">
              {sortedRecords
                .slice(0, 2)
                .map(([workoutType, workoutRecords]) => (
                  <RecordTable
                    key={workoutType}
                    workoutType={workoutType}
                    records={workoutRecords}
                  />
                ))}
            </div>
            <div className="record_grade_2">
              {sortedRecords
                .slice(2, 4)
                .map(([workoutType, workoutRecords]) => (
                  <RecordTable
                    key={workoutType}
                    workoutType={workoutType}
                    records={workoutRecords}
                  />
                ))}
            </div>
          </>
        ) : (
          <NoPost post="Record" />
        )}
      </div>

      {userInfo?.auth === "admin" && (
        <ActionButton>
          <Link to="/record/write" className="write_button">
            <FaPencil />
          </Link>
        </ActionButton>
      )}
    </div>
  );
};

export default RecordList;
