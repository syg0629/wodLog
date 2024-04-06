import "./Record.css";
import ActionButton from "../components/ActionButton";
import Table from "../components/Table";
import { Database } from "../api/supabase/supabase";
import { supabase } from "../api/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type Record = Database["public"]["Tables"]["record"]["Row"];

const Record = () => {
  const {
    data: records,
    isLoading,
    error,
  } = useQuery<Record[], Error, Record[], string[]>({
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    console.log("Supabase 데이터 가져오는 중 오류 >> ", error.message);
  }

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
