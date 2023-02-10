import * as dayjs from 'dayjs';

export function calcCareer(careers: any) {
  let totalDay = 0;
  let career;
  careers?.forEach(item => {
    const startDate = dayjs(new Date(item.startDate));
    const endDate = dayjs(new Date(item.endDate));
    const diffDay = endDate.diff(startDate, 'month', true);
    totalDay += diffDay;
  });

  if (totalDay === 0) {
    career = '경력 없음';
  } else {
    career = (totalDay / 12 + 1).toFixed(0) + '년차';
  }
  return career;
}
