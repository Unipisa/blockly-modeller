import {metamodel} from '../blocks/metamodel.js';
import {showCustomAlert} from './alerts.js';
import {icons} from'../blocks/icons.js';

const prompt = "Write a summary that explains the following diagram to a non-technical audience without giving technical explaination of the notation. Don't be verbose, just refer to the content of the diagram. Here is the diagram code:\n";

//not used
//const prompt2 = "First, analyse the UML class diagram in the code and in the figure. Then, extract all classes and return a JSON with all classes extracted, each class should have NAME with the class name, DESCRIPTION containing a 20-30 word description of the class that explains to a non-technical audience, the role of the class within the system and operations performed in association with other connected classes. Then, is shoudl have TYPE containing the type of entity represented, either digital, actor/organisation, natural resource or other type of resource. Then, it should have data extracted from the image analysis: WIDTH, containing the class width in pixels; HEIGHT, containing the class height in pixels; X, containing the x-position of the class; Y, containing the y-position of the class. Return the JSON";

const prompt3 = "Suggest improvements to extend the content of the following UML domain diagram. Do not use technical concepts or code and use max 100 words. In case the code is empty provide an example based on digital agriculture. Here is the diagram code:\n";

const prompt4 = `You are given a user request and a metamodel describing available block types, fields and relationships.

Analyse the user request and translate it into a series of actions to modify a Blockly Workspace according to the metamodel.

When processing the user request, ignore letter casing by converting inputs to a case-insensitive form before interpretation. Variations in capitalization must not change the detected intent.

Categorize the entities mentioned in the user request into the following types based on the metamodel: actors, organizations => custom_actor; animal, animal products, weather, natural resources => natural_resource; software, hardware => custom_digital; tractors, mechanical tools => custom_tool; tasks, activities => custom_operation; characteristics (e.g., name of actor, age, type) => custom_attribute; specification of a bigger entity => custom_generalization.

Return an array in JSON format with objects representing the actions needed to modify the Blockly Workspace.

Each object shall include these properties and corresponding values:
- action_type, (mandatory) with value: one among of ["block_create", "block_update", "block_delete"]
- block_name, (mandatory) with the name of the block to create, update or delete
- block_type, (mandatory only if action_type = "block_create") with admitted values: ["custom_actor", "natural_resource", "custom_digital", "custom_tool", "custom_operation", "custom_attribute", "custom_generalization"]
- field_name, (mandatory only if action_type = "block_update" or "block_create") with the name of the field to update or set
- field_value, (mandatory only if action_type = "block_update" or "block_create") with the value of the field to update or set
- association, (mandatory only if action_type = "block_update" or "block_created" AND block_type is "custom_operation") with the name of the block to associate the operation with 
- parent_element, (not mandatory, applicable only if action_type = "block_create") with the name of the parent element or as a generalization (if applicable)

Do not add any object properties different from the ones specified above.
Output only the serialized JSON array, without explanations, formatting, or extra text. In case of an empty or unclear request, return an array with a single item explaining the issue, e.g., [{ "error": "unclear user input" }]
.\n`;


const instructionsHelp = `<strong>Type textual instructions to build or modify your model.</strong>\n
<em>Examples of instructions you can use:\n
<strong>To create blocks:</strong>\n
- "Add an actor named Farmer"\n
- "Create a natural resource called Soil Moisture"\n
- "Create a model for a Smart Irrigation system"\n
<strong>To update blocks:</strong>\n
- "Update the block Sensor to have the name Weather Sensor"\n
<strong>To delete blocks:</strong>\n
- "Delete the block Old Tractor"\n \n
The AI will interpret your instructions and make the corresponding changes to your models.
Please note that the AI's interpretation may not always be perfect, so review the changes made to ensure they align with your intentions.</em>\n`;

export async function displayAITranslation(modelString,diagramDivId) {
const diagramDiv = document.getElementById(diagramDivId);
const res = await fetch("https://blockly-modeller.onrender.com/ask-ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: prompt+modelString })
});
const data = await res.json();

  diagramDiv.innerHTML = "<div>" + formatDescription(data.content) + "</div>";
}

export async function displayAISuggestion(modelString,diagramDivId) {
const diagramDiv = document.getElementById("diagramDivContentId");
const res = await fetch("https://blockly-modeller.onrender.com/ask-ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: prompt3+modelString })
});
const data = await res.json();
diagramDiv.innerHTML = formatDescription(data.content);
showCustomAlert(formatDescription(data.content));
}

export async function askAIModelSuggestion(userRequest) {
const res = await fetch("https://blockly-modeller.onrender.com/ask-ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: prompt4+" input data: user request:"+userRequest+"; metamodel"+metamodel })
});
const newWorkspace = await res.json();
  return newWorkspace;
}

export async function provideInstructionsHelp() {
  showCustomAlert(instructionsHelp);;
}


function formatDescription(text) {
  return text
    // Convert **text** to <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      // Add newline after each period
    .replace(/\.\s*/g, '.<br />')
    // Clean multiple newlines
    .replace(/\n+/g, '<br />')
    .trim();

   
        // Bold markdown (**text**)
        //.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

        // Add newline before numbers like "1." "2." "3."
        //.replace(/(\s*)(\d+\.)\s*/g, "<br>$2 ")

        // Add newline before bullets •
        //.replace(/\s*•\s*/g, "<br>• ")

        // Ensure the very beginning title gets bold and new line after
        //.replace(/^([A-Za-z ]+)\s/, "<strong>$1</strong><br>")
        
        // Normalize long dashes
        //.replace(/ – /g, " — ");
      }



/* not used
export async function extractAImappedElements(modelString,image,diagramDivId) {
const diagramDiv = document.getElementById(diagramDivId);

const res = await fetch("https://blockly-modeller.onrender.com/ask-ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: prompt2+modelString+image})
});
const data = await res.json();

  const map = document.getElementById(diagramDivId);

  // Create a popup element
  const popup = document.createElement('div');
  popup.classList.add('popup');
  map.appendChild(popup);

  // Add entities
  if(data){
    const dataJSON = JSON.parse(data);
  dataJSON.forEach(item => {
    const box = document.createElement('div');
    box.classList.add('entity');
    box.style.left = item.X + 'px';
    box.style.top = item.Y + 'px';
    box.style.width = item.WIDTH + 'px';
    box.style.height = item.HEIGHT + 'px';
    box.textContent = item.NAME;

    // Show popup on click
    box.addEventListener('click', (e) => {
      popup.innerHTML = `<h3>${item.NAME}</h3><p>${item.DESCRIPTION}</p>`;
      popup.style.left = (item.X + item.WIDTH + 15) + 'px';
      popup.style.top = item.Y + 'px';
      popup.style.display = 'block';
    });

    map.appendChild(box);
  });

  // Hide popup when clicking elsewhere
  map.addEventListener('click', (e) => {
    if (!e.target.classList.contains('entity')) {
      popup.style.display = 'none';
    }
  });
}
  //diagramDiv.innerHTML = data.content;

}
*/