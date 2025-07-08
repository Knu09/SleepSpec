import { Segment } from "@/store/store";
import { Entypo } from "@expo/vector-icons";
import { ImageSource } from "expo-image";
import { ColorValue } from "react-native";

export type SettingButtonProps = {
    title: string;
    icon: React.ComponentProps<typeof Entypo>["name"];
    onPress: () => void;
    isActive: boolean;
    theme: string;
};

export type Timer = {
    secs: number;
    mins: number;
};

export type Script = {
    book: string;
    chapter: string;
    content: string;
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
    FIL1,
    FIL2,
    ENG1,
    ENG2,
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
            case LANG.ENG1:
                return "American E";
            case LANG.ENG2:
                return "American E";
            case LANG.FIL1:
                return "Filipino";
            case LANG.FIL2:
                return "Filipino";
        }
    }

    export function asImg(self: LANG): ImageSource {
        const US_FLAG = require("@/assets/images/flag-us.svg");
        const FIL_FLAG = require("@/assets/images/flag-ph.svg");

        switch (self) {
            case LANG.ENG1:
                return US_FLAG;
            case LANG.ENG2:
                return US_FLAG;
            case LANG.FIL1:
                return FIL_FLAG;
            case LANG.FIL2:
                return FIL_FLAG;
        }
    }

    export function getBookTitle(lang: LANG): string {
        return LANG.getScript(lang).book;
    }

    export function getScript(self: LANG): Script {
        return SCRIPTS[self];
    }
}

export enum CLASS {
    PRE = "pre", // Not Sleep deprived
    POST = "post", // Sleep deprived
    BALANCED = "balanced", // Neutral state
}

export type Evaluations = {
    classes: CLASS[];
    scores: number[];
};

export type ClassResult = {
    class: CLASS;
    confidence_score: number;
    decision_score: number;
    sd_prob: number;
    nsd_prob: number;
    evals: Evaluations;
};

export namespace CLASS {
    type ResultObj = {
        class: string;
        confidence_score: number;
        classes: string[];
        scores: number[];
        sd_prob: number;
        nsd_prob: number;
        decision_score: number;
    };

    export function getTitle(result: ClassResult | Segment): string {
        switch (result.class) {
            case CLASS.POST:
                return "Sleep-deprived";
            case CLASS.PRE:
                return "Non-sleep-deprived";
            case CLASS.BALANCED:
                return "Neutral";
        }
    }

    export function getTitleColor(result: ClassResult | Segment): ColorValue {
        return result.class == CLASS.POST
            ? "#ff2121"
            : CLASS.PRE
              ? "#006fff"
              : "#3AC8D9";
    }

    export function from(data: ResultObj): ClassResult {
        const {
            class: c,
            confidence_score,
            classes,
            scores,
            sd_prob,
            nsd_prob,
            decision_score,
        } = data;

        const result: ClassResult = {
            class:
                c === "post"
                    ? CLASS.POST
                    : c === "pre"
                      ? CLASS.PRE
                      : CLASS.BALANCED,
            confidence_score,
            decision_score,
            sd_prob,
            nsd_prob,
            evals: {
                classes: classes.map((c) =>
                    c === "post" ? CLASS.POST : CLASS.PRE,
                ),
                scores,
            },
        };

        return result;
    }

    export function getAdvices(result: ClassResult): Advices {
        return advices[result.class];
    }

    export function getConfScorePercent(self: ClassResult | Segment): string {
        return toPercent(self.confidence_score);
    }

    export function toPercent(n: number) {
        return (n * 100).toFixed(2) + "%";
    }
}

const SCRIPTS: Record<LANG, Script> = {
    [LANG.ENG1]: {
        book: "The Prince",
        chapter: "ch. 3, Concerning Mixed Principalities",
        content:
            "New additions to an ancient state are either of the same country and language, or they are not. When they are, it is easier to hold them, especially when they have not been accustomed to self-government.\n\nTo hold them securely it is enough to have destroyed the family of the prince who was ruling them, because the two peoples preserving in other things the old conditions, and not being unlike in customs, will live quietly together.\n\nThis can be seen in Brittany Burgundy, Gascony, and Normandy, which have been bound to France a very long time. Although there may be some difference in language, nevertheless the customs are alike, and the people are easily able to get on amongst themselves.\n\nThe prince who wishes to hold such additions, has only to bear in mind two considerations: first that the family of their former prince is destroyed, and second, that neither their laws nor their taxes are altered, so that in a very short time they will become entirely integrated in the old principality.\n\nBut when states are acquired in a country differing in language, customs or laws, there are difficulties, and good fortune and great energy are needed to hold them. One of the most positive moves would be for the prince to go and reside there. This would make his position more secure. Because, if one is there, problems are seen as they spring up, and one can quickly remedy them.\n\nBut if one is not at hand, the problems are heard of only when they are great, and then one can no longer remedy them. Besides this, the country is not exploited by officials and the subjects are satisfied by easy access to the prince.\n\nThus, wishing to be good, they have more cause to love him, and wishing to be otherwise, to fear him. He who would attack that state from the outside must have the greatest caution. As long as the prince resides there it can only be taken from him with the greatest difficulty.",
    },
    [LANG.ENG2]: {
        book: "Moby Dick",
        chapter: "ch. 112, The Blacksmith",
        content:
            "He was an old man, who, at the age of nearly sixty, had postponedly encountered that thing in sorrow’s technicals called ruin.\n\nHe had been an artisan of famed excellence, and with plenty to do; owned a house and garden; embraced a youthful, daughter-like, loving wife, and three blithe, ruddy children; every Sunday went to a cheerful-looking church, planted in a grove. But one night, under cover of darkness, and further concealed in a most cunning disguisement, a desperate burglar slid into his happy home, and robbed them all of everything.\n\nAnd darker yet to tell, the blacksmith himself did ignorantly conduct this burglar into his family’s heart. It was the Bottle Conjuror! Upon the opening of that fatal cork, forth flew the fiend, and shrivelled up his home.\n\nNow, for prudent, most wise, and economic reasons, the blacksmith’s shop was in the basement of his dwelling, but with a separate entrance to it; so that always had the young and loving healthy wife listened with no unhappy nervousness, but with vigorous pleasure, to the stout ringing of her young-armed old husband’s hammer; whose reverberations, muffled by passing through the floors and walls, came up to her, not unsweetly, in her nursery; and so, to stout Labor’s iron lullaby, the blacksmith’s infants were rocked to slumber.\n\nOh, woe on woe! Oh, Death, why canst thou not sometimes be timely? Hadst thou taken this old blacksmith to thyself ere his full ruin came upon him, then had the young widow had a delicious grief, and her orphans a truly venerable, legendary sire to dream of in their after years; and all of them a care-killing competency.\n\nBut Death plucked down some virtuous elder brother, on whose whistling daily toil solely hung the responsibilities of some other family, and left the worse than useless old man standing, till the hideous rot of life should make him easier to harvest.",
    },
    [LANG.FIL1]: {
        book: "Maring",
        chapter: "ch. 1, Napitas ang Bulaklak",
        content:
            "Sila ay may bugtong na anak, uliran ng bait, si Maria na tinagurian ng Maring.\n\nKung kaaya-aya man ang ganda ng kalooban ni Maring, ay lalo pa naman kaaya-aya ang ganda ng kaniyang anyo, anyo ng bagong bumubukang kampupot, at lalong-lalo pa yaong mukha niyang anaki’y mukhang anghel, mukhang pinagkalooban ng langit ng lubhang mapanghalinang dikit na bihirang ipagkaloob sa taong kinapal.\n\nAng kaniyang mapupungay na mata ay anaki’y salamin ng pag-ibig, anaki’y sibol ng lambing, anaki’y larawan ng bait.\n\nAt dahil nga sa gayon, ay pinag-ingatan yatang talaga ng palad, kaya’t pinalamutihan sa dakong noo ng masinsin, ngunit makitid na kilay na hubog tari, at binakuran ng mayabong at malantik na pilikmata, akala marahil ng Maykapal ay upang huwag manganib sa puwing man lamang yaong mga matang kaniyang pinagpalang talaga.\n\nAng kaniyang mga ngiti ay ngiting langit: naghahandog sa kaharap ng lugod na di mahulilip at walang hanggang tamis ng maamong kalooban, lalo’t talagang maririkit yaong kaniyang mga maliliit at masinsing ngiping kinaiinggitan ng tunay na garing, at sinalitan ng isang ngiping gintong ipinasadya ng kaniyang ama, upang malubos mandin ang ganda noong napakatamis na bibig.\n\nKung lugay ang kaniyang mayabong na buhok, ay umaabot hanggang sakong, malinis, maitim at makinang na anaki’y sarampuli ng mga Lakhang-dalaga sa unang panahon.\n\nSi Maring ay kayumangging maligat na namumula-mula, at ang kaniyang pangangatawan ay katatagan sa taas at sa bilog. Ang kaniyang mga kilos ay mabining-pawa, mahinhin at kalugod-lugod sa lahat ng bagay.\n\nMay isang binata, bagong-taong basal na nagngangalang Gonsalo. Ito ay maralita ring gaya nila Maring, palibhasa’y gaya rin nilang walang ibang paghahanap kundi pamamalakaya sa mga ilog at dagat.\n\nSi Gonsalo ay may mga tatlong taon ng nananhik ng ligaw kay Maring, ngunit hindi pinansin nito ang kaniyang matapat na pagsuyo, at kadalasang isagot sa kaniya ay ang kaniyang nais na makasuyo muna sa kaniyang mga magulang.",
    },
    [LANG.FIL2]: {
        book: "Noli Me Tangere",
        chapter: "ch. 16, Si Sisa",
        content:
            'Bata pa si Sisa, at noon pa lang ay makikita nang siya’y maganda at kaakit-akit kumilos. Ang kanyang mga mata—na parang ang kanyang kaluluwang handa niyang ibigay lahat para sa kanyang mga anak—ay napakaganda. Mahahaba ang kanyang pilikmata at malalim kung tumingin. Maganda ang hubog ng kanyang ilong, at ang kanyang mapupulang labi ay maayos ang anyo. Siya ang tinatawag ng mga Tagalog na "kayumangging kaligatan"—isang kayumangging kulay na malinis at kaaya-aya.\n\nBagamat bata pa siya, dala marahil ng kalungkutan o gutom, unti-unti nang namumutla ang kanyang mga pisngi. Ang kanyang makapal na buhok, na dati\'y alaga at nagpapaganda sa kanyang anyo, ay inayos hindi para maging kaakit-akit kundi dahil ugali na niyang maging maayos. Ang kanyang buhok ay simpleng sinuklay, walang palamuti tulad ng alampay o palamuti sa buhok.\n\nIlang araw na siyang hindi lumalabas ng bahay dahil tinatapos niya ang isang trabahong iniutos sa kanya, na kailangang matapos agad sa abot ng kanyang makakaya. Sa kagustuhan niyang magkaroon ng kaunting pera, hindi siya nagsimba nang umagang iyon dahil aabutin siya ng halos dalawang oras sa paglalakad papunta at pabalik sa bayan. —Talagang ang kahirapan ay nakakapilit gumawa ng kasalanan.\n\nNang matapos ang kanyang gawa, agad niya itong dinala sa may-ari. Pero pinangakuan lang siya ng bayad, hindi agad binayaran.\n\nBuong maghapon, isa lang ang iniisip niya—ang saya na mararamdaman niya pagsapit ng gabi. Nabalitaan niyang uuwi ang kanyang mga anak, kaya’t inisip niyang ihanda ang isang masarap na hapunan para sa kanila. Bumili siya ng lawlaw (isang uri ng tuyo), pumitas ng mga pinakagandang kamatis mula sa kanyang maliit na taniman—dahil alam niyang paborito ito ni Crispín. Humingi rin siya ng pampalasa at karne mula kay Pilosopo Tasyo, na nakatira mga limang daang metro ang layo, kabilang ang tapa ng baboy-ramo at hita ng pato mula sa gubat—paborito ito ni Basilio.\n\nPuno ng pag-asa, isinaing niya ang pinakaputing bigas na siya rin mismo ang nagbayo. Isa itong hapunang karapat-dapat para sa kura, pero inihanda niya ito para sa kanyang mga mahal na anak.',
    },
};

const advices: {
    [CLASS.POST]: Advices;
    // TODO: MODERATE: Advices;
    [CLASS.PRE]: Advices;
    [CLASS.BALANCED]: Advices;
} = {
    [CLASS.POST]: {
        summary:
            "Your results indicate signs of mild sleep deprivation. To improve your sleep health, consider:",
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
                desc: "If mild sleep deprivation persists, consult a healthcare professional for further evaluation.",
            },
        ],
    },
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
    [CLASS.BALANCED]: {
        summary:
            "Your results are balanced, showing no strong signs of either sleep deprivation or well-rested. This may indicate transitional sleep quality or subtle fatigue. Consider the following tips to maintain or improve your sleep health:",
        contents: [
            {
                id: "1",
                title: "Stay Consistent with Sleep Habits",
                desc: "Even mild irregularities in your schedule can affect your rest. Aim for a regular bedtime and wake-up time.",
            },
            {
                id: "2",
                title: "Be Aware of Early Fatigue Signs",
                desc: "If you're feeling less focused or more irritable, it may be time to adjust your sleep duration or quality.",
            },
            {
                id: "3",
                title: "Avoid Sleep Disruptors",
                desc: "Limit caffeine intake in the afternoon, reduce evening screen time, and minimize stress before bed.",
            },
            {
                id: "4",
                title: "Optimize Your Daily Routine",
                desc: "Incorporate physical activity and take short breaks during the day to prevent fatigue from accumulating.",
            },
        ],
    },
};
