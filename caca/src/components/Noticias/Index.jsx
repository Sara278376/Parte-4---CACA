import React, { useEffect, useState } from 'react';
import './Noticias.css';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
      .then(res => res.json())
      .then(data => setNoticias(data));
  }, []);

  return (
    <section id="Noticias">
      <div className="noticias-container">
        <div style={{ textAlign: 'center' }}>
          <h2>Notícias da Saúde</h2>
        </div>
        
        {noticias.map((n) => (
          <div key={n.id} className="noticia-card">
            <h3>{n.title}</h3>
            <p>{n.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}