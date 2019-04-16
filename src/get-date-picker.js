import flatpickr from 'flatpickr';

const getFlatpickrSettings = (date) => {
  return {
    'defaultDate': date,
    'enableTime': true,
    'time_24hr': true,
    'altInput': true,
    'altFormat': `H:i`,
    'dateFormat': `Z`
  };
};

export const triggerFlatpickr = (parentElement, dateStart, dateEnd) => {
  const startInputTimeElement = parentElement.querySelector(`input[name='dateStart']`);
  const endInputTimeElement = parentElement.querySelector(`input[name='dateEnd']`);

  flatpickr(startInputTimeElement, getFlatpickrSettings(dateStart));
  flatpickr(endInputTimeElement, getFlatpickrSettings(dateEnd));
};

export const renderTimeInputs = (dateStart, dateEnd) => {
  return (
    `<div class="point__time">
      choose time
        <input
          class="point__input"
          type="text"
          value="${dateStart}"
          name="dateStart"
          placeholder="${dateStart}"
        />
        <span class="point__input point__input--separator">–</span>
        <input
          class="point__input"
          type="text"
          value="${dateEnd}"
          name="dateEnd"
          placeholder="${dateEnd}"
        />
    </div>`
  );
};
