import './header.scss';
import createElement from '../createElement';

export default function header(headerBox: HTMLElement) {
  // очищаем узел headerBox
  while (headerBox.firstChild) headerBox.removeChild(headerBox.firstChild);

  const headerContainer = createElement(headerBox, 'div', 'header');

  const garagePageLink = createElement(headerContainer, 'div', 'garagePageLink menuLink', 'garage');
  garagePageLink.addEventListener('click', () => { window.location.hash = '#/garage'; });

  const winnersPageLink = createElement(headerContainer, 'div', 'winnersPageLink menuLink', 'winners');
  winnersPageLink.addEventListener('click', () => { window.location.hash = '#/winners'; });

  return headerContainer;
}
