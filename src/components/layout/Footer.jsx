import Link from "next/link";
import Logo from "@/components/brand/Logo";
import Container from "./Container";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { allRoutes, contact, site } from "@/content/site";

/**
 * Footer: a thin closing row and nothing else.
 *
 * The large CTA band that used to live here is now `ClosingCTA`, placed by
 * each page — see that file. What remains is deliberately quiet: the lockup,
 * the routes, a copyright line.
 *
 * `Get Involved` appears here even though it is absent from the header. The
 * footer is where a site lists what exists; the header is where it says what
 * is worth your attention. The page is still two `ContentPending` blocks.
 *
 * CONTACT DETAILS come from `contact` in src/content/site.js — phone,
 * location and Instagram as supplied by the client. Any field left null
 * simply does not render; nothing here is filled in with a placeholder.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-rule">
      <Container className="flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-5">
          {/* Live type rather than the stacked lockup image: at footer scale
              the artwork's tagline is only a few pixels tall and reads as a
              smudge. */}
          <Logo variant="full" size="md" />

          {(contact.phone || contact.address) && (
            <address className="flex flex-col gap-1.5 text-body-sm not-italic text-ink-body">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="w-fit tabular-nums text-ink-body no-underline transition-colors duration-300 hover:text-teal"
                >
                  {contact.phone}
                </a>
              )}
              {contact.address && <span>{contact.address}</span>}
            </address>
          )}

          {contact.instagram && (
            <a
              href={contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on Instagram (opens in a new tab)`}
              className="flex h-10 w-10 items-center justify-center rounded-pill border border-rule-strong text-ink transition-colors duration-300 hover:border-teal hover:bg-teal hover:text-ink-invert"
            >
              <InstagramIcon className="h-[1.15rem] w-[1.15rem]" />
            </a>
          )}
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10">
            {allRoutes.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-body-sm text-ink-body no-underline transition-colors duration-300 hover:text-teal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Container className="border-t border-rule py-8">
        <div className="flex flex-col gap-3 text-caption text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name} &mdash; {site.tagline}
          </p>

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="text-ink-body no-underline transition-colors duration-300 hover:text-teal"
            >
              {contact.email}
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}
