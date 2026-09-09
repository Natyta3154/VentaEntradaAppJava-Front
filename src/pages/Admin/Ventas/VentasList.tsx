import React, { useEffect, useState } from 'react';
import { adminVentasService, AdminCompra, AdminEntrada } from '../../../services/adminVentasService';
import { RefreshCcw, Search, Info, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table, Thead, Tbody, Tr, Th, Td, Badge, ConfirmModal, TableSkeleton, FilterBar, EmptyState } from '../../../components/UI';

const VentasList = () => {
    const [activeTab, setActiveTab] = useState<'compras' | 'entradas'>('compras');
    
    const [compras, setCompras] = useState<AdminCompra[]>([]);
    const [entradas, setEntradas] = useState<AdminEntrada[]>([]);
    const [loading, setLoading] = useState(true);

    const [showRefundModal, setShowRefundModal] = useState(false);
    const [compraToRefund, setCompraToRefund] = useState<AdminCompra | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [compraToDelete, setCompraToDelete] = useState<AdminCompra | null>(null);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [compraToView, setCompraToView] = useState<AdminCompra | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'compras') {
                const data = await adminVentasService.getCompras(0, 100);
                setCompras(Array.isArray(data) ? data : (data.content || []));
            } else {
                const data = await adminVentasService.getEntradas(0, 100);
                setEntradas(Array.isArray(data) ? data : (data.content || []));
            }
        } catch (error) {
            console.error(`Error cargando ${activeTab}:`, error);
            toast.error("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const confirmRefund = (compra: AdminCompra) => {
        setCompraToRefund(compra);
        setShowRefundModal(true);
    };

    const handleRefund = async () => {
        if (!compraToRefund) return;

        try {
            await adminVentasService.procesarDevolucion(compraToRefund.id);
            toast.success('Devolución procesada con éxito');
            loadData();
        } catch (error: any) {
            toast.error(error.response?.data?.mensaje || 'Error al procesar la devolución');
        } finally {
            setShowRefundModal(false);
            setCompraToRefund(null);
        }
    };

    const confirmDelete = (compra: AdminCompra) => {
        setCompraToDelete(compra);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!compraToDelete) return;

        try {
            await adminVentasService.eliminarCompra(compraToDelete.id);
            toast.success('Compra eliminada con éxito');
            loadData();
        } catch (error: any) {
            toast.error(error.response?.data?.mensaje || 'Error al eliminar la compra');
        } finally {
            setShowDeleteModal(false);
            setCompraToDelete(null);
        }
    };

    const viewInfo = (compra: AdminCompra) => {
        setCompraToView(compra);
        setShowInfoModal(true);
    };


    const getEstadoCompraBadge = (estado: string) => {
        switch (estado) {
            case 'COMPLETADA': return <Badge variant="success">Completada</Badge>;
            case 'REEMBOLSADA': return <Badge variant="danger">Reembolsada</Badge>;
            default: return <Badge variant="warning">{estado}</Badge>;
        }
    };

    const getEstadoEntradaBadge = (estado: string) => {
        switch (estado) {
            case 'VENDIDA': return <Badge variant="warning">No Validada</Badge>;
            case 'VALIDADA': return <Badge variant="success">Validada</Badge>;
            case 'ANULADA': return <Badge variant="danger">Anulada</Badge>;
            default: return <Badge variant="default">{estado}</Badge>;
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

    const filteredCompras = compras.filter(c => 
        c.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.usuarioEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEntradas = entradas.filter(e => 
        e.eventoNombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.id.toString().includes(searchTerm)
    );

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Ventas y Entradas</h2>
                    <p className="text-gray-400 mt-1">Supervisa transacciones y tickets emitidos.</p>
                </div>
                
                <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                    <button 
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            activeTab === 'compras' 
                            ? 'bg-blue-600 text-white shadow' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveTab('compras')}
                    >
                        Compras
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                            activeTab === 'entradas' 
                            ? 'bg-blue-600 text-white shadow' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveTab('entradas')}
                    >
                        Entradas
                    </button>
                </div>
            </div>
            
            <FilterBar 
                onSearch={setSearchTerm} 
                placeholder={activeTab === 'compras' ? "Buscar comprador o email..." : "Buscar entrada, evento o usuario..."} 
            />
            
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} columns={6} />
                ) : activeTab === 'compras' ? (
                    filteredCompras.length === 0 ? (
                        <EmptyState 
                            title="No hay compras" 
                            description="No se encontraron registros de compras con los filtros actuales."
                        />
                    ) : (
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Comprador</Th>
                                    <Th>Email</Th>
                                    <Th>Fecha</Th>
                                    <Th>Total</Th>
                                    <Th>Estado</Th>
                                    <Th className="text-right">Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredCompras.map((compra) => (
                                    <Tr key={compra.id}>
                                        <Td className="text-gray-400">#{compra.id}</Td>
                                        <Td className="font-medium text-white">{compra.usuarioNombre}</Td>
                                        <Td className="text-gray-400">{compra.usuarioEmail}</Td>
                                        <Td>{new Date(compra.fechaCompra).toLocaleString()}</Td>
                                        <Td className="font-medium text-green-400">{formatCurrency(compra.total)}</Td>
                                        <Td>{getEstadoCompraBadge(compra.estado)}</Td>
                                        <Td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {compra.estado === 'COMPLETADA' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => viewInfo(compra)}
                                                            title="Ver Info"
                                                            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-blue-400 hover:text-white hover:bg-blue-500 rounded transition-colors"
                                                        >
                                                            <Info className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => confirmRefund(compra)}
                                                            title="Reembolsar"
                                                            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-red-400 hover:text-white hover:bg-red-500 rounded transition-colors"
                                                        >
                                                            <RefreshCcw className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => confirmDelete(compra)}
                                                        title="Eliminar"
                                                        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )
                ) : (
                    filteredEntradas.length === 0 ? (
                        <EmptyState 
                            title="No hay entradas" 
                            description="No se encontraron registros de entradas con los filtros actuales."
                        />
                    ) : (
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Token / ID</Th>
                                    <Th>Evento</Th>
                                    <Th>Tipo</Th>
                                    <Th>Propietario</Th>
                                    <Th>ID Compra</Th>
                                    <Th>Estado</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredEntradas.map((entrada) => (
                                    <Tr key={entrada.id}>
                                        <Td className="font-mono text-xs text-blue-400">{`#${entrada.id}`}</Td>
                                        <Td className="font-medium text-white">{entrada.eventoNombre}</Td>
                                        <Td>{entrada.tipoEntradaNombre}</Td>
                                        <Td>{entrada.usuarioNombre}</Td>
                                        <Td className="text-gray-400">#{entrada.compraId}</Td>
                                        <Td>{getEstadoEntradaBadge(entrada.estado)}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )
                )}
            </div>

            <ConfirmModal 
                isOpen={showRefundModal}
                title="Procesar Devolución"
                message={`¿Estás seguro que deseas reembolsar la compra #${compraToRefund?.id} por ${compraToRefund ? formatCurrency(compraToRefund.total) : ''}? Esta acción es irreversible y devolverá el dinero a través de Mercado Pago, invalidando las entradas asociadas.`}
                confirmText="Sí, Reembolsar"
                onConfirm={handleRefund}
                onCancel={() => {
                    setShowRefundModal(false);
                    setCompraToRefund(null);
                }}
                isDestructive={true}
            />

            <ConfirmModal 
                isOpen={showDeleteModal}
                title="Eliminar Compra"
                message={`¿Estás seguro que deseas eliminar la compra #${compraToDelete?.id} de ${compraToDelete?.usuarioNombre}? Al no estar completada, se eliminará el registro.`}
                confirmText="Sí, Eliminar"
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setCompraToDelete(null);
                }}
                isDestructive={true}
            />

            {showInfoModal && compraToView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">Detalles de la Compra #{compraToView.id}</h3>
                            <button 
                                onClick={() => setShowInfoModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Comprador</p>
                                <p className="font-medium text-white">{compraToView.usuarioNombre}</p>
                                <p className="text-sm text-gray-300">{compraToView.usuarioEmail}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Fecha</p>
                                    <p className="text-white">{new Date(compraToView.fechaCompra).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Estado</p>
                                    <div>{getEstadoCompraBadge(compraToView.estado)}</div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Mercado Pago ID</p>
                                <p className="font-mono text-sm text-blue-400">{compraToView.mercadoPagoId || 'N/A'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-700 mt-2 flex justify-between items-center">
                                <span className="font-semibold text-gray-300">Total pagado:</span>
                                <span className="text-xl font-bold text-green-400">{formatCurrency(compraToView.total)}</span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-700 flex justify-end">
                            <button 
                                onClick={() => setShowInfoModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VentasList;
