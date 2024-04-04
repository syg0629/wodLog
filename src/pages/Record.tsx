import "./Record.css";
import ActionButton from "../components/ActionButton";
import Table from "../components/Table";
import { Database } from "../api/supabase/supabase";
import { supabase } from "../api/supabase/supabaseClient";
import { useEffect, useState } from "react";

type Record = Database["public"]["Tables"]["record"]["Row"];

const Record = () => {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: records, error } = await supabase
          .from("record")
          .select("*")
          .order("record", { ascending: true });

        if (error) {
          throw error;
        }
        setRecords(records);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Supabase 데이터 가져오는 중 오류 >> ", error.message);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="record_wrapper">
      <h1 className="title">Record</h1>
      <div className="record_grade_top">
        {records.map((record: Record) => (
          <Table key={record.id} {...record} />
        ))}
      </div>
      <ActionButton path="/record/write" text="+" cssType="write_button" />
    </div>
  );
};

export default Record;
