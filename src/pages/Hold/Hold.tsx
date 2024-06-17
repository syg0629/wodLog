import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import { FaPencil } from "react-icons/fa6";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HoldType, holdQueryKeys } from "../../queries/holdQueries";
import Table from "../../components/common/Table";
import dayjs from "dayjs";

const Hold = () => {
  const navigate = useNavigate();
  const onClickMoveToDetail = (id: number) => {
    navigate(`/hold/${id}/edit`);
  };

  const { data } = useSuspenseQuery(holdQueryKeys.list());

  // Hold 신청일의 끝 날짜 기준으로 정렬
  const sortedData = Array.isArray(data)
    ? data.sort((a, b) =>
        dayjs(b.holdEndDay).isBefore(dayjs(a.holdEndDay)) ? -1 : 1
      )
    : [];

  // Hold table header
  const columnTitles = ["No.", "이름", "신청기간", "사용 홀드", "잔여일"];

  // Hold table body
  const renderBody = (
    sortedData: HoldType[],
    onClickMoveToDetail: (id: number) => void
  ) => (
    <tbody>
      {sortedData.map((data, index) => (
        <tr key={data.id} onClick={() => onClickMoveToDetail(data.id)}>
          <td>{index + 1}</td>
          <td>{data.writer}</td>
          <td>
            {data.holdStartDay} ~ {data.holdEndDay}
          </td>
          <td>{data.requestedHoldDate} 일</td>
          <td>{data.remainingDays} 일</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="wrapper">
      <h1 className="title">Hold</h1>

      <div className="hold_wrapper">
        <div className="hold_table_wrapper">
          <Table
            columnTitles={columnTitles}
            data={sortedData}
            renderBody={renderBody}
            post="hold"
            onClickMoveToDetail={onClickMoveToDetail}
          />
        </div>
      </div>

      <ActionButton>
        <Link to="/hold/write" className="write_button">
          <FaPencil />
        </Link>
      </ActionButton>
    </div>
  );
};

export default Hold;
