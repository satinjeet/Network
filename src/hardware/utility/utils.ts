let set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateID(length: number = 8, characterSet: string = set) {
    return Array(length).join().split(',').map(function() { return characterSet.charAt(Math.floor(Math.random() * characterSet.length)); }).join('');
}

export function generateHDWId() {
    let id = generateID(8, 'ABCDE0123456789');

    return `${id[0]}${id[1]}:${id[2]}${id[3]}:${id[4]}${id[5]}:${id[6]}${id[7]}`;
}