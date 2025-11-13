export default function isValidName(str: string) {
  return /^[A-Za-z\s,.'-]+$/.test(str);
}
