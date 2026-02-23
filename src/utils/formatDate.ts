export function getShortDate(date: Date) {
  return new Date(date).toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

export function getMediumDate(date: Date) {
  return new Date(date).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "medium"
  });
}

export function getLongDate(date: Date) {
  return new Date(date).toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "long",
  });
}
