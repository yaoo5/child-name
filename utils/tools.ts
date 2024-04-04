

export function notEmptyArray(value: unknown): boolean {
    return Array.isArray(value) && value.length !== 0;
}