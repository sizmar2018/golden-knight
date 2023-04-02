"use strict";
import { getData, postData,updateData } from "./utilsAPI.js";

const CALL_API_DELAY = 3000;
let viewAPI;
const API_NAME = "/jeu";
let token=undefined;

$(document).ready(function() {
    token = initialRenderOfComponents(API_NAME);
  
    $("#form_inscription").submit(e => {
      e.preventDefault();
  
      if ($("#email_init")[0].checkValidity() && $("#motDePasse_init")[0].checkValidity() && $("#pseudo_init")[0].checkValidity() ) {
        const data = {
          email: $("#email_init").val(),
          motDePasse: $("#motDePasse_init").val(),
          pseudo: $("#pseudo_init").val()
        };

        postData("/inscription", data, token,onPost,onError);
      } else {
        alert("Entrez un email,mot de passe valide et pseudo valide");
      }
    });

    $("#form_connexion").submit(e => {
      e.preventDefault();
  
      if ($("#pseudo")[0].checkValidity() && $("#motDePasse")[0].checkValidity()) {
        const data = {
          pseudo: $("#pseudo").val(),
          motDePasse: $("#motDePasse").val()
        };
        postData("/connexion", data, token, onPost, onError);
      } else {
        alert("Entrez un pseudo et mot de passe valide");
      }
    });

    $("#scores_btn").click(e => {
      e.preventDefault();
      ListeScoreRenderWhenAuthenticated(API_NAME, token);
    });

    $("#jeu_btn").click(e => {
      e.preventDefault();
      GlobalRenderWhenAuthenticated(API_NAME,token);
    });

    $("#deconnexion_btn").click(e => {
      localStorage.removeItem("token");
      token = undefined;
      GlobalRenderWhenNotAuthenticated();
    });
});

const initialRenderOfComponents = url => {
    //per default, hide the login component, unless there is a token in localstorage
    //Note that in this demo, you can consider that the token is always valid if
    //it is found in the localStorage. This is a simplification...
    token = localStorage.getItem("token");
    if (token) {
      GlobalRenderWhenAuthenticated(url, token);
      return token;
  
    } else {
      GlobalRenderWhenNotAuthenticated();
      return;
    }
  };
  
  const GlobalRenderWhenAuthenticated = (url, token) => {
    $("#navigation").removeClass('d-none');
   
    $("#card").addClass('d-none');
    $("#deconnexion_btn").show();
    $("#jeu_btn").show();
    $("#scores_btn").show();
    $("canvas").show();
    $("#utilisateur_connexion").hide();
    $("#utilisateur_inscription").hide();
    $("#scores").hide();
  };
  
  const GlobalRenderWhenNotAuthenticated = (errorMessage = "") => {
    $("canvas").hide();
    $("#navigation").addClass('d-none');
    $("#card").removeClass('d-none');
    $("#deconnexion_btn").hide();
    $("#jeu_btn").hide();
    $("#scores_btn").hide();
    $("#utilisateur_connexion").show();
    $("#utilisateur_inscription").show();
    $("#message").html(errorMessage);
    $("#scores").hide();
    if (errorMessage === "") $("#message").hide();
  else $("#message").show();
  };

  const ListeScoreRenderWhenAuthenticated = (url, token) =>{
    getData(API_NAME, token, onGet,onErrorGet);
    $("canvas").hide();
    $("#navigation").removeClass('d-none');
    $("#card").removeClass('d-none');
    $("#deconnexion_btn").show();
    $("#jeu_btn").show();
    $("#scores_btn").show();
    $("#utilisateur_connexion").hide();
    $("#utilisateur_inscription").hide();
    $("#scores").show();
  };

  function onGet(response) {
    if (response.success) {
      if (response.data.length > 0) {         
        affichage_scores(
          "affichage_table",
          response.data,
        );
      }
    } else $("#affichage_table").text(JSON.stringify(response.error));
  }

function onPost(response) {
  $("#email_init").val("");
  $("#motDePasse_init").val("");
  $("#pseudo_init").val("");
  $("#email").val("");
  $("#motDePasse").val("");
  
  if (response.success === "true") {
      localStorage.setItem("token", response.token);
      token = response.token;
      GlobalRenderWhenAuthenticated(API_NAME, token);
  } else {
      console.error("Error:", response);
      GlobalRenderWhenNotAuthenticated(response.error);
  }
}
  
  function onError(err) {
    console.error("Error :", err);
    GlobalRenderWhenNotAuthenticated(response.error);
  }

  function onErrorGet(err) {
    console.error("Error when contacting API:", err);
  }