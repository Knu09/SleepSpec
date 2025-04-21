export enum LANG {
    ENGLISH,
    FILIPINO,
}

export namespace LANG {
    export function asString(lang: LANG): string {
        switch (lang) {
            case LANG.ENGLISH:
                return "English";
            case LANG.FILIPINO:
                return "Filipino";
        }
    }

    export function asImg(lang: LANG): NodeJS.Require {
        switch (lang) {
            case LANG.ENGLISH:
                return require("@/assets/images/flag-us.svg");
            case LANG.FILIPINO:
                return require("@/assets/images/flag-ph.svg");
        }
    }
}
