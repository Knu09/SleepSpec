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

    export function getScript(self: LANG): string {
        return scripts[self]
    }
}

export enum CLASS {
    NSD, // Not Sleep deprived
    SD, // Sleep deprived
}

type ClassResult = {
    class: CLASS,
    confidence_score: number,
}

export namespace CLASS {
    type ResultObj = {
        class: number,
        confidence_score: number,
    }

    export function toHeader(self: CLASS): string {
        switch (self) {
            case CLASS.SD:
                return "Highly Sleep-Deprived"
            case CLASS.NSD:
                return "Not Sleep-Deprived"
        }
    }

    export function fromJSON(data: string): ClassResult {
        const { class: c, confidence_score }: ResultObj = JSON.parse(data)
        const result: ClassResult = {
            class: c == 1 ? CLASS.SD : CLASS.NSD,
            confidence_score
        }

        return result
    }
}


const scripts = {
    [LANG.ENGLISH]:
        "He was an old man, who, at the age of nearly sixty, had postponedly encountered that thing in sorrow’s technicals called ruin. He had been an artisan of famed excellence, and with plenty to do; owned a house and garden; embraced a youthful, daughter-like, loving wife, and three blithe, ruddy children; every Sunday went to a cheerful-looking church, planted in a grove.\n\nBut one night, under cover of darkness, and further concealed in a most cunning disguisement, a desperate burglar slid into his happy home, and robbed them all of everything. And darker yet to tell, the blacksmith himself did ignorantly conduct this burglar into his family’s heart. It was the Bottle Conjuror! Upon the opening of that fatal cork, forth flew the fiend, and shriveled up his home.",

    [LANG.FILIPINO]:
        `Ngayon, nais kong pag-usapan ang isang napakahalagang paksa na madalas nating binabalewala—ang kahalagahan ng pagtulog. Sa mundong mabilis ang takbo, kadalasan nating inuuna ang tulog, pag-aaral, at iba pang gawain kaysa ang ating kalusugan. Ngunit, alam ba ninyo na ang kawalan ng sapat na tulog ay may masamang epekto sa ating katawan at isipan?
    Kapag kulang tayo sa tulog, bumababa ang ating
`,
    // ENGLISH = `
    //     He was an old man, who, at the age of nearly sixty, had postponedly encountered that thing in sorrow’s technicals called ruin. He had been an artisan of famed excellence, and with plenty to do; owned a house and garden; embraced a youthful,
    //     daughter-like, loving wife, and three blithe, ruddy children; every Sunday went
    //     to a cheerful-looking church, planted in a grove.
    //
    //     But one night, under cover of darkness, and further concealed in a most cunning
    //     disguisement, a desperate burglar slid into his happy home, and robbed them all
    //     of everything. And darker yet to tell, the blacksmith himself did ignorantly
    //     conduct this burglar into his family’s heart. It was the Bottle Conjuror! Upon
    //     the opening of that fatal cork, forth flew the fiend, and shriveled up his home.
    //
    //     Now, for prudent, most wise, and economic reasons, the blacksmith’s shop was in
    //     the basement of his dwelling, but with a separate entrance to it; so that always
    //     had the young and loving healthy wife listened with no unhappy nervousness, but
    //     with vigorous pleasure, to the stout ringing of her young-armed old husband’s
    //     hammer; whose reverberations, muffled by passing through the floors and walls,
    //     came up to her, not unsweetly, in her nursery; and so, to stout Labor’s iron lullaby,
    //     the blacksmith’s infants were rocked to slumber.
    // `,
};
