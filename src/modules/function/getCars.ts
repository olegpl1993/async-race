export default async function getCars(garagePageNumber?: number, limit?: number) {
  let res: Response;
  if (limit) { // машины на выбранной странице
    res = await fetch(`http://127.0.0.1:3000/garage?_page=${garagePageNumber}&_limit=${limit}`);
  } else { // все машины в гараже
    res = await fetch('http://127.0.0.1:3000/garage');
  }
  return res;
}
