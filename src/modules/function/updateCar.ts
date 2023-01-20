export default async function updateCar(id: number, updateObj: { name: string, color: string }) {
  await fetch(`http://127.0.0.1:3000/garage/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateObj),
  });
}
