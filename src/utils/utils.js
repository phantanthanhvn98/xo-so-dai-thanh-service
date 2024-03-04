import { parse, subDays, format } from 'date-fns';
import { calendar } from "../utils/data/contants.js";

export function getPreviousTwoDays(inputDateStr) {
  const parsedDate = parse(inputDateStr, 'dd-MM-yyyy', new Date());
  const oneDayBefore = subDays(parsedDate, 1);
  const twoDaysBefore = subDays(parsedDate, 2);
  const oneDayBeforeStr = format(oneDayBefore, 'dd-MM-yyyy');
  const twoDaysBeforeStr = format(twoDaysBefore, 'dd-MM-yyyy');
  return [oneDayBeforeStr, twoDaysBeforeStr];
}

export function getTinhByDay (dayOfWeek){
  const tinh = [...calendar[dayOfWeek]?.bac.tinh, ...calendar[dayOfWeek]?.trung.tinh, ...calendar[dayOfWeek]?.nam.tinh]
  return tinh
}

export function parseDayofWeek (dateOfWeek){
  if(dateOfWeek === "Monday"){
    return "thu2"
  }else if(dateOfWeek === "Tuesday"){
    return "thu3"
  }else if(dateOfWeek === "Wednesday"){
    return "thu4"
  }else if(dateOfWeek === "Thursday"){
    return "thu5"
  }else if(dateOfWeek === "Friday"){
    return "thu6"
  }else if(dateOfWeek === "Saturday"){
    return "thu7"
  }else{
    return "cn"
  }
}

export function parseDate(input) {
  // Tách ngày, tháng và năm từ chuỗi đầu vào
  const parts = input.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1] - 1, 10); // Tháng trong JavaScript là từ 0 đến 11, nên giảm đi 1
  const year = parseInt(parts[2], 10);

  // Tạo đối tượng Date với ngày, tháng, năm đã trích xuất
  const dateObject = new Date(year, month, day);

  return dateObject;
}