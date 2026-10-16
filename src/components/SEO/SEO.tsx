import React, { useEffect } from 'react';
import { sanitizeJsonLd } from '../../utils/security';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    schemaData?: object | null;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = 'NochePass es la plataforma para comprar entradas para las mejores fiestas, boliches y eventos exclusivos. ¡Tu Noche, Tu Entrada!',
    keywords = 'NochePass, entradas, fiestas, boliches, eventos, compra entradas, tickets, vip, reserva mesa',
    image = '/img/photo-hero.webp',
    url = window.location.href,
    schemaData = null,
}) => {
    useEffect(() => {
        // Actualizar título
        document.title = `${title} | NochePass`;

        // Helper para actualizar o crear meta tags
        const setMetaTag = (selector: string, attribute: string, value: string) => {
            let meta = document.querySelector(selector);
            if (!meta) {
                meta = document.createElement('meta');
                if (selector.startsWith('meta[name=')) {
                    const name = selector.match(/meta\[name="(.+?)"\]/)?.[1];
                    if (name) meta.setAttribute('name', name);
                } else if (selector.startsWith('meta[property=')) {
                    const prop = selector.match(/meta\[property="(.+?)"\]/)?.[1];
                    if (prop) meta.setAttribute('property', prop);
                }
                document.head.appendChild(meta);
            }
            meta.setAttribute(attribute, value);
        };

        // Actualizar descripción y keywords
        setMetaTag('meta[name="description"]', 'content', description);
        setMetaTag('meta[name="keywords"]', 'content', keywords);

        // Actualizar Open Graph
        setMetaTag('meta[property="og:title"]', 'content', `${title} | NochePass`);
        setMetaTag('meta[property="og:description"]', 'content', description);
        setMetaTag('meta[property="og:image"]', 'content', image);
        setMetaTag('meta[property="og:url"]', 'content', url);

        // Actualizar Twitter Cards
        setMetaTag('meta[name="twitter:title"]', 'content', `${title} | NochePass`);
        setMetaTag('meta[name="twitter:description"]', 'content', description);
        setMetaTag('meta[name="twitter:image"]', 'content', image);

        // Inyectar o actualizar JSON-LD Schema si se provee (sanitizado contra XSS)
        let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
        if (schemaData) {
            if (!scriptTag) {
                scriptTag = document.createElement('script');
                scriptTag.id = 'json-ld-schema';
                scriptTag.type = 'application/ld+json';
                document.head.appendChild(scriptTag);
            }
            scriptTag.textContent = sanitizeJsonLd(schemaData);
        } else if (scriptTag) {
            scriptTag.remove();
        }
    }, [title, description, keywords, image, url, schemaData]);

    return null;
};

export default SEO;
