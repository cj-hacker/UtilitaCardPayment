(() => {
  "use strict";

  const WEBHOOK_URL = "https://hooks.uk.webexconnect.io/events/FI7EANSH9O";
  const params = new URLSearchParams(window.location.search);

  const rawAmount = params.get("amount") || "0";
  const rawReference = params.get("reference") || "DEMO";
  const rawMobile = params.get("mobile") || "";

  const parsedAmount = Number.parseFloat(rawAmount);
  const amount = Number.isFinite(parsedAmount) && parsedAmount >= 0 ? parsedAmount : 0;
  const reference = rawReference.trim().slice(0, 60) || "DEMO";

  const formattedAmount = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(amount);

  const el = {
    paymentAmount: document.getElementById("paymentAmount"),
    paymentReference: document.getElementById("paymentReference"),
    buttonAmount: document.getElementById("buttonAmount"),
    form: document.getElementById("paymentForm"),
    successPanel: document.getElementById("successPanel"),
    errorPanel: document.getElementById("errorPanel"),
    successAmount: document.getElementById("successAmount"),
    successMobile: document.getElementById("successMobile"),
    successReference: document.getElementById("successReference"),
    makeAnotherPayment: document.getElementById("makeAnotherPayment"),
    returnToForm: document.getElementById("returnToForm"),
    webhookErrorMessage: document.getElementById("webhookErrorMessage"),
    mobileNumber: document.getElementById("mobileNumber"),
    cardholder: document.getElementById("cardholder"),
    cardNumber: document.getElementById("cardNumber"),
    expiry: document.getElementById("expiry"),
    cvv: document.getElementById("cvv"),
    payButton: document.getElementById("payButton")
  };

  el.paymentAmount.textContent = formattedAmount;
  el.paymentReference.textContent = reference;
  el.buttonAmount.textContent = formattedAmount;
  el.successAmount.textContent = formattedAmount;
  el.successReference.textContent = reference;
  el.mobileNumber.value = rawMobile.replace(/\D/g, "").slice(0, 15);

  const digitsOnly = value => value.replace(/\D/g, "");

  function normaliseMobile(value) {
    const trimmed = value.trim();
    const digits = digitsOnly(trimmed);
    return trimmed.startsWith("+") ? `+${digits}` : digits;
  }

  function setError(input, message) {
    const error = document.getElementById(`${input.id}Error`);
    input.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) error.textContent = message;
  }

  function clearInputs() {
    el.mobileNumber.value = "";
    el.cardholder.value = "";
    el.cardNumber.value = "";
    el.expiry.value = "";
    el.cvv.value = "";
  }

  function showForm() {
    el.successPanel.hidden = true;
    el.errorPanel.hidden = true;
    el.form.hidden = false;
  }

  el.cardNumber.addEventListener("input", () => {
    const digits = digitsOnly(el.cardNumber.value).slice(0, 16);
    el.cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  });

  el.expiry.addEventListener("input", () => {
    const digits = digitsOnly(el.expiry.value).slice(0, 4);
    el.expiry.value = digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  });

  el.cvv.addEventListener("input", () => {
    el.cvv.value = digitsOnly(el.cvv.value).slice(0, 4);
  });

  function validate() {
    let valid = true;
    const mobileDigits = digitsOnly(el.mobileNumber.value);
    const cardDigits = digitsOnly(el.cardNumber.value);
    const cvvDigits = digitsOnly(el.cvv.value);
    const expiryMatch = el.expiry.value.match(/^(\d{2})\/(\d{2})$/);

    const mobileError =
      mobileDigits.length >= 10 && mobileDigits.length <= 15
        ? ""
        : "Enter a valid demo mobile number.";
    setError(el.mobileNumber, mobileError);
    if (mobileError) valid = false;

    const nameError =
      el.cardholder.value.trim().length >= 2
        ? ""
        : "Enter a dummy cardholder name.";
    setError(el.cardholder, nameError);
    if (nameError) valid = false;

    const cardError =
      cardDigits.length === 16
        ? ""
        : "Enter a 16-digit dummy card number.";
    setError(el.cardNumber, cardError);
    if (cardError) valid = false;

    let expiryError = "";
    if (!expiryMatch) {
      expiryError = "Enter a dummy expiry date in MM/YY format.";
    } else {
      const month = Number(expiryMatch[1]);
      if (month < 1 || month > 12) {
        expiryError = "Enter a valid month from 01 to 12.";
      }
    }
    setError(el.expiry, expiryError);
    if (expiryError) valid = false;

    const cvvError =
      cvvDigits.length >= 3
        ? ""
        : "Enter a 3 or 4 digit dummy security code.";
    setError(el.cvv, cvvError);
    if (cvvError) valid = false;

    return valid;
  }

  async function sendWebhook(number) {
    const payload = {
      number,
      payment: amount.toFixed(2),
      reference
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook returned HTTP ${response.status}.`);
    }
  }

  el.form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!validate()) return;

    const mobile = normaliseMobile(el.mobileNumber.value);

    el.payButton.disabled = true;
    el.payButton.textContent = "Processing demo payment…";

    try {
      await sendWebhook(mobile);
      clearInputs();
      el.form.hidden = true;
      el.errorPanel.hidden = true;
      el.successMobile.textContent = mobile;
      el.successPanel.hidden = false;
    } catch (error) {
      clearInputs();
      el.form.hidden = true;
      el.successPanel.hidden = true;
      el.webhookErrorMessage.textContent =
        error instanceof Error ? error.message : "Unknown webhook error.";
      el.errorPanel.hidden = false;
    } finally {
      el.payButton.disabled = false;
      el.payButton.innerHTML = `Pay <span>${formattedAmount}</span>`;
    }
  });

  el.makeAnotherPayment.addEventListener("click", () => {
    clearInputs();
    [el.mobileNumber, el.cardholder, el.cardNumber, el.expiry, el.cvv]
      .forEach(input => setError(input, ""));
    showForm();
    el.mobileNumber.focus();
  });

  el.returnToForm.addEventListener("click", () => {
    showForm();
    el.mobileNumber.focus();
  });

  window.addEventListener("beforeunload", clearInputs);
})();
