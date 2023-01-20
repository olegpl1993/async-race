export default function carAnime(carBox: HTMLElement, int: NodeJS.Timer) {
  const car = carBox;
  const left = car.style.left ? +(car.style.left.slice(0, -1)) + 0.1 : 0;
  car.style.left = `${left}%`;
  if (left > 99) clearInterval(int); // останавливает анимацию в конце дороги
}
