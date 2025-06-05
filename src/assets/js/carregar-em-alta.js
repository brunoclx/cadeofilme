let listaEmAlta = document.getElementById("lista-em-alta"); // Pega a lista de elementos do Em Alta
async function carregarEmAlta() { // Crio a função assincrona carregarEmAlta
    try { // tento fazer a chamada, se der certo faz o que esta abaixo
        const options = { // crio uma const para passar as informações (opções)
            method: 'GET', // método usado GET
            headers: {
                accept: 'application/json', // forma que vou passar a informação
                // token TMDB:
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzFlYmFlZTUzYjg4ZTg5OTZjMjYxYTQzMWI3ZmVmOSIsIm5iZiI6MTUyNTcxMDE1OC41NjcwMDAyLCJzdWIiOiI1YWYwN2Q0ZTBlMGEyNjFkODMwMTIwNGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9bR2GldZkN9Bvk1hZ8b1p2d-5asNZoUortYKtg5x2Gk'
            }
        };
        const RESPOSTA = await fetch('https://api.themoviedb.org/3/trending/all/day?language=pt-BR', options); // faço uma chamada na api através da URL de Trending, passando as informações acima
        let dados = await RESPOSTA.json();// armazeno o retorno da api em formato json 

        const filmesSeries = dados.results.filter(  // crio uma variavel que filtra o resultado, acessando o obejto results e filtro
            item => item.media_type === "movie" || item.media_type === "tv"// por tv ou movie
        );

        let contador = 0; //inicio o contador

        filmesSeries.forEach(item => { // faço um forEach na variavel onde armazeno o array  filtado acima
            contador++; // acrescento um a variável contador toda vez que passar aqui
            if(contador <= 8){ // se o contador for menor ou igual a 8
                let novoItem = document.createElement("li"); // cria um novo elemento
                novoItem.className = "py-3"; // acrescenta a class
                novoItem.innerHTML = `<a href="/src/filme.html?id=${item.id}"><i class="fa-solid fa-chart-line text-darkcade dark:text-white"></i> <span class="px-2">${item.title || item.name}</span></a>`; // dentro do li criado adiciono mais informações como link e o titulo ou name
                listaEmAlta.appendChild(novoItem); // adiciono o novo li criado dentro da lista "listaEmAlta"
            }
        });

    } catch (error) { // se der errado, mostra o erro no console
        console.log("Erro", error);
    }
}
carregarEmAlta(); // chamada da função