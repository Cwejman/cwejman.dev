import { clamp } from '@utils/common.ts';

export const getScrollProgress = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  const start = window.innerHeight || document.documentElement.clientHeight;
  const end = -rect.height;
  const progress = (start - rect.top) / (start - end);

  return clamp(0, 1, progress);
};

export const getCustomDataSet = (
  elTag: string,
  onConnected: (dataset: DOMStringMap, el: HTMLElement) => void,
) =>
  customElements.define(
    elTag,
    class CustomerDataSetElement extends HTMLElement {
      connectedCallback() {
        onConnected(this.dataset, this);
      }
    },
  );
