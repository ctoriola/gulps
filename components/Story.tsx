import { gallery, shop } from "@/lib/content";

/** Our story, the gallery next door, and how to find us (content strategy, section 09). */
export default function Story() {
  return (
    <>
      <section id="story" className="info info-story">
        <div className="info-inner reveal">
          <span className="eyebrow">Our story</span>
          <h2 className="display">Gulp. See.</h2>
          <div className="info-cols">
            <p>
              Two verbs. There are two ways to find something out: put it in your mouth, or put it in front of your
              eyes. Gulpsee is a coffee shop built for both.
            </p>
            <p>Gulp to taste what&rsquo;s in the cup. See what&rsquo;s on the wall. Neither is complete without the other.</p>
            <p>We don&rsquo;t tell you what to think of a coffee. We show you what&rsquo;s in it, and leave the rest to you.</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="info info-gallery">
        <div className="info-inner reveal">
          <span className="eyebrow">{gallery.name}</span>
          <h2 className="display">Our neighbour in art.</h2>
          <p className="info-lead">
            {gallery.name} is a contemporary art gallery showing mostly Nigerian artists.
            {gallery.directions ? ` ${gallery.directions}` : ""}
            {gallery.receiptTerms ? ` Bring your Gulpsee receipt: ${gallery.receiptTerms}.` : ""}
          </p>
          {gallery.url && (
            <a className="pill pill-dark" href={gallery.url} target="_blank" rel="noopener noreferrer">
              Visit {gallery.name}
            </a>
          )}
        </div>
      </section>

      <section id="visit" className="info info-visit">
        <div className="info-inner reveal">
          <span className="eyebrow">Visit</span>
          <h2 className="display">Smell it at the door.</h2>
          <p className="info-lead">
            Put your hand in the bowl of beans at the counter. Taste what&rsquo;s in your cup. Then go and see
            what&rsquo;s on the wall.
          </p>
          <div className="visit-details">
            <p>{shop.hours}</p>
            <address>
              {shop.address.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </address>
          </div>
          <a className="pill pill-outline" href={shop.mapsUrl} target="_blank" rel="noopener noreferrer">
            Get directions
          </a>
        </div>
      </section>
    </>
  );
}
