import Sidebar from './Sidebar';
import { useDoctorStore } from '../store/useDoctorStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const activePatient = useDoctorStore(state => state.getActivePatient());

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header Placeholder (Global to dashboard) */}
                <div className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shrink-0 justify-between">
                    <div>
                        {activePatient ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-[#25418F] bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                                    Current Patient: {activePatient.name} (Age {activePatient.age})
                                </span>
                            </div>
                        ) : (
                            <div className="text-sm font-bold text-slate-400">Welcome, Doctor</div>
                        )}
                    </div>
                    {/* Header content varies per page, so we can inject dynamically or handle in pages */}
                    <div className="flex items-center justify-end">
                        {/* User profile common area */}
                        <div className="flex items-center gap-4">
                            {/* Could add a global Notifications icon, User Profile etc. */}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
