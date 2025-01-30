export function buildRoutePath(path) {
    const regexRoutePath = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(regexRoutePath, '(?<$1>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}