/**
 * Simulated Telebirr / M-Pesa wallets for demo and development.
 * Replace authorizeWalletPayment with live provider APIs in production.
 */

const DEFAULT_DEMO_PIN = "1234";
const DEFAULT_BALANCE = 25000;

/** @type {Map<string, { balance: number, pin: string, fullName: string }>} */
const accounts = new Map();

function accountKey(provider, phone) {
  return `${String(provider).toLowerCase()}:${String(phone).trim()}`;
}

function normalizePhone(provider, phone) {
  const p = String(phone || "").trim();
  if (provider === "telebirr" && !/^09\d{8}$/.test(p)) {
    throw new Error("Telebirr number must start with 09 and be 10 digits.");
  }
  if (provider === "mpesa" && !/^07\d{8}$/.test(p)) {
    throw new Error("M-Pesa number must start with 07 and be 10 digits.");
  }
  return p;
}

function maskPhone(phone) {
  if (!phone || phone.length < 4) return "****";
  return `${"*".repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`;
}

function getOrCreateAccount(provider, phone, fullName = "") {
  const key = accountKey(provider, phone);
  if (!accounts.has(key)) {
    accounts.set(key, {
      balance: DEFAULT_BALANCE,
      pin: DEFAULT_DEMO_PIN,
      fullName: fullName || "Wallet user",
    });
  } else if (fullName) {
    const acc = accounts.get(key);
    acc.fullName = fullName;
  }
  return accounts.get(key);
}

function getWalletBalance(provider, phone) {
  const key = accountKey(provider, phone);
  const acc = accounts.get(key);
  return acc ? acc.balance : 0;
}

function authorizeWalletPayment({
  provider,
  phone,
  pin,
  amount,
  fullName,
}) {
  const normalizedProvider = String(provider).toLowerCase();
  const normalizedPhone = normalizePhone(normalizedProvider, phone);
  const payAmount = Number(amount);
  if (!Number.isFinite(payAmount) || payAmount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const acc = getOrCreateAccount(normalizedProvider, normalizedPhone, fullName);
  const enteredPin = String(pin || "").trim();

  if (enteredPin !== acc.pin) {
    const err = new Error("Incorrect wallet PIN. Please try again.");
    err.code = "INVALID_PIN";
    throw err;
  }

  if (acc.balance < payAmount) {
    const err = new Error(
      `Insufficient balance. Available ETB ${acc.balance.toFixed(2)}, required ETB ${payAmount.toFixed(2)}.`,
    );
    err.code = "INSUFFICIENT_BALANCE";
    err.availableBalance = acc.balance;
    throw err;
  }

  acc.balance = Math.round((acc.balance - payAmount) * 100) / 100;

  return {
    provider: normalizedProvider,
    phone: normalizedPhone,
    maskedPhone: maskPhone(normalizedPhone),
    amountPaid: payAmount,
    remainingBalance: acc.balance,
    payerName: acc.fullName,
  };
}

module.exports = {
  DEFAULT_DEMO_PIN,
  DEFAULT_BALANCE,
  normalizePhone,
  maskPhone,
  getOrCreateAccount,
  getWalletBalance,
  authorizeWalletPayment,
};
