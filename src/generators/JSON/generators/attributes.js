export const custom_attribute = function (block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const username = function (block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const password = function (block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const coords = function (block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const area = function (block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const id = function (block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};
