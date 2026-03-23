import { VIEWS } from "../../views";
import {icons} from'../../../blocks/icons.js';
import { getTodayDate } from '../../../utils/utils.js';
import { logBlocklyEvent } from "../../../utils/logger.js";
import { showCustomAlert } from "../../../utils/alerts";



export async function listenChat() { 

    try {
    
    const socket = new WebSocket("wss://blockly-modeller.onrender.com/viewer");
    //const chat = document.getElementById("chat");

    socket.onmessage = (event) => {
    console.log('Adding CHAT download button');

      const p = document.createElement("p");
      p.textContent = event.data;
      //chat.prepend(p);
      //chat.scrollTop = chat.scrollHeight;
      showCustomAlert(p.textContent)
    };

  

      } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }

}



