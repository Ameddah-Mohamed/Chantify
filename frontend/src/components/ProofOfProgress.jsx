export default function ProofOfProgress() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Proof of Progress</h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition">
        <span className="material-symbols-outlined text-5xl text-gray-400">cloud_upload</span>
        <p className="mt-2 text-gray-600">Drag & drop files here</p>
        <p className="text-sm text-gray-500">or click to browse</p>
      </div>

      <ul className="mt-6 space-y-4">
        <li className="flex items-center gap-4">
          <span className="material-symbols-outlined text-gray-500">description</span>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">progress-photo-1.jpg</p>
            <p className="text-xs text-gray-500">1.2 MB</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
