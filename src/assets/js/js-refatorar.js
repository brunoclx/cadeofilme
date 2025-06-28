const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const termoPesquisar = urlParams.get('id');

async function detalhesFilme(termoPesquisado) {
    let backdrop = document.getElementsByClassName("backdrop");
    let tituloFilme = document.getElementById("titulo-filme");
    let duracao = document.getElementById("duracao");
    let anoLancamento = document.getElementById("ano");
    let classificacaoFilme = document.getElementById("classificacao");
    let notaImdb = document.getElementById("nota-tmdb");

    let sinopse = document.getElementById("sinopse");
    
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
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzFlYmFlZTUzYjg4ZTg5OTZjMjYxYTQzMWI3ZmVmOSIsIm5iZiI6MTUyNTcxMDE1OC41NjcwMDAyLCJzdWIiOiI1YWYwN2Q0ZTBlMGEyNjFkODMwMTIwNGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9bR2GldZkN9Bvk1hZ8b1p2d-5asNZoUortYKtg5x2Gk'
            }
        };
        termoPesquisado = termoPesquisar;
        const RESPOSTA = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}?language=pt-BR`, options),
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}/release_dates`, options),
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}/watch/providers`, options),
            fetch(`https://api.themoviedb.org/3/movie//${termoPesquisado}/credits`, options),
            fetch(`https://api.themoviedb.org/3/movie/${termoPesquisado}/recommendations?language=pt-BR`, options)
        ]);
        let dados = await RESPOSTA[0].json();
        let classificacao = await RESPOSTA[1].json();
        let watchProviders = await RESPOSTA[2].json();
        let elencoCreditos = await RESPOSTA[3].json();
        let similar = await RESPOSTA[4].json();

        backdrop[0].style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${dados.backdrop_path})`;
        tituloFilme.innerHTML = dados.title || dados.name;                

        

        duracao.innerHTML = `${dados.runtime} min`;

        let classificacaoFilmeRetorno = classificacao.results.find(item => item.iso_3166_1 === "BR");
        let classificacaoBR = classificacaoFilmeRetorno ? classificacaoFilmeRetorno.release_dates[0].certification : "";
        classificacaoFilme.innerHTML = classificacaoBR;
        
        anoLancamento.innerHTML = `${dados.release_date.split("-")[0]}`;

        let idImdb = dados.imdb_id;
        
        async function ApiImdb(idFilme) {
            idFilme = idImdb;
            try {
                const RESPOSTAIMDB = await fetch(`https://rest.imdbapi.dev/v2/titles/${idFilme}`);
                const dadosImdb = await RESPOSTAIMDB.json();
                notaImdb.innerHTML = `${dadosImdb.rating.aggregate_rating}/10`;
            } catch (error) {
                console.log("Erro", error);
            }
        }
        ApiImdb();

        sinopse.innerHTML = `${dados.overview}`;

        //console.log(watchProviders);
        let watchProvidersRetorno = watchProviders.results.BR;
        
        let assistirGratisArr = watchProvidersRetorno.ads;
        let porAssinaturaArr = watchProvidersRetorno.flatrate;
        let paraComprarArr = watchProvidersRetorno.buy;
        let paraAlugarArr = watchProvidersRetorno.rent;

        function criarServico(servico){
            let novoServico = document.createElement("div");
            let imagemServico = document.createElement("img");
            let nomeServico = document.createElement("p");
            novoServico.classList.add(
                "servico",
                "flex",
                "gap-3",
                "items-center",
                "text-xs");
            imagemServico.classList.add(
                "h-8",
                "rounded-full"
            );
            imagemServico.setAttribute("src", `https://media.themoviedb.org/t/p/original/${servico.logo_path}`);
            let nomeServicoretorno = servico.provider_name;
            switch (nomeServicoretorno){
                case "Netflix Standard with Ads":
                    nomeServico.innerHTML = "Netflix com anúncios";
                    break;
                case "Google Play Movies":
                    nomeServico.innerHTML = "Google Play Filmes";
                    break;
                case "Amazon Prime Video with Ads":
                    nomeServico.innerHTML = "Amazon Prime Vídeo com anúncios"
                    break;
                default:
                    nomeServico.innerHTML = nomeServicoretorno;
            }
            novoServico.append(imagemServico, nomeServico);
            return novoServico;
        }

        if(assistirGratisArr){
            assistirGratis.style.display = "block";
            assistirGratisArr.forEach(servico => {
                const elementoServico = criarServico(servico); // preciso salvar em uma variavel o retorno da função para adicionar na div contentAssistirGratis
                contentAssistirGratis.appendChild(elementoServico);                         
            });
        }

        if(porAssinaturaArr){
            porAssinatura.style.display = "block";
            porAssinaturaArr.forEach(servico => {
                const elementoServico = criarServico(servico); // aqui chamamos a função
                contentPorAssinatura.appendChild(elementoServico);        
            });
        }

        if(paraComprarArr){
            paraComprar.style.display = "block";
            paraComprarArr.forEach(servico => {
                const elementoServico = criarServico(servico); // aqui chamamos a função
                contentParaComprar.appendChild(elementoServico);        
            });
        }

        if(paraAlugarArr){
            paraAlugar.style.display = "block";
            paraAlugarArr.forEach(servico => {
                const elementoServico = criarServico(servico); // aqui chamamos a função
                contentParaAlugar.appendChild(elementoServico);        
            });
        }

        const elencoCast = elencoCreditos.cast.filter(  // crio uma variavel que filtra o resultado, acessando o obejto results e filtro
            item => item.known_for_department === "Acting"
        );

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


        

    } catch (error) {
        console.log("Erro:", error); 
    }
}
detalhesFilme();