import { IoIosFitness } from "react-icons/io";
import "../../components/common/Common.css";

interface NoPostProps {
  post: string;
}

const NoPost = ({ post }: NoPostProps) => {
  return (
    <div className="no_post">
      <IoIosFitness />
      {post}가 등록되지 않았습니다 !
    </div>
  );
};

export default NoPost;
