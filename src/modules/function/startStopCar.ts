export default async function startStopCar(id: number, status: string) {
  const res = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=${status}`, { method: 'PATCH' });
  return res;
}
