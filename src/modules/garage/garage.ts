import './garage.scss';
import createElement from '../createElement';
import { CarData } from '../types/carData';
import flagImg from '../../images/flag.png';
import createCar from '../function/createCar';
import updateCar from '../function/updateCar';
import deleteCar from '../function/deleteCar';
import startStopCar from '../function/startStopCar';
import { StartStopData } from '../types/startStopData';
import carAnime from '../function/carAnime';
import state from '../state';
import getCars from '../function/getCars';
import startRace from '../function/startRace';
import resetCar from '../function/resetCar';
import deleteWinner from '../function/deleteWinner';
import getWinners from '../function/getWinners';
import { WinnerData } from '../types/winnerData';

export default async function garagePage(contentBox: HTMLElement) {
  while (contentBox.firstChild) contentBox.removeChild(contentBox.firstChild);
  const stopBtnArr: HTMLButtonElement[] = []; // массив кнопок остановки машины

  const garageBox = createElement(contentBox, 'div', 'garageBox');

  // панель создания и изменения машин -------------------------------------------------------
  const driverBox = createElement(garageBox, 'div', 'driverBox');
  const createCarRow = createElement(driverBox, 'div', 'carRow');
  const createCarNameInput = createElement(createCarRow, 'input', 'textInput') as HTMLInputElement;
  const createCarColorInput = createElement(createCarRow, 'input', 'colorInput') as HTMLInputElement;
  createCarColorInput.type = 'color';

  const createCarBtn = createElement(createCarRow, 'button', 'button', 'CREATE') as HTMLButtonElement;
  createCarBtn.addEventListener('click', async () => {
    const createObj = { name: createCarNameInput.value, color: createCarColorInput.value };
    await createCar(createObj);
    garagePage(contentBox);
  });

  const updateCarRow = createElement(driverBox, 'div', 'carRow');
  const updateCarNameInput = createElement(updateCarRow, 'input', 'textInput') as HTMLInputElement;
  const updateCarColorInput = createElement(updateCarRow, 'input', 'colorInput') as HTMLInputElement;
  updateCarColorInput.type = 'color';
  const updateCarBtn = createElement(updateCarRow, 'button', 'button', 'UPDATE') as HTMLButtonElement;
  updateCarBtn.disabled = true;

  let updateCarIndex: number;
  updateCarBtn.addEventListener('click', async () => {
    const updateObj = { name: updateCarNameInput.value, color: updateCarColorInput.value };
    await updateCar(updateCarIndex, updateObj);
    garagePage(contentBox);
  });

  const carArrNodes: { node: HTMLElement, id: number }[] = []; // массив машин для гонки startRace
  const buttonCarRow = createElement(driverBox, 'div', 'carRow');

  // кнопка сброса гонки -----------------------------------------------------------------
  const resetBtn = createElement(buttonCarRow, 'button', 'button reset', 'RESET') as HTMLButtonElement;
  resetBtn.disabled = true;
  resetBtn.addEventListener('click', () => {
    carArrNodes.forEach((carNode) => { // остановка всех машин
      resetCar(carNode.node, carNode.id); // останавливает и возвращает машину
    });
    // сброс данных о текущем победителе
    state.curentWinner.carId = 0;
    state.curentWinner.time = 0;
    // удаление окна победителя
    if (contentBox.childNodes[1]) contentBox.removeChild(contentBox.childNodes[1]);
    // включает все кнопки на странице
    const btnArr = document.querySelectorAll('button'); // массив всех кнопок на странице
    setTimeout(() => {
      btnArr.forEach((btn) => {
        const button = btn;
        button.disabled = false;
      });
      updateCarBtn.disabled = true;
      resetBtn.disabled = true;
      stopBtnArr.forEach((btn) => {
        const button = btn;
        button.disabled = true;
      });
    }, 2000);
  });

  // кнопка начала гонки ------------------------------------------------------------------
  const raceBtn = createElement(buttonCarRow, 'button', 'button', 'RACE') as HTMLButtonElement;
  raceBtn.addEventListener('click', () => {
    const btnArr = document.querySelectorAll('button'); // массив всех кнопок на странице
    btnArr.forEach((btn) => { // отключает все кнопки на странице
      const button = btn;
      button.disabled = true;
    });
    setTimeout(() => {
      resetBtn.disabled = false;
    }, 12000);
    carArrNodes.forEach((carNode) => { // запуск всех машин на странице
      startRace(contentBox, carNode.node, carNode.id); // запуск одной машины
    });
  });

  // кнопка генерации машин --------------------------------------------------------
  const generateCarsBtn = createElement(buttonCarRow, 'button', 'button', 'GENERATE CARS') as HTMLButtonElement;
  generateCarsBtn.addEventListener('click', async () => {
    const promiseArr: Promise<void>[] = [];
    for (let n = 0; n < 100; n += 1) {
      // случайное имя из двух массивов
      const brands = ['Toyota', 'Mercedes', 'BMW', 'Honda', 'Volkswagen', 'Ford', 'Hyundai', 'Audi', 'Nissan', 'Porsche'];
      const model = ['Martin', 'X5', 'X6', 'X7', 'X8', 'X9', 'Roadster', '2', '3', '4', '5', '6', '7',
        '8', '9', 'Sedan', 'Hatchback', 'D-Class', 'C-Class', 'B-Class', 'A-Class', 'S-Class'];
      const rndCarName = `${brands[Math.floor(Math.random() * brands.length)]} ${model[Math.floor(Math.random() * model.length)]}`;
      // случайный цвет в формате rgb
      const letters = '0123456789ABCDEF';
      let rndColor = '#';
      for (let i = 0; i < 6; i += 1) rndColor += letters[Math.floor(Math.random() * 16)];
      // добавление машины
      const createObj = { name: rndCarName, color: rndColor };
      promiseArr.push(createCar(createObj));
    }
    await Promise.all(promiseArr);
    garagePage(contentBox); // обновление страницы
  });

  // количество машин в гараже и номер страницы -------------------------------------
  const garageRes = await getCars();
  const garageData: CarData[] = await garageRes.json(); // массив машин в гараже

  createElement(garageBox, 'div', 'numberCars', `Garge (${garageData.length})`);
  createElement(garageBox, 'div', 'numberPage', `Page #${state.garagePageNumber}`);

  const trackBox = createElement(garageBox, 'div', 'trackBox');

  // игровое поле с треками и машинами ------------------------------------------------
  const garageResOnPage = await getCars(state.garagePageNumber, state.garageCarOnPage);
  const garageDataOnPage: CarData[] = await garageResOnPage.json(); // массив машин текущей страницы

  garageDataOnPage.forEach((car) => {
    const trackRow = createElement(trackBox, 'div', 'trackRow');
    const selectRemoveNameRow = createElement(trackRow, 'div', 'selectRemoveNameRow');

    const selectBtn = createElement(selectRemoveNameRow, 'button', 'button', 'SELECT') as HTMLButtonElement;
    selectBtn.addEventListener('click', () => {
      updateCarNameInput.value = car.name;
      updateCarIndex = car.id; // меняет id выбраного авто
      updateCarBtn.disabled = false; // делает активной кнопку обновить
    });

    const removeBtn = createElement(selectRemoveNameRow, 'button', 'button', 'REMOVE') as HTMLButtonElement;
    removeBtn.addEventListener('click', async () => {
      const winnersRes = await getWinners();
      const winnersData: WinnerData[] = await winnersRes.json(); // общий массив победителей
      winnersData.forEach(async (el) => {
        if (el.id === car.id) { // если машина уже существует в списке победителей
          await deleteWinner(car.id); // удаляет из списка победителей
        }
      });
      await deleteCar(car.id); // удаляет из гаража
      garagePage(contentBox);
    });

    createElement(selectRemoveNameRow, 'div', 'carName', car.name);

    const mainRow = createElement(trackRow, 'div', 'mainRow');
    const startStopRow = createElement(mainRow, 'div', 'startStopRow');

    // трек и машина --------------------------------------------------------------------
    const mainTrackRow = createElement(mainRow, 'div', 'mainTrackRow');
    const flagBox = createElement(mainTrackRow, 'img', 'flagBox') as HTMLImageElement;
    flagBox.alt = 'flag';
    flagBox.src = flagImg;
    flagBox.width = 60;
    flagBox.height = 60;
    const carBox = createElement(mainTrackRow, 'div', 'carBox');
    carBox.innerHTML = `<svg width="80" height="50" class="carSVG" viewBox="40 -55 180 180" xmlns="http://www.w3.org/2000/svg">
    <g><title>background</title><rect fill="none" id="canvas_background" height="131" width="258" y="-1" x="-1"/></g>
    <g><title>Layer 1</title>
    <g id="svg_1" stroke=" none" transform="translate(1.4065934419631958,1.4065934419631958) scale(2.809999942779541) ">
    <circle id="svg_2" stroke=" none" r="1.955" cy="34.015458" cx="71.090872"/>
    <circle id="svg_3" stroke=" none" r="1.955" cy="34.015458" cx="20.120872"/>
    <path id="svg_4" stroke=" none" stroke-linecap="round" d="m75.834872,13.285458l-7.987,-1.22l-2.35,-2.574c-5.599,-6.132 -13.571,-9.649 -21.874,-9.649l-6.245,0c-1.357,0 -2.696,0.107 -4.016,0.296c-0.022,0.004 -0.044,0.006 -0.066,0.01c-7.799,1.133 -14.802,5.468 -19.285,12.106c-7.95,2.899 -13.656,10.344 -13.656,17.938c0,3.254 2.647,5.9 5.9,5.9l3.451,0c0.969,4.866 5.269,8.545 10.416,8.545s9.447,-3.679 10.416,-8.545l30.139,0c0.969,4.866 5.27,8.545 10.416,8.545s9.446,-3.679 10.415,-8.545l2.947,0c3.254,0 5.9,-2.646 5.9,-5.9c0,-8.511 -6.106,-15.621 -14.521,-16.907zm-32.21,-9.443c7.065,0 13.848,2.949 18.676,8.094l-22.481,0l-3.267,-8.068c0.275,-0.009 0.55,-0.026 0.826,-0.026l6.246,0zm-11.189,0.516l3.068,7.578l-16.176,0c3.457,-3.883 8.046,-6.527 13.108,-7.578zm-12.313,36.279c-3.652,0 -6.623,-2.971 -6.623,-6.622c0,-3.652 2.971,-6.623 6.623,-6.623s6.623,2.971 6.623,6.623c0,3.652 -2.971,6.622 -6.623,6.622zm50.971,0c-3.652,0 -6.623,-2.971 -6.623,-6.622c0,-3.652 2.971,-6.623 6.623,-6.623c3.651,0 6.622,2.971 6.622,6.623c0,3.652 -2.97,6.622 -6.622,6.622z"/>
    </g></g></svg>`;
    carBox.style.fill = car.color;
    carArrNodes.push({ node: carBox, id: car.id });

    // кнопки запуска и остановки машины ----------------------------------------------------
    const startBtn = createElement(startStopRow, 'button', 'button', 'A') as HTMLButtonElement;
    const stopBtn = createElement(startStopRow, 'button', 'button stopBtn', 'B') as HTMLButtonElement;
    stopBtnArr.push(stopBtn);
    stopBtn.disabled = true;

    let int: NodeJS.Timer;
    startBtn.addEventListener('click', async () => {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      const startStop = await startStopCar(car.id, 'started');
      const startStopData: StartStopData = await startStop.json();
      const timeAnimation = startStopData.distance / startStopData.velocity;
      int = setInterval(() => carAnime(carBox, int), timeAnimation / 1000);
      const driveMode = await startStopCar(car.id, 'drive');
      if (driveMode.status === 500) clearInterval(int);
    });
    stopBtn.addEventListener('click', async () => {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      const startStop = await startStopCar(car.id, 'stopped');
      const data: StartStopData = await startStop.json();
      if (data) clearInterval(int);
      carBox.style.left = '0%';
    });

    createElement(trackRow, 'div', 'dottedRow');
  });

  // кнопки переключения страницы ----------------------------------------------------
  const prevNextRow = createElement(garageBox, 'div', 'prevNextRow');
  const prevBtn = createElement(prevNextRow, 'button', 'button', 'PREV') as HTMLButtonElement;
  prevBtn.addEventListener('click', () => {
    if (state.garagePageNumber > 1) {
      state.garagePageNumber -= 1;
      garagePage(contentBox);
    }
  });
  const nextBtn = createElement(prevNextRow, 'button', 'button', 'NEXT') as HTMLButtonElement;
  nextBtn.addEventListener('click', () => {
    if (state.garagePageNumber * state.garageCarOnPage < garageData.length) {
      state.garagePageNumber += 1;
      garagePage(contentBox);
    }
  });

  return garageBox;
}
