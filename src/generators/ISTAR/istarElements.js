import { generateID } from "../../utils/utils";
import { cleanName } from "../../utils/utils";
import { getAllActorsBlocksinWs } from "../../listeners/index.js";
import { foundTargetEl } from "../../utils/blockUtils.js";

export function parseJSONToIStar(jsonData) {
 
 if (!jsonData.blocks || jsonData.blocks.length === 0 || 
        (!jsonData.blocks[0].actors && !jsonData.blocks[0].resources)) {
        return {};
    }

    const validActors = [
        ...jsonData.blocks[0].actors.filter(actor => actor.name && actor.name.trim() !== "" && actor.name.trim() !== "..............."),
        ...jsonData.blocks[0].resources.filter(resource => (resource.type === "custom_digital" || resource.type === "custom_digital_component") && resource.name && resource.name.trim() !== "" && resource.name.trim() !== "...............")
    ];
    
    const resources = jsonData.blocks[0].resources.filter(resource => (resource.type === "custom_resource" || resource.type === "custom_tool") && resource.name && resource.name.trim() !== "" && resource.name.trim() !== "...............");
    
    const arrayistaractors = [];
    const arrayistardependencies = [];

    // Creazione dei file iStar per ogni attore
    validActors.forEach(actor => {
        const text_name = actor.name;
        const istar_operations = [];
        const activities = actor.activities || [];
        let i = 80;
        //console.log("blocchi1", validActors, digitalActors);

        activities.forEach(activity => {
            if (activity.name && activity.name !== "..............." && activity.name.trim() !== "") {
                const id_op = generateID(activity.name);
                const op_name = activity.name;
                const op_goal = activity.motivation || "";
                const op_ass = activity.target ? cleanName(activity.target) : "none";

//dentro nodes:     "istar.Task"
                const istar_operation = {
                    id: id_op,
                    text: op_name,
                    type: "istar.Task",
                    x: i,
                    y: 140,
                    customProperties: { "Description": "" }
                };
                istar_operations.push(istar_operation);
                
                //"istar.Goal"
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

                // Gestione del target:
                if (op_ass !== "none") {
                    
                    //let targetcleaned = foundTargetEl(activity.target);

                    // Caso 3: Attore che targetta una risorsa
                    if (activity.target.includes("(CUSTOM_RESOURCE)") || activity.target.includes("(CUSTOM_TOOL)")) {
                        // Caso 3: Attore che targetta una risorsa
                        if (resources.find(r => cleanName(r.name) === op_ass)) {
                            const istar_res = {
                                id: id_op + "_res",
                                text: op_ass,
                                type: "istar.Resource",
                                x: i,
                                y: 200,
                                customProperties: { "Description": "" }
                            };
                            istar_operations.push(istar_res);
                        }
                    }

                    // Caso 1: Attore che targetta se stesso
                    else if (cleanName(text_name) === op_ass) {
                        const istar_dep = {
                            id: id_op + "_dep",
                            text: op_name,
                            type: "istar.Task",
                            x: i + 50,
                            y: 140,
                            customProperties: { "Description": "" },
                            source: text_name,
                            target: text_name
                        };
                        arrayistardependencies.push(istar_dep);
                    }
                    // Caso 2: Attore che targetta un altro attore
                    else if (validActors.find(a => cleanName(a.name) === op_ass)) {
                        const istar_dep = {
                            id: id_op + "_dep",
                            text: op_name,
                            type: "istar.Task",
                            x: i + 50,
                            y: 140,
                            customProperties: { "Description": "" },
                            source: text_name,
                            target: op_ass
                        };
                        arrayistardependencies.push(istar_dep);
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
        // console.log("blocchiACT:", arrayistaractors);
        // console.log("blocchiDEP:", arrayistardependencies);
    });

    return { arrayistaractors, arrayistardependencies };
    
}
