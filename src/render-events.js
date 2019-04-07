export const events = {
  'bus': {
    activity: `Bus to `,
    icon: `🚌`,
    isTransport: true,
  },
  'check-in': {
    activity: `Check into hotel at `,
    icon: `🏨`,
    isTransport: false,
  },
  'drive': {
    activity: `Drive to `,
    icon: `🚗`,
    isTransport: true,
  },
  'flight': {
    activity: `️Flight to `,
    icon: `✈️`,
    isTransport: true,
  },
  'restaurant': {
    activity: `Restaurant at `,
    icon: `🍴`,
    isTransport: true,
  },
  'ship': {
    activity: `Ship to ️`,
    icon: `🛳️`,
    isTransport: true,
  },
  'sightseeing': {
    activity: `️Sightseeing at `,
    icon: `🏛️`,
    isTransport: false,
  },
  'taxi': {
    activity: `Taxi to `,
    icon: `🚕`,
    isTransport: true,
  },
  'train': {
    activity: `Train to `,
    icon: `🚂`,
    isTransport: true,
  },
  'transport': {
    activity: `Transport to `,
    icon: `🚊`,
    isTransport: true,
  }
};

const renderGroupElement = (event, icon) => {
  return (
    `<input
      class="travel-way__select-input visually-hidden"
      type="radio"
      id="travel-way-${event}"
      name="travelWay"
      value="${event}"
      ${events[event].icon === icon ? `checked` : ``}>
     <label class="travel-way__select-label" for="travel-way-${event}">${events[event].icon} ${event}</label>`
  );
};


const firstGroupElements = [];
const secondGroupElements = [];

Object.keys(events).filter(function (event) {
  return events[event].isTransport ? firstGroupElements.push(event) : secondGroupElements.push(event);
});

const renderElements = (group, icon) => {
  return group.map((groupElement) => renderGroupElement(groupElement, icon)).join(``);
};

export const renderEvents = (currentIcon) => {
  return (
    `<div class="travel-way__select">
      <div class="travel-way__select-group">
        ${renderElements(firstGroupElements, currentIcon)}
      </div>
    
      <div class="travel-way__select-group">
        ${renderElements(secondGroupElements, currentIcon)}
      </div>
    </div>`
  );
};
