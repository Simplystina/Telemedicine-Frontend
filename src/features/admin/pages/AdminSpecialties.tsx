import { useState } from "react";
import { FiPlus, FiTrash2, FiLoader, FiGrid } from "react-icons/fi";
import { useAdminSpecialties, useCreateSpecialty, useDeleteSpecialty } from "@/features/admin/hooks/useAdmin";

function AdminSpecialties() {
    const [newName, setNewName] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { data: specialties = [], isLoading } = useAdminSpecialties();
    const { mutate: createSpecialty, isPending: isCreating } = useCreateSpecialty();
    const { mutate: deleteSpecialty, isPending: isDeleting } = useDeleteSpecialty();

    const handleCreate = () => {
        const name = newName.trim();
        if (!name) return;
        createSpecialty(name, {
            onSuccess: () => {
                setNewName("");
                setShowForm(false);
            },
        });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Specialties</h1>
                    <p className="text-neutral-600 font-poppins text-sm">Manage the medical specialties available on the platform.</p>
                </div>
                <button
                    onClick={() => setShowForm(prev => !prev)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-poppins font-semibold text-sm transition-colors shadow-sm"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Specialty
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-6">
                    <h3 className="text-base font-archivo font-bold text-neutral-900 mb-4">New Specialty</h3>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="e.g. Cardiology"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreate()}
                            autoFocus
                            className="flex-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-poppins text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={!newName.trim() || isCreating}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-poppins font-semibold text-sm transition-colors disabled:opacity-50"
                        >
                            {isCreating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiPlus className="w-4 h-4" />}
                            Create
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setNewName(""); }}
                            className="px-4 py-2.5 border border-neutral-200 text-neutral-600 rounded-xl font-poppins font-semibold text-sm hover:bg-neutral-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : specialties.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiGrid className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                        <p className="text-neutral-400 font-poppins text-sm">No specialties yet. Add one above.</p>
                    </div>
                ) : (
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {specialties.map(specialty => (
                            <div
                                key={specialty.id}
                                className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:border-neutral-200 hover:bg-neutral-50 transition-all group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                        <FiGrid className="w-4 h-4 text-primary-500" />
                                    </div>
                                    <p className="text-sm font-semibold font-poppins text-neutral-900">{specialty.name}</p>
                                </div>

                                {confirmDelete === String(specialty.id) ? (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => deleteSpecialty(String(specialty.id), { onSuccess: () => setConfirmDelete(null) })}
                                            disabled={isDeleting}
                                            className="text-xs px-2.5 py-1 bg-red-500 text-white rounded-lg font-poppins font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                                        >
                                            {isDeleting ? "…" : "Yes"}
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(null)}
                                            className="text-xs px-2.5 py-1 border border-neutral-200 text-neutral-600 rounded-lg font-poppins font-semibold hover:bg-neutral-100 transition-colors"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(String(specialty.id))}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all shrink-0"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
                    <p className="text-sm font-poppins text-neutral-500">{specialties.length} {specialties.length === 1 ? "specialty" : "specialties"} configured</p>
                </div>
            </div>
        </div>
    );
}

export default AdminSpecialties;
