import { VideoKlub } from "./videoklub.js"

fetch("https://localhost:5001/VideoKlub/PreuzmiVideoKlubove").then(p => {
    p.json().then(data => {
        data.forEach(klub => {
            const b = new VideoKlub(klub.id, klub.naziv,klub.adresa);
            b.crtajVideoKlub(document.body);
            })
        });
 });

