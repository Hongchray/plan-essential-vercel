export default function ForbiddenPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-600">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Forbidden</h2>
        <p className="mt-2 text-gray-600">
          Sorry, you don’t have permission to access this page.
        </p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="/event"
            className="rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition"
          >
            Go Home
          </a>
          <a
            href="/login"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Login Again
          </a>
        </div>
      </div>
    </main>
  );
}
