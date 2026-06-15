import Image from "next/image";

const photos = [
  { src: "/photos/01.jpg", alt: "" },
  { src: "/photos/02.jpg", alt: "" },
  { src: "/photos/03.jpg", alt: "" },
];

export default function Home() {
  return (
    <div className="home-grid">
      <div className="home-grid__row">
        <div className="home-grid__cell">
          <Image src={photos[0].src} alt={photos[0].alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) calc(50vw - 2rem), 533px" priority />
        </div>
        <div className="home-grid__cell">
          <Image src={photos[1].src} alt={photos[1].alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) calc(50vw - 2rem), 533px" priority />
        </div>
      </div>
      <div className="home-grid__row home-grid__row--full">
        <div className="home-grid__cell">
          <Image src={photos[2].src} alt={photos[2].alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) calc(100vw - 3rem), 1067px" />
        </div>
      </div>
      <blockquote className="home-quote">
        <p>"die sprache ist das haus des seins"</p>
        <p className="home-quote__vn">ngôn ngữ là ngôi nhà của hữu thể</p>
        <cite>— Heidegger</cite>
      </blockquote>
    </div>
  );
}
