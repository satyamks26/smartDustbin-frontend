const BASE_URL = "http://10.253.222.113:5000";

export async function visitBin(binId, userId) {
    const url = userId
        ? `${BASE_URL}/bin/${binId}?userId=${userId}`
        : `${BASE_URL}/bin/${binId}`;

    const res = await fetch(url);
    return res.json();
}

export async function openBin(binId) {
    const res = await fetch(`${BASE_URL}/bin/${binId}/open`, {
        method: "POST"
    });
    return res.json();
}

export async function closeBin(binId) {
    const res = await fetch(`${BASE_URL}/bin/${binId}/close`, {
        method: "POST"
    });
    return res.json();
}
