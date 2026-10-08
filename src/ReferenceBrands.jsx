import React from 'react';
import './reference-brands.css';

const brands = [
  ['Acun Medya', 'acunmedya-2-2'],
  ['Civil', 'civil-2-1'],
  ['Ferre', 'ferre-2-1'],
  ['Beyaz Fırın', 'beyaz-firin-2-1'],
  ['Havaist', 'havaist-2-1'],
  ['ZSA', 'zsa-2'],
  ['LG', 'lg-2-1'],
  ['Yatsan', 'yatsan-2-1'],
  ['Lujo', 'lujo-3'],
  ['letgo', 'letgo-2-1'],
  ['Tuğba', 'tugba-2-1'],
  ['Migros One', 'migros-one-2-1'],
  ['Kellogg’s', 'kellogs-2-1'],
  ['Caribou', 'caribou-2-1'],
];

export function ReferenceBrands() {
  return (
    <section className="reference-brands container" aria-label="Markalar">
      <ul className="reference-brands-grid" aria-label="Firma logoları">
        {brands.map(([name, file]) => (
          <li key={file}>
            <img
              src={`/images/reference-brands/${file}.svg`}
              alt={name}
              width="140"
              height="60"
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
