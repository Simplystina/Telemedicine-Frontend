import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiX, FiUploadCloud, FiFile, FiCheckCircle } from "react-icons/fi";
import FormInput from "@/features/auth/components/FormInput";
import FormSelect from "@/features/auth/components/FormSelect";
import FormDatePicker from "@/features/auth/components/FormDatePicker";
import { useUploadLabResult } from "@/features/labs/hooks/useLabs";
import type { LabResult } from "@/types";

// ---- Zod Schema ---- (matches all columns in the Health Records table)
const uploadSchema = z.object({
    title: z.string().min(2, "Document title must be at least 2 characters"),
    type: z.string().min(1, "Please select a document type"),
    date: z.date().refine((d) => d instanceof Date, { message: "Please select the document date" }),
    facilityName: z.string().min(2, "Facility name must be at least 2 characters"),
    state: z.string().min(1, "Please enter the state"),
    address: z.string().min(5, "Please enter the full address"),
    requestedBy: z.string().min(2, "Please enter the name of the doctor that requested the test"),
    notes: z.string().max(300, "Notes must be 300 characters or less").optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

const DOCUMENT_TYPE_OPTIONS = [
    { label: "Lab Result", value: "Lab Result" },
    { label: "Imaging", value: "Imaging" },
    { label: "Doctor Note", value: "Doctor Note" },
    { label: "Prescription", value: "Prescription" },
    { label: "Other", value: "Other" },
];

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    labResult?: LabResult | null;
}

function UploadDocumentModal({ isOpen, onClose, labResult }: UploadDocumentModalProps) {
    const { mutateAsync: uploadLab } = useUploadLabResult();
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fileError, setFileError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
    });

    useEffect(() => {
        if (labResult) {
            reset({
                title: labResult.testName,
                type: "Lab Result",
                date: new Date(labResult.requestedAt),
                facilityName: "",
                state: "",
                address: "",
                requestedBy: labResult.doctor ? `Dr. ${labResult.doctor.lastName}` : "",
                notes: labResult.notes || "",
            });
        }
    }, [labResult, reset]);

    if (!isOpen) return null;

    const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    const MAX_SIZE_MB = 10;

    const validateFile = (file: File): boolean => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setFileError("Only PDF, JPG, and PNG files are accepted.");
            return false;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setFileError(`File size must be under ${MAX_SIZE_MB}MB.`);
            return false;
        }
        setFileError("");
        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) setSelectedFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleClose = () => {
        reset();
        setSelectedFile(null);
        setFileError("");
        setIsSuccess(false);
        onClose();
    };

    const onSubmit = async (_data: UploadFormData) => {
        if (!selectedFile) {
            setFileError("Please select a file to upload.");
            return;
        }
        setIsSubmitting(true);
        try {
            if (labResult) {
                await uploadLab({ id: labResult.id, file: selectedFile });
            } else {
                // Simulate general upload
                await new Promise(resolve => setTimeout(resolve, 1800));
            }
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => handleClose(), 2500);
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-archivo font-bold text-neutral-900">
                            {labResult ? `Upload Result: ${labResult.testName}` : "Upload Document"}
                        </h2>
                        <p className="text-sm text-neutral-500 font-poppins mt-0.5">PDF, JPG or PNG — max 10MB</p>
                    </div>
                    <button onClick={handleClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <FiCheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold font-archivo text-neutral-900 mb-2">Document Uploaded!</h3>
                            <p className="text-neutral-500 font-poppins text-sm">Your record has been saved successfully.</p>
                        </div>
                    ) : (
                        <form id="upload-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {/* Drag & Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragOver
                                    ? "border-primary-500 bg-primary-50"
                                    : selectedFile
                                        ? "border-green-400 bg-green-50"
                                        : "border-neutral-200 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50/50"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                                />
                                {selectedFile ? (
                                    <>
                                        <FiFile className="w-10 h-10 text-green-500 mb-3" />
                                        <p className="font-semibold font-poppins text-neutral-800 text-sm text-center">{selectedFile.name}</p>
                                        <p className="text-xs text-neutral-500 font-poppins mt-1">{formatFileSize(selectedFile.size)}</p>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                            className="mt-3 text-xs text-red-500 hover:text-red-600 font-semibold font-poppins underline"
                                        >
                                            Remove file
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <FiUploadCloud className="w-10 h-10 text-neutral-400 mb-3" />
                                        <p className="font-semibold font-poppins text-neutral-700 text-sm">Drag & drop your file here</p>
                                        <p className="text-xs text-neutral-400 font-poppins mt-1">or <span className="text-primary-600 font-semibold">click to browse</span></p>
                                    </>
                                )}
                            </div>
                            {fileError && <p className="text-sm text-red-600 font-poppins -mt-2">{fileError}</p>}

                            {/* Section: Document Details */}
                            <div className="pt-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-4">Document Details</p>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormSelect
                                            label="Document Type"
                                            id="doc-type"
                                            options={DOCUMENT_TYPE_OPTIONS}
                                            placeholder="Select type..."
                                            error={errors.type?.message}
                                            {...register("type")}
                                        />
                                        <Controller
                                            name="date"
                                            control={control}
                                            render={({ field }) => (
                                                <FormDatePicker
                                                    label="Document Date"
                                                    id="doc-date"
                                                    selected={field.value ?? null}
                                                    onChange={field.onChange}
                                                    maxDate={new Date()}
                                                    placeholderText="Select date"
                                                    error={errors.date?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Facility Details */}
                            <div className="pt-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-poppins mb-4">Facility Details</p>
                                <div className="space-y-4">
                                    <FormInput
                                        label="Facility Name"
                                        type="text"
                                        id="facility-name"
                                        placeholder="e.g. Lagos University Teaching Hospital"
                                        error={errors.facilityName?.message}
                                        {...register("facilityName")}
                                    />
                                </div>
                            </div>

                            {/* Notes (optional) */}
                            <div className="pt-2">
                                <label htmlFor="doc-notes" className="block font-poppins text-sm font-semibold text-neutral-600 mb-2">
                                    Notes <span className="text-neutral-400 font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    id="doc-notes"
                                    rows={2}
                                    placeholder="Any additional context about this document..."
                                    className={`w-full px-4 py-3 border rounded-lg font-poppins text-sm text-neutral-900 placeholder-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none ${errors.notes ? "border-red-500" : "border-neutral-300"
                                        }`}
                                    {...register("notes")}
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-600 font-poppins">{errors.notes.message}</p>}
                            </div>

                        </form>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0 flex gap-3">
                        <button type="button" onClick={handleClose} className="flex-1 py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-poppins font-semibold hover:bg-neutral-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="upload-form"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-poppins font-semibold hover:bg-primary-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <><FiUploadCloud className="mr-2" /> Upload Document</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadDocumentModal;
