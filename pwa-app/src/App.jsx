import { useState } from "react";
import { signUp, signIn, getTokens, sendTokens } from "./auth";

function App() {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(0);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [toPseudo, setToPseudo] = useState("");

    async function handleSignUp() {
        const result = await signUp(pseudo, password);
        if (result.error) setError(result.error);
        else {
            setUser(result.data[0]);
            await fetchTokens(result.data[0].pseudo);
        }
    }

    async function handleSignIn() {
        const result = await signIn(pseudo, password);
        if (result.error) setError(result.error);
        else {
            setUser(result.user);
            await fetchTokens(result.user.pseudo);
        }
    }

    async function fetchTokens(userPseudo) {
        const result = await getTokens(userPseudo);
        if (result.error) setError(result.error);
        else setTokens(result.tokens);
    }

    async function handleSendTokens() {
        const result = await sendTokens(user.pseudo, toPseudo, parseInt(amount));
        if (result.error) setError(result.error);
        else {
            setTokens(tokens - amount); // Met à jour le solde local des tokens
            alert(`Vous avez envoyé ${amount} tokens à ${toPseudo}`);
        }
    }

    return (
        <div>
            <h1>Application de Tokens</h1>
            {!user ? (
                <>
                    <input
                        type="text"
                        placeholder="Pseudo"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSignUp}>S'inscrire</button>
                    <button onClick={handleSignIn}>Se connecter</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            ) : (
                <>
                    <h2>Bienvenue, {user.pseudo}</h2>
                    <p>Tokens disponibles : {tokens}</p>
                    <div>
                        <h3>Envoyer des tokens</h3>
                        <input
                            type="text"
                            placeholder="Pseudo du destinataire"
                            value={toPseudo}
                            onChange={(e) => setToPseudo(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Montant"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={handleSendTokens}>Envoyer</button>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            )}
        </div>
    );
}

export default App;
