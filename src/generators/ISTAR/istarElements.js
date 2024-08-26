import { generateID } from "../../utils/utils";
import { cleanName } from "../../utils/utils";
import { getAllActorsBlocksinWs } from "../../listeners/index.js";
import { foundTargetEl } from "../../utils/blockUtils.js";

export function parseJSONToIStar(jsonData) {
 
    // Controllo della presenza di blocchi e attori
    if (!jsonData.blocks || jsonData.blocks.length === 0 || !jsonData.blocks[0].actors) {
        return {}; // Restituisci un oggetto vuoto se il formato JSON non è valido
    }

    const validActors = jsonData.blocks[0].actors.filter(actor => actor.name && actor.name.trim() !== "" && actor.name.trim() !== "...............");
    const digitalActors = jsonData.blocks[0].resources.filter(resource => (resource.type === "custom_digital" || resource.type === "custom_digital_component") && resource.name && resource.name.trim() !== "" && resource.name.trim() !== "...............");
    const arrayistaractors = [];
    const arrayistardependencies = [];

    // Creazione dei file iStar per ogni attore
    [...validActors, ...digitalActors].forEach(actor => {
        const text_name = actor.name;
        const istar_operations = [];
        const activities = actor.activities || [];
        let i = 80;

        activities.forEach(activity => {
            if (activity.name && activity.name !== "..............." && activity.name.trim() !== "") {
                const id_op = generateID(activity.name);
                const op_name = activity.name;
                const op_goal = activity.motivation || "";
                const op_ass = activity.target ? cleanName(activity.target) : "none";

                const istar_operation = {
                    id: id_op,
                    text: op_name,
                    type: "istar.Task",
                    x: i,
                    y: 140,
                    customProperties: { "Description": "" }
                };
                istar_operations.push(istar_operation);

                if (op_goal && op_goal !== "..............." && op_goal.trim() !== "") {
                    const istar_goal = {
                        id: id_op + "_goal",
                        text: op_goal,
                        type: "istar.Goal",
                        x: i,
                        y: 80,
                        customProperties: { "Description": "" }
                    };
                    istar_operations.push(istar_goal);
                }

                if (op_ass !== "none") {
                    const blockType = validActors.find(a => cleanName(a.name) === op_ass) ? "custom_actor" : "custom_digital";
                    if (blockType === "custom_resource" || blockType === "custom_tool") {
                        let targetcleaned = foundTargetEl(activity.target);
                        const istar_res = {
                            id: id_op + "_res",
                            text: targetcleaned,
                            type: "istar.Resource",
                            x: i,
                            y: 200,
                            customProperties: { "Description": "" }
                        };
                        istar_operations.push(istar_res);
                    }
                    if (blockType === "custom_actor" || blockType === "custom_digital" || blockType === "custom_digital_component") {
                        let targetcleaned = foundTargetEl(activity.target);
                        const istar_dep = {
                            id: id_op + "_dep",
                            text: op_name,
                            type: "istar.Task",
                            x: i + 50,
                            y: 140,
                            customProperties: { "Description": "" },
                            source: text_name,
                            target: targetcleaned
                        };
                        arrayistardependencies.push(istar_dep);
                        console.log("value to target:"+activity.target);                        
                        console.log("value to target:"+istar_dep.target);
                    }
                }
                i += 120;
            }
        });

        const actoritem = {
            id: text_name,
            text: text_name,
            type: "istar.Actor",
            x: 15,
            y: 10,
            customProperties: { "description": "" },
            nodes: istar_operations
        };

        arrayistaractors.push(actoritem);
    });

    return { arrayistaractors, arrayistardependencies };
    
}
