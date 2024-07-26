export const formatSpecialisations = (specialisations) => {
    if (!specialisations) return ''; // Verifica se specialisations è undefined (a volte non c'è il campo)
    const validSpecialisations = specialisations.filter(spec => spec.name && spec.name !== '...............'); //per custom spec
  
    if (validSpecialisations.length === 1) {
      return `, is generalisation of <i>${validSpecialisations[0].name.toLowerCase()}</i>`;
    } else if (validSpecialisations.length > 1) {
      const lastSpecialisation = validSpecialisations.pop();
      return `, is generalisation of <i>${validSpecialisations.map(spec => spec.name).join(', ')}</i> and <i>${lastSpecialisation.name}</i>`;
    }
    return '';
  };
  