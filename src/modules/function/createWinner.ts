export default async function createWinner(createObj: { id: number, wins: number, time: number }) {
  await fetch('http://127.0.0.1:3000/winners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createObj),
  });
}
