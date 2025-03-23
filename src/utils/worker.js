/* eslint-disable no-restricted-globals */
import { generateUsers } from './generateUsers.js';

self.onmessage = (event) => {
    const { total, chunkSize } = event.data;
    const generator = generateUsers(total, chunkSize);

    for (let chunk of generator) {
        self.postMessage(chunk);
        console.log('Sent chunk:', chunk.length);
    }
};