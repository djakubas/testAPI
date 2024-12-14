const config = {
    clientId: "e8fde093-5323-4a7f-8ec3-056017f714c8",
    tenantId: "be030616-78c0-481d-bcd0-9d07452a14c2",
    redirectUri: "https://djakubas.github.io/testAPI/",
    apiScope: "api://e8fde093-5323-4a7f-8ec3-056017f714c8/ForecastRead",
    apiUrl: "https://localhost:7186/weatherforecast",
};

const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    console.log("Generated Code Verifier:", verifier);
    return verifier;
};

const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    console.log("Generated Code Challenge:", challenge);
    return challenge;
};

const login = async () => {
    console.log("Starting login process...");
    const codeVerifier = generateCodeVerifier();
    sessionStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const authUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize?` +
        `client_id=${config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
        `&response_mode=query&scope=${encodeURIComponent(config.apiScope)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    console.log("Redirecting to:", auth
