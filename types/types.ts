import { Segment } from "@/store/store";
import { ImageSource } from "expo-image";
import { ColorValue } from "react-native";

export type Timer = {
    secs: number;
    mins: number;
};

export namespace Timer {
    export function fromSeconds(seconds: number): Timer {
        return {
            secs: Math.floor(seconds % 60),
            mins: Math.floor(seconds / 60),
        };
    }

    export function format({ secs, mins }: Timer): string {
        const formattedMinutes = String(mins).padStart(2, "0");
        const formattedSeconds = String(secs).padStart(2, "0");

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    export function reset(): Timer {
        return { secs: 0, mins: 0 };
    }
}

export enum Process {
    IDLE,
    PENDING,
    READY,
    FAILED,
}

export enum LANG {
    ENGLISH,
    FILIPINO,
}

type Advices = {
    summary: string;
    contents: {
        id: string;
        title: string;
        desc: string;
    }[];
};

export namespace LANG {
    export function asString(lang: LANG): string {
        switch (lang) {
            case LANG.ENGLISH:
                return "AMERICAN E";
            case LANG.FILIPINO:
                return "FILIPINO";
        }
    }

    export function asImg(self: LANG): ImageSource {
        switch (self) {
            case LANG.ENGLISH:
                return require("@/assets/images/flag-us.svg");
            case LANG.FILIPINO:
                return require("@/assets/images/flag-ph.svg");
        }
    }

    export function getScript(self: LANG): string {
        return scripts[self];
    }
}

export enum CLASS {
    PRE = "pre", // Not Sleep deprived
    POST = "post", // Sleep deprived
}

export type Evaluations = {
    classes: CLASS[];
    scores: number[];
};

export type ClassResult = {
    class: CLASS;
    confidence_score: number;
    evals: Evaluations;
};

export namespace CLASS {
    type ResultObj = {
        class: number;
        confidence_score: number;
        classes: number[];
        scores: number[];
    };

    export function getTitle(result: ClassResult | Segment): string {
        switch (result.class) {
            case CLASS.POST:
                return "Sleep-Deprived";
            case CLASS.PRE:
                return "Non-Sleep-Deprived";
        }
    }

    export function getTitleColor(result: ClassResult | Segment): ColorValue {
        return result.class == CLASS.POST ? "#ff2121" : "#006fff";
    }

    export function from(data: ResultObj): ClassResult {
        const { class: c, confidence_score: score, classes, scores } = data;
        const result: ClassResult = {
            class: c == 1 ? CLASS.POST : CLASS.PRE,
            confidence_score: score,
            evals: {
                classes: classes.map((c) => (c == 1 ? CLASS.POST : CLASS.PRE)),
                scores,
            },
        };

        return result;
    }

    export function getAdvices(result: ClassResult): Advices {
        return advices[result.class];
    }

    export function getConfScorePercent(self: ClassResult | Segment): string {
        return self.confidence_score.toFixed(2) + "%";
    }
}

const scripts = {
    [LANG.ENGLISH]:
        "He was an old man, who, at the age of nearly sixty, had postponedly encountered that thing in sorrow’s technicals called ruin. He had been an artisan of famed excellence, and with plenty to do; owned a house and garden; embraced a youthful, daughter-like, loving wife, and three blithe, ruddy children; every Sunday went to a cheerful-looking church, planted in a grove.\n\nBut one night, under cover of darkness, and further concealed in a most cunning disguisement, a desperate burglar slid into his happy home, and robbed them all of everything. And darker yet to tell, the blacksmith himself did ignorantly conduct this burglar into his family’s heart. It was the Bottle Conjuror! Upon the opening of that fatal cork, forth flew the fiend, and shriveled up his home.\n\nNow, for prudent, most wise, and economic reasons, the blacksmith’s shop was in the basement of his dwelling, but with a separate entrance to it; so that always had the young and loving healthy wife listened with no unhappy nervousness, but with vigorous pleasure, to the stout ringing of her young-armed old husband’s hammer; whose reverberations, muffled by passing through the floors and walls, came up to her, not unsweetly, in her nursery; and so, to stout Labor’s iron lullaby, the blacksmith’s infants were rocked to slumber.\n\nOh, woe on woe! Oh, Death, why canst thou not sometimes be timely? Hadst thou taken this old blacksmith to thyself ere his full ruin came upon him, then had the young widow had a delicious grief, and her orphans a truly venerable, legendary sire to dream of in their after years; and all of them a care-killing competency. But Death plucked down some virtuous elder brother, on whose whistling daily toil solely hung the responsibilities of some other family, and left the worse than useless old man standing, till the hideous rot of life should make him easier to harvest.",

    [LANG.FILIPINO]: `Napitas Ang Bulaklak Noong taong isáng daán at siyám na pû... ay nanirahan sa nayon ng bundok, sakop ng Maynila ang mag-asawang Pedro at Julia.\n\nMarálita ang kaniláng pamumuhay palibhasa’y walang ibáng paghahanap kungdi ang mamalakaya sa mga ilog at sa look ng Maynila.\n\nSila ay may bugtong na anak, uliran ng bait, si Maria na tinagurian ng Maring. Kung kaaya-aya man ang gandá ng kalooban ni Maring, ay lalo pa namán kaaya-aya ang gandá ng kaniyang anyo, anyo ng bagong bumubukang kampuput, at lalong-lalo pa yaong mukha niyang anaki’y mukhang angel, mukhang pinagkalooban ng langit ng lubhang mapanghalinang dikit na bihirang ipagkaloob sa taong kinapal.\n\nAng kaniyang mapupungay na mata ay anaki’y salamin ng pag-ibig, anaki’y sibol ng lambing, anaki’y larawan ng bait. At dahil nga sa gayón, ay pinag-ingatan yatang talagá ng palad, kaya’t pinalamutihan sa dakong noó ng masinsin, nguni’t makitid na kilay na hubog tari, at binakuran ng mayabong at malantik na pilikmatá, akala marahil ng Maykapal ay upang huwag manganib sa puwing man lamang yaong mga matáng kaniyang pinagpalang talaga.\n\nAng kaniyang mga ngiti ay ngiting langit: naghahandog sa kaharap ng lugod na di mahulilip at walang hanggang tamis ng maamong kalooban, lalo’t talagáng maririkit yaong kaniyang mga maliliit at masinsing ngiping kinaiinggitan ng tunay na garing, at sinalitan ng isang ngiping gintong ipinasadya ng kaniyang amá, upang malubos mandin [9]ang ganda noong napakatamis na bibig.\n\nKung lugay ang kaniyang mayabong na buhok, ay uma-abot hangang sakong, malinis, maitim at makinang na anaki’y sarampuli ng mga Lakhang-dalaga sa unang panahon.\n\nSi Maring ay kayumangging maligat na namumula-mulá, at ang kaniyang pangangatawán ay katatágan sa taas at sa bilog. Ang kaniyang mga kilos ay mabining pawa, mahinhin at kalugod-lugod sa lahat ng bagay.\n\nMay isáng binata, bagong-taong basal na nagngangalang Gonsalo. Ito ay maralita ring gaya nilá Maring, palibhasa’y gaya rin nilang walang ibang paghahanap kungdi pamamalakaya sa mga ilog at dagat. Si Gonsalo ay may mga tatlong taón ng nananhik ng ligaw kay Maring, nguni’t hindi pinansin nitó ang kaniyang matapat na pagsuyo, at kadalasang isagot sa kaniya ay ang kaniyang nais na makasuyo muna sa kaniyang mga magulang.`,
};

const advices: {
    [CLASS.POST]: Advices;
    // MODERATE: Advices;
    [CLASS.PRE]: Advices;
} = {
    [CLASS.POST]: {
        summary:
            "Your results indicate signs of sleep deprivation. To improve your sleep health, consider:",
        contents: [
            {
                id: "1",
                title: "Prioritizing Rest",
                desc: "Aim for at least 7–9 hours of sleep per night.",
            },
            {
                id: "2",
                title: "Maintaining a Consistent Sleep Schedule",
                desc: "Going to bed and waking up at the same time daily helps regulate your body's internal clock.",
            },
            {
                id: "3",
                title: "Creating a Relaxing Bedtime Routine",
                desc: "Reduce screen time, avoid caffeine, and engage in relaxation techniques such as meditation or reading before bed.",
            },
            {
                id: "4",
                title: "Optimizing Sleep Environment",
                desc: "Keep your room dark, cool, and quiet to enhance sleep quality.",
            },
            {
                id: "5",
                title: "Monitoring Your Sleep Patterns",
                desc: "If sleep deprivation persists, consult a healthcare professional for further evaluation.",
            },
        ],
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
    [CLASS.PRE]: {
        summary:
            "Your sleep habits seem healthy, but consistent monitoring is recommended.",
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
        ],
    },
};
