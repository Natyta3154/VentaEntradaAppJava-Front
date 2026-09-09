export type Role = 'ADMIN' | 'PORTERO' | 'CLIENTE';

export interface User {
    id: number;
    email: string;
    nombre?: string;
    apellido?: string;
    dni?: string;
    rol: Role;
    // Otros campos que devuelva el backend
}

export type EventStatus = 'BORRADOR' | 'PUBLICADO' | 'VENTA_ABIERTA' | 'AGOTADO' | 'SUSPENDIDO' | 'CANCELADO' | 'FINALIZADO';

export interface Artista {
    id: number;
    nombre: string;
    biografia?: string; // djService usaba biografia / descripcion
    estiloMusical?: string;
    foto?: string;
}

export interface Evento {
    id: number;
    titulo: string; // unificando titulo/nombre
    descripcion?: string;
    fecha: string; // ISO date string
    fechaFin?: string; // ISO date string
    hora?: string;
    lugar?: string;
    direccion?: string;
    ciudad?: string;
    capacidadTotal: number;
    edadMinima?: number;
    estado: EventStatus;
    imagenUrl?: string;
    precioEntrada?: number;
    artistas?: Artista[];
    tiposTickets?: TicketType[];
    createdAt?: string;
    updatedAt?: string;
}

export interface TicketType {
    id: number;
    eventoId: number;
    nombre: string; // Ej: 'General', 'VIP'
    descripcion?: string;
    precio: number;
    stockTotal: number;
    stockDisponible: number;
    stockVendido: number;
    activo: boolean; // Para "desactivar" en lugar de borrar
    fechaInicioVenta?: string;
    fechaFinVenta?: string;
    limitePorUsuario?: number;
}

export type TicketStatus = 'VENDIDA' | 'VALIDADA' | 'ANULADA' | 'REEMBOLSADA';

export interface Ticket {
    id: number;
    compraId: number;
    eventoId: number;
    tipoTicketId: number;
    usuarioId: number;
    codigoQr: string;
    estado: TicketStatus;
    fechaValidacion?: string;
}

export type PurchaseStatus = 'PENDIENTE' | 'COMPLETADA' | 'RECHAZADA' | 'DEVUELTA';

export interface Purchase {
    id: number;
    usuarioId: number;
    eventoId: number;
    mercadoPagoId?: string;
    estado: PurchaseStatus;
    montoTotal: number;
    fechaCompra: string;
    tickets: Ticket[]; // Opcionalmente hidratado
}

// Interfaz para respuestas paginadas típicas de Spring Data
export interface PaginatedResponse<T> {
    content: T[];
    pageable: any;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
