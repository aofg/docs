declare module "micro-route" {
    import { IncomingMessage } from "http";

    type MethodType = 'OPTIONS' | 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATH';

    function route(pattern: string | RegExp, method: '*' | MethodType | MethodType[] ) : (req: IncomingMessage) => boolean;

    export = route;
}