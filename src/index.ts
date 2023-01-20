import './index.scss';
import createElement from './modules/createElement';
import garagePage from './modules/garage/garage';
import winnersPage from './modules/winners/winners';
import errorPage from './modules/error/error';
import header from './modules/header/header';
import footer from './modules/footer/footer';

export const wrapper = createElement(document.body, 'div', 'wrapper');
export const headerBox = createElement(wrapper, 'div', 'headerBox');
export const contentBox = createElement(wrapper, 'div', 'contentBox');
export const footerBox = createElement(wrapper, 'div', 'footerBox');

export function router() {
  const { hash } = window.location; // получает хеш из строки браузера
  if (hash === '' || hash === '#/' || hash === '#/garage') garagePage(contentBox); // рендеринг страницы
  else if (hash === '#/winners') winnersPage(contentBox);
  else errorPage(contentBox);
}
window.addEventListener('hashchange', router); // срабатывает на изменение хеша в строке url

window.addEventListener('load', () => {
  header(headerBox);
  footer(footerBox);
  router();
});
