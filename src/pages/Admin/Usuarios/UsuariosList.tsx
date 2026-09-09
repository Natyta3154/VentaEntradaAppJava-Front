import React, { useEffect, useState } from 'react';
import { usuarioService, Usuario } from '../../../services/usuarioService';
import UsuarioRolModal from './UsuarioRolModal';
import EditarUsuarioModal from './EditarUsuarioModal';
import { Table, Thead, Tbody, Tr, Th, Td, Badge, TableSkeleton, FilterBar, EmptyState } from '../../../components/UI';
import { Shield, ShieldAlert, ShieldCheck, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modals state
    const [showRolModal, setShowRolModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [usuarioSelected, setUsuarioSelected] = useState<Usuario | undefined>(undefined);
    
    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsuarios = async () => {
        setLoading(true);
        try {
            const data = await usuarioService.getUsuarios(0, 100);
            if ('content' in data) {
                setUsuarios(data.content);
            } else {
                setUsuarios(data);
            }
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            toast.error("Error al cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    const handleRolEdit = (usuario: Usuario) => {
        setUsuarioSelected(usuario);
        setShowRolModal(true);
    };
    
    const handleEdit = (usuario: Usuario) => {
        setUsuarioSelected(usuario);
        setShowEditModal(true);
    };

    const handleDelete = async (usuario: Usuario) => {
        const nombreCompleto = usuario.nombre || usuario.apellido 
            ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() 
            : usuario.email;

        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${nombreCompleto}?`)) {
            try {
                await usuarioService.eliminarUsuario(usuario.id);
                toast.success("Usuario eliminado correctamente");
                loadUsuarios();
            } catch (error) {
                console.error("Error eliminando usuario", error);
                toast.error("Error al eliminar el usuario");
            }
        }
    };

    const handleRolModalSuccess = () => {
        setShowRolModal(false);
        loadUsuarios();
        toast.success("Rol actualizado correctamente");
    };

    const handleEditModalSuccess = () => {
        setShowEditModal(false);
        loadUsuarios();
        toast.success("Usuario editado correctamente");
    };

    const getRolBadge = (rol: string) => {
        switch (rol) {
            case 'ROLE_ADMIN':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Admin
                    </span>
                );
            case 'ROLE_PORTERO':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Staff / Validador
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        <Shield className="w-3.5 h-3.5" />
                        Cliente
                    </span>
                );
        }
    };

    const filteredUsuarios = usuarios.filter(u => {
        const term = searchTerm.toLowerCase();
        const fullName = `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase();
        return (
            fullName.includes(term) ||
            u.nombre?.toLowerCase().includes(term) || 
            u.apellido?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestión de Usuarios</h2>
                    <p className="text-gray-400 mt-1">Administra los roles y permisos del sistema.</p>
                </div>
            </div>
            
            <FilterBar 
                onSearch={setSearchTerm} 
                placeholder="Buscar por nombre, apellido o email..." 
            />

            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} columns={4} />
                ) : filteredUsuarios.length === 0 ? (
                    <EmptyState 
                        title="No hay usuarios" 
                        description="No se encontraron usuarios con los filtros actuales."
                    />
                ) : (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Usuario</Th>
                                <Th>Email</Th>
                                <Th>Rol y Permisos</Th>
                                <Th className="text-right">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredUsuarios.map((usuario) => {
                                const tieneNombreOApellido = Boolean(usuario.nombre?.trim() || usuario.apellido?.trim());
                                const nombreCompleto = tieneNombreOApellido
                                    ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
                                    : 'Sin nombre';
                                const inicialAvatar = (usuario.nombre?.trim()?.charAt(0) || usuario.email.charAt(0)).toUpperCase();

                                return (
                                    <Tr key={usuario.id}>
                                        <Td className="text-gray-400">#{usuario.id}</Td>
                                        <Td className="font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                                    {inicialAvatar}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {nombreCompleto}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{usuario.email}</div>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td>{usuario.email}</Td>
                                        <Td>{getRolBadge(usuario.rol)}</Td>
                                        <Td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(usuario)}
                                                    className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded transition-colors"
                                                    title="Editar Usuario"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleRolEdit(usuario)}
                                                    className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded transition-colors"
                                                    title="Cambiar Rol"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(usuario)}
                                                    className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded transition-colors"
                                                    title="Eliminar Usuario"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                )}
            </div>

            {showRolModal && usuarioSelected && (
                <UsuarioRolModal 
                    usuario={usuarioSelected} 
                    onClose={() => setShowRolModal(false)} 
                    onSuccess={handleRolModalSuccess} 
                />
            )}
            
            {showEditModal && usuarioSelected && (
                <EditarUsuarioModal 
                    usuario={usuarioSelected} 
                    onClose={() => setShowEditModal(false)} 
                    onSuccess={handleEditModalSuccess} 
                />
            )}
        </div>
    );
};

export default UsuariosList;
