export class Film {

    constructor(id,nazivFilma,reziser,trajanje,godIzlaska,kolicina,red,pozURedu)
    {
        this.id=id;
        this.nazivFilma=nazivFilma;
        this.reziser=reziser;
        this.trajanje=trajanje;
        this.godIzlaska=godIzlaska;
        this.kolicina=kolicina;
        this.red=red;
        this.pozURedu=pozURedu;
        this.kontejner=null;
    }   

    filmInfo()
    {
        this.kontejner.innerHTML="";
        let naslov = document.createElement("label");
        naslov.innerHTML=this.nazivFilma;
        naslov.className="naslovFilm";
        this.kontejner.appendChild(naslov);

        naslov= document.createElement("label");
        naslov.innerHTML="Režiser: " + this.reziser;
        naslov.className="naslovReziser";
        this.kontejner.appendChild(naslov);
    }

    crtajFilm(host)
    {
        this.kontejner= document.createElement("div");
        this.kontejner.className="filmDiv";
        this.kontejner.innerHTML="Prazno";
        host.appendChild(this.kontejner);
    }

    dugmeInfo()
    {
        const dugmeInfo = document.createElement("button");
        dugmeInfo.innerHTML="Prikaži";
        dugmeInfo.className="dugmeInfo";
        this.kontejner.appendChild(dugmeInfo);
        dugmeInfo.onclick = (ev) => {
            console.log(this.id);
            fetch("https://localhost:5001/VideoKlub/PreuzmiFilmove").then(p => {
             p.json().then(filmovi => {
                 filmovi.forEach(k=>{
                     if(k.nazivFilma==this.nazivFilma){
                        const info=`Naziv filma: ${k.nazivFilma}\n Režiser: ${k.reziser}\n Dužina filma: ${k.trajanje}\n Godina izlaska: ${k.godIzlaska}\n Trenutno na stanju: ${k.kolicina} `;
                        alert(info);
                     }
                   })
              });
           });
        }
    }


    postaviBoju(naziv){

        const firstAlphabet = naziv.charAt(0).toLowerCase();
        const asciiCode = firstAlphabet.charCodeAt(0);
        const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
       
        var num = Math.round(0xffffff * parseInt(colorNum));
        var r = num >> 16 & 255;
        var g = num >> 8 & 255;
        var b = num & 255;
        this.kontejner.style.backgroundColor="rgb("+r+", "+b+", "+g+")";
    }
    
    dodajNaPolicu(id,nazivFilma,reziser,trajanje,godIzlaska,kolicina,red,pozURedu){
        this.id=id;
        this.nazivFilma=nazivFilma;
        this.reziser=reziser;
        this.trajanje=trajanje;
        this.godIzlaska=godIzlaska;
        this.kolicina=kolicina;
        this.red=red;
        this.pozURedu=pozURedu;
        this.filmInfo();
        this.dugmeInfo();
        this.postaviBoju(this.nazivFilma); 
    }
    azurirajKolicinu(novaKolicina){
        this.kolicina = novaKolicina;
        this.filmInfo();
        this.dugmeInfo();
        this.postaviBoju(this.nazivFilma);     
    }
    obrisi(){
        this.nazivFilma=" ";
        this.reziser=" ";
        this.trajanje=0;
        this.godIzlaska=0;
        this.kolicina=0;
        this.kontejner.style.backgroundColor="rgb(238, 231, 165)";
        this.kontejner.innerHTML="Prazno";
        console.log(this);
    }

}
