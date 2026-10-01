/**
 * Single source of truth for site-wide structural content.
 *
 * IMPORTANT: this file holds structure only — route names, labels and
 * organisation identity. Descriptive copy about Vidyanjali lives in
 * `about.js` and `programmes.js`, and every word of it is the client's.
 * Do not add invented copy anywhere; wait for the client's words.
 */

export const site = {
  name: "Vidyanjali",
  /* From the supplied logo lockup. NOTE: the client's content says the centre
     "has now rebranded into Vidyanjali Learning Centre" — confirm whether the
     site should lead with that name, and whether this tagline still stands. */
  tagline: "Centre for Building Bridges",
  /* Search-result and social-card description. Assembled only from facts in
     the client's JOURNEY paragraph — nothing added. */
  description:
    "Established in 2003, Vidyanjali began as a therapy centre and has now rebranded into Vidyanjali Learning Centre — a school for children with autism and many other neurodevelopmental conditions.",
  /* Update once the production domain is confirmed — used by metadata + sitemap. */
  url: "https://vidyanjali.org",
};

/**
 * Header navigation. Deliberately three items.
 *
 * `Get Involved` is NOT here. Its page is still two `ContentPending` blocks —
 * volunteering, partnerships and donations have not been confirmed — and a
 * header link is a promise that something is behind it. The route still works
 * and still appears in the footer and the sitemap, so nothing is orphaned;
 * it just is not advertised until it has content. Promote it the day it does.
 */
export const primaryNav = [
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Contact", href: "/contact" },
];

/** The header's single call to action. */
export const navCta = { label: "Enquire", href: "/contact" };

/**
 * Every public route. The footer and the sitemap read from this, so an
 * unfinished page stays reachable and indexable without being promoted.
 */
export const allRoutes = [
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];

/**
 * The closing invitation, used by `ClosingCTA`.
 *
 * This used to reuse the fourth vision statement. That broke as soon as the
 * homepage and /about both set out all four visions in full: the closing band
 * then repeated, word for word, a line the reader had already passed a couple
 * of screens earlier. Every one of the four had the same problem, so there was
 * no vision statement left to borrow.
 *
 * The line below is therefore WRITTEN, not quoted — one of only two on the
 * site, the other being `heroStatement` in about.js.
 *
 * IT IS DELIBERATELY FLAT. The previous wording, "Come and talk to us about
 * your child.", was flagged and withdrawn: "come and talk to us" implies a
 * conversation the centre has not said it offers, and "your child" presumes a
 * reader who already has a child in mind for a place. The replacement names
 * the organisation and the action and nothing else — no service, no outcome,
 * no admissions process, no appointment, no figure. There is nothing in it
 * for the client to have to stand behind. Replace it the moment they write
 * their own.
 */
export const footerCta = {
  heading: "Get in touch with Vidyanjali.",
  /* "Get in touch" as the button under a heading that already says exactly
     that read as a stutter, so the button now names the destination instead. */
  action: "Contact us",
  href: "/contact",
};

/**
 * Contact details, as supplied by the client. The footer and the contact page
 * read from here, so this is the only edit needed. A null field simply does
 * not render.
 */
export const contact = {
  email: "vidyanjalitherapycentre2112@gmail.com",
  phone: "+91 73058 73755",
  address: "Nungambakkam, Chennai",
  /* The profile URL without the share-tracking `?stkn=` token the link was
     copied with — same profile, cleaner link. */
  instagram: {
    handle: "@vidyanjali_chennai",
    url: "https://www.instagram.com/vidyanjali_chennai/",
  },
};
