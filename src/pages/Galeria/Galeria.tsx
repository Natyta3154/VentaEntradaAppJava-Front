// 1. IMPORTANTE: Agregamos useState aquí
import React, { useState } from 'react'; 
import { useGaleria } from '../../hooks/useGaleria';
import './Galeria.css';

const Galeria = () => {
  const { media, loading } = useGaleria();
  
  // Estado para controlar qué imagen se ve en grande
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (loading) return (
    <div className="galeria-loader">
      <div className="spinner"></div>
      <p>Cargando Experiencias...</p>
    </div>
  );

  return (
    <section className="galeria-section">
      <div className="galeria-header">
        <span className="subtitle">Nuestros Recuerdos</span>
        <h2 className="galeria-title">Momentos de los eventos</h2>
        <div className="title-underline"></div>
      </div>

      <div className="galeria-grid">
        {media.length > 0 ? (
          media.map((item) => (
            <div 
              key={item.id} 
              className="galeria-item"
              // 2. Agregamos el evento clic para abrir la imagen
              onClick={() => !item.es_video && setSelectedImg(item.archivo_url)}
            >
              <div className="media-container">
                {item.es_video ? (
                  <>
                    <video src={item.archivo_url} className="galeria-media" muted />
                    <div className="video-badge">▶</div>
                  </>
                ) : (
                  <img 
                    src={item.archivo_url} 
                    alt={item.titulo} 
                    className="galeria-media"
                    loading="lazy"
                  />
                )}
                
                <div className="galeria-overlay">
                  <div className="overlay-content">
                    <p className="item-category">{item.es_video ? 'Video' : 'Imagen'}</p>
                    <h3 className="item-title">{item.titulo.replace(/"/g, '')}</h3>
                    {/*<div className="view-button">
                        {item.es_video ? 'Reproducir' : 'Ver en grande'}
                    </div>*/}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-container">
            <p className="no-data">La galería está siendo preparada...</p>
          </div>
        )}
      </div>

      {/* --- MODAL LIGHTBOX (Solo se muestra si selectedImg tiene algo) --- */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={() => setSelectedImg(null)}>
          <button className="lightbox-close" onClick={() => setSelectedImg(null)}>&times;</button>
          <img 
            src={selectedImg} 
            alt="Tamaño real" 
            className="lightbox-image" 
            onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
          />
        </div>
      )}
    </section>
  );
};

export default Galeria;
