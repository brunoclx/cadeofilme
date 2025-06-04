window.addEventListener("DOMContentLoaded", () => {// estou aguardando o window carregar todo o conteudo
    let mudarTema = document.getElementById("mudar-tema"); // pego o li com o id mudar-tema
    let temaAplicado = document.getElementsByTagName("html"); // pego as tags HTML
    let statusTema = document.getElementById("status-tema"); // pego o span que exibe o satus do tema
    let temaAtual = "";

    statusTema.innerHTML = "desativado"; // começo exibindo o valor desativado, pois tenho setado que o tema padrão é light

    const temaSalvo = localStorage.getItem("tema"); // pego do LocalStorage o valor do item tena
    if (temaSalvo) { // se tiver um valor salvo
        temaAtual = temaSalvo; // atribuo o valor salvo à variavel temaAtual
        temaAplicado[0].setAttribute("data-theme", temaAtual); // no temaAplicado na posição 0, seto o atributo "dark-theme" como o temaAtual
        statusTema.innerText = temaAtual === "dark" ? "ativado" : "desativado"; // se o tema atual for "dark", mostra "ativado", se não mostra "desativado"
    }

    mudarTema.addEventListener("click", () =>{// quando a pessoa clica em mudarTema            
        if(temaAtual === "light"){ // se o tema atual for "light"
            temaAtual = "dark"; // muda para "dark"
        }else{
            temaAtual = "light"; // se não muda para "light"             
        }
        temaAplicado[0].setAttribute("data-theme", `${temaAtual}`); //no temaAplicado na posição 0, seto o atributo "dark-theme" como o temaAtual
        statusTema.innerText = temaAtual === "dark" ? "ativado" : "desativado"; // se o tema atual for "dark", mostra "ativado", se não mostra "desativado"
        localStorage.setItem("tema", temaAtual); // armazeno no localStorage o valor novo do temaAtual 
    });     
});