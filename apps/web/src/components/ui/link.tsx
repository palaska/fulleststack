/**
 * TODO: Update this component to use your client-side framework's link
 * component. We've provided examples of how to do this for Next.js, Remix, and
 * Inertia.js in the Catalyst documentation:
 *
 * https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import type { LinkComponentProps } from "@tanstack/react-router";

import * as Headless from "@headlessui/react";
import { Link as TanstackLink } from "@tanstack/react-router";
import React from "react";

export function Link(
  props: LinkComponentProps,
) {
  return (
    <Headless.DataInteractive>
      <TanstackLink {...props} />
    </Headless.DataInteractive>
  );
}

export function ExternalLink(
  props: React.ComponentProps<"a">,
) {
  return (
    <Headless.DataInteractive>
      <a {...props} />
    </Headless.DataInteractive>
  );
}
