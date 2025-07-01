import { CONFIG } from '../utils/config.js'; // importando a chave key
import { apiImdb } from './imdbApi.js';
import { criarServico } from './scripts-filmes-series.js';
import { criarBoxServico } from './scripts-filmes-series.js';

const queryString = window.location.search; // acessando a url do navegador
const urlParams = new URLSearchParams(queryString); // separando os elementos da url
const termoPesquisar = urlParams.get('id'); // pegando apenas o id

async function detalhesFilme(termoPesquisado) {
    termoPesquisado = termoPesquisar;

    let erroBuscar = document.getElementById("erro-buscar");
    let informacoesPrincipais = document.getElementById("informacoes-principais");
    let ondeAssistir = document.getElementById("onde-assistir");
    let blocoCreditos = document.getElementById("bloco-creditos");

    let backdrop = document.getElementsByClassName("backdrop");
    let tituloFilme = document.getElementById("titulo-filme");
    let duracao = document.getElementById("duracao");
    let anoLancamento = document.getElementById("ano");
    let classificacaoFilme = document.getElementById("classificacao");
    let notaImdb = document.getElementById("nota-tmdb");

    let sinopse = document.getElementById("sinopse");

    let assistirGratis = document.getElementById("assistir-gratis");
    let contentAssistirGratis = document.getElementById("content-assistir-gratis");
    let porAssinatura = document.getElementById("por-assinatura");
    let contentPorAssinatura = document.getElementById("content-por-assinatura");
    let paraComprar = document.getElementById("para-comprar");
    let contentParaComprar = document.getElementById("content-para-comprar");
    let paraAlugar = document.getElementById("para-alugar");
    let contentParaAlugar = document.getElementById("content-para-alugar");

    let generos = document.getElementById("generos");
    let elenco = document.getElementById("elenco");
    let diretor = document.getElementById("diretor");

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
        const RESPOSTA = await Promise.all([ // fazendo várias requisições
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}?language=pt-BR`, options), // detalhes do filme 
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}/release_dates`, options), // data delançamento e classificação
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}/watch/providers`, options), // onde assistir
            fetch(`https://api.themoviedb.org/3/movie//${termoPesquisado}/credits`, options), // creditos (atores e diretor)
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}/recommendations?language=pt-BR`, options) // recomendações
        ]);

        let dados = await RESPOSTA[0].json(); // // detalhes do filme
        let classificacao = await RESPOSTA[1].json(); // data delançamento e classificação
        let watchProviders = await RESPOSTA[2].json(); // onde assistir
        let elencoCreditos = await RESPOSTA[3].json(); // creditos (atores e diretor)
        let similar = await RESPOSTA[4].json(); // recomendações

        const ENCONTROU_FILME = dados.success; // verificando o status do retorno se encontrou ou não

        if(ENCONTROU_FILME == false){ // se não encontrou ele retorna false
            erroBuscar.classList.remove("hidden");
        }else{ // se encontrou ele retorna undefined
            // se o filme existir, remove a classe hidden dos blocos de conteúdo
            informacoesPrincipais.classList.remove("hidden");
            ondeAssistir.classList.remove("hidden");
            blocoCreditos.classList.remove("hidden");

            backdrop[0].style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${dados.backdrop_path})`; // carrega o backdrop do filme
            tituloFilme.innerHTML = dados.title || dados.name; // carrega o titulo ou nome de acordo com o retorno da API
            
            let classificacaoFilmeRetorno = classificacao.results.find(item => item.iso_3166_1 === "BR"); // Procuro em results o iso_3166_1=BR
            let classificacaoBR = classificacaoFilmeRetorno?.release_dates?.[0]?.certification || "N/D"; // Se existir retorna o valor, se não reorna N/D
            classificacaoFilme.innerHTML = classificacaoBR; // exibe a classificação

            anoLancamento.innerHTML = `${dados.release_date.split("-")[0]}`; // exibe o ano de lançamento
            
            duracao.innerHTML = `${dados.runtime} min`; // exibe a duração
            
            let idImdb = dados.imdb_id; //Pega o ID Imdb que vem na Api
            apiImdb(idImdb, notaImdb); // passa via parametro para a função importada ApiImdb

            sinopse.innerHTML = `${dados.overview}`; // Exibe no campo sinopse o valor de dados.overview

            let watchProvidersRetorno = watchProviders.results.BR; // pega aqui apenas os Serviços que estão na chave BR            
            
            if (!watchProvidersRetorno){ // se a variavel que tem os serviços que estão na chave BR estiver vazia
                let informarErro = document.createElement("p"); // cria um elemento p
                informarErro.classList.add("text-xs", "text-white"); // adiciona essas classes
                informarErro.innerText = "No momento não encontramos este filme em nenhum serviço de streaming."; // adiciona este texto
                ondeAssistir.appendChild(informarErro);// adiciona o elemento p criado dentro da div ondeAssistir
            }else{ // se tiver conteúdo
                let conteudoServicos = document.createElement("div"); // cria um elemento div
                conteudoServicos.classList.add("flex", "flex-col", "gap-3"); // adiciona essas classes
                ondeAssistir.appendChild(conteudoServicos); // adiciona a div criada em OndeAssistir
                
                const ordem = ["ads", "flatrate", "rent", "buy"]; // crio um array com a ordem que eu quero

                let temTipo = []; //crio um array para contar os serviços exibidos

                ordem.forEach(tipo => { // faço um forEach no array
                    const servicos = watchProvidersRetorno[tipo];
                    if (!servicos || !servicos.length) return;

                    switch (tipo) {
                        case "ads":
                            const servicosBoxTipoAds = criarBoxServico(conteudoServicos, "Grátis");
                            temTipo.push(servicosBoxTipoAds);
                            servicos.forEach(servico => {
                                const elementoServico = criarServico(servico);
                                servicosBoxTipoAds.appendChild(elementoServico);
                            });
                        break;

                        case "flatrate":
                            const servicosBoxTipoFlatrate = criarBoxServico(conteudoServicos, "Por Assinatura");
                            temTipo.push(servicosBoxTipoFlatrate);
                            servicos.forEach(servico => {
                                const elementoServico = criarServico(servico);
                                servicosBoxTipoFlatrate.appendChild(elementoServico);
                            });
                        break;

                        case "rent":
                            const servicosBoxTipoRent = criarBoxServico(conteudoServicos, "Alugar");
                            temTipo.push(servicosBoxTipoRent);
                            servicos.forEach(servico => {
                                const elementoServico = criarServico(servico);
                                servicosBoxTipoRent.appendChild(elementoServico);
                            });
                        break;

                        case "buy":
                            const servicosBoxTipoBuy = criarBoxServico(conteudoServicos, "Comprar");
                            temTipo.push(servicosBoxTipoBuy);
                            servicos.forEach(servico => {
                                const elementoServico = criarServico(servico);
                                servicosBoxTipoBuy.appendChild(elementoServico);
                            });
                        break;
                    }
                });

                if (temTipo.length > 1) {
                    temTipo.forEach((box, index) => {
                       if (index < temTipo.length - 1) {
                            box.classList.add("border-b", "border-darkcade", "pb-3");
                        } 
                    });
                }
                
                let contaGenero = 0;
                let todosGeneros = dados.genres;
                todosGeneros.forEach(genero => {
                    let novoGenero = document.createElement("span");
                    contaGenero ++;
                    if(contaGenero < todosGeneros.length){
                        novoGenero.innerHTML = ` <a href="">${genero.name}</a>,`;
                    }else if(contaGenero = todosGeneros.length){
                        novoGenero.innerHTML = ` <a href="">${genero.name}</a>.`;
                    }
                    generos.appendChild(novoGenero);
                });

                const elencoCast = elencoCreditos.cast.filter(  // crio uma variavel que filtra o resultado, acessando o obejto results e filtro
                    item => item.known_for_department === "Acting"
                );

                let contaelenco = 0;
                elencoCast.forEach(cast => {
                    let novoCast = document.createElement("span");
                    contaelenco ++;
                    if(contaelenco < 10){
                        novoCast.innerHTML = ` <a href="">${cast.name}</a>,`;
                    }else if(contaelenco == 10){
                        novoCast.innerHTML = ` <a href="">${cast.name}.</a>`;
                    }
                    elenco.appendChild(novoCast);
                });

                let elencoDiretor = elencoCreditos.crew.find(item => item.job === "Director");
                diretor.innerHTML = `${elencoDiretor.name}.`;

                let todosSimilar = similar.results;
                let contaSimilar = 0;
                todosSimilar.forEach(similar => {
                    if(contaSimilar <= 5){
                        let novoSimilar = document.createElement("li");
                        let linkNovoSimilar = document.createElement("a");
                        let imagemNovoSimilar = document.createElement("img");
                        linkNovoSimilar.setAttribute("href", `filme.html?id=${similar.id}`);
                        imagemNovoSimilar.setAttribute("src", `https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${similar.poster_path}`);
                        maisOpcoes.appendChild(novoSimilar);
                        novoSimilar.appendChild(linkNovoSimilar);
                        linkNovoSimilar.appendChild(imagemNovoSimilar);
                        contaSimilar++
                    }
                });

            }            
        } 
    } catch (error) {
        console.log("Erro:", error);  
        erroBuscar.classList.remove("hidden");      
    }
}
detalhesFilme();