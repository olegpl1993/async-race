import './winners.scss';
import createElement from '../createElement';
import { WinnerData } from '../types/winnerData';
import { CarData } from '../types/carData';
import getWinners from '../function/getWinners';
import state from '../state';

export default async function winnersPage(contentBox: HTMLElement) { // очищаем узел contentBox
  while (contentBox.firstChild) contentBox.removeChild(contentBox.firstChild);

  const winnersRes = await getWinners();
  const winnersData: WinnerData[] = await winnersRes.json(); // общий массив победителей

  const winnersBox = createElement(contentBox, 'div', 'winnersBox');

  createElement(winnersBox, 'div', 'winnersNumber', `Winners (${winnersData.length})`);
  createElement(winnersBox, 'div', 'numberPage', `Page #${state.winnerPageNumber}`);

  const nameRow = createElement(winnersBox, 'div', 'nameRow');
  createElement(nameRow, 'div', 'textBlock', 'Number');
  createElement(nameRow, 'div', 'textBlock', 'Car');
  createElement(nameRow, 'div', 'textBlock carName', 'Name');

  // сортировка ----------------------------------------------------------------------
  let winsBtnText: string;
  let bestTimeBtnText: string;
  let winnerResOnPage: Response;
  if (state.winnerSort === 'wins' && state.winnerOrder === 'ASC') {
    bestTimeBtnText = 'Best time';
    winsBtnText = 'Wins ↑';
    winnerResOnPage = await getWinners(
      state.winnerPageNumber,
      state.winnerCarOnPage,
      state.winnerSort,
      state.winnerOrder,
    );
  } else if (state.winnerSort === 'wins' && state.winnerOrder === 'DESC') {
    bestTimeBtnText = 'Best time';
    winsBtnText = 'Wins ↓';
    winnerResOnPage = await getWinners(
      state.winnerPageNumber,
      state.winnerCarOnPage,
      state.winnerSort,
      state.winnerOrder,
    );
  } else if (state.winnerSort === 'time' && state.winnerOrder === 'ASC') {
    bestTimeBtnText = 'Best time ↑';
    winsBtnText = 'Wins';
    winnerResOnPage = await getWinners(
      state.winnerPageNumber,
      state.winnerCarOnPage,
      state.winnerSort,
      state.winnerOrder,
    );
  } else if (state.winnerSort === 'time' && state.winnerOrder === 'DESC') {
    bestTimeBtnText = 'Best time ↓';
    winsBtnText = 'Wins';
    winnerResOnPage = await getWinners(
      state.winnerPageNumber,
      state.winnerCarOnPage,
      state.winnerSort,
      state.winnerOrder,
    );
  } else {
    bestTimeBtnText = 'Best time';
    winsBtnText = 'Wins';
    winnerResOnPage = await getWinners(state.winnerPageNumber, state.winnerCarOnPage);
  }
  const winnerDataOnPage: WinnerData[] = await winnerResOnPage.json(); // массив текущей страницы

  const winsBtn = createElement(nameRow, 'div', 'textBlock wins', winsBtnText);
  winsBtn.addEventListener('click', () => {
    if (state.winnerSort === 'wins' && state.winnerOrder === 'ASC') {
      state.winnerOrder = 'DESC';
    } else if (state.winnerSort === 'wins' && state.winnerOrder === 'DESC') {
      state.winnerOrder = 'ASC';
    } else {
      state.winnerSort = 'wins';
      state.winnerOrder = 'ASC';
    }
    winnersPage(contentBox);
  });

  const bestTimeBtn = createElement(nameRow, 'div', 'textBlock bestTime', bestTimeBtnText);
  bestTimeBtn.addEventListener('click', () => {
    if (state.winnerSort === 'time' && state.winnerOrder === 'ASC') {
      state.winnerOrder = 'DESC';
    } else if (state.winnerSort === 'time' && state.winnerOrder === 'DESC') {
      state.winnerOrder = 'ASC';
    } else {
      state.winnerSort = 'time';
      state.winnerOrder = 'ASC';
    }
    winnersPage(contentBox);
  });
  // -------------------------------------------------------------------------------------

  const lineBox = createElement(winnersBox, 'div', 'lineBox');

  winnerDataOnPage.forEach(async (winner, index) => {
    const carRes = await fetch(`http://127.0.0.1:3000/garage/${winner.id}`);
    const carData: CarData = await carRes.json(); // данные машины победителя
    const winnerLine = createElement(lineBox, 'div', 'nameRow');
    createElement(winnerLine, 'div', 'textBlock', (index + 1) + (state.winnerPageNumber - 1) * 10); // номер в списке
    const carBox = createElement(winnerLine, 'div', 'textBlock');
    carBox.innerHTML = `<svg width="90" height="40" class="carSVG" viewBox="40 -20 180 180" xmlns="http://www.w3.org/2000/svg">
    <g><title>background</title><rect fill="none" id="canvas_background" height="131" width="258" y="-1" x="-1"/></g>
    <g><title>Layer 1</title>
    <g id="svg_1" stroke=" none" transform="translate(1.4065934419631958,1.4065934419631958) scale(2.809999942779541) ">
    <circle id="svg_2" stroke=" none" r="1.955" cy="34.015458" cx="71.090872"/>
    <circle id="svg_3" stroke=" none" r="1.955" cy="34.015458" cx="20.120872"/>
    <path id="svg_4" stroke=" none" stroke-linecap="round" d="m75.834872,13.285458l-7.987,-1.22l-2.35,-2.574c-5.599,-6.132 -13.571,-9.649 -21.874,-9.649l-6.245,0c-1.357,0 -2.696,0.107 -4.016,0.296c-0.022,0.004 -0.044,0.006 -0.066,0.01c-7.799,1.133 -14.802,5.468 -19.285,12.106c-7.95,2.899 -13.656,10.344 -13.656,17.938c0,3.254 2.647,5.9 5.9,5.9l3.451,0c0.969,4.866 5.269,8.545 10.416,8.545s9.447,-3.679 10.416,-8.545l30.139,0c0.969,4.866 5.27,8.545 10.416,8.545s9.446,-3.679 10.415,-8.545l2.947,0c3.254,0 5.9,-2.646 5.9,-5.9c0,-8.511 -6.106,-15.621 -14.521,-16.907zm-32.21,-9.443c7.065,0 13.848,2.949 18.676,8.094l-22.481,0l-3.267,-8.068c0.275,-0.009 0.55,-0.026 0.826,-0.026l6.246,0zm-11.189,0.516l3.068,7.578l-16.176,0c3.457,-3.883 8.046,-6.527 13.108,-7.578zm-12.313,36.279c-3.652,0 -6.623,-2.971 -6.623,-6.622c0,-3.652 2.971,-6.623 6.623,-6.623s6.623,2.971 6.623,6.623c0,3.652 -2.971,6.622 -6.623,6.622zm50.971,0c-3.652,0 -6.623,-2.971 -6.623,-6.622c0,-3.652 2.971,-6.623 6.623,-6.623c3.651,0 6.622,2.971 6.622,6.623c0,3.652 -2.97,6.622 -6.622,6.622z"/>
    </g></g></svg>`;
    carBox.style.fill = carData.color;
    createElement(winnerLine, 'div', 'textBlock carName', carData.name); // название машины
    createElement(winnerLine, 'div', 'textBlock', winner.wins); // количество побед
    createElement(winnerLine, 'div', 'textBlock', winner.time); // лучшее время
  });

  const prevNextRow = createElement(winnersBox, 'div', 'prevNextRow');
  const prevBtn = createElement(prevNextRow, 'button', 'button', 'PREV') as HTMLButtonElement;
  prevBtn.addEventListener('click', () => {
    if (state.winnerPageNumber > 1) {
      state.winnerPageNumber -= 1;
      winnersPage(contentBox);
    }
  });
  const nextBtn = createElement(prevNextRow, 'button', 'button', 'NEXT') as HTMLButtonElement;
  nextBtn.addEventListener('click', () => {
    if (state.winnerPageNumber * state.winnerCarOnPage < winnersData.length) {
      state.winnerPageNumber += 1;
      winnersPage(contentBox);
    }
  });

  return winnersBox;
}
