import { CONFIG } from '../utils/config.js'; // importando a chave key
import { apiImdb } from './imdbApi.js';
import { criarServico } from './scripts-filmes-series.js';
import { criarBoxServico } from './scripts-filmes-series.js';

const queryString = window.location.search; // acessando a url do navegador
const urlParams = new URLSearchParams(queryString); // separando os elementos da url
const termoPesquisar = urlParams.get('id'); // pegando apenas o id

async function detalhesFilme(termoPesquisado) {
    termoPesquisado = Number(termoPesquisar);

    let tituloPagina = document.getElementsByTagName("title");

    let erroBuscar = document.getElementById("erro-buscar");
    let informacoesPrincipais = document.getElementById("informacoes-principais");
    let ondeAssistir = document.getElementById("onde-assistir");
    let blocoCreditos = document.getElementById("bloco-creditos");

    let backdrop = document.getElementsByClassName("backdrop");
    let tituloFilme = document.getElementById("titulo-filme");
    let temporadas = document.getElementById("temporadas");
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
    let criador = document.getElementById("criador");

    let boxMaisOpcoes = document.getElementById("mais-opcoes");
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
            fetch(`https://api.themoviedb.org/3/tv/${termoPesquisado}?language=pt-BR`, options), // detalhes do filme
            fetch(`https://api.themoviedb.org/3/tv/${termoPesquisado}/content_ratings`, options),
            fetch(`https://api.themoviedb.org/3/tv/${termoPesquisado}/external_ids`, options),
            fetch(`https://api.themoviedb.org/3/tv/${termoPesquisado}/watch/providers`, options), // onde assistir
            fetch(`https://api.themoviedb.org/3/tv/${termoPesquisado}/aggregate_credits`, options), // creditos (atores e diretor)
            fetch(`https://api.themoviedb.org/3/tv/${termoPesquisado}/recommendations?language=pt-BR`, options), // recomendações
        ]);

        let dados = await RESPOSTA[0].json(); // // detalhes do filme
        let contentRatings = await RESPOSTA[1].json();
        let externalIDs = await RESPOSTA[2].json();
        let watchProviders = await RESPOSTA[3].json(); // onde assistir
        let elencoCreditos = await RESPOSTA[4].json(); // creditos (atores e diretor)
        let similar = await RESPOSTA[5].json(); // recomendações
       
        const ENCONTROU_FILME = dados.success; // verificando o status do retorno se encontrou ou não
        const FILME_ADULTO = dados.adult;

        if(ENCONTROU_FILME == false || FILME_ADULTO){ // se não encontrou ele retorna false
            erroBuscar.classList.remove("hidden");
            tituloPagina[0].innerText = `Ops, Houve algum erro :( - Cadê o Filme`;
        }else{ // se encontrou ele retorna undefined
            // se o filme existir, remove a classe hidden dos blocos de conteúdo
            tituloPagina[0].innerText = `${dados.title || dados.name} - Cadê o Filme`;
            informacoesPrincipais.classList.remove("hidden");
            ondeAssistir.classList.remove("hidden");
            blocoCreditos.classList.remove("hidden");
            maisOpcoes.classList.remove("hidden");

            backdrop[0].style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${dados.backdrop_path})`; // carrega o backdrop do filme
            
            tituloFilme.innerHTML = dados.title || dados.name; // carrega o titulo ou nome de acordo com o retorno da API

            let classificacaoRetorno = contentRatings.results.find(item => item.iso_3166_1 === "BR"); // Procuro em results o iso_3166_1=BR
            let classificacaoBR = classificacaoRetorno.rating || "N/D"; // Se existir retorna o valor, se não reorna N/D
            classificacaoFilme.innerHTML = classificacaoBR; // exibe a classificação

            anoLancamento.innerHTML = `${dados.first_air_date.split("-")[0]}`; // exibe o ano de lançamento
            
            temporadas.innerText = `${dados.number_of_seasons} ${dados.number_of_seasons === 1 ? 'temporada' : 'temporadas'}`;

            let idImdb = externalIDs.imdb_id; //Pega o ID Imdb que vem na Api
            apiImdb(idImdb, notaImdb); // passa via parametro para a função importada ApiImdb

            sinopse.innerHTML = `${dados.overview}`; // Exibe no campo sinopse o valor de dados.overview


            if(!watchProviders){
                console.log("Este filme não esta disponivel no Brasil ou em outos paises.");
            }else{
                let watchProvidersRetorno = watchProviders.results.BR; // pega aqui apenas os Serviços que estão na chave BR        
                
                if (!watchProvidersRetorno){ // se a variavel que tem os serviços que estão na chave BR estiver vazia
                    let informarErro = document.createElement("p"); // cria um elemento p
                    informarErro.classList.add("text-xs", "text-white"); // adiciona essas classes
                    informarErro.innerText = ":( Poxa! Parece que esta série não está disponível em nenhum serviço de streaming."; // adiciona este texto
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

                }
            }

            let contaGenero = 0;
            let todosGeneros = dados.genres;
            console.log(todosGeneros);
            todosGeneros.forEach(genero => {
                let novoGenero = document.createElement("span");
                contaGenero ++;
                if(contaGenero < todosGeneros.length){
                    novoGenero.innerHTML = ` <a href="genero.html?id=${genero.id}">${genero.name}</a>,`;
                }else if(contaGenero = todosGeneros.length){
                    novoGenero.innerHTML = ` <a href="genero.html?id=${genero.id}">${genero.name}</a>.`;
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
                    novoCast.innerHTML = ` <a href="pessoa.html?id=${cast.id}">${cast.name}</a>,`;
                }else if(contaelenco == 10){
                    novoCast.innerHTML = ` <a href="pessoa.html?id=${cast.id}">${cast.name}.</a>`;
                }
                elenco.appendChild(novoCast);
            });


            const elencoCreator = dados.created_by;

            let contaCreator = 0;
            elencoCreator.forEach(creator => {
                let novoCreator = document.createElement("span");
                contaCreator ++;
                if(contaCreator < elencoCreator.length){
                    novoCreator.innerHTML = ` <a href="pessoa.html?id=${creator.id}">${creator.name}</a>,`;
                }else if(contaCreator == elencoCreator.length){
                    novoCreator.innerHTML = ` <a href="pessoa.html?id=${creator.id}">${creator.name}.</a>`;
                }
                criador.appendChild(novoCreator);
            });

            let todosSimilar = similar.results;
            console.log(todosSimilar);
            if(todosSimilar.length == 0){
                maisOpcoes.classList.add('hidden');
                let informarErro = document.createElement("p"); // cria um elemento p
                informarErro.classList.add("text-xs", "text-white"); // adiciona essas classes
                informarErro.innerText = ":( Poxa! Não encontramos títulos semelhantes para esta série."; // adiciona este texto   
                boxMaisOpcoes.appendChild(informarErro);// adiciona o elemento p criado dentro da div ondeAssistir
            }else{
                boxMaisOpcoes.classList.remove("hidden");
                let contaSimilar = 0;
                todosSimilar.forEach(similar => {
                if(contaSimilar <= 5){
                        let novoSimilar = document.createElement("li");
                        let linkNovoSimilar = document.createElement("a");
                        let imagemNovoSimilar = document.createElement("img");
                        linkNovoSimilar.setAttribute("href", `tv.html?id=${similar.id}`);
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