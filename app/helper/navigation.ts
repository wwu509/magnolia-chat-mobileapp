import {Href, router} from "expo-router";

type Params = {
    [key: string]: string;
}

const navigateTo = (path: string, params?: Params): void => {
    const url = params
        ? `${path}?${new URLSearchParams(params).toString()}`
        : path;
    // @ts-ignore
    router.push(url);
};

const navigateBack = (): void => {
    router.back();
};

const replaceRoute = (path: Href<string | object>): void => {
    router.replace(path);
};

const reset = (path: Href<string | object>): void => {
    router.replace(path);
};

export {navigateTo, navigateBack, replaceRoute, reset};
