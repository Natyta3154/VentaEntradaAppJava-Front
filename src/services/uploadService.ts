import api from '../api/api';

/**
 * Sube una imagen al servidor (el cual la sube a Cloudinary).
 * @param file El archivo seleccionado del input de tipo file
 * @returns La URL de la imagen subida
 */
export const uploadImage = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data.url;
    } catch (error) {
        console.error("Error subiendo la imagen:", error);
        throw error;
    }
};
