import { formatActivities } from "./activities_report";
import { formatAggregation } from "./aggregation_report";
import { formatAttributes } from "./attributes_report";
import { formatSpecialisations } from "./specialisations_report";

export const formatResourceReport = (resource) => {
  let resourceReport = `<br>• Resource: ${resource.name.toUpperCase()}`;

  const attributesText = formatAttributes(resource.attributes);
  if (attributesText) {
    resourceReport += attributesText;
  }
  const specialisationText = formatSpecialisations(resource.specialisations);
  if (specialisationText) {
    resourceReport += specialisationText;
  }
  const aggregationText = formatAggregation(resource.aggregation);
  if (aggregationText) {
    resourceReport += aggregationText;
  }
  if (resource.activities && resource.activities.length > 0) {
    const activitiesText = formatActivities(resource.activities);
    if (activitiesText) {
      resourceReport += `, does the action of:<br>${activitiesText}`;
    }
  }
  return resourceReport;
};
