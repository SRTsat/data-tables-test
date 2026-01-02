import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';

DataTable.use(DT);

interface DataTableBaseProps {
    columns: any[];
    ajaxUrl?: string | object;
    options?: any;
    data?: any[];
}

const DataTableBase = forwardRef<any, DataTableBaseProps>(
    ({ columns, ajaxUrl, options, data }, ref) => {

        // ✅ ref internal yang PASTI punya .current
        const internalRef = useRef<any>(null);

        // ✅ expose internalRef ke parent
        useImperativeHandle(ref, () => internalRef.current);

        useEffect(() => {
            if (!internalRef.current) return;

            // Ambil element table asli lewat jQuery
            const table = $(internalRef.current).find('table');

            const handleEdit = function (this: any, e: any) {
                e.preventDefault();
                const rowData = internalRef.current
                    .dt()
                    .row($(this).closest('tr'))
                    .data();

                if (options?.onEdit) options.onEdit(rowData);
            };

            const handleDelete = function (this: any, e: any) {
                e.preventDefault();
                const id = $(this).data('id');
                if (options?.onDelete) options.onDelete(id);
            };

            table.on('click', '.btn-edit', handleEdit);
            table.on('click', '.btn-delete', handleDelete);

            return () => {
                table.off('click', '.btn-edit', handleEdit);
                table.off('click', '.btn-delete', handleDelete);
            };
        }, [options?.onEdit, options?.onDelete]);

        return (
            <div className="dt-dark-container">
                <style>{`
                    .dataTables_wrapper { color: white !important; padding: 10px 0; }
                    .dataTables_wrapper .dataTables_length select, 
                    .dataTables_wrapper .dataTables_filter input { 
                        color: white !important; background: #111 !important; border: 1px solid #333 !important; padding: 6px !important; border-radius: 4px; outline: none;
                    }
                    table.dataTable { width: 100% !important; margin: 20px 0 !important; border-collapse: collapse !important; background: transparent !important; }
                    table.dataTable thead th { 
                        color: white !important; border-bottom: 2px solid #333 !important; text-align: left !important; padding: 15px 12px !important; background: #0a0a0a !important; 
                    }
                    table.dataTable tbody td { 
                        color: #ccc !important; border-bottom: 1px solid #1a1a1a !important; padding: 12px !important; background: transparent !important;
                    }
                    table.dataTable tbody tr:hover { background: #0f172a !important; }
                    .dataTables_info, .dataTables_paginate { color: #888 !important; margin-top: 15px !important; }
                    .dataTables_processing { background: #2563eb !important; color: white !important; border-radius: 8px !important; }
                `}</style>

                <DataTable
                    ref={internalRef}
                    data={data}
                    columns={columns}
                    className="display"
                    options={{
                        serverSide: true,
                        processing: true,
                        ajax: options?.ajax || ajaxUrl,
                        responsive: true,
                        autoWidth: false,
                        language: {
                            processing: "Sabar ya bro, lagi narik data...",
                            search: "Cari:",
                            info: "Nampilin _START_ ke _END_ dari _TOTAL_ data",
                        },
                        ...options
                    }}
                />
            </div>
        );
    }
);

export default DataTableBase;
