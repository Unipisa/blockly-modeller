export const login = function (block) {
    console.log(block)
    if(block.getParent() !== null){
      return {
        type: "activity", 
        name: block.getFieldValue("NAME")};
    };
  };
  
  export const custom_operation = function (block) {
    if(block.getParent() !== null){
      return { 
        type: "activity", 
        name: block.getFieldValue("NAME"), 
        motivation: block.getFieldValue("MOTIVATION"), 
        target: block.getFieldValue("ASSOCIATIONS")};
    };
  };
  