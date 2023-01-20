export default async function updateWinner(id: number, updateObj: { wins: number, time: number }) {
  await fetch(`http://127.0.0.1:3000/winners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateObj),
  });
}
