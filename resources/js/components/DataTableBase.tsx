import React, { forwardRef } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';

// Import CSS bawaan
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-select-dt/css/select.dataTables.min.css';

DataTable.use(DT);

interface DataTableBaseProps {
    data: any[];
    columns: any[];
    options?: any;
}

// Pakai forwardRef supaya kita bisa akses fungsi .dt() dari parent (UserList)
const DataTableBase = forwardRef<any, DataTableBaseProps>(({ data, columns, options }, ref) => {
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
                table.dataTable tbody td.select-checkbox:before { border: 1px solid white !important; }
                .dataTables_info, .dataTables_paginate { color: #888 !important; margin-top: 15px !important; }
                .paginate_button { color: white !important; }
            `}</style>

            <DataTable 
                ref={ref}
                data={data} 
                columns={columns} 
                className="display" 
                options={{
                    responsive: true,
                    autoWidth: false,
                    ...options // Gabungkan dengan opsi tambahan dari parent
                }} 
            />
        </div>
    );
});

export default DataTableBase;