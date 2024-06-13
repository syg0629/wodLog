import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import { FaPencil } from "react-icons/fa6";
import { useSuspenseQuery } from "@tanstack/react-query";
import { holdQueryKeys } from "../../queries/holdQueries";
import NoPost from "../../components/common/NoPost";
import Loader from "../../components/common/Loader";

const Hold = () => {
  const navigate = useNavigate();
  const onClickMoveToDetail = (id: number) => {
    navigate(`/hold/${id}/edit`);
  };

  const { data: hold } = useSuspenseQuery(holdQueryKeys.list());

  if (!hold) {
    return <Loader />;
  }

  return (
    <div className="wrapper">
      <h1 className="title">Hold</h1>

      <div className="hold_wrapper">
        <div className="hold_table_wrapper">
          {hold.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>이름</th>
                  <th>신청기간</th>
                  <th>사용 홀드</th>
                  <th>잔여일</th>
                </tr>
              </thead>
              <tbody>
                {hold
                  .sort((a, b) => b.holdEndDay.localeCompare(a.holdStartDay))
                  .map((post, index) => (
                    <tr
                      key={post.id}
                      onClick={() => onClickMoveToDetail(post.id)}
                    >
                      <td>{index + 1}</td>
                      <td>{post.writer}</td>
                      <td>
                        {post.holdStartDay} ~ {post.holdEndDay}
                      </td>
                      <td>{post.requestedHoldDate} 일</td>
                      <td>{post.remainingDays} 일</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <NoPost post="Hold" />
          )}
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
