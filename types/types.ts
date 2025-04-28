export enum LANG {
    ENGLISH,
    FILIPINO,
}

type CFS = {
    score: number;
}

type Advices = {
    summary: string;
    contents: {
        id: string;
        title: string;
        desc: string;
    }[]
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

export type ClassResult = {
    class: CLASS,
    confidence_score: CFS,
}

export namespace CLASS {
    type ResultObj = {
        class: number,
        confidence_score: number,
    }

    export function toHeader(result: ClassResult): string {
        switch (result.class) {
            case CLASS.SD:
                return "Sleep-Deprived"
            case CLASS.NSD:
                return "Non-Sleep-Deprived"
        }
    }

    export function fromJSON(data: ResultObj): ClassResult {
        const { class: c, confidence_score: score } = data
        const result: ClassResult = {
            class: c == 1 ? CLASS.SD : CLASS.NSD,
            confidence_score: { score }
        }


        return result
    }

    export function getAdvices(result: ClassResult): Advices  {
        return advices[result.class]
    }

    export function getConfScorePercent(self: ClassResult): string {
        let percent = self.confidence_score.score * 100;
        return percent.toFixed(2) + "%"
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


const advices: {
    [CLASS.SD]: Advices;
    // MODERATE: Advices;
    [CLASS.NSD]: Advices;
} = {
    [CLASS.SD]: {
        summary: "Your results indicate signs of sleep deprivation. To improve your sleep health, consider:",
        contents: [
            {
                id: "1",
                title: "Prioritizing Rest",
                desc: "Aim for at least 7–9 hours of sleep per night.",
            },
            {
                id: "2",
                title: "Maintaining a Consistent Sleep Schedule",
                desc:
                    "Going to bed and waking up at the same time daily helps regulate your body's internal clock.",
            },
            {
                id: "3",
                title: "Creating a Relaxing Bedtime Routine",
                desc:
                    "Reduce screen time, avoid caffeine, and engage in relaxation techniques such as meditation or reading before bed.",
            },
            {
                id: "4",
                title: "Optimizing Sleep Environment",
                desc:
                    "Keep your room dark, cool, and quiet to enhance sleep quality.",
            },
            {
                id: "5",
                title: "Monitoring Your Sleep Patterns",
                desc:
                    "If sleep deprivation persists, consult a healthcare professional for further evaluation.",
            },
        ]
    },
    // MODERATE: {
    //     summary: "Your sleep quality is moderate, but there is room for improvement.",
    //     contents: [
    //         {
    //             id: "1",
    //             title: "Improve Sleep Duration",
    //             desc:
    //                 "Try to increase your sleep time by 30–60 minutes per night.",
    //         },
    //         {
    //             id: "2",
    //             title: "Reduce Stimulants",
    //             desc: "Limit caffeine intake in the afternoon and evening.",
    //         },
    //     ]
    // },
    [CLASS.NSD]: {
        summary: "Your sleep habits seem healthy, but consistent monitoring is recommended.",
        contents: [
            {
                id: "1",
                title: "Continue Following a Healthy Sleep Routine",
                desc: "Stick to a regular sleep schedule and avoid late-night disruptions.",
            },
            {
                id: "2",
                title: "Practice Good Sleep Hygiene",
                desc: "Limit screen exposure before bedtime and create a restful sleeping environment.",
            },
            {
                id: "3",
                title: "Manage Stress and Lifestyle Factors",
                desc: "Engage in regular physical activity, avoid heavy meals before sleep, and manage stress effectively.",
            },
            {
                id: "4",
                title: "Stay Hydrated and Maintain a Balanced Diet",
                desc: "Proper hydration and nutrition contribute to better overall sleep health.",
            },
        ]
    },
};
