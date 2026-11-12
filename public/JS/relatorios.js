const formulario = document.getElementById("filtro");
const campoInicio = document.getElementById("inicio");
const campoFim = document.getElementById("fim");
const corpo = document.getElementById("registros");
const moeda = (valor) => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const hojeLocal = () => {
    const agora = new Date();
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;
};

async function gerarRelatorio(event) {
    event?.preventDefault();
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = "";
    if (campoInicio.value > campoFim.value) {
        mensagem.textContent = "A data inicial deve ser anterior à data final.";
        return;
    }
    try {
        const query = new URLSearchParams({ inicio: campoInicio.value, fim: campoFim.value });
        const resposta = await fetch(`/api/relatorios?${query}`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível gerar o relatório.");
        document.getElementById("faturamento").textContent = moeda(dados.resumo.faturamento);
        document.getElementById("quantidade").textContent = dados.resumo.quantidade;
        document.getElementById("ticket").textContent = moeda(dados.resumo.ticketMedio);
        corpo.replaceChildren();
        dados.registros.forEach((registro) => {
            const linha = document.createElement("tr");
            [registro.data, registro.hora, registro.cliente, registro.corte, registro.pagamento, moeda(registro.valor)].forEach((valor) => {
                const celula = document.createElement("td");
                celula.textContent = valor ?? "";
                linha.appendChild(celula);
            });
            corpo.appendChild(linha);
        });
        if (!dados.registros.length) mensagem.textContent = "Nenhum atendimento encontrado nesse período.";
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

campoInicio.value = hojeLocal();
campoFim.value = hojeLocal();
formulario.addEventListener("submit", gerarRelatorio);
gerarRelatorio();
