import flatpickr from 'flatpickr';

const getFlatpickrSettings = (date, minDate, maxDate, picker) => {
  return {
    'minDate': minDate,
    'maxDate': maxDate,
    'defaultDate': date,
    'enableTime': true,
    'time_24hr': true,
    'altInput': true,
    'altFormat': `H:i`,
    'dateFormat': `Z`,
    'onClose': picker,
  };
};

export const triggerFlatpickr = (parentElement, dateStart, dateEnd) => {
  const startInputTimeElement = parentElement.querySelector(`input[name='dateStart']`);
  const endInputTimeElement = parentElement.querySelector(`input[name='dateEnd']`);

  const closeStart = (selectedDates, dateStr, instance) => {
    endPicker.set(`minDate`, dateStr);
  };

  const closeEnd = (selectedDates, dateStr, instance) => {
    startPicker.set(`maxDate`, dateStr);
  };

  const startPicker = flatpickr(startInputTimeElement, getFlatpickrSettings(dateStart, false, endInputTimeElement.value, closeStart));
  const endPicker = flatpickr(endInputTimeElement, getFlatpickrSettings(dateEnd, startInputTimeElement.value, false, closeEnd));
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
          required
        />
        <span class="point__input point__input--separator">–</span>
        <input
          class="point__input"
          type="text"
          value="${dateEnd}"
          name="dateEnd"
          placeholder="${dateEnd}"
          required
        />
    </div>`
  );
};
