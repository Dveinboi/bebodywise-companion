/** Full-screen backdrop + centered panel shared by the app's modals. */
export default function ModalShell({ maxWidth = 'max-w-lg', rounded = 'rounded-3xl', children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} bg-[#091117] border border-[#1A2F3D] ${rounded} shadow-2xl overflow-hidden my-8`}
      >
        {children}
      </div>
    </div>
  );
}
