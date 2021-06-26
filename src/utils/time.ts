
const timestampToHumanTime = (timestamp: number) => {

    const temp = Math.floor(timestamp / 1000);

    let string = '';

    const days = Math.floor((temp % 31536000) / 86400);
    if(days) {
        string += `${days}d `;
    }
    const hours = Math.floor((temp % 86400) / 3600);
    if(hours) {
        string += `${hours}h `;
    }
    const minutes = Math.floor((temp % 3600) / 60);
    if(minutes) {
        string += `${minutes}m `;
    }
    const seconds = temp % 60;
    if(seconds) {
        string += `${seconds}s`;
    }

    if(string === '') {
        return '0';
    }

    return string;
}

export {
    timestampToHumanTime
};