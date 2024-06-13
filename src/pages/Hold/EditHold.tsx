import WriteHold from "../../pages/Hold/WriteHold";
import { useParams } from "react-router-dom";
import { holdQueryKeys } from "../../queries/holdQueries";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/common/Loader";

const EditHold = () => {
  const params = useParams();
  const holdId = Number(params.id);

  const { data: editHoldData } = useQuery(holdQueryKeys.detail(holdId));

  if (!editHoldData) {
    return <Loader />;
  }

  return <WriteHold isEdit={true} data={editHoldData} />;
};
export default EditHold;
