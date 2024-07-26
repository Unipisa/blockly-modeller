//TODO

export function view(json) { 

    try {

        return json;
    
    } catch (error) {

      console.error("Caught error in Component:", error);

      return error;

    }
  

}


