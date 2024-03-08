import { parse, subDays, format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale'

export function getPreviousNDays(inputDateStr, page) {
  if(page < 1)
    return []
  const parsedDate = parse(inputDateStr, 'dd-MM-yyyy', new Date());
  return Array(page).fill(0).map((item, index) => {
    return format(subDays(parsedDate, index+1), 'dd-MM-yyyy')
  })
  // const oneDayBefore = subDays(parsedDate, 1);
  // const twoDaysBefore = subDays(parsedDate, 2);
  // const oneDayBeforeStr = format(oneDayBefore, 'dd-MM-yyyy');
  // const twoDaysBeforeStr = format(twoDaysBefore, 'dd-MM-yyyy');
  // return [oneDayBeforeStr, twoDaysBeforeStr];
}

export function parseDateFromDDMMYYYY(dateString) {
  const [day, month, year] = dateString.split('-');

  const parsedDate = new Date(`${year}-${month}-${day}`);

  return parsedDate;
}

export const parseDayofWeek = (dateOfWeek) => {
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

export function getDayOfWeekVN(date){
  const dayOfWeek = format(date, 'EEEE', { locale: vi });
  return dayOfWeek
}

export function formatDateToDDMMYYYY(date) {
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0');
const year = date.getFullYear();

return `${day}-${month}-${year}`;
}

