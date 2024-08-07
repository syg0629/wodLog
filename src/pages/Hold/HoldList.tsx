import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import { FaPencil } from "react-icons/fa6";
import { useSuspenseQuery } from "@tanstack/react-query";
import { holdQueryKeys } from "../../queries/holdQueries";
import Table from "../../components/common/Table";
import dayjs from "dayjs";
import { useMemo } from "react";
import { HoldWithUserInfo } from "../../types/type";
import { useAuthenticatedUserInfo } from "../../hooks/useAuthenticatedUserInfo";

const HoldList = () => {
  const userInfo = useAuthenticatedUserInfo();
  const navigate = useNavigate();

  const { data: hold } = useSuspenseQuery(holdQueryKeys.list(userInfo));

  const handleMoveToDetail = (id: number) => {
    const canEdit = hold.some(
      (holdData) =>
        holdData.id === id && userInfo.writerUuid === holdData.writerUuid
    );
    if (canEdit) {
      navigate(`/hold/${id}/edit`);
    } else {
      alert("본인이 작성한 Hold만 수정 가능합니다.");
    }
  };

  //Hold 신청일의 끝 날짜 기준으로 정렬
  const sortedData = useMemo(() => {
    return hold.sort((a, b) =>
      dayjs(b.holdEndDay).isBefore(dayjs(a.holdEndDay)) ? -1 : 1
    );
  }, [hold]);

  // Hold table header
  const columnTitles = ["No.", "이름", "신청기간", "사용 홀드", "잔여일"];

  // Hold table body
  const renderBody = (
    sortedData: HoldWithUserInfo[],
    handleMoveToDetail: (id: number) => void
  ) => (
    <tbody>
      {sortedData.map((holdData, index) => (
        <tr key={holdData.id} onClick={() => handleMoveToDetail(holdData.id)}>
          <td>{index + 1}</td>
          <td>{holdData.userInfo.userName}</td>
          <td>
            {holdData.holdStartDay} ~ {holdData.holdEndDay}
          </td>
          <td>{holdData.requestedHoldDays} 일</td>
          <td>{holdData.userInfo.remainingHoldDays} 일</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="wrapper">
      <h1 className="title">Hold</h1>

      <div className="hold_table_wrapper">
        <Table
          columnTitles={columnTitles}
          data={sortedData}
          renderBody={renderBody}
          post="Hold"
          handleMoveToDetail={handleMoveToDetail}
        />
      </div>

      <ActionButton>
        <Link to="/hold/write" className="write_button">
          <FaPencil />
        </Link>
      </ActionButton>
    </div>
  );
};

export default HoldList;
