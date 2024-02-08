import { Odeljenje } from "./odeljenje.js";

export class VideoKlub{
    constructor(id,naziv,adresa){
        this.id=id;
        this.naziv=naziv;
        this.adresa=adresa;
        this.odeljenja=[];
        this.kontejner=null;
    }
    dodajOdeljenje(o){
        this.odeljenja.push(o);
    }
    crtajVideoKlub(host){
        if(!host)
            throw new Exception("Roditeljski element ne postoji");
        this.kontejner=document.createElement("div");
        this.kontejner.classList.add("kontKlub");
        host.appendChild(this.kontejner);
        let info=document.createElement("label");
        info.className="infoNaslov";
        info.innerHTML=`Naziv kluba: ${this.naziv}`;
        this.kontejner.appendChild(info);
        info=document.createElement("label");
        info.className="info";
        info.innerHTML=`Adresa: ${this.adresa}`;
        this.kontejner.appendChild(info);
        this.formaZaOdeljenje(this.kontejner);
        fetch("https://localhost:5001/VideoKlub/PreuzmiOdeljenja/"+this.id).then(p => {
            p.json().then(data => {
            data.forEach(odlj => {
                const odeljenje = new Odeljenje(odlj.id, odlj.naziv,odlj.brojRedova,odlj.brojPolicaPoRedu);
                this.dodajOdeljenje(odeljenje);
                odeljenje.crtajOdeljenje(this.kontejner);
                odlj.filmovi.forEach(film=>{
                    odeljenje.filmovi[(film.red-1)*odeljenje.brojPolicaPoRedu+film.pozURedu-1].dodajNaPolicu(film.id,film.nazivFilma,film.reziser,film.trajanje,film.godIzlaska,film.kolicina,film.red,film.pozURedu);
                });
            });
        });
     });
        console.log(this.odeljenja);
    }
    formaZaOdeljenje(host){
        const forma=document.createElement("div");
        host.appendChild(forma);
        forma.className="formaOdeljenje";
        let labele=["Naziv:","Broj redova:","Broj polica po redu:"];
        let tipovi=["text","number","number"];
        let klase=["naziv","brojRedova","brojPolicaPoRedu"];
        let polje=null;
        let labela=document.createElement("label");
        labela.innerHTML="Unos novog odeljenja";
        labela.className="nazivForme";
        forma.appendChild(labela);
        labele.forEach((el,ind)=>{
            labela=document.createElement("label");
            labela.innerHTML=el;
            forma.appendChild(labela);
            polje=document.createElement("input");
            polje.type=tipovi[ind];
            polje.className=klase[ind];
            forma.appendChild(polje);
        })
        polje=document.createElement("button");
        polje.className="dugme";
        polje.innerHTML="Dodaj";
        forma.appendChild(polje);
        console.log(this.odeljenja.length+1);
        polje.onclick=(ev)=>{
            const naziv = forma.querySelector(".naziv").value;
            const brojRedova = parseInt(forma.querySelector(".brojRedova").value);
            const brojPolicaPoRedu = parseInt(forma.querySelector(".brojPolicaPoRedu").value);
            const id=this.id;
            if(naziv=="")
                alert("Morate da unesete naziv odeljenja.");
            else if(isNaN(brojRedova))
                alert("Morate da unesete broj redova.");
            else if(isNaN(brojPolicaPoRedu))
                alert("Morate da unesete broj polica u svakom redu.");
            else
            {
                fetch("https://localhost:5001/VideoKlub/UpisiOdeljenje/" + this.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        naziv: naziv,
                        brojRedova: brojRedova,
                        brojPolicaPoRedu: brojPolicaPoRedu
                    })
                }).then(p => {
                    if (p.ok) {
                        const odlj=new Odeljenje(this.odeljenja.length,naziv,brojRedova,brojPolicaPoRedu);
                        console.log(this.odeljenja);
                        this.dodajOdeljenje(odlj);
                        odlj.crtajOdeljenje(this.kontejner);
                    }
                    else if (p.status == 406) {
                        alert("Već postoji ovo odeljenje u video klubu!");
                    }
                    else if (p.status == 407){
                        alert("Odeljenje mora imati bar jedan red i bar jednu policu po redu!");
                    }
                });          

            }            
        }
    }
}