import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatUtcDateToString = (utcDateString: string): string => {
  return dayjs(utcDateString).utc().format("YYYY.MM.DD. HH:mm");
};

export const formatDateToString = (date: Date): string => {
  return dayjs(date).format("YYYY.MM.DD");
};

export const formatNumberToDate = (numberDate: number): Date => {
  return dayjs(numberDate.toString(), "YYYYMMDD").toDate();
};
