export default function createElement(
  parent: HTMLElement | Element,
  tag: string,
  className?: string,
  content?: string | number | HTMLElement,
) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.textContent = String(content);
  parent.append(element);
  return element;
}
