export async function apiImdb(idFilme, elementoNota) {
    try {
        const RESPOSTAIMDB = await fetch(`https://rest.imdbapi.dev/v2/titles/${idFilme}`);
        const dadosImdb = await RESPOSTAIMDB.json();
        if(dadosImdb.rating.aggregate_rating != ""){
            elementoNota.innerHTML = `${dadosImdb.rating.aggregate_rating}/10`;  
        }else{
            elementoNota.innerHTML = "N/D"; 
        }
        
    } catch (error) {
        console.log("Erro", error);
    }
}