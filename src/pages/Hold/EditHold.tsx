import WriteHold from "../../pages/Hold/WriteHold";
import { useParams } from "react-router-dom";
import { holdQueryKeys } from "../../queries/holdQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuthenticatedUserInfo } from "../../hooks/useAuthenticatedUserInfo";

const EditHold = () => {
  const params = useParams();
  const holdId = Number(params.id);
  const userInfo = useAuthenticatedUserInfo();

  const { data: editHoldData } = useSuspenseQuery(
    holdQueryKeys.detail(holdId, userInfo)
  );

  return <WriteHold isEdit={true} editData={editHoldData} />;
};
export default EditHold;
