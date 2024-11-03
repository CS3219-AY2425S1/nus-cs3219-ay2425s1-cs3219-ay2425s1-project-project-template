
const formatDatetime = datetime => {
  const [date, time] = datetime.split(':');
  const hours = time.slice(0,2);
  const minutes = time.slice(2);
  return `${date}, ${hours}:${minutes}`
}

const _parseDatetime = datetime => {
  const [day, month, yearAndTime] = datetime.split('/');
  const [year, time] = yearAndTime.split(':');
  const hours = time.slice(0,2);
  const minutes = time.slice(2);
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
}

const sortByLatestDate = history => history.sort((x, y) => {
  const date_x = _parseDatetime(x.datetime);
  const date_y = _parseDatetime(y.datetime);
  return date_y - date_x;
});



const historyService = { sortByLatestDate, formatDatetime};

export default historyService;