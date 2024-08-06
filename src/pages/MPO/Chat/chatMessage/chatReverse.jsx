export const chatReverse = (data) => {
    if (data) {
        const reversedIds = data?.reduce((acc, obj) => {
            if ('id' in obj) {
                acc.unshift(obj); // Add 'id' dictionaries to the beginning of the array
            } else if ('message' in obj) {
                acc.push(obj); // Add 'content' dictionaries to the end of the array
            }
            return acc;
        }, []);

        return reversedIds
    }
    else {
        return []
    }
}