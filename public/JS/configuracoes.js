const formSenha = document.getElementById("formSenha");
formSenha.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mensagem = document.getElementById("mensagem");
    const novaSenha = document.getElementById("novaSenha").value;
    if (novaSenha !== document.getElementById("confirmarSenha").value) {
        mensagem.textContent = "A confirmação não corresponde à nova senha.";
        return;
    }
    try {
        const resposta = await fetch("/api/admin/senha", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senhaAtual: document.getElementById("senhaAtual").value, novaSenha })
        });
        const dados = await resposta.json();
        mensagem.textContent = dados.mensagem || "Não foi possível atualizar a senha.";
        if (resposta.ok && dados.sucesso) formSenha.reset();
    } catch (erro) {
        mensagem.textContent = "Erro ao conectar com o servidor.";
    }
});
