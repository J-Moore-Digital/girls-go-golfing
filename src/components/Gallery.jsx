import '../styles/components/Gallery.css';

export default function Gallery({ images, labels }) {
  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <h2 className="section-title">{labels.gallery_title}</h2>
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image} alt={`Gallery image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
