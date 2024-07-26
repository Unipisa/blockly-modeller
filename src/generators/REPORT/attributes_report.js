export const formatAttributes = (attributes) => {
    const validAttributes = attributes.filter(attr => attr.name && attr.name !== '...............'); //per il custom attribute
    if (validAttributes.length === 1) {
      return ` with attribute <i>${validAttributes[0].name}</i>`;
    } else if (validAttributes.length > 1) {
      const lastAttribute = validAttributes.pop();
      return ` with attributes <i>${validAttributes.map(attr => attr.name).join(', ')}</i> and <i>${lastAttribute.name}</i>`;
    }
    return '';
  };
  