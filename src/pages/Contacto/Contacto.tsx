import React, { useState } from 'react';
import './Contacto.css';
import { contactoService, MensajeContacto } from '../../services/contactoService';
import Button from '../../components/UI/Button/Button';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SEO from '../../components/SEO/SEO';

const Contacto = () => {
    const [formData, setFormData] = useState<MensajeContacto>({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await contactoService.enviarMensaje(formData);
            toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.');
            setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            toast.error('Ocurrió un error al enviar tu mensaje. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contacto-page">
            <SEO
                title="Contacto"
                description="Ponte en contacto con EntradaYa para consultas, reservas VIP, eventos privados y dudas sobre compra de entradas."
                keywords="contacto, EntradaYa, eventos, EntradaYa, reservas, EntradaYa, consultas, EntradaYa, dudas sobre compra de entradas, EntradaYa"
            />
            <div className="contacto-header">
                <h1 className="glitch" data-text="CONTÁCTANOS">CONTÁCTANOS</h1>
                <p className="subtitle">¿Tienes alguna duda o consulta? Estamos aquí para ayudarte.</p>
            </div>

            <div className="contacto-container">
                <div className="contacto-info-wrapper">
                    <div className="info-card">
                        <div className="info-icon">
                            <MapPin size={24} />
                        </div>
                        <div className="info-content">
                            <h3>Ubicación</h3>
                            <p>Calle Falsa 123, Ciudad de la Furia, Argentina</p>
                        </div>
                    </div>
                    
                    <div className="info-card">
                        <div className="info-icon">
                            <Phone size={24} />
                        </div>
                        <div className="info-content">
                            <h3>Teléfono</h3>
                            <p>+54 11 1234-5678</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <Mail size={24} />
                        </div>
                        <div className="info-content">
                            <h3>Email</h3>
                            <p>info@vibrafestival.com</p>
                        </div>
                    </div>
                </div>

                <div className="contacto-form-wrapper">
                    <form className="contacto-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre Completo</label>
                            <input 
                                type="text" 
                                id="nombre" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                required 
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="asunto">Asunto</label>
                            <input 
                                type="text" 
                                id="asunto" 
                                name="asunto" 
                                value={formData.asunto} 
                                onChange={handleChange} 
                                required 
                                placeholder="Motivo de tu consulta"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea 
                                id="mensaje" 
                                name="mensaje" 
                                value={formData.mensaje} 
                                onChange={handleChange} 
                                required 
                                placeholder="Escribe tu mensaje aquí..."
                                rows={5}
                            ></textarea>
                        </div>

                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={isSubmitting}
                            className="submit-btn"
                        >
                            {isSubmitting ? 'Enviando...' : (
                                <>
                                    <Send size={18} style={{ marginRight: '8px' }}/>
                                    Enviar Mensaje
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contacto;
