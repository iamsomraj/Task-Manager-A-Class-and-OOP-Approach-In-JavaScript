import { Component } from './Component.js';

export class Tooltip extends Component {
  constructor(closeToolTipNotifierFunction, text, hostElementId) {
    super(hostElementId);
    this.closeToolTipNotifier = closeToolTipNotifierFunction;
    this.text = text;
    this.create();
  }

  closeToolTip = () => {
    this.remove();
    this.closeToolTipNotifier();
  };

  create = () => {
    const toolTipElement = document.createElement('div');
    toolTipElement.className = 'card';

    const hostElPosLeft = this.hostElement.offsetLeft;
    const hostElPosTop = this.hostElement.offsetTop;
    const hostElPosHeight = this.hostElement.clientHeight;
    const parentElScroll = this.hostElement.parentElement.scrollTop;
    const x = hostElPosLeft + 20;
    const y = hostElPosTop + hostElPosHeight - parentElScroll - 10;

    toolTipElement.style.position = 'absolute';
    toolTipElement.style.left = x + 'px';
    toolTipElement.style.top = y + 'px';

    const toolTipTemplate = document.getElementById('tool-tip');
    const toolTipBody = document.importNode(toolTipTemplate.content, true);
    toolTipBody.querySelector('p').textContent = this.text;
    toolTipElement.append(toolTipBody);

    this.element = toolTipElement;
    toolTipElement.addEventListener('click', this.closeToolTip);
  };
}
