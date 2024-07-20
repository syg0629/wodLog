import NoPost from "../../components/common/NoPost";
import TableHeader from "./TableHeader";

interface TableProps<T> {
  columnTitles: string[];
  data: T[];
  renderBody: (
    data: T[],
    handleMoveToDetail: (id: number) => void
  ) => JSX.Element;
  handleMoveToDetail?: (id: number) => void;
  post: string;
}

const Table = <T,>({
  columnTitles,
  data,
  renderBody,
  post,
  handleMoveToDetail = () => {},
}: TableProps<T>) => {
  return (
    <div>
      {data.length > 0 ? (
        <table className="table">
          <TableHeader columnTitles={columnTitles} />
          {renderBody(data, handleMoveToDetail)}
        </table>
      ) : (
        <NoPost post={post} />
      )}
    </div>
  );
};
export default Table;
