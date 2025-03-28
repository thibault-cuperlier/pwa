import { supabase } from "./supabase";

// Fonction d'inscription
export async function signUp(pseudo, password) {
    // Vérifie si le pseudo existe déjà
    let { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("pseudo", pseudo)
        .single();

    if (existingUser) {
        return { error: "Ce pseudo est déjà pris." };
    }

    // Inscription : on crée l'utilisateur dans Supabase
    const { data, error } = await supabase
        .from("users")
        .insert([{ pseudo, password, tokens: 100 }]); // Donne 100 tokens à l'inscription

    if (error) {
        return { error: error.message };
    }

    return { data };
}

// Fonction de connexion
export async function signIn(pseudo, password) {
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("pseudo", pseudo)
        .eq("password", password)
        .single();

    if (error || !user) {
        return { error: "Pseudo ou mot de passe incorrect." };
    }

    return { user };
}

// Fonction pour récupérer le solde de tokens
export async function getTokens(pseudo) {
    const { data, error } = await supabase
        .from("users")
        .select("tokens")
        .eq("pseudo", pseudo)
        .single();

    if (error) {
        return { error: error.message };
    }

    return { tokens: data.tokens };
}

// Fonction pour envoyer des tokens à un autre utilisateur
export async function sendTokens(fromPseudo, toPseudo, amount) {
    if (amount <= 0) {
        return { error: "Le montant doit être supérieur à 0." };
    }

    // Vérifie si l'utilisateur émetteur a assez de tokens
    const { data: sender, error: senderError } = await supabase
        .from("users")
        .select("tokens")
        .eq("pseudo", fromPseudo)
        .single();

    if (senderError || !sender || sender.tokens < amount) {
        return { error: "Fonds insuffisants." };
    }

    // Vérifie si le destinataire existe
    const { data: receiver, error: receiverError } = await supabase
        .from("users")
        .select("tokens")
        .eq("pseudo", toPseudo)
        .single();

    if (receiverError || !receiver) {
        return { error: "Le destinataire n'existe pas." };
    }

    // Met à jour les tokens
    const { error: updateSenderError } = await supabase
        .from("users")
        .update({ tokens: sender.tokens - amount })
        .eq("pseudo", fromPseudo);

    if (updateSenderError) {
        return { error: "Erreur lors de l'envoi." };
    }

    const { error: updateReceiverError } = await supabase
        .from("users")
        .update({ tokens: receiver.tokens + amount })
        .eq("pseudo", toPseudo);

    if (updateReceiverError) {
        return { error: "Erreur lors de la réception." };
    }

    return { success: true };
}
