const renderListItem = function (offers) {
  let offersList = ``;
  for (let i = 0; i < offers.length; i++) {
    offersList += `<li><button class="trip-point__offer">${offers[i]}</button></li>`;
  }
  return offersList;
};


export default function (icon, title, timetable, duration, price, offers) {
  return (
    `<article class="trip-point">
      <i class="trip-icon">${icon}</i>
    <h3 class="trip-point__title">${title}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${timetable}</span>
    <span class="trip-point__duration">${duration}</span>
    </p>
    <p class="trip-point__price">${price}</p>
    <ul class="trip-point__offers">
    ${renderListItem(offers)}
    </ul></article>`
  );
}
