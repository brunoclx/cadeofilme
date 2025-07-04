import { CONFIG } from '../utils/config.js'; // importando a chave key

const queryString = window.location.search; // acessando a url do navegador
const urlParams = new URLSearchParams(queryString); // separando os elementos da url
const termoPesquisar = urlParams.get('id'); // pegando apenas o id

async function detalhesPessoa(termoPesquisado){
    termoPesquisado = Number(termoPesquisar);

    let tituloPagina = document.getElementsByTagName("title");
    let erroBuscar = document.getElementById("erro-buscar");
    let bio = document.getElementById("bio");
    let avatar = document.querySelector("#avatar img");
    let nomePessoa = document.querySelector("#mini-bio h1");
    let textoBio = document.querySelector("#mini-bio p");
    let conhecidoPor = document.getElementById("conhecido-por");
    let maisOpcoes = document.getElementById("lista-mais-opcoes");

    try {
        const options = { // crio uma const para passar as informações (opções)
            method: 'GET', // método usado GET
            headers: {
                accept: 'application/json', // forma que vou passar a informação
                // token TMDB:
                Authorization: `Bearer ${CONFIG.apiToken}`// acessando a api com a apiToken do arquivo importado
            }
        };
        const RESPOSTA = await Promise.all([
            fetch(`https://api.themoviedb.org/3/person/${termoPesquisado}?language=pt-BR`, options),
            fetch(`https://api.themoviedb.org/3/person/${termoPesquisado}/combined_credits?language=pt-BR`, options)
        ]);
        let dados = await RESPOSTA[0].json();
        let trabalhosPessoa = await RESPOSTA[1].json();
        console.log(trabalhosPessoa);

        const ENCONTROU_PESSOA = dados.success;

        if(ENCONTROU_PESSOA == false){
            erroBuscar.classList.remove("hidden");
            tituloPagina[0].innerText = `Ops, Houve algum erro :( - Cadê o Filme`;
        }else{
           tituloPagina[0].innerText = `${dados.name} - Cadê o Filme`;
           avatar.setAttribute("src", `https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${dados.profile_path}`);
           avatar.setAttribute("alt", `Foto de ${dados.name}`);
           nomePessoa.innerText = `${dados.name}`;
           textoBio.innerText = `${dados.biography}`;
        }


        
    } catch (error) {
        console.log("Erro", error);
        erroBuscar.classList.remove("hidden");
    }
}
detalhesPessoa();