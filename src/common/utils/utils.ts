import dayjs from 'dayjs';

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

export function convertRegionMainName(name: string) {
  return name
    .replace(/특별시/g, '')
    .replace(/광역시/g, '')
    .replace(/특별자치도/g, '')
    .replace(/경기도/g, '경기')
    .replace(/충청북도/g, '충북')
    .replace(/충청남도/g, '충남')
    .replace(/전라북도/g, '전북')
    .replace(/전라남도/g, '전남')
    .replace(/경상북도/g, '경북')
    .replace(/경상남도/g, '경남');
}

export function convertRegionMainCode(code: string) {
  return code.slice(0, 2);
}

export function convertRegionMiddleCode(code: string) {
  return code.slice(2, 4);
}
