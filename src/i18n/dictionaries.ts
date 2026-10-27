export type Locale = "es" | "en";

export const dictionaries = {
  es: {
    nav: {
      explore: "Explorar Espacios",
      myBookings: "Mis Reservas",
      adminPanel: "Panel Admin",
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Salir",
    },
    home: {
      tag: "Disponibilidad en tiempo real",
      title: "Espacios diseñados para tu enfoque",
      subtitle: "Reserva escritorios compartidos, oficinas privadas y cabinas insonorizadas por hora sin contratos permanentes.",
      filterType: "Tipo de espacio",
      allTypes: "Todos los tipos",
      filterCapacity: "Capacidad mínima",
      filterPrice: "Precio máx. hora",
      resetFilters: "Restablecer",
      perHour: "Tarifa por hora",
      bookBtn: "Reservar",
      emptyState: "No se encontraron espacios con los filtros indicados.",
    },
  },
  en: {
    nav: {
      explore: "Explore Spaces",
      myBookings: "My Bookings",
      adminPanel: "Admin Panel",
      login: "Log In",
      register: "Sign Up",
      logout: "Log Out",
    },
    home: {
      tag: "Real-time availability",
      title: "Spaces designed for your focus",
      subtitle: "Book shared desks, private offices, and soundproof pods by the hour with zero long-term commitments.",
      filterType: "Space Type",
      allTypes: "All types",
      filterCapacity: "Min. Capacity",
      filterPrice: "Max. Price / hr",
      resetFilters: "Reset Filters",
      perHour: "Hourly rate",
      bookBtn: "Book Now",
      emptyState: "No spaces match your selected criteria.",
    },
  },
} as const;