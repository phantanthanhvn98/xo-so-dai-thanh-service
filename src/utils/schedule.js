export function isMienNamLive(){
    const currentTime = new Date();
    const checkTime = new Date();
    checkTime.setHours(16, 5, 0, 0);

    return currentTime.getTime() > checkTime.getTime()
}

export function isMienTrungLive(){
    const currentTime = new Date();
    const checkTime = new Date();
    checkTime.setHours(17, 5, 0, 0);

    return currentTime.getTime() > checkTime.getTime()
}

export function isMienBacLive(){
    const currentTime = new Date();
    const checkTime = new Date();
    checkTime.setHours(18, 5, 0, 0);

    return currentTime.getTime() > checkTime.getTime()
}