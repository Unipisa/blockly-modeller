// import { DOM_NODES } from "./domElements";

// export function showCustomAlert(message) {
//   DOM_NODES.alertMessage.innerHTML = message.replace(/\n/g, "<br>");
//   DOM_NODES.alertBox.classList.remove("hidden");
// }

// export function closeCustomAlert() {
//   DOM_NODES.alertBox.classList.add("hidden");
// }
// window.closeCustomAlert = closeCustomAlert; 



export const Alert_div = {
  alertBox: null, 
  alertMessage: null,
};

export function showCustomAlert(message) {
    Alert_div.alertMessage.innerHTML = message.replace(/\n/g, "<br>");
    Alert_div.alertBox.classList.remove("hidden");
}

export function closeCustomAlert() {
    Alert_div.alertBox.classList.add("hidden");
}

export const instructions = `TASK 1

Leggi la descrizione del processo e crea il modello. \n 
Costruisci il modello partendo dagli elementi evidenziati in grassetto, che sono obbligatori. Puoi aggiungere elementi anche sulla base di conoscenze pregresse. 
Esporta il diagramma di struttura in formato immagine e l’area di lavoro (workspace).

Tempo massimo: 15 minuti \n

L’<strong>agricoltore</strong> ha l’obiettivo di modernizzare la coltivazione in serra per ottimizzare le pratiche agricole e migliorare la sostenibilità. L’integrazione di strumenti digitali consente di incrementare la produttività, ridurre l’uso di input come acqua e fertilizzanti e aumentare il benessere degli agricoltori grazie all’automazione, che consente di risparmiare tempo. 

Il nuovo processo prevede l’introduzione un sistema basato su <strong>sensori</strong> installati nella serra per rilevare temperatura, CO2, umidità del suolo, pH e luce. I sensori sono collegati tramite un sistema di comunicazione basato su LoRa Network, che consente la trasmissione dei dati alla piattaforma AgroSense ogni ora. 

L’agricoltore può accedere per <strong>monitorare le condizioni ambientali</strong> nella propria <strong>serra</strong> collegandosi alla piattaforma Agrosense sia da dispositivi mobili che da computer.  Ad esempio, se il sistema rileva una diminuzione della temperatura, l'agricoltore può intervenire immediatamente per accendendo delle lampade, prevenendo così lo stress delle piante e potenziali danni al raccolto

I consulenti tecnici, che lavorano a stretto contatto con gli agricoltori, possono accedere ai dati attraverso la stessa piattaforma e offrire raccomandazioni personalizzate basate sulle condizioni rilevate.


TASK 2 \n

Importa il file POMODORO.json che si trova sul desktop ed estendi il modello aggiungendo una tecnologia basata su sensori per monitorare lo stato di salute delle piante di pomodoro e fornire suggerimenti per i trattamenti antiparassitari.
Quando sei soddisfatto/a salva il diagamma di processo in formato immagine e l’area di lavoro.

Tempo massimo: 5 minuti \n
`;

window.closeCustomAlert = closeCustomAlert;

