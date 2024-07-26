import { formatActivities } from "./activities_report";
import { formatAttributes } from "./attributes_report";

export const formatActorReport = (actor) => {
  const namePattern = /([A-Za-z]+)(\d+)$/;
  const match = actor.name.match(namePattern);

  let formattedName;
  if (match) {
    const baseName = match[1];
    const id = match[2];
    formattedName = `${baseName.toUpperCase()}(${id})`;
  } else {
    // Se non corrisponde al pattern, usa il nome originale
    formattedName = actor.name.toUpperCase();
  }

  let actorReport = `<br>• Actor: ${formattedName}`;
  const attributesText = formatAttributes(actor.attributes);
  if (attributesText) {
    actorReport += attributesText;
  }
  if (actor.activities && actor.activities.length > 0) {
    const activitiesText = formatActivities(actor.activities);
    if (activitiesText) {
      actorReport += `, does the action of:<br>${activitiesText}`;
    }
  }
  return actorReport;
};
