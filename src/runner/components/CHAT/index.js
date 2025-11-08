import { VIEWS } from "../../views";
import {icons} from'../../../blocks/icons.js';
import { getTodayDate } from '../../../utils/utils.js';
import { logBlocklyEvent } from "../../../utils/logger.js";

export function view() { 

    try {

        return VIEWS.displayChat();
        //return "abc"

        
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}


export async function listenChat() { 

    try {
    
    const socket = new WebSocket("ws://localhost:3000/viewer");
    const chat = document.getElementById("chat");

    socket.onmessage = (event) => {
      const p = document.createElement("p");
      p.textContent = event.data;
      chat.prepend(p);
      //chat.scrollTop = chat.scrollHeight;
    };

  

      } catch (error) {

    console.error("Caught error in Component:", error);

    return error;

  }

}



