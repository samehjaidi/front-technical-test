import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class SwalService {
  constructor() { }

  alert(title: string, icon: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      confirmButtonColor: "#275c8b",
      cancelButtonText: "Annuler",
    });
  }

  confirmAlert(title: string, text: string, action: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      confirmButtonColor: "#275c8b",
      cancelButtonColor: "#21b2f4",
      confirmButtonText: action,
      showCancelButton: true,
      cancelButtonText: "Annuler",
    });
  }
  errorHtmlAlert(
    title: string,
    html: string,
    confirmButtonText: string,
    width: string = "50em"
  ) {
    Swal.fire({
      icon: "error",
      title: title,
      html: html,
      confirmButtonText: confirmButtonText,
      width: width,
      heightAuto: true,
      confirmButtonColor: "#275c8b",
    });
  }
  inputAlert(title: string, text: string, inputs: any[]) {
    return Swal.fire({
      title: title,
      text: text,
      input: "radio",
      inputOptions: inputs.reduce((acc: any, input: any) => {
        acc[input.value] = input.label;
        return acc;
      }, {}),
      inputValidator: (value) => {
        if (!value) {
          return "Vous devez sélectionner une option";
        }
        return null;
      },
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: "Valider",
      confirmButtonColor: "#275c8b",
      cancelButtonColor: "#21b2f4",
    });
  }
  customRadioAlert(title: string, text: string, options: any[]) {
    const html = `
      <style>
        .swal2-radio-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .swal2-radio-item {
          margin-bottom: 0.5em;
        }
      </style>
      <p style="text-align: left; margin-bottom: 1em;">${text}</p>
      <div class="swal2-radio-group">
        ${options
        .map(
          (opt: any, index: number) => `
              <div class="swal2-radio-item">
                <input type="radio" name="custom-radio" id="opt-${index}" value="${opt.value
            }" ${opt.checked ? "checked" : ""}>
                <label for="opt-${index}" style="margin-left: 0.3em;">${opt.label
            }</label>
              </div>
            `
        )
        .join("")}
      </div>
    `;

    return Swal.fire({
      title: title,
      html: html,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#275c8b",
      cancelButtonColor: "#21b2f4",
      preConfirm: () => {
        const selected = (
          document.querySelector(
            'input[name="custom-radio"]:checked'
          ) as HTMLInputElement
        )?.value;
        if (!selected) {
          Swal.showValidationMessage("Veuillez sélectionner une option");
        }
        return selected;
      },
    });
  }

  showHtmlAlert(
    title: string,
    html: string,
    text: string,
    action: string,
    width: string = "50em"
  ) {
    return Swal.fire({
      title: title,
      text: text,
      html: html,
      icon: "success",
      width: width,
      confirmButtonColor: "#275c8b",
      cancelButtonColor: "#21b2f4",
      confirmButtonText: action,
      showCancelButton: true,
      cancelButtonText: "Annuler",
    });
  }
  successAlert(title: string, text: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#275c8b'
    });
  }

  errorAlert(title: string, text: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#275c8b'
    });
  }

  infoAlert(title: string, text: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#275c8b'
    });
  }


}
