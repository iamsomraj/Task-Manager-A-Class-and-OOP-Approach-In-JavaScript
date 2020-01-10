export class DOMHelper {
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
