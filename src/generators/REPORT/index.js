import { formatActorReport } from "./actor_report";
import { formatResourceReport } from "./resource_report";


const generateReportFromJSON = (jsonData) => {
  let report = '<u>Diagram entities:</u><br>';

  if (jsonData.blocks && jsonData.blocks.length > 0) {
    const data = jsonData.blocks[0];

    if (data.actors && data.actors.length > 0) {
      data.actors.forEach(actor => {
        if (actor.name && actor.name.trim() !== '...............') {
          report += formatActorReport(actor);
        }
      });
    }

    if (data.resources && data.resources.length > 0) {
      data.resources.forEach(resource => {
        if (resource.name && resource.name.trim() !== '...............') {
          report += formatResourceReport(resource);
        }
      });
    }
  }
  return report;
}

export { generateReportFromJSON }