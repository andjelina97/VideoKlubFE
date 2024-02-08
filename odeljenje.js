import {Film} from "./film.js"
export class Odeljenje {
    constructor(id,naziv,brojRedova,brojPolicaPoRedu){
        this.id= id;
        this.naziv=naziv;
        this.brojRedova=brojRedova;
        this.brojPolicaPoRedu=brojPolicaPoRedu;
        this.filmovi=[];
        this.kontejner=null;
    }


    dodajFilm(f){
        this.filmovi.push(f);
    }

    crtajOdeljenje(host){
        if(!host)
        throw new Exception("Roditeljski element nije nadjen!");

        let info=document.createElement("label");
        info.classList.add("info");
        info.classList.add("zanr");
        info.innerHTML=this.naziv;
        host.appendChild(info);

        this.kontejner= document.createElement("div");
        this.kontejner.className="kontOdeljenje";
        host.appendChild(this.kontejner);

        const divForme= document.createElement("div");
        divForme.className="odeljenjeForme";
        this.kontejner.appendChild(divForme);
        this.dodajFormu(divForme);
        this.izmeniFormu(divForme);

        const divZaCrtanje= document.createElement("div");
        divZaCrtanje.className="divZaCrtanje";
        this.kontejner.appendChild(divZaCrtanje);
        this.crtajPolice(divZaCrtanje);
    }


    dodajFormu(host)
    {
        const forma= document.createElement("div");
        host.appendChild(forma);
        //forma.classList.add("odeljenjeForme");
        forma.classList.add("formaDodaj");

        let labele=["Naziv:", "Režiser:", "Trajanje:", "Godina izlaska:", "Kolicina:"];
        let tipovi=["text", "text", "text", "number", "number"];
        let klase =["nazivFilma","reziser","trajanje","godIzlaska","kol"];
        let polje = null;
       
        let labela= document.createElement("label");
        labela.innerHTML="Unos filma:";
        labela.className="nazivForme";
        forma.appendChild(labela);

        labele.forEach((el,ind)=> {

            labela= document.createElement("label");
            labela.innerHTML=el;
            forma.appendChild(labela);
            polje= document.createElement("input");
            polje.type=tipovi[ind];
            polje.className=klase[ind];
            forma.appendChild(polje);

        })

        let koordinate=["Red:", "Pozicija u redu:"];
        let vrednosti=[this.brojRedova,this.brojPolicaPoRedu];
        klase=["X", "Y"];
        let kord=document.createElement("div");
        let el = null;
        forma.appendChild(kord);
        koordinate.forEach((e,ind)=> {
            el=document.createElement("label");
            el.innerHTML=e;
            kord.appendChild(el);

            let sel=document.createElement("select");
            sel.className=klase[ind];
            kord.appendChild(sel);
            for(let i=1; i<=vrednosti[ind]; i++)
            {
                el=document.createElement("option");
                el.innerHTML=i;
                el.value=i;
                sel.appendChild(el);
            }
        })

        polje=document.createElement("button");
        polje.className="dugme";
        polje.innerHTML="Dodaj";
        forma.appendChild(polje);
        polje.onclick=(ev) => {

            const nazivFilma= forma.querySelector(".nazivFilma").value;
            const reziser= forma.querySelector(".reziser").value;
            const trajanje= forma.querySelector(".trajanje").value;
            const godIzlaska=parseInt(forma.querySelector(".godIzlaska").value);
            const kolicina = parseInt(forma.querySelector(".kol").value);
            const x= parseInt(forma.querySelector(".X").value);
            const y=parseInt(forma.querySelector(".Y").value);
            console.log(nazivFilma,reziser,trajanje,godIzlaska,kolicina,x,y);
            console.log(this.filmovi);

            if(nazivFilma=="")
            alert("Morate da unesete naziv filma!");
            else if(reziser=="")
            alert("Morate da unesete ime i prezime rezisera!");
            else if(trajanje=="")
            alert("Unesite duzinu filma!");
            else if(isNaN(godIzlaska))
            alert("Unesite godinu prvog prikaza filma!");
            else if(isNaN(kolicina))
            alert("Unesite kolicinu!");
            else{
                
                fetch("https://localhost:5001/VideoKlub/UpisiFilm/" + this.id, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nazivFilma: nazivFilma,
                        reziser:reziser,
                        trajanje:trajanje,
                        godIzlaska:godIzlaska,
                        kolicina: kolicina,
                        red: x,
                        pozURedu:y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.filmovi[(x-1)*this.brojPolicaPoRedu+y-1].dodajNaPolicu(0,nazivFilma,reziser,trajanje,godIzlaska,kolicina,x,y);
                    }
                    else if (p.status == 400) {
                        const greskaLokacija = { x: 0, y: 0 };
                        p.json().then(q => {
                            greskaLokacija.x = q.x;
                            greskaLokacija.y = q.y;
                            alert("Ovaj film već postoji u "+greskaLokacija.x+". redu, na "+greskaLokacija.y+". polici.\nAžurirajte količinu na toj lokaciji ako želite da dodate još filmova.");
                        });
                    }
                    else if (p.status === 406) {
                        alert("Na ovoj lokaciji se već nalazi neki drugi film.\nProbajte da dodate film na drugu lokaciju.");
                    }
                   else if(p.status === 0){
                        alert("Film je već na ovoj lokaciji.\nAžurirajte količinu ako želite da dodate još filmova.");
                    }
                                
                    else if(p.status === 410){
                        alert("Morate dodati bar jedan film.");
                    }
                    else
                       alert("greska");
                       
                });

            }
            console.log(this.filmovi);
        }
    }



    izmeniFormu(host){
        const formaIzmeni=document.createElement("div");
        host.appendChild(formaIzmeni);
        //formaIzmeni.classList.add("odeljenjeForme");
        formaIzmeni.className="formaIzmeni";
        let labelaI=document.createElement("label");
        labelaI.innerHTML="Izmeni/Obriši";
        labelaI.className="nazivForme";
        formaIzmeni.appendChild(labelaI);
        labelaI=document.createElement("label");
        labelaI.innerHTML="Izaberite jednu opciju:";
        formaIzmeni.appendChild(labelaI);
        
        let opcija=null;
        let labela=null;
        let divOpcija=null;
      
        divOpcija = document.createElement("div");
        divOpcija.className="opcija";
        const opcija1 = document.createElement("input");
        opcija1.type="radio";
        opcija1.name = this.naziv;
        opcija1.value= "a";
        labela = document.createElement("label");
        labela.innerHTML="ažuriranje";
       
        divOpcija.appendChild(opcija1);
        divOpcija.appendChild(labela);
        formaIzmeni.appendChild(divOpcija);
        const opcija2 = document.createElement("input");
        opcija2.type="radio";
        opcija2.name = this.naziv;
        opcija2.value= "b";
        labela = document.createElement("label");
        labela.innerHTML="brisanje";
        labela.className="labelica";
        divOpcija.appendChild(opcija2);
        divOpcija.appendChild(labela);
        formaIzmeni.appendChild(divOpcija);
        
        let koordinateI=["Red:","Pozicija u redu:"];
        let vrednostiI=[this.brojRedova,this.brojPolicaPoRedu];
        let klaseI=["xI","yI"];
        let kord=document.createElement("div");
        let el=null;
        formaIzmeni.appendChild(kord);
        koordinateI.forEach((e,ind)=>{
            el=document.createElement("label");
            el.innerHTML=e;
            kord.appendChild(el);
            let sel=document.createElement("select");
            sel.className=klaseI[ind];
            kord.appendChild(sel);
            for(let i=1;i<=vrednostiI[ind];i++)
            {
                el=document.createElement("option");
                el.innerHTML=i;
                el.value=i;
                sel.appendChild(el);
            }
        })
        el=document.createElement("label");
        el.innerHTML="Nova količina:";
        formaIzmeni.appendChild(el);
        el=document.createElement("input");
        el.type="number";
        el.className="novaKol";
        formaIzmeni.appendChild(el);
        const d=document.createElement("button");
        
        d.innerHTML="Izmeni/Obriši";
        d.className="dugme";
        formaIzmeni.appendChild(d);
        opcija1.onclick=(ev)=>{
            console.log(opcija1.value);
            d.innerHTML="Ažuriraj";
            formaIzmeni.querySelector(".novaKol").disabled = false;
        }
        opcija2.onclick=(ev)=>{
            console.log(opcija2.value);
            d.innerHTML="Obriši";
            formaIzmeni.querySelector(".novaKol").disabled = true;
            console.log(formaIzmeni.getElementsByClassName("novaKol"));   
        }
        d.onclick=(ev)=>{
            console.log(d.innerHTML);
            const x=parseInt(formaIzmeni.querySelector(".xI").value);
            const y=parseInt(formaIzmeni.querySelector(".yI").value);
            if(d.innerHTML=="Ažuriraj")
            {
                const novaKolicina = parseInt(formaIzmeni.querySelector(".novaKol").value);
                if(isNaN(novaKolicina))
                {
                    alert("Niste uneli novu količinu!");
                    return;
                }
                fetch("https://localhost:5001/VideoKlub/IzmeniFilm/" + this.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        kolicina:novaKolicina,
                        red: x,
                        pozURedu:y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.filmovi[(x-1)*this.brojPolicaPoRedu+y-1].azurirajKolicinu(novaKolicina);
                    }
                    else if (p.status == 404) {
                        alert("Na ovoj lokaciji ne postoji nijedan film!");
                    }
                    else if(p.status==406){
                        alert("Nova količina mora da bude bar 1!");
                    }                
                });
            }        
            else if(d.innerHTML=="Obriši")
            {
                fetch("https://localhost:5001/VideoKlub/ObrisiFilm/" + this.id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        red: x,
                        pozURedu:y
                    })
                }).then(p => {
                    if (p.ok) {
                        this.filmovi[(x-1)*this.brojPolicaPoRedu+y-1].obrisi();
                    }
                    else if (p.status == 404) {
                        alert("Na ovoj lokaciji ne postoji nijedan film!");
                    }                              
                });                
            }
            else
                alert("Niste izabrali nijednu opciju!");
                 
            console.log(this.filmovi);
        }
    }


    crtajPolice(host){
        let red=null;
        for(let i=0;i<this.brojRedova;i++){
            red=document.createElement("div");
            host.appendChild(red);
            red.className="red";
            for(let j=0;j<this.brojPolicaPoRedu;j++){
                this.dodajFilm(new Film(0," "," "," ",0,0,i+1,j+1));
                this.filmovi[i*this.brojPolicaPoRedu+j].crtajFilm(red);
            }
        }
    }


}