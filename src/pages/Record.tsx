import "./Record.css";
import "./Component.css";
import ActionButton from "../components/ActionButton";
import Table from "../components/Table";
import { Database } from "../api/supabase/supabase";
import { supabase } from "../api/supabase/supabaseClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

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
      const { data, error } = await supabase
        .from("record")
        .select("*")
        .order("record", { ascending: true });
      if (error) {
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="record_wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade_top">
        {records?.map((record: Record) => (
          <Table key={record.id} {...record} />
        ))}
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
