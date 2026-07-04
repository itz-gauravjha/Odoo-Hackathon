import React from 'react';

export default function PayrollRegistry({ payrollData, onUpdateSalary }) {
  return (
    <div className="glass-panel">
      <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-4">Payroll Administrator</h3>
      
      <div className="table-container mt-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">
              <th className="pb-3">Employee</th>
              <th className="pb-3">Role / Dept</th>
              <th className="pb-3">Basic</th>
              <th className="pb-3">Allowances</th>
              <th className="pb-3">Deductions</th>
              <th className="pb-3">Net Take-Home</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map(item => (
              <tr key={item._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                <td className="py-4">
                  <div className="font-semibold text-slate-300">{item.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.employeeId}</div>
                </td>
                <td className="py-4 text-slate-300">
                  <div>{item.jobTitle}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.department}</div>
                </td>
                <td className="py-4 font-mono text-slate-200">${item.salaryStructure.basic.toLocaleString()}</td>
                <td className="py-4 font-mono text-slate-200">${item.salaryStructure.allowances.toLocaleString()}</td>
                <td className="py-4 font-mono text-red-400">${item.salaryStructure.deductions.toLocaleString()}</td>
                <td className="py-4 font-mono text-emerald-400 font-bold">${item.salaryStructure.netSalary.toLocaleString()}</td>
                <td className="py-4">
                  <button 
                    onClick={() => onUpdateSalary(item)} 
                    className="rounded border border-indigo-500/25 bg-indigo-500/5 px-2.5 py-1.5 text-[10px] font-bold text-indigo-300 hover:bg-indigo-500/10"
                  >
                    💵 Update Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
