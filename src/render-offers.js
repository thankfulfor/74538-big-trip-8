export const renderOffers = (offers) => {
  const offersList = offers.map((offer) => {
    return `
      <input
        class="point__offers-input visually-hidden"
        type="checkbox"
        id="${offer.title}"
        name="offer"
        value="${offer.title}" 
        ${offer.accepted ? `checked` : ``}
      />
        <label for="${offer.title}" class="point__offers-label">
        <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
      </label>
      `;
  });

  return offersList.join(``);
};
