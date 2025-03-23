export function* generateUsers(total, chunkSize = 50000) {
    for (let i = 0; i < total; i += chunkSize) {
        const chunk = [];
        for (let j = i; j < Math.min(i + chunkSize, total); j++) {
            chunk.push({
                id: j + 1,
                firstName: `User${j + 1}`,
                lastName: `LastName${j + 1}`,
                age: Math.floor(Math.random() * 50 + 18),
                email: `user${j + 1}@example.com`,
                version: 1
            });
        }
        yield chunk;
    }
}
