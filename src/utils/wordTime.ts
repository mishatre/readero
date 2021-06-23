function secondsToStr(seconds1: number) {
    var temp = seconds1;
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' d';
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' h';
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' m';
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' s';
    }
    return ''; //'just now' //or other string you like;
}

export function completionRate(wordCount: number, currentWordIndex: number) {
    return ((currentWordIndex / wordCount) * 100).toFixed(1);
}

export function timeToRead(
    wordCount: number,
    currentWordIndex: number,
    wordPerMinute: number
) {
    return secondsToStr(
        Math.floor((wordCount - currentWordIndex) / (wordPerMinute / 60))
    );
}
