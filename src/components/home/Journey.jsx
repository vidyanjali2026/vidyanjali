import Link from "next/link";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import { journey } from "@/content/about";

/**
 * The short story, told in one sentence.
 *
 * WHAT IS AND IS NOT HERE. The client supplied exactly one sentence of
 * history: founded 2003, began as a therapy centre, became a school. That is
 * two stations and a date, so this is two stations and a date. There is no
 * third marker, no milestones, no growth curve — inventing one would mean
 * inventing the years it happened in.
 *
 * The second journey line, "Vidyanjali has now rebranded into Vidyanjali
 * Learning Centre", is deliberately NOT shown here. It contradicts the name
 * the site leads with, and putting both in front of a parent on the homepage
 * would just be confusing. It still appears in full on /about, and the naming
 * conflict is flagged for the client rather than silently resolved.
 *
 * IT IS DELIBERATELY SMALL AND DELIBERATELY QUIET. It arrives directly after
 * a photograph that fills the screen, and the contrast is the point: the page
 * has just shouted, so this whispers. The whole section is a label, one
 * sentence, two dates and a link — narrower than anything else on the page.
 * The previous version put this same sentence beside a photograph with two
 * display figures under it and ran to 825px tall; at that weight it competed
 * with the sections either side of it instead of resting between them.
 *
 * The sentence is set in the display face at h2 rather than as body copy,
 * so that a short passage of prose still reads as an editorial moment rather
 * than as an introduction someone forgot to delete.
 */

/* Both stations come from `journey[0]`. Nothing here is inferred. */
const STATIONS = [
  { marker: "2003", label: "A therapy centre" },
  { marker: "Today", label: "A learning centre" },
];

export default function Journey() {
  return (
    <Section spacing="lg">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow className="mb-6">Our journey</Eyebrow>
          <p className="text-h2 text-ink">{journey[0]}</p>
        </Reveal>

        {/* Two dates on one gold rule. A single line with a figure at each end
            reads as a span of time, which is the entire content of the
            sentence above it. */}
        <Reveal delay={120}>
          <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-x-10 border-t-[3px] border-gold pt-6">
            {STATIONS.map((station) => (
              <div key={station.marker}>
                <p className="font-display text-h1 tabular-nums text-purple-mid">
                  {station.marker}
                </p>
                <p className="mt-1 text-body-sm text-ink-body">{station.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Link
            href="/about"
            className="group mt-11 inline-flex items-center gap-2 text-body-sm font-semibold text-teal no-underline"
          >
            Read our full story
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
