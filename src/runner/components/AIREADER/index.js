import { VIEWS } from "../../views";

let ws = null;


export function view() { 


    try {

        return VIEWS.displayChat();

        
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  
          

}

