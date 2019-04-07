const renderFilter = function (filterType, filterName, checked = false) {
  const filterNameInLowerCase = filterName.toLowerCase();
  return (
    `<input
        type="radio"
        id="${filterType}-${filterNameInLowerCase}"
        name="${filterType}"
        value="${filterNameInLowerCase}"
        ${checked ? `checked` : ``}
      />
      <label
        class="trip-${filterType}__item trip-${filterType}__item--${filterNameInLowerCase}"
        for="${filterType}-${filterNameInLowerCase}">
        ${filterName}
      </label>
`
  );
};

export const showFilters = function (filterType, filtersArray) {
  const filterList = filtersArray.map((filtersItem) => {
    return renderFilter(filterType, filtersItem.name, filtersItem.checked);
  });
  return filterList.join(``);
};
