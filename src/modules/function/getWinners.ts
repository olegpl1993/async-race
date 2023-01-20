export default async function getWinners(
  winnersPageNumber?: number,
  limit?: number,
  sort?: 'id' | 'wins' | 'time',
  order?: 'ASC' | 'DESC',
) {
  let res: Response;
  const url = ['http://127.0.0.1:3000/winners?'];
  if (winnersPageNumber) url.push(`_page=${winnersPageNumber}`);
  if (limit) url.push(`_limit=${limit}`);
  if (sort) url.push(`_sort=${sort}`);
  if (order) url.push(`_order=${order}`);
  const finalUrl = url.join('&');

  if (winnersPageNumber || limit || sort || order) {
    res = await fetch(finalUrl);
  } else { // все машины победители
    res = await fetch('http://127.0.0.1:3000/winners');
  }
  return res;
}
