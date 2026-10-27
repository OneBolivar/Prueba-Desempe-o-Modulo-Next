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

// 3. Validación de Fechas y Horas de Reserva
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

  if (start < now) {
    return {
      isValid: false,
      error: "No es posible reservar en fechas u horarios pasados.",
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
  if (diffInHours < 1) {
    return {
      isValid: false,
      error: "El tiempo mínimo de reserva es de 1 hora.",
    };
  }

  const totalHours = Math.ceil(diffInHours);

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