import { parse, subDays, format } from 'date-fns';

export default function getPreviousTwoDays(inputDateStr) {
  const parsedDate = parse(inputDateStr, 'dd-MM-yyyy', new Date());
  const oneDayBefore = subDays(parsedDate, 1);
  const twoDaysBefore = subDays(parsedDate, 2);
  const oneDayBeforeStr = format(oneDayBefore, 'dd-MM-yyyy');
  const twoDaysBeforeStr = format(twoDaysBefore, 'dd-MM-yyyy');
  return [oneDayBeforeStr, twoDaysBeforeStr];
}

