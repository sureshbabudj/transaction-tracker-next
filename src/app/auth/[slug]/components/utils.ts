import { randomBytes, pbkdf2Sync } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const hashVerify = pbkdf2Sync(password, salt, 1000, 64, "sha512");
  return hash === hashVerify.toString("hex");
}

export function validateEmail(
  email: FormDataEntryValue | null
): email is string {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

export function validatePassword(
  password: FormDataEntryValue | null
): password is string {
  if (!password || typeof password !== "string") return false;
  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

export function validateFirstName(
  firstName: FormDataEntryValue | null
): firstName is string {
  const firstNameRegex = /^[A-Za-z][A-Za-z ]{2,}$/;
  if (
    !firstName ||
    typeof firstName !== "string" ||
    (firstName.length > 0 && !firstNameRegex.test(firstName))
  ) {
    return false;
  }

  return true;
}

export function validateLastName(
  lastName: FormDataEntryValue | null
): lastName is string {
  const lastNameRegex = /^[A-Za-z][A-Za-z ]{2,}$/;
  if (
    !lastName ||
    typeof lastName !== "string" ||
    (lastName.length > 0 && !lastNameRegex.test(lastName))
  ) {
    return false;
  }

  return true;
}
