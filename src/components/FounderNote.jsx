import '../styles/components/FounderNote.css';

export default function FounderNote({ data }) {
  if (!data) return null;

  return (
    <section className="founder-note" id="founder-note">
      <div className="container founder-note-layout">
        <div className="founder-note-main">
          <p className="founder-note-kicker script-accent">Founder Note</p>
          <h2>{data.title}</h2>
          <p className="founder-note-body">{data.body}</p>
          {data.quote ? <blockquote>{data.quote}</blockquote> : null}
          <p className="founder-note-signoff script-accent">{data.signature}</p>
        </div>
        {/* <aside className="founder-note-meta">
          <h3>Where to Find GGG</h3>
          <ul>
            {(data.where_to_find || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Podcast</h3>
          <p>{data.podcast}</p>
        </aside> */}
      </div>
    </section>
  );
}
