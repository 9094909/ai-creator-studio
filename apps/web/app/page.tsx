import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-black bg-opacity-50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">AI Creator Studio</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="rounded px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary hover:text-secondary-foreground"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Create Content with AI
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-secondary">
            Powerful AI-powered tools for creators. Write, design, and publish amazing content in minutes.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="rounded border border-border px-8 py-3 text-lg font-medium text-foreground transition hover:bg-secondary hover:bg-opacity-10"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground">Features</h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'AI Writing Assistant',
                description: 'Get intelligent suggestions and auto-complete for your content',
              },
              {
                title: 'Content Generation',
                description: 'Generate high-quality content ideas and outlines instantly',
              },
              {
                title: 'Analytics Dashboard',
                description: 'Track your content performance and audience engagement',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-background p-6 transition hover:border-primary hover:bg-background hover:bg-opacity-50"
              >
                <h4 className="text-xl font-semibold text-foreground">{feature.title}</h4>
                <p className="mt-2 text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-foreground">Ready to get started?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary">
            Join thousands of creators using AI Creator Studio to build their next big idea.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition hover:opacity-90"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-black py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-secondary">© 2024 AI Creator Studio. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-secondary transition hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-secondary transition hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-secondary transition hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
