import startStopCar from './startStopCar';
import { StartStopData } from '../types/startStopData';
import carAnime from './carAnime';
import state from '../state';
import createElement from '../createElement';
import { CarData } from '../types/carData';
import createWinner from './createWinner';
import getWinners from './getWinners';
import { WinnerData } from '../types/winnerData';
import updateWinner from './updateWinner';

export default async function startRace(
  contentBox: HTMLElement,
  carBox: HTMLElement,
  carId: number,
) {
  const startStop = await startStopCar(carId, 'started');
  const startStopData: StartStopData = await startStop.json();

  const timeAnimation = startStopData.distance / startStopData.velocity;
  const int: NodeJS.Timer = setInterval(() => carAnime(carBox, int), timeAnimation / 1000);

  const driveMode = await startStopCar(carId, 'drive');

  if (driveMode.status === 500) clearInterval(int); // останавливает машину если 500 ошибка

  if (driveMode.status === 200 && state.curentWinner.carId === 0) { // записывает победителя в стейт
    state.curentWinner.carId = carId;
    state.curentWinner.time = timeAnimation;
    const timeInTable = +(timeAnimation / 1000).toFixed(2);
    const carRes = await fetch(`http://127.0.0.1:3000/garage/${carId}`);
    const carData: CarData = await carRes.json(); // данные машины победителя
    createElement(contentBox, 'div', 'winnerCarWindow', `Winner ${carData.name} time ${timeInTable}s`);

    const winnersRes = await getWinners();
    const winnersData: WinnerData[] = await winnersRes.json(); // общий массив победителей
    let creatingWinner = true; // для проверки нужно создавать нового победитля или нет
    winnersData.forEach((el) => {
      if (el.id === carId) { // если машина уже существует в списке победителей
        updateWinner(carId, { // обновляет количество побед и время
          wins: el.wins + 1,
          time: timeInTable < el.time ? timeInTable : el.time,
        });
        creatingWinner = false;
      }
    });
    // добавляет победителя если его нету в списке победителией
    if (creatingWinner) {
      await createWinner({ id: carId, wins: 1, time: +(timeAnimation / 1000).toFixed(2) });
    }
  }
}
