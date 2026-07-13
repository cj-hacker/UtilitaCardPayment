(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);

  const rawAmount = params.get("amount") || "0";
  const rawReference = params.get("reference") || "DEMO";

  const amount = Number.parseFloat(rawAmount);
  const safeAmount = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  const reference = rawReference.trim().slice(0, 40) || "DEMO";

  const formattedAmount = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(safeAmount);

  const elements = {
    paymentAmount: document.getElementById("paymentAmount"),
    paymentReference: document.getElementById("paymentReference"),
    buttonAmount: document.getElementById("buttonAmount"),
    form: document.getElementById("paymentForm"),
    successPanel: document.getElementById("successPanel"),
    successAmount: document.getElementById("successAmount"),
    successReference: document.getElementById("successReference"),
    makeAnotherPayment: document.getElementById("makeAnotherPayment"),
    cardholder: document.getElementById("cardholder"),
    cardNumber: document.getElementById("cardNumber"),
    expiry: document.getElementById("expiry"),
    cvv: document.getElementById("cvv")
  };

  elements.paymentAmount.textContent = formattedAmount;
  elements.paymentReference.textContent = reference;
  elements.buttonAmount.textContent = formattedAmount;
  elements.successAmount.textContent = formattedAmount;
  elements.successReference.textContent = reference;

  function digitsOnly(value) {
    return value.replace(/\D/g, "");
  }

  function setError(input, message) {
    const error = document.getElementById(`${input.id}Error`);
    input.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", Boolean(message).toString());
    if (error) error.textContent = message;
  }

  function clearSensitiveFields() {
    elements.cardholder.value = "";
    elements.cardNumber.value = "";
    elements.expiry.value = "";
    elements.cvv.value = "";
  }

  elements.cardNumber.addEventListener("input", () => {
    const digits = digitsOnly(elements.cardNumber.value).slice(0, 16);
    elements.cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  });

  elements.expiry.addEventListener("input", () => {
    const digits = digitsOnly(elements.expiry.value).slice(0, 4);
    elements.expiry.value =
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  elements.cvv.addEventListener("input", () => {
    elements.cvv.value = digitsOnly(elements.cvv.value).slice(0, 4);
  });

  function validateForm() {
    let valid = true;

    const name = elements.cardholder.value.trim();
    const cardDigits = digitsOnly(elements.cardNumber.value);
    const expiryMatch = elements.expiry.value.match(/^(\d{2})\/(\d{2})$/);
    const cvvDigits = digitsOnly(elements.cvv.value);

    setError(elements.cardholder, name.length >= 2 ? "" : "Enter a dummy cardholder name.");
    if (name.length < 2) valid = false;

    setError(
      elements.cardNumber,
      cardDigits.length === 16 ? "" : "Enter a 16-digit dummy card number."
    );
    if (cardDigits.length !== 16) valid = false;

    let expiryError = "";
    if (!expiryMatch) {
      expiryError = "Enter a dummy expiry date in MM/YY format.";
    } else {
      const month = Number(expiryMatch[1]);
      if (month < 1 || month > 12) {
        expiryError = "Enter a valid month from 01 to 12.";
      }
    }
    setError(elements.expiry, expiryError);
    if (expiryError) valid = false;

    setError(
      elements.cvv,
      cvvDigits.length >= 3 ? "" : "Enter a 3 or 4 digit dummy security code."
    );
    if (cvvDigits.length < 3) valid = false;

    return valid;
  }

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    // No fetch, XMLHttpRequest, localStorage, sessionStorage, cookies,
    // analytics, or server submission is used in this demo.
    clearSensitiveFields();
    elements.form.hidden = true;
    elements.successPanel.hidden = false;
  });

  elements.makeAnotherPayment.addEventListener("click", () => {
    clearSensitiveFields();
    for (const input of [
      elements.cardholder,
      elements.cardNumber,
      elements.expiry,
      elements.cvv
    ]) {
      setError(input, "");
    }
    elements.successPanel.hidden = true;
    elements.form.hidden = false;
    elements.cardholder.focus();
  });

  window.addEventListener("beforeunload", clearSensitiveFields);
})();
