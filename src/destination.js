export class Destination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.pictures = data[`pictures`];
  }

  renderOptions(names) {
    const optionsList = names.map((name) => {
      return `<option value="${name}"></option>`;
    });
    return optionsList.join(``);
  }


  get template() {
    return (
      `<datalist id="destination-select">
        ${ this.renderOptions(this.name)}
      </datalist>`
    );
  }
}
