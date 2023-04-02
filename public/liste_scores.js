
function affichage_scores(
    targetHtmlElementId,
    arrayToPrint, 
  ) {
    arrayToPrint.sort(function(a, b) { return b.score - a.score;});
    let div_container = document.getElementById(targetHtmlElementId);
    div_container.innerHTML = "";
    let maListe = document.createElement("table");
    maListe.className = "table table-hover table-dark";
    div_container.appendChild(maListe);
  
    let ligne = document.createElement("tr");
    maListe.appendChild(ligne);
    let th1 = document.createElement("th");
    th1.innerHTML = "Classement";
    ligne.appendChild(th1);
    let th2 = document.createElement("th");
    th2.innerHTML = "Nom Utilisateur";
    ligne.appendChild(th2);
    let th3 = document.createElement("th");
    th3.innerHTML = "Score";
    ligne.appendChild(th3);

    for (let x = 0; x < arrayToPrint.length; x++) {
      let ligneScore = document.createElement("tr");
      maListe.appendChild(ligneScore);
      const utilisateur = arrayToPrint[x];
      for (const propriete in utilisateur) {
        if(propriete === "id"){
            let monChamp = document.createElement("td");
            monChamp.innerHTML = x+1;
            ligneScore.appendChild(monChamp); 
        }
        if (propriete === "score" || propriete === "pseudo") {
            let monChamp = document.createElement("td");
            monChamp.innerHTML = utilisateur[propriete];
            ligneScore.appendChild(monChamp);
        }
      }
    }
}
  
  export default affichage_scores;