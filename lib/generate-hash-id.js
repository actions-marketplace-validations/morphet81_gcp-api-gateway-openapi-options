const generateHashId = (xGoogleBackEnd) => {
    if (!xGoogleBackEnd) throw new Error("xGoogleBackEnd is empty");

    const rand = Math.random();
    return `${xGoogleBackEnd}-${rand}`;
};

module.exports = generateHashId;