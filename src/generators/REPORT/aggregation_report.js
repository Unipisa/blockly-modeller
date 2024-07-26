export const formatAggregation = (aggregation) => {
    if (!aggregation || aggregation === 'NONE') return '';
    return `, which is a component of <i>${aggregation.toLowerCase()} (custom digital tool)</i>`;
  };
  