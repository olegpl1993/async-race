import './error.scss';
import createElement from '../createElement';

export default function errorPage(contentBox: HTMLElement) {
  // очищаем узел contentBox
  while (contentBox.firstChild) contentBox.removeChild(contentBox.firstChild);

  const error = createElement(contentBox, 'div', 'error', '404: page not found');

  return error;
}
