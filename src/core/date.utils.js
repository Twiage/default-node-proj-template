export function getDateNow() {
  return Date.now();
}
export function getIsoDateStringFromNow(timeInMilliseconds) {
  return new Date(Date.now() + timeInMilliseconds).toISOString();
}
