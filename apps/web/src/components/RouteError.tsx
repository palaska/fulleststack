import { Heading } from "@/web/components";

export function RouteError({ error }: { error: Error }) {
  console.error("RouteError", error);
  return (
    <article className="error">
      <Heading>Something went wrong</Heading>
    </article>
  );
}
