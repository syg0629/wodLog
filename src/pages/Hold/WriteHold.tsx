import "./WriteHold.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { eachDayOfInterval } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import dayjs from "dayjs";
import Line from "../../components/common/Line";
import { useNavigate, useParams } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { ko } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { supabase } from "../../api/supabase/supabaseClient";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";
import { holdQueryKeys, Hold } from "../../queries/holdQueries";
import {
  formatNumberToDate,
  formatDateToString,
} from "../../utils/formattedDate";

interface WriteProps {
  isEdit: boolean;
  data: Hold[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const currentYear = today.getFullYear();
const years = [currentYear, currentYear + 1];

export const WriteHold = ({ isEdit, data }: WriteProps) => {
  const params = useParams();
  const holdId = Number(params.id);
  const navigate = useNavigate();

  const [range, setRange] = useState<DateRange | undefined>(undefined);

  // 공휴일 데이터 prefetching
  const queryClient = useQueryClient();
  useEffect(() => {
    years.forEach((year) => {
      queryClient.prefetchQuery({
        queryKey: holdQueryKeys.holidays(year).queryKey,
        queryFn: holdQueryKeys.holidays(year).queryFn,
        staleTime: 1000 * 60 * 60 * 24 * 30,
      });
    });
  }, [queryClient]);

  // 공휴일 데이터를 가져오기 위한 useQueries
  const holidayQueries = useQueries({
    queries: years.map((year) => ({
      queryKey: holdQueryKeys.holidays(year).queryKey,
      queryFn: holdQueryKeys.holidays(year).queryFn,
      staleTime: 1000 * 60 * 60 * 24 * 30,
    })),
  });

  const holidays = holidayQueries.flatMap((query) => query.data ?? []);

  // 공휴일 데이터를 Date 객체로 변환 후 유효한 데이터만 필터링
  const holidayDates = useMemo(
    () =>
      holidays
        .map((holiday) => formatNumberToDate(holiday.locdate))
        .filter((date) => date && !isNaN(date.getTime())),
    [holidays]
  );

  // 공휴일 여부 확인
  const isHoliday = useCallback(
    (date: Date) =>
      holidayDates.some((holiday) => holiday.getTime() === date.getTime()),
    [holidayDates]
  );

  // 데이터가 있을 경우, 기존 데이터를 state에 저장
  useEffect(() => {
    if (data && data[0]) {
      const { holdStartDay, holdEndDay } = data[0];
      setRange({
        from: new Date(holdStartDay),
        to: new Date(holdEndDay),
      });
    }
  }, [data]);

  // 총 홀드일 계산(일요일, 공휴일 제외)
  const calculateTotalHoldDays = useCallback(
    (startDate: Date, endDate: Date) => {
      const allDates = eachDayOfInterval({ start: startDate, end: endDate });
      return allDates.filter((date) => date.getDay() !== 0 && !isHoliday(date))
        .length;
    },
    [isHoliday]
  );

  // 총 홀드일 계산
  const totalHoldDays = useMemo(() => {
    if (range?.from && range?.to) {
      return calculateTotalHoldDays(range.from, range.to);
    }
    return 0;
  }, [calculateTotalHoldDays, range]);

  // 잔여일 계산
  const remainingDays = useMemo(() => {
    if (data && range?.from && range?.to) {
      const initialTotalHoldDays = calculateTotalHoldDays(
        new Date(data[0].holdStartDay),
        new Date(data[0].holdEndDay)
      );
      return data[0].remainingDays + initialTotalHoldDays - totalHoldDays;
    }
    return 0;
  }, [totalHoldDays, calculateTotalHoldDays, data, range]);

  // 달력 내 공휴일, 일요일, 지난 날짜를 disabled 처리
  const modifiers = useMemo(
    () => ({
      disabled: [...holidayDates, { dayOfWeek: [0] }, { before: today }],
    }),
    [holidayDates]
  );

  const saveHold = useMutation<Hold, Error, Hold>({
    mutationFn: async (holdData: Hold): Promise<Hold> => {
      const {
        createdDate,
        holdStartDay,
        holdEndDay,
        remainingDays,
        requestedHoldDate,
        writer,
      } = holdData;
      const savedHold = isEdit
        ? await supabase
            .from("hold")
            .update({
              createdDate,
              holdStartDay,
              holdEndDay,
              remainingDays,
              requestedHoldDate,
            })
            .eq("id", holdId)
            .select()
        : await supabase
            .from("hold")
            .insert([
              {
                createdDate,
                holdStartDay,
                holdEndDay,
                remainingDays,
                requestedHoldDate,
                writer,
              },
            ])
            .select();

      return (await handleSupabaseResponse(savedHold))[0];
    },
    onSuccess: () => {
      navigate("/hold");
    },
    onError: (error) => {
      console.error("Hold 등록/수정 시 오류 >> ", error.message);
    },
  });

  const onClickSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (totalHoldDays === 0) {
      alert(
        "선택된 기간이 없습니다.\n일요일, 공휴일은 제외되오니 다시 선택해주세요."
      );
      return;
    }

    if (remainingDays <= 0) {
      alert("잔여일이 신청하신 총 홀드일보다 부족합니다.");
      return;
    }

    const confirmMessage = isEdit ? "수정하시겠습니까?" : "등록하시겠습니까?";
    const formattedData = {
      id: holdId,
      holdStartDay: formatDateToString(range?.from ?? new Date()),
      holdEndDay: formatDateToString(range?.to ?? new Date()),
      remainingDays,
      requestedHoldDate: totalHoldDays,
      createdDate: dayjs().format("YYYY.MM.DD HH:mm:ss"),
      writer: "작성자",
    };

    if (confirm(confirmMessage)) {
      saveHold.mutate(formattedData);
    }
  };

  const onClickDelete = async () => {
    if (confirm("삭제하시겠습니까?")) {
      await supabase.from("hold").delete().eq("id", holdId);
      alert("해당 Hold가 삭제되었습니다.");
      navigate("/hold", { replace: true });
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">Hold</h1>
      <form onSubmit={onClickSubmit}>
        <div className="write_btn_wrapper">
          <button type="submit">{isEdit ? "수정하기" : "등록하기"}</button>
          {isEdit && (
            <button type="button" onClick={onClickDelete}>
              삭제하기
            </button>
          )}
        </div>
        <Line />
        <div className="write_hold_wrapper">
          <div className="calendar_wrapper">
            <DayPicker
              locale={ko}
              mode="range"
              modifiers={modifiers}
              selected={range}
              onSelect={setRange}
            />
          </div>
          <div className="write_hold_info_wrapper">
            <div className="errorMessage">
              <FaExclamationCircle /> 이전 날짜는 선택할 수 없습니다.
              <br />
              <FaExclamationCircle /> 일요일과 공휴일은 제외됩니다.
            </div>
            <strong>◦ 홀드 기간 : </strong>
            {range?.from && range?.to ? (
              <span>{`${formatDateToString(range.from)} ~ ${formatDateToString(
                range.to
              )}`}</span>
            ) : range?.from ? (
              <span>{`${formatDateToString(range.from)} ~ `}</span>
            ) : (
              <span className="errorMessage"> 날짜를 선택해주세요!</span>
            )}
            <div>
              <strong>◦ 총 홀드일 : </strong>
              {totalHoldDays} 일
            </div>
            <strong>◦ 잔여일 : </strong>
            {remainingDays >= 0 ? (
              <span>{remainingDays} 일</span>
            ) : (
              <span className="errorMessage">
                잔여일이 신청하신 총 홀드일보다 부족합니다.
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default WriteHold;
