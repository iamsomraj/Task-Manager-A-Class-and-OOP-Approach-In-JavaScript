class DOMHelper {
  static moveElements(elementId, newDestinationSelector) {
    const project = document.getElementById(elementId);
    const destination = document.querySelector(newDestinationSelector);
    destination.append(project);
    project.scrollIntoView({ behavior: 'smooth' });
  }

  static removeEventListener(element) {
    const cloneNode = element.cloneNode(true);
    element.replaceWith(cloneNode);
    return cloneNode;
  }
}

class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  remove() {
    if (this.element) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  insert() {
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
}

class Tooltip extends Component {
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

class ProjectItem {
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

class ProjectList {
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

class App {
  static init() {
    const activeProjectList = new ProjectList('active');
    const finishedProjectList = new ProjectList('finished');
    activeProjectList.setSwitchHandlerFunction(
      finishedProjectList.addProject.bind(finishedProjectList)
    );
    finishedProjectList.setSwitchHandlerFunction(
      activeProjectList.addProject.bind(activeProjectList)
    );
  }
}

App.init();
