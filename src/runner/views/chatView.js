export const displayChat = (event) => {
    const chatDiv = document.getElementById("chat");
    if (chatDiv) {
//const umlDiagramDiv = document.getElementById('codeOutputUML');
  //const umlDiagramDiv = DOM_NODES.umlDiagramDiv;
  chatDiv.innerHTML = event; 
    } 
};
