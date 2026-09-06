export function Topbar() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-3 sm:px-6">
        <p className="text-sm font-medium text-muted-foreground">
          {"Creates by "}
          <a
            href="https://linkedin.com/in/amarmohanty"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Amar Mohanty
          </a>
        </p>
      </div>
    </header>
  )
}
