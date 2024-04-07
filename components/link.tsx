/**
 * Next.js Link component prefetches all the links on the page.
 * Prefetching causes the hosting bill to increase.
 * This is a custom implementation
 * - to disable prefetching by default at places where it is not needed.
 * - to explicitly enable prefetching where it is needed.
 * Some examples are:
 * - Links in the footer
 * - Low traffic pages
 * - Low interaction links that are not part of the main flow of the app like: profile, settings, etc.
 */
import VercelLink from "next/link";
import { LinkProps as VercelLinkProps } from "next/link";

type LinkProps = Omit<VercelLinkProps, "prefetch">;

export const PrefetchLink = ({ ...props }: LinkProps) => {
  return <VercelLink {...props} prefetch={true} />;
  // Prefetch is enabled by default, this is just to make it explicit
};

export const Link = ({ ...props }: LinkProps) => {
  return <VercelLink prefetch={false} {...props} />;
};
