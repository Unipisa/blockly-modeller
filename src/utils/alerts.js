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

window.closeCustomAlert = closeCustomAlert;