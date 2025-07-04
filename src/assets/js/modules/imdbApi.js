export async function apiImdb(idFilme, elementoNota) {
    try {
        const RESPOSTAIMDB = await fetch(`https://rest.imdbapi.dev/v2/titles/${idFilme}`);
        const dadosImdb = await RESPOSTAIMDB.json();
        if(dadosImdb){
            elementoNota.innerHTML = `${dadosImdb.rating.aggregate_rating}/10`;  
        }else{
            elementoNota.innerText = "N/D"; 
        }
        
    } catch (error) {
        console.log("Erro", error);
    }
}