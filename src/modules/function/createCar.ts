export default async function createCar(createObj: { name: string, color: string }) {
  await fetch('http://127.0.0.1:3000/garage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createObj),
  });
}
