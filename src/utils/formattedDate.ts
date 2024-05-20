import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatUtcDate = (utcDate: string) => {
  return dayjs(utcDate).utc().format("YYYY.MM.DD. HH:mm");
};
