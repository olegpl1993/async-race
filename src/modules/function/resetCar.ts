import startStopCar from './startStopCar';
import { StartStopData } from '../types/startStopData';

export default async function resetCar(
  carBox: HTMLElement,
  carId: number,
  interval?: NodeJS.Timer,
) {
  const car = carBox;
  const startStop = await startStopCar(carId, 'stopped');
  const data: StartStopData = await startStop.json();
  if (data) clearInterval(interval);
  car.style.left = '0%';
}
