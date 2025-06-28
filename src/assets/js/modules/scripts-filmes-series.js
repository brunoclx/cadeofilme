export function criarBoxServico(conteudoServicos, valorNomeBoxTipo){
    let novoBoxTipo = document.createElement("div");
    let nomeBoxTipo = document.createElement("p");
    let servicosBoxTipo = document.createElement("div");
    novoBoxTipo.classList.add("text-white", "flex", "flex-col", "gap-5");
    
    nomeBoxTipo.innerText = valorNomeBoxTipo;
    
    servicosBoxTipo.classList.add("grid", "grid-cols-2", "gap-5", "pb-3");
    novoBoxTipo.append(nomeBoxTipo, servicosBoxTipo);
    conteudoServicos.appendChild(novoBoxTipo);

    return servicosBoxTipo;
}


export function criarServico(servico){
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