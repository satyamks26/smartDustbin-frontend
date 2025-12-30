const BASE_URL = "https://smartdustbin.onrender.com";

console.log("BIN API USING RENDER BACKEND");


export async function visitBin(binId, userId) {
    const url = userId
        ? `${BASE_URL}/bin/${binId}?userId=${userId}`
        : `${BASE_URL}/bin/${binId}`;

    const res = await fetch(url);
    return res.json();
}

export async function openBin(binId, userId) {
    const res = await fetch(
        `${BASE_URL}/bin/${binId}/open?userId=${userId}`,
        { method: "POST" }
    );
    return res.json();
}

export async function closeBin(binId, userId) {
    const res = await fetch(
        `${BASE_URL}/bin/${binId}/close?userId=${userId}`,
        { method: "POST" }
    );
    return res.json();
}
