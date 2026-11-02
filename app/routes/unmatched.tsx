/** Any address that no route claims is a 404; the root error boundary renders the page. */
export default function Unmatched() {
  throw new Response(null, { status: 404 });
}
