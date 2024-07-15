import "./RecordList.css";
import "../../components/common/Common.css";
import ActionButton from "../../components/common/ActionButton";
import RecordTable from "../../components/common/RecordTable";
import { Database } from "../../api/supabase/supabase";
import { supabase } from "../../api/supabase/supabaseClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { FaPencil } from "react-icons/fa6";
import NoPost from "../../components/common/NoPost";

type Record = Database["public"]["Tables"]["record"]["Row"];

const RecordList = () => {
  const { data: records } = useSuspenseQuery<
    Record[],
    Error,
    Record[],
    string[]
  >({
    queryKey: ["records"],
    queryFn: async () => {
      const data: PostgrestSingleResponse<Record[]> = await supabase
        .from("record")
        .select("*")
        .order("record", { ascending: true });

      return handleSupabaseResponse(data);
    },
  });

  const groupedRecords = records?.reduce((acc, record) => {
    if (!acc[record.workoutType]) {
      acc[record.workoutType] = [];
    }
    acc[record.workoutType].push(record);
    return acc;
  }, {} as { [key: string]: Record[] });

  return (
    <div className="wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade">
        {records && records.length > 0 ? (
          <>
            <div className="record_grade_1">
              {Object.entries(groupedRecords)
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
              {Object.entries(groupedRecords)
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
      <ActionButton>
        <Link to="/record/write" className="write_button">
          <FaPencil />
        </Link>
      </ActionButton>
    </div>
  );
};

export default RecordList;
