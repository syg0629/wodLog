import WriteHold from "../../pages/Hold/WriteHold";
import { useParams } from "react-router-dom";
import { holdQueryKeys } from "../../queries/holdQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

const EditHold = () => {
  const params = useParams();
  const holdId = Number(params.id);

  const { data: editHoldData } = useSuspenseQuery(holdQueryKeys.detail(holdId));

  return <WriteHold isEdit={true} data={editHoldData} />;
};
export default EditHold;
