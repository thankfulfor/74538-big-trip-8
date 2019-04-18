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

  // console.log('startInputTimeElement', startInputTimeElement.value);
  // console.log('endInputTimeElement', endInputTimeElement.value);

  const closeStart = (selectedDates, dateStr) => {
    endPicker.set(`minDate`, dateStr);
  };

  const closeEnd = (selectedDates, dateStr) => {
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
