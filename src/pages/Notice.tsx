import ActionButton from "../components/ActionButton";

const Notice = () => {
  return (
    <div>
      Notice
      <ActionButton path="/notice/write" text="+" cssType="write_button" />
    </div>
  );
};

export default Notice;
