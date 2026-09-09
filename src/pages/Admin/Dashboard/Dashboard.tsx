import React, { useEffect, useState } from 'react';
import { dashboardService, DashboardMetrics, EventoOcupacion, AlertaStock } from '../../../services/dashboardService';
import { Card, CardContent, CardHeader, Table, Thead, Tbody, Tr, Th, Td, Badge, Skeleton } from '../../../components/UI';
import { DollarSign, Ticket, Users, Calendar, AlertTriangle, ArrowDownCircle, CheckCircle2 } from 'lucide-react';

const MetricCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, trend?: string, loading?: boolean }> = ({ title, value, icon, trend, loading }) => (
    <Card className="hover:border-blue-500/50 transition-colors">
        <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
                {loading ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                    <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
                )}
            </div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [ocupacion, setOcupacion] = useState<EventoOcupacion[]>([]);
    const [alertas, setAlertas] = useState<AlertaStock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [m, o, a] = await Promise.all([
                    dashboardService.getMetrics(),
                    dashboardService.getOcupacionEventos(),
                    dashboardService.getAlertasStock()
                ]);
                setMetrics(m);
                setOcupacion(o);
                setAlertas(a);
            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

    return (
        <div className="p-6 text-gray-200 animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                <p className="text-gray-400 mt-1">Resumen general y métricas del sistema.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Total Recaudado" 
                    value={metrics ? formatCurrency(metrics.totalRecaudado) : ''} 
                    icon={<DollarSign className="w-6 h-6" />} 
                    loading={loading}
                />
                <MetricCard 
                    title="Ventas del Día" 
                    value={metrics ? formatCurrency(metrics.ventasDelDia) : ''} 
                    icon={<DollarSign className="w-6 h-6" />} 
                    loading={loading}
                />
                <MetricCard 
                    title="Entradas Vendidas" 
                    value={metrics?.entradasVendidas || 0} 
                    icon={<Ticket className="w-6 h-6" />} 
                    loading={loading}
                />
                <MetricCard 
                    title="Entradas Validadas" 
                    value={metrics?.entradasValidadas || 0} 
                    icon={<CheckCircle2 className="w-6 h-6" />} 
                    loading={loading}
                />
                <MetricCard 
                    title="Devoluciones" 
                    value={metrics?.devoluciones || 0} 
                    icon={<ArrowDownCircle className="w-6 h-6" />} 
                    loading={loading}
                />
                <MetricCard 
                    title="Usuarios Activos" 
                    value={metrics?.usuariosActivos || 0} 
                    icon={<Users className="w-6 h-6" />} 
                    loading={loading}
                />
                <MetricCard 
                    title="Eventos Activos" 
                    value={metrics?.eventosActivos || 0} 
                    icon={<Calendar className="w-6 h-6" />} 
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Ocupación por Evento</h3>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-4 space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Evento</Th>
                                        <Th>Vendidas / Total</Th>
                                        <Th>Ocupación</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {ocupacion.map((o) => (
                                        <Tr key={o.eventoId}>
                                            <Td className="font-medium text-white">{o.titulo}</Td>
                                            <Td>{o.entradasVendidas} / {o.capacidadTotal}</Td>
                                            <Td>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${o.porcentajeOcupacion > 90 ? 'bg-red-500' : o.porcentajeOcupacion > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                                            style={{ width: `${Math.min(o.porcentajeOcupacion, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-400 w-8">{o.porcentajeOcupacion}%</span>
                                                </div>
                                            </Td>
                                        </Tr>
                                    ))}
                                    {ocupacion.length === 0 && (
                                        <Tr>
                                            <Td className="text-center text-gray-500 py-6" colSpan={3}>No hay datos de ocupación.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Alertas de Stock
                        </h3>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-4 space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Evento</Th>
                                        <Th>Tipo Ticket</Th>
                                        <Th>Stock Restante</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {alertas.map((a, i) => (
                                        <Tr key={i}>
                                            <Td className="font-medium text-white">{a.eventoTitulo}</Td>
                                            <Td><Badge variant="default">{a.tipoTicketNombre}</Badge></Td>
                                            <Td><Badge variant="danger">{a.stockDisponible} restantes</Badge></Td>
                                        </Tr>
                                    ))}
                                    {alertas.length === 0 && (
                                        <Tr>
                                            <Td className="text-center text-gray-500 py-6" colSpan={3}>No hay alertas de stock bajo.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
