let sinopseMini = true;

function lerMais(){
    const lerMais = document.querySelector("#ler-mais-menos i");
    const lerMaisTexto = document.querySelector("#ler-mais-menos span");
    const txtSinopse = document.querySelector("#txt-sinopse");
    
    if(sinopseMini){
        txtSinopse.classList.remove("line-clamp-4");
        lerMais.classList.replace("fa-arrow-down", "fa-arrow-up");
        lerMaisTexto.innerHTML = "Ler menos";
        sinopseMini = false;
    }else{
        txtSinopse.classList.add("line-clamp-4");
        lerMais.classList.replace("fa-arrow-up", "fa-arrow-down");
        lerMaisTexto.innerHTML = "Ler mais";
        sinopseMini = true;
    }
}