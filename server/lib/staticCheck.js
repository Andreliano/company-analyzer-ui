export class StaticCheck {

    static isStaticRequest(path) {
        const staticRegex = /(\.(css|js|png|jpg|svg|gif|pdf|csv|json|mov|ico))$/g;
        return staticRegex.exec(path);
    }

}