class Checkers {
    table;
    round;
    highlighted;

    constructor() {
        this.table = document.querySelector("#table");
        this.round = "black";
        this.highlighted = {
            row: -1,
            col: -1,
            player: null
        }

        this.generateField();
    }

    generatefield() {
        for(let i = 1; i <= 64; i++) {
            const row = Math.ceil(i/8);
            const col = (i - 1) % 8 + 1;
            const field = document.createElement("div");
            field.classList.add("field");
            let player = null; // ezt itt csináltuk let-vel, mert majd két helyen csináljuk meg itt az if-ben 

            if(row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            } else if(row % 2 === 0 && col % 2 === 1) {
                field.classList.add("black-bg");
                player = document.createElement("div");
            }

            if(player && col < 3) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            } else if(player && col >= 7) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            }

            /*
            A field-nek csináltunk egy id-t, hogy ebből majd tudjuk, hogy pontosan melyik field-ről van szó a row és a col segítségével 
            */
            field.id = `field-${row}-${col}`;

            if(player) {
                this.highlightPlayer(player);
                player.setAttribute("row", row);
                player.setAttribute("col", col);
            }

            this.table.appendChild(field);

            /*
            Nagyon fontos, hogy ki ne maradjon az appendChild-olás, mert ezek egymásban lesznek benne 
            */

        }
    }

    highlightPlayer(player) {
        player.addEventListener("click", (e)=> {
            e.stopPropagation();

            /*
            itt már csak a player-t kérjük be és nem a col-t meg a row-ot is, mert csináltunk a player-nek egy olyan attributumot, 
            hogy col és a row itt a generateFields függvényben, ami csak akkor van ha létezik ez a player, amit itt be szeretnénk 
            kérni és ott setAttribute-val megadjuk a col-t meg a row-t
            ->
            if(player) {
                this.highlightPlayer(player);
                player.setAttribute("row", row);
                player.setAttribute("col", col);
            } 

            itt meg ezeknek az értéket lementjük egy változóba és akkor meg lesz a row meg a col, fontos, hogy legyen parseInt!!! 
            */
           const row = parseInt(player.getAttribute("row"));
           const col = parseInt(player.getAttribute("col"));

           /*
           ha ez már egy highlighted.player volt akkor levesszük róla a highlight class-t 
           ha meg nem akkor hozzáadjuk 
           */

           if(this.highlighted.player)
                this.highlighted.player.classList.remove("highlight");

           player.classList.add("highlight");

           //megadjuk a highlighted-nak a dologokat, itt már le van mentve a row meg a col és a player-t azt meg bekérjük meghíváskor a 

           this.highlighted = {
                row,
                col,
                player
           }

           /*
           Szóval ez azt csinálja, hogy rárakja player-re a highlight class-t ha még nem volt highlighted.player-en 
           ha meg volt akkor leveszi róla 
           meg megadjuk a row col és magát a player-div-et ennek a highighted objektumnak, szóval ezeket fogja tárolni 
           */

        })
    }

    canMove(col, row) {
        /*
        ez bekér egy col-t meg egy row-t és megnézzük, hogy oda arra a mezőre a szabályok szerint lehet-e lépni 
        kiszámolunk a legelején egy colDiff-et, ami a kijelölt bábúnak a row-ja és a col-ja minusz a row és a col, amit bekérünk  
        */
       const rowDiff = this.highlighted.row - row;
       const colDiff = this.highlighted.col - col;

       /*
       a field-eknek van egy id-ja ami megmondja, hogy melyik row és a col-on van az a field
       ->
       field.id = `field-${row}-${col}`;
       itt meg leszedjük azokat a field-eket, ahova érvényesen léhetünk itt még nem nézzük, hogy melyik a black meg a white-player
       */

       const fields = [
        document.querySelector(`field-${row-1}-${col}`),
        document.querySelector(`field-${row+1}-${col}`),
        document.querySelector(`field-${row-1}-${col-1}`),
        document.querySelector(`field-${row-1}-${col+1}`),
        document.querySelector(`field-${row-1}-${col-1}`),
        document.querySelector(`field-${row+1}-${col+1}`),
        document.querySelector(`field-${row-1}-${col+1}`),
        document.querySelector(`field-${row+1}-${col-1}`)
       ];

       /*
       és akkor ezeken a field-eken, ha csak így be vannak rakva egy tömbbe, akkor végig tudunk rajtuk menni egy for-val 
       */

       for(const field of fields) {
        if(field === null)
            continue;
       }

       const children = field.children; /*ez ugye a player div, ami benne van a field-ben*/

       /*
       itt az if-ben megnézzük, hogy van-e valami a children-ben tehát a children.length az nem nulla 
       illetve megnézzük, hogy a kijelöltünk az fekete és akkor a children[0]-nek white-nak kell lennie és fordítva 
       */ 
      if(children.length !== 0 && this.highlighted.player.classList.contains("black-player") && children[0].classList.contains("white-player") 
        || this.highlighted.player.classList.contains("white-player") && children[0].classList.contains("black-player")) {
            if(this.highlighted.player.classList.contains("black-player")) {

            } else {

            }
        }

        /*
        Itt megcsináljuk a sima lépéseket 
        hogyha black-player-nek a köre van, akkor rowDiff-nek 1-nek kell lennie, mert mehet felfele illetve lefele is 
        és a col pedig lehet -1 és 1 is mindkét esetben, ha white-player meg ha black-player is 
        még azt is le kell, hogy ellenőriznünk, hogy van-e kijelölt highlighted, azt meg csak úgy, hogy highlighted.row !== -1
        mert az az alap felül és ha nem annyi akkor biztos, hogy van
        */
       if(this.round === "black") {
        return this.highlighted.row !== -1 && rowDiff === 1 && (colDiff === -1 || colDiff === 1);
       }
        return this.highlighted.row !== -1 && rowDiff === -1 && (colDiff === -1 || colDiff === 1);

    }

    step(field, row, col) {
        /*
        ez maga a lépés
        itt véltoztatjuk meg, hogy kinek a köre van 
        levesszük a highlighted.player-ről a highlight-ot
        átadjuk az új row meg a col-t a setAttribute-val 
        és kiűrítjük a highlighted-ot 
        */
       field.addEventListener("click", ()=> {
        if(this.canMove(row, col)) {
            this.round = this.round === "black" ? "white" : "black";

            //hozzáadjuk a field-hez a highlighted.player-t 
            field.appendChild(this.highlighted.player);
            this.highlighted.player.classList.remove("highlight");
            this.highlighted.player.setAttribute("row", row);
            this.highlighted.player.setAttribute("col", col);

            this.highlighted = {
                row: -1,
                col: -1,
                player: null
            }
        } else {
            alert("Nem jó lépés!");
        }
       });
    }
}

new Checkers();