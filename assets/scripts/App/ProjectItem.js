import { Tooltip } from './Tooltip.js';
import { DOMHelper } from '../Utility/DomHelper.js';

export class ProjectItem {
  hasActiveToolTip = false;

  constructor(id, updateProjectListFunction, type) {
    this.id = id;
    this.updateProjectListHandler = updateProjectListFunction;
    this.connectMoreInfoButton();
    this.connectSwitchProjectButton(type);
    this.connectDrag();
  }

  update = (updateProjectListFunction, type) => {
    this.updateProjectListHandler = updateProjectListFunction;
    this.connectSwitchProjectButton(type);
  };

  showToolTip = () => {
    if (this.hasActiveToolTip) {
      return;
    }
    const projectItem = document.getElementById(this.id);
    const tootTipText = projectItem.dataset.extraInfo;
    const toolTip = new Tooltip(
      () => {
        this.hasActiveToolTip = false;
      },
      tootTipText,
      this.id
    );
    toolTip.insert();
    this.hasActiveToolTip = true;
  };

  connectDrag = () => {
    document.getElementById(this.id).addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', this.id);
      event.dataTransfer.effectAllowed = 'move';
    });
  };

  connectMoreInfoButton = () => {
    const projectItemElement = document.getElementById(this.id);
    const moreInfoButton = projectItemElement.querySelector(
      'button:first-of-type'
    );
    moreInfoButton.addEventListener('click', this.showToolTip);
  };

  connectSwitchProjectButton = type => {
    const projectItemElement = document.getElementById(this.id);
    let switchProjectBtn = projectItemElement.querySelector(
      'button:last-of-type'
    );
    switchProjectBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
    switchProjectBtn = DOMHelper.removeEventListener(switchProjectBtn);
    switchProjectBtn.addEventListener(
      'click',
      this.updateProjectListHandler.bind(this, this.id)
    );
  };
}
