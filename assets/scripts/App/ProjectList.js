import { ProjectItem } from './ProjectItem.js';
import { DOMHelper } from '../Utility/DomHelper.js';

export class ProjectList {
  projects = [];
  constructor(type) {
    this.type = type;
    // switch handler here points to the function
    const projectItems = document.querySelectorAll(`#${type}-projects li`);
    for (let projectItem of projectItems) {
      this.projects.push(
        new ProjectItem(
          projectItem.id,
          this.switchProject.bind(this),
          this.type
        )
      );
    }
    this.connectDroppable();
  }

  // for defining the drop zone
  connectDroppable = () => {
    const list = document.querySelector(`#${this.type}-projects ul`);

    list.addEventListener('dragenter', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        list.parentElement.classList.add('droppable');
        event.preventDefault();
      }
    });
    list.addEventListener('dragover', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
      }
    });

    list.addEventListener('dragleave', event => {
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
        list.parentElement.classList.remove('droppable');
      }
    });

    list.addEventListener('drop', event => {
      const projId = event.dataTransfer.getData('text/plain');

      if (this.projects.find(project => projId === project.id)) {
        return;
      }

      document
        .getElementById(projId)
        .querySelector('button:last-of-type')
        .click();
      list.parentElement.classList.remove('droppable');
      event.preventDefault();
    });
  };

  // defining the switch handler function so that it can take another instance
  setSwitchHandlerFunction = switchHandlerFunction => {
    this.switchHandler = switchHandlerFunction;
  };

  // add projects should be invoked from another instance
  addProject = project => {
    this.projects.push(project);
    DOMHelper.moveElements(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  };

  switchProject = id => {
    this.switchHandler(
      this.projects.find(project => {
        return project.id === id;
      })
    ); // returning the project that is going to get removed
    this.projects = this.projects.filter(project => {
      return project.id !== id;
    });
  };
}
