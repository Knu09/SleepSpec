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

    export function asImg(self: LANG): NodeJS.Require {
        switch (self) {
            case LANG.ENGLISH:
                return require("@/assets/images/flag-us.svg");
            case LANG.FILIPINO:
                return require("@/assets/images/flag-ph.svg");
        }
    }
}

export enum CLASS {
    SD, // Sleep deprived
    NSD, // Not Sleep deprived
}

export namespace CLASS {
    export function toHeader(self: CLASS): string {
        switch (self) {
            case CLASS.SD:
                return "Highly Sleep-Deprived"
            case CLASS.NSD:
                return "Not Sleep-Deprived"
        }
    }
}
