import { DOM_NODES } from "./domElements";

export function showCustomAlert(message) {
  DOM_NODES.alertMessage.innerHTML = message.replace(/\n/g, "<br>");
  DOM_NODES.alertBox.classList.remove("hidden");
}

export function closeCustomAlert() {
  DOM_NODES.alertBox.classList.add("hidden");
}
window.closeCustomAlert = closeCustomAlert; 