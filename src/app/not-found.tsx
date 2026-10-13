export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center dark:bg-black">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          The page you were looking for does not exist.
        </p>
      </div>
    </main>
  );
}
