export class Adapter {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`type`];
    this.time = {};
    this.time.startTime = data[`date_from`];
    this.time.endTime = data[`date_to`];
    this.city = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.pictures = data[`destination`][`pictures`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
  }

  toRAW() {
    return {
      'destination': {
        name: this.city,
        description: this.description,
        pictures: this.pictures,
      },
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'base_price': this.price,
      'date_from': this.time.startTime,
      'date_to': this.time.endTime,
      'type': this.title,
    };
  }

  static parsePoint(data) {
    console.log(data)
    return new Adapter(data);
  }

  static parsePoints(data) {
    return data.map(Adapter.parsePoint);
  }
}
