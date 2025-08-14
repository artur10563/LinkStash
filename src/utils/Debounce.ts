export function debounce(func: Function, delay: number, context?: any): (...args: any[]) => void {
    let timeoutId: any;

    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}