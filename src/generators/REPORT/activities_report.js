export const formatActivities = (activities) => {
    return activities.map(activity => {
      let activityText = '';
      if (activity.name && activity.name !== '...............') {
        activityText = `  - <i>${activity.name}</i>`;
        if (activity.motivation && activity.motivation !== '...............') {
          activityText += ` because <i>${activity.motivation}</i>`;
        }
        if (activity.target && activity.target !== 'NONE') {
          activityText += `, interacting with <i>${activity.target.toLowerCase()}</i>`;
        }
      }
      return activityText;
    }).filter(text => text !== '').join('<br>');  // rimuove tutte le stringhe vuote dall'array risultante, sennò entra nell'if e stampa comunque 'does the action of'.
  };
  