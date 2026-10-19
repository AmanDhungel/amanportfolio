import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="container-page pt-40 pb-32 outline-none">
      <h1 className="font-serif text-h2 font-normal">This page does not exist.</h1>
      <p className="mt-4 text-muted">The link may be old, or the address may have a typo.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Go to the home page
      </Link>
    </main>
  );
}
