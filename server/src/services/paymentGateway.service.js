function mapMethodToProvider(method) {
  const m = String(method || "cash").toLowerCase();
  if (m === "telebirr") return "telebirr";
  if (m === "mpesa") return "mpesa";
  if (m === "card") return "card";
  return "cash";
}

function sanitizeMobilePaymentDetails(details = {}) {
  const phoneNumber = String(details.phoneNumber || "").trim();
  const fullName = String(details.fullName || "").trim();
  const pin = String(details.pin || "").trim();

  return {
    phoneNumber,
    fullName,
    pin,
    maskedPhoneNumber: phoneNumber
      ? `${"*".repeat(Math.max(phoneNumber.length - 4, 0))}${phoneNumber.slice(-4)}`
      : "",
  };
}

/**
 * Initializes payment.
 * NOTE: For Telebirr/M-Pesa this is a safe simulation layer until live
 * credentials/callback URLs are configured.
 */
async function initializePayment({
  provider,
  amount,
  orderId,
  email,
  name,
  paymentDetails,
}) {
  const ts = Date.now();
  const ref = `${provider.toUpperCase()}-${orderId}-${ts}`;
  const mobileDetails = sanitizeMobilePaymentDetails(paymentDetails);

  if (provider === "cash") {
    return {
      reference: ref,
      status: "processing",
      action: null,
      raw: { mode: "cash_on_delivery" },
    };
  }

  // Placeholder actions to show frontend how to proceed for mobile wallets.
  if (provider === "telebirr") {
    return {
      reference: ref,
      status: "initialized",
      action: {
        type: "phone_prompt",
        provider: "telebirr",
        message: `A Telebirr payment request has been sent to ${mobileDetails.maskedPhoneNumber || "the provided phone"}. Confirm it on your phone to complete the order.`,
      },
      raw: {
        provider,
        orderId,
        email,
        name,
        customerFullName: mobileDetails.fullName,
        phoneNumber: mobileDetails.maskedPhoneNumber,
      },
    };
  }

  if (provider === "mpesa") {
    return {
      reference: ref,
      status: "initialized",
      action: {
        type: "phone_prompt",
        provider: "mpesa",
        message: `An M-Pesa payment request has been sent to ${mobileDetails.maskedPhoneNumber || "the provided phone"}. Confirm it on your phone to complete the order.`,
      },
      raw: {
        provider,
        orderId,
        email,
        name,
        customerFullName: mobileDetails.fullName,
        phoneNumber: mobileDetails.maskedPhoneNumber,
      },
    };
  }

  // Card generic
  return {
    reference: ref,
    status: "initialized",
    action: {
      type: "redirect",
      url: `${process.env.CARD_SIMULATED_URL || "https://payments.example/checkout"}?ref=${encodeURIComponent(ref)}&amount=${amount}`,
    },
    raw: { provider, orderId, email, name },
  };
}

module.exports = {
  mapMethodToProvider,
  initializePayment,
  sanitizeMobilePaymentDetails,
};