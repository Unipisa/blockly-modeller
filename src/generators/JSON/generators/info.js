import {generator} from "..";

export const info = function (block) {
    block.setDeletable(false);
    var statements_actors = generator.statementToCode(block, "ACTORS");
    var statements_resources_units = generator.statementToCode(block, "RESOURCES_UNIT");
    return {actors: statements_actors , resources: statements_resources_units};
  };
  