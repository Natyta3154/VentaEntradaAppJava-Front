import { User } from '../types';

const ALLOWED_CHECKOUT_HOSTS = [
    'www.mercadopago.com',
    'www.mercadopago.com.ar',
    'sandbox.mercadopago.com',
    'sandbox.mercadopago.com.ar',
    'mercadopago.com',
    'mercadopago.com.ar'
];

/**
 * Valida y ejecuta de forma segura una redirección a pasarelas de pago externas.
 * Previene vulnerabilidades de Open Redirect y ataques basados en esquemas (ej: javascript:).
 */
export const safeRedirectToCheckout = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== 'string') return false;

    try {
        const parsedUrl = new URL(url);

        // Exigir protocolo seguro HTTPS
        if (parsedUrl.protocol !== 'https:') {
            console.error('Intento de redirección a protocolo no seguro:', parsedUrl.protocol);
            return false;
        }

        // Validar que el dominio pertenezca a los hosts permitidos
        const isAllowed = ALLOWED_CHECKOUT_HOSTS.some(
            host => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
        );

        if (!isAllowed) {
            console.error('Host de redirección no autorizado:', parsedUrl.hostname);
            return false;
        }

        window.location.assign(parsedUrl.href);
        return true;
    } catch (err) {
        console.error('URL de checkout inválida:', err);
        return false;
    }
};

/**
 * Sanitiza objetos para inyección segura en bloques JSON-LD (<script type="application/ld+json">).
 * Evita la ruptura del contexto HTML por etiquetas de cierre prematuras como </script>.
 */
export const sanitizeJsonLd = (data: object | null | undefined): string => {
    if (!data) return '';
    return JSON.stringify(data).replace(/</g, '\\u003c');
};

/**
 * Filtra y sanitiza la estructura del usuario para almacenar únicamente los campos requeridos en memoria.
 * Evita la persistencia accidental de credenciales o metadatos sensibles del backend en el estado del cliente.
 */
export const sanitizeUser = (raw: any): User | null => {
    if (!raw || typeof raw !== 'object') return null;

    // Soportar respuestas donde el usuario viene envuelto en 'usuario' o 'user'
    const source = (raw.usuario && typeof raw.usuario === 'object')
        ? raw.usuario
        : (raw.user && typeof raw.user === 'object')
            ? raw.user
            : raw;

    let nombre = source.nombre ? String(source.nombre).trim() : (source.firstName ? String(source.firstName).trim() : undefined);
    let apellido = source.apellido ? String(source.apellido).trim() : (source.lastName ? String(source.lastName).trim() : undefined);

    // Si el backend envía nombre y apellido concatenados en 'username' (ej. LoginResponse: getNombre() + " " + getApellido())
    if ((!nombre || !apellido) && source.username && typeof source.username === 'string') {
        const parts = source.username.trim().split(/\s+/);
        if (!nombre && parts.length > 0) {
            nombre = parts[0];
        }
        if (!apellido && parts.length > 1) {
            apellido = parts.slice(1).join(' ');
        }
    }

    return {
        id: Number(source.id) || 0,
        email: String(source.email || ''),
        username: source.username ? String(source.username) : undefined,
        nombre: nombre || undefined,
        apellido: apellido || undefined,
        dni: source.dni ? String(source.dni) : undefined,
        rol: source.rol || 'CLIENTE'
    };
};

/**
 * Genera URLs seguras para recursos e imágenes con fallback por defecto siempre en HTTPS.
 */
export const getSafeResourceUrl = (path: string | undefined | null): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'https://ventaentradaappjava-back.onrender.com';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};
