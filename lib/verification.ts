import crypto from "node:crypto";

const CODE_TTL_MS = 2 * 60 * 1000;

export type VerificationPayload = {
  type: "registration" | "password_reset";
  expiresAt: number;
  [key: string]: unknown;
};

function secret() {
  const value = process.env.NEXTAUTH_SECRET;
  if (!value) throw new Error("NEXTAUTH_SECRET تنظیم نشده است.");
  return crypto.createHash("sha256").update(value).digest();
}

export function createVerificationToken(
  payload: Omit<VerificationPayload, "expiresAt">,
) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secret(), iv);
  const body = Buffer.from(
    JSON.stringify({ ...payload, expiresAt: Date.now() + CODE_TTL_MS }),
  );
  const encrypted = Buffer.concat([cipher.update(body), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function verifyVerificationToken(token: string) {
  const [ivValue, tagValue, encryptedValue] = token.split(".");
  if (!ivValue || !tagValue || !encryptedValue) return null;

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      secret(),
      Buffer.from(ivValue, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    const body = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]);
    const payload = JSON.parse(body.toString("utf8")) as VerificationPayload;
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

function normalizeMobile(mobile: string) {
  return mobile
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\s|-/g, "")
    .replace(/^\+98/, "0")
    .replace(/^98/, "0");
}

export async function sendSms(mobile: string, code: string) {
  const apiKey = process.env.SMS_IR_API_KEY;
  const templateId = process.env.SMS_IR_TEMPLATE_ID;
  if (!apiKey || !templateId || !/^\d+$/.test(templateId)) {
    throw new Error("کلید یا شناسه قالب SMS_IR_TEMPLATE_ID تنظیم نشده است.");
  }

  const normalizedMobile = normalizeMobile(mobile);
  if (!/^09\d{9}$/.test(normalizedMobile)) {
    throw new Error(`شماره موبایل نامعتبر است: ${mobile}`);
  }

  const response = await fetch("https://api.sms.ir/v1/send/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      mobile: normalizedMobile,
      templateId: Number(templateId),
      parameters: [{ name: "CODE", value: code }],
    }),
  });
  const responseText = await response.text();
  if (!response.ok) {
    let message = responseText;
    try {
      const body = JSON.parse(responseText) as {
        message?: string;
        errors?: unknown;
      };
      message = body.message || JSON.stringify(body.errors) || responseText;
    } catch {
      // Keep the provider's plain-text response.
    }
    throw new Error(`SMS.ir: ${message || `HTTP ${response.status}`}`);
  }
}

export async function sendEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("تنظیمات ارسال ایمیل Resend کامل نیست.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "کد تایید پانوملک",
      html: `<p dir="rtl">کد تایید شما: <strong>${code}</strong></p>`,
    }),
  });
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Resend: ${responseText || `HTTP ${response.status}`}`);
  }
}
