export const searchItem = (mainArray, text, type) => {
  if (mainArray) {
    const newData = mainArray.filter(item => {
      console.log('as', item);
      var itemData;
      if (type == 'Contact') {
        itemData = `${item.first_name.toUpperCase()}`;
      } else {
        itemData = `${item.contact_name.toUpperCase()}`;
      }
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    return newData;
  }
};
