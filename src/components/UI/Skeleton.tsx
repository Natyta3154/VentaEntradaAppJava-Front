import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`}></div>
);

export const TableSkeleton: React.FC<{ rows?: number, columns?: number }> = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="w-full">
            <div className="flex border-b border-gray-700 bg-gray-900/50">
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="flex-1 px-6 py-3">
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex border-b border-gray-800">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className="flex-1 px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
