
async function carregarDashboard() {

    try {

        const resposta = await fetch("/api/dashboard");

        if (!resposta.ok) {

            throw new Error("Erro ao buscar dados.");

        }

        const dados = await resposta.json();

        // ===============================
        // FATURAMENTO
        // ===============================

        document.getElementById("faturamento").textContent =
            dados.faturamento.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        // ===============================
        // CORTES
        // ===============================

        document.getElementById("cortes").textContent =
            dados.cortes;

        // ===============================
        // TICKET MÉDIO
        // ===============================

        document.getElementById("ticket").textContent =
            dados.ticket.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

        // ===============================
        // DATA
        // ===============================

        document.getElementById("data").textContent =
            `Hoje: ${dados.data}`;

        // ===============================
        // ÚLTIMOS CORTES
        // ===============================

        const lista = document.getElementById("lista");

        lista.innerHTML = "";

        if (dados.ultimosCortes.length === 0) {

            const linha = document.createElement("tr");
            const celula = document.createElement("td");
            celula.colSpan = 7;
            celula.textContent = "Nenhum corte registrado.";
            linha.appendChild(celula);
            lista.appendChild(linha);

            return;

        }

        dados.ultimosCortes.forEach(corte => {

            const linha = document.createElement("tr");

            [corte.cliente, corte.corte,
                Number(corte.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                corte.pagamento, corte.data, corte.hora, corte.observacao].forEach((valor) => {
                const celula = document.createElement("td");
                celula.textContent = valor ?? "";
                linha.appendChild(celula);
            });

            lista.appendChild(linha);

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}

// Executa quando a página abre
carregarDashboard();
