import "./Record.css";
import "../../components/Components.css";
import ActionButton from "../../components/ActionButton";
import Table from "../../components/Table";
import { Database } from "../../api/supabase/supabase";
import { supabase } from "../../api/supabase/supabaseClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type Record = Database["public"]["Tables"]["record"]["Row"];

const Record = () => {
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
    <div className="record_wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade">
        {records && records.length > 0 ? (
          Object.entries(groupedRecords).map(
            ([workoutType, workoutRecords]) => (
              <Table
                key={workoutType}
                workoutType={workoutType}
                records={workoutRecords}
              />
            )
          )
        ) : (
          <div className="no_record">등록된 기록이 없습니다!</div>
        )}
      </div>
      <ActionButton>
        <Link to="/record/write" className="write_button">
          +
        </Link>
      </ActionButton>
    </div>
  );
};

export default Record;
