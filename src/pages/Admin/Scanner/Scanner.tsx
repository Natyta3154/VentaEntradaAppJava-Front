import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../../api/api';
import './Scanner.css';
import { CheckCircle, XCircle, User, Ticket, Calendar, ShieldCheck } from 'lucide-react';
import Button from '../../../components/UI/Button/Button';

interface ValidationDetails {
    usuario: string;
    email: string;
    tipo: string;
    evento: string;
}

interface ValidationResponse {
    status: 'verde' | 'rojo';
    mensaje: string;
    detalles?: ValidationDetails;
}

const Scanner = () => {
    const [scanResult, setScanResult] = useState<ValidationResponse | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [lastScanTime, setLastScanTime] = useState(0);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isScanning) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                false
            );

            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Error clearing scanner", err));
            }
        };
    }, [isScanning]);

    const onScanSuccess = async (decodedText: string) => {
        // Evitar escaneos múltiples del mismo código en segundos seguidos
        const now = Date.now();
        if (now - lastScanTime < 3000) return;

        setLastScanTime(now);
        setIsScanning(false); // Pausamos el scanner para mostrar resultado

        try {
            const response = await api.post('api/entradas/validar-qr', {
                codigo: decodedText
            });
            setScanResult(response.data);
        } catch (err: any) {
            if (err.response?.data) {
                setScanResult(err.response.data);
            } else {
                setScanResult({
                    status: 'rojo',
                    mensaje: 'ERROR DE CONEXIÓN O CÓDIGO INVÁLIDO'
                });
            }
        }
    };

    const onScanFailure = (error: any) => {
        // No mostramos errores de "no se encontró QR" para no saturar la consola
    };

    const resetScanner = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-gray-200 flex flex-col items-center py-10 px-5 font-sans">
            <header className="text-center mb-10">
                <ShieldCheck size={32} className="text-violet-500 mb-3 mx-auto" />
                <h1 className="text-3xl font-black m-0 tracking-tight text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                    VALIDADOR DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">ACCESO</span>
                </h1>
                <p className="text-gray-400 text-sm mt-2 font-medium">Personal de Puerta • NochePass</p>
            </header>

            <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    {isScanning ? (
                        <div id="reader" className="qr-reader-window"></div>
                    ) : (
                        <div className={`text-center py-5 px-3 animate-[slideUp_0.3s_ease-out] ${scanResult?.status}`}>
                            <div className="mb-6 flex justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                {scanResult?.status === 'verde' ?
                                    <CheckCircle size={80} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" /> :
                                    <XCircle size={80} className="text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
                                }
                            </div>

                            <h2 className={`text-2xl font-black mb-8 tracking-tight ${scanResult?.status === 'verde' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`}>
                                {scanResult?.mensaje}
                            </h2>

                            {scanResult?.detalles && (
                                <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-6 text-left mb-8 shadow-inner">
                                    <div className="flex gap-4 items-start mb-5 last:mb-0">
                                        <User size={18} className="text-violet-400 mt-1" />
                                        <div>
                                            <label className="block text-xs text-gray-500 font-black tracking-widest mb-1">CLIENTE</label>
                                            <p className="text-base font-semibold text-gray-200 m-0">{scanResult.detalles.usuario}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start mb-5 last:mb-0">
                                        <Ticket size={18} className="text-violet-400 mt-1" />
                                        <div>
                                            <label className="block text-xs text-gray-500 font-black tracking-widest mb-1">ENTRADA</label>
                                            <p className="text-base font-semibold text-gray-200 m-0">{scanResult.detalles.tipo}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start mb-5 last:mb-0">
                                        <Calendar size={18} className="text-violet-400 mt-1" />
                                        <div>
                                            <label className="block text-xs text-gray-500 font-black tracking-widest mb-1">EVENTO</label>
                                            <p className="text-base font-semibold text-gray-200 m-0">{scanResult.detalles.evento}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8">
                                <button 
                                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm tracking-widest rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(217,70,239,0.5)] active:translate-y-0 active:shadow-none" 
                                    onClick={resetScanner}
                                >
                                    ESCANEAR SIGUIENTE
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-auto pt-10">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold tracking-widest bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse"></span> SISTEMA EN LÍNEA
                </div>
            </footer>
        </div>
    );
};

export default Scanner;
