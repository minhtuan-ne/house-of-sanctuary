export default function WritingLoading() {
  return (
    <section className="writing-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="writing-card-skeleton">
          <div className="writing-card-skeleton__media skeleton-pulse" />
          <div className="writing-card-skeleton__body">
            <div className="writing-card-skeleton__title skeleton-pulse" />
            <div className="writing-card-skeleton__line skeleton-pulse" />
            <div className="writing-card-skeleton__line writing-card-skeleton__line--short skeleton-pulse" />
          </div>
        </div>
      ))}
    </section>
  );
}
