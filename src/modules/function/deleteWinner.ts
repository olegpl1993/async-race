export default async function deleteWinner(id: number) {
  await fetch(`http://127.0.0.1:3000/winners/${id}`, {
    method: 'DELETE',
  });
}
