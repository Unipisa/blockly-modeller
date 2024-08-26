import { getAllClassBlocksinWs, getAllCustomDigitalBlocksinWs } from "../listeners/index.js";

export const registerExtensions = (Blockly) => {
  Blockly.Extensions.register('dynamic_menu_extension',
    function() {
      this.getInput('ASSOCIATIONS')
        .appendField(new Blockly.FieldDropdown(
          function() {
            var options = [];
            var classNames = getAllClassBlocksinWs();
            classNames.forEach((name) => {
              options.push([name, name.toUpperCase()]);
            })
            return options;
          }), 'ASSOCIATIONS');
    });

  Blockly.Extensions.register('dynamic_aggregation_menu_extension',
    function() {
      this.getInput('AGGREGATION')
        .appendField(new Blockly.FieldDropdown(
          function() {
            var options = [];
            var customDigitalNames = getAllCustomDigitalBlocksinWs();
            customDigitalNames.forEach((name) => {
              options.push([name, name.toUpperCase()]);
            });
            return options;
          }), 'AGGREGATION');
    });
};
