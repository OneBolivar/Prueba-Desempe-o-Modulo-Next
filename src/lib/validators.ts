import {
  ValidationResult,
  BookingDateValidationResult,
  SpaceInput,
} from "@/types/validators";

// 1. Validación de Correo Electrónico
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// 2. Validación de Contraseña Segura (mínimo 6 caracteres, número o símbolo)
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: "La contraseña debe contener al menos 6 caracteres.",
    };
  }

  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasNumberOrSymbol) {
    return {
      isValid: false,
      error: "La contraseña debe incluir al menos un número o símbolo.",
    };
  }

  return { isValid: true };
}

// 3. Validación de Fechas y Horas de Reserva (Reglas de Negocio Estrictas Riwi)
export function validateBookingDates(
  startTimeStr: string,
  endTimeStr: string
): BookingDateValidationResult {
  if (!startTimeStr || !endTimeStr) {
    return {
      isValid: false,
      error: "Debes proporcionar fecha y hora de inicio y fin.",
    };
  }

  const start = new Date(startTimeStr);
  const end = new Date(endTimeStr);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: "El formato de las fechas ingresadas no es válido.",
    };
  }

  // Regla: No fechas pasadas
  if (start < now) {
    return {
      isValid: false,
      error: "No es posible reservar en fechas u horarios pasados.",
    };
  }

  // Regla: Ventana de anticipación máxima de 30 días
  const maxAdvanceMs = 30 * 24 * 60 * 60 * 1000;
  if (start.getTime() > now.getTime() + maxAdvanceMs) {
    return {
      isValid: false,
      error: "No es posible reservar con más de 30 días de anticipación.",
    };
  }

  // Regla: Minutos en punto obligatorios (:00)
  if (start.getMinutes() !== 0 || end.getMinutes() !== 0 || start.getSeconds() !== 0 || end.getSeconds() !== 0) {
    return {
      isValid: false,
      error: "Las reservas deben realizarse en horas en punto (:00). No se permiten fracciones de hora.",
    };
  }

  // Regla: Mismo día calendario
  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (!isSameDay) {
    return {
      isValid: false,
      error: "La reserva debe comenzar y finalizar en el mismo día.",
    };
  }

  // Regla: Horario de operación estricto (07:00 a 21:00)
  const startHour = start.getHours();
  const endHour = end.getHours();

  if (startHour < 7) {
    return {
      isValid: false,
      error: "El coworking inicia operaciones a las 07:00.",
    };
  }

  if (endHour > 21 || (endHour === 21 && (end.getMinutes() > 0 || end.getSeconds() > 0))) {
    return {
      isValid: false,
      error: "El coworking finaliza operaciones a las 21:00. La reserva debe terminar a más tardar a las 21:00.",
    };
  }

  const diffInMs = end.getTime() - start.getTime();
  if (diffInMs <= 0) {
    return {
      isValid: false,
      error: "La hora de finalización debe ser posterior a la hora de inicio.",
    };
  }

  const diffInHours = diffInMs / (1000 * 60 * 60);

  // Regla: Duración estricta (1 a 4 horas completas)
  if (diffInHours < 1 || diffInHours > 4 || !Number.isInteger(diffInHours)) {
    return {
      isValid: false,
      error: "La duración de la reserva debe ser de mínimo 1 hora y máximo 4 horas completas.",
    };
  }

  const totalHours = diffInHours;

  return {
    isValid: true,
    startTime: start,
    endTime: end,
    totalHours,
  };
}

// 4. Validación de Espacios (Catálogo Admin)
export function validateSpaceData(data: Partial<SpaceInput>): ValidationResult {
  if (!data.name || data.name.trim().length < 3) {
    return {
      isValid: false,
      error: "El nombre del espacio debe tener al menos 3 caracteres.",
    };
  }

  if (!data.description || data.description.trim().length < 10) {
    return {
      isValid: false,
      error: "La descripción debe tener al menos 10 caracteres.",
    };
  }

  if (!data.type || data.type.trim().length === 0) {
    return {
      isValid: false,
      error: "Debes seleccionar un tipo de espacio.",
    };
  }

  if (typeof data.capacity !== "number" || data.capacity < 1) {
    return {
      isValid: false,
      error: "La capacidad debe ser un número entero mayor a 0.",
    };
  }

  if (typeof data.pricePerHour !== "number" || data.pricePerHour <= 0) {
    return {
      isValid: false,
      error: "El precio por hora debe ser mayor a 0.",
    };
  }

  if (!data.imageUrl || !data.imageUrl.startsWith("http")) {
    return {
      isValid: false,
      error: "Debes proporcionar una URL de imagen válida (http/https).",
    };
  }

  return { isValid: true };
}
