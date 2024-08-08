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
import { useAtomValue } from "jotai";
import { recordQueryKeys } from "../../queries/recordQueries";
import { useMemo } from "react";
import groupBy from "lodash/groupBy";

const workoutTypeOrder = ["Rx’d", "A", "B", "C"];
const recordTypeOrder = ["time", "round", "number", "unrecognizable"];

const RecordList = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const { data: records } = useSuspenseQuery(recordQueryKeys.list());

  const groupedAndSortedRecords = useMemo(() => {
    // workoutType 별로 records 그룹화
    const groupedRecords = groupBy(records, "workoutType");

    // 각 workoutType 그룹 내에서 records를 정렬
    for (const workoutType in groupedRecords) {
      groupedRecords[workoutType].sort((a, b) => {
        // recordType 순서 비교
        const typeComparison =
          recordTypeOrder.indexOf(a.recordType) -
          recordTypeOrder.indexOf(b.recordType);
        if (typeComparison !== 0) return typeComparison;

        // recordType이 같은 경우, sortableRecord 값으로 정렬
        // time 오름차순, round 및 number 내림차순
        return a.recordType === "time"
          ? a.sortableRecord - b.sortableRecord
          : b.sortableRecord - a.sortableRecord;
      });
    }
    return groupedRecords;
  }, [records]);

  // 존재하는 workoutType만 화면에 보여줌
  const sortedWorkoutTypes = workoutTypeOrder
    .filter((type) => groupedAndSortedRecords[type])
    .map((type) => [type, groupedAndSortedRecords[type]] as [string, Record[]]);

  const renderRecordTables = (start: number, end: number) => (
    <div className={`record_grade_${start + 1}`}>
      {sortedWorkoutTypes
        .slice(start, end)
        .map(([workoutType, workoutRecords]) => (
          <RecordTable
            key={workoutType}
            workoutType={workoutType}
            records={workoutRecords}
          />
        ))}
    </div>
  );

  return (
    <div className="wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade">
        {records && records.length > 0 ? (
          <>
            {renderRecordTables(0, 2)}
            {renderRecordTables(2, 4)}
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
