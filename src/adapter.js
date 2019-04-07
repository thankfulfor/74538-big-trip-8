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
      'id': this.id,
      'type': this.title,
      'date_from': this.time.startTime,
      'date_to': this.time.endTime,
      'destination.name': this.city,
      'destination.description': this.description,
      'destination.pictures': this.pictures,
      'is_favorite': this.isFavorite,
      'base_price': this.price,
      'offers': this.offers,
    };
  }

  static parsePoint(data) {
    return new Adapter(data);
  }

  static parsePoints(data) {
    return data.map(Adapter.parsePoint);
  }
}
