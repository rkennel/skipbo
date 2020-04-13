export function generateUniqueId(): string {
    const availableCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    let id = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex: number = Math.floor(
            Math.random() * availableCharacters.length
        );

        id = id + availableCharacters.charAt(randomIndex);
    }

    return id;
}