export const dam = function(block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const river = function(block) {
    if(block.getParent() !== null){
    return { 
      type: "attribute", 
      name: block.getFieldValue("NAME") };
  };
};

export const well = function(block) {
    if(block.getParent() !== null){
    return { type: "attribute", name: block.getFieldValue("NAME") };
  };
};

export const dripper = function(block) {
    if(block.getParent() !== null){
    return { type: "attribute", name: block.getFieldValue("NAME") };
  };
};

export const sprinkler = function(block) {
  if(block.getParent() !== null){
    return { type: "attribute", name: block.getFieldValue("NAME") };
  };
};

export const custom_generalization = function(block) {
  if(block.getParent() !== null){  
    return { type: "attribute", name: block.getFieldValue("NAME") };
  };
};  
