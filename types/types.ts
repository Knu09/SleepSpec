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
                return "English";
            case LANG.ENG2:
                return "English";
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
    decision_scores: number[];
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
        decision_scores: number[];
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
            decision_scores,
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
                decision_scores,
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

    export function getDecScorePercent(self: ClassResult | Segment): string {
        return self.decision_score.toFixed(4);
    }

    export function toPercent(n: number) {
        return (n * 100).toFixed(2) + "%";
    }
}

export const getStyles = (type: string) => {
    switch (type) {
        case "info":
            return {
                toastIconColor: "#006FFF",
                Color: "primaryBlue",
            };
        case "success":
            return {
                toastIconColor: "#3DC13C",
                Color: "success",
            };
        case "warning":
            return {
                toastIconColor: "#F39C11",
                Color: "warning",
            };
        case "error":
            return {
                toastIconColor: "#FF2121",
                Color: "danger",
            };
        default:
            return {
                toastIconColor: "#01000F",
                Color: "darkBg",
            };
    }
};

const SCRIPTS: Record<LANG, Script> = {
    [LANG.ENG1]: {
        book: "The Prince",
        chapter: "ch. 3, Concerning Mixed Principalities",
        content:
            "New additions to an ancient state are either of the same country and language, or they are not. When they are, it is easier to hold them, especially when they have not been accustomed to self-government.\n\nTo hold them securely it is enough to have destroyed the family of the prince who was ruling them, because the two peoples preserving in other things the old conditions, and not being unlike in customs, will live quietly together.\n\nThis can be seen in Brittany Burgundy, Gascony, and Normandy, which have been bound to France a very long time. Although there may be some difference in language, nevertheless the customs are alike, and the people are easily able to get on amongst themselves.\n\nThe prince who wishes to hold such additions, has only to bear in mind two considerations: first that the family of their former prince is destroyed, and second, that neither their laws nor their taxes are altered, so that in a very short time they will become entirely integrated in the old principality.\n\nBut when states are acquired in a country differing in language, customs or laws, there are difficulties, and good fortune and great energy are needed to hold them. One of the most positive moves would be for the prince to go and reside them. This would make his position more secure. Because, if one is there, problems are seen as they spring up, and one can quickly remedy them.\n\nBut if one is not at hand, the problems are heard of only when they are great, and then one can no longer remedy them. Besides this, the country is not exploited by officials and the subjects are satisfied by easy access to the prince.\n\nThus, wishing to be good, they have more cause to love him, and wishing to be otherwise, to fear him. He who would attack that state from the outside must have the greatest caution. As long as the prince resides there it can only be taken from him with the greatest difficulty.\n\nThe other and better course is to send colonies to one or two places, which may be as keys to that state, for it is necessary either to do this or else to keep there a great number of cavalry and infantry.\n\nA prince does not spend much on colonies, for with little or no expense he can send them out and keep them there, and he offends a minority only of the citizens from whom he takes lands and houses to give them to the new inhabitants; and those whom he offends, remaining poor and scattered, are never able to injure him; whilst the rest being uninjured are easily kept quiet, and at the same time are anxious not to err for fear it should happen to them as it has to those who have been despoiled.\n\nIn conclusion, I say that these colonies are not costly, they are more faithful, they injure less, and the injured, as has been said, being poor and scattered, cannot hurt. Upon this, one has to remark that men ought either to be well treated or crushed, because they can avenge themselves of lighter injuries, of more serious ones they cannot; therefore the injury that is to be done to a man ought to be of such a kind that one does not stand in fear of revenge. ",
    },
    // [LANG.ENG2]: {
    //     book: "Moby Dick",
    //     chapter: "ch. 112, The Blacksmith",
    //     content:
    //         "He was an old man, who, at the age of nearly sixty, had postponedly encountered that thing in sorrow’s technicals called ruin.\n\nHe had been an artisan of famed excellence, and with plenty to do; owned a house and garden; embraced a youthful, daughter-like, loving wife, and three blithe, ruddy children; every Sunday went to a cheerful-looking church, planted in a grove. But one night, under cover of darkness, and further concealed in a most cunning disguisement, a desperate burglar slid into his happy home, and robbed them all of everything.\n\nAnd darker yet to tell, the blacksmith himself did ignorantly conduct this burglar into his family’s heart. It was the Bottle Conjuror! Upon the opening of that fatal cork, forth flew the fiend, and shrivelled up his home.\n\nNow, for prudent, most wise, and economic reasons, the blacksmith’s shop was in the basement of his dwelling, but with a separate entrance to it; so that always had the young and loving healthy wife listened with no unhappy nervousness, but with vigorous pleasure, to the stout ringing of her young-armed old husband’s hammer; whose reverberations, muffled by passing through the floors and walls, came up to her, not unsweetly, in her nursery; and so, to stout Labor’s iron lullaby, the blacksmith’s infants were rocked to slumber.\n\nOh, woe on woe! Oh, Death, why canst thou not sometimes be timely? Hadst thou taken this old blacksmith to thyself ere his full ruin came upon him, then had the young widow had a delicious grief, and her orphans a truly venerable, legendary sire to dream of in their after years; and all of them a care-killing competency.\n\nBut Death plucked down some virtuous elder brother, on whose whistling daily toil solely hung the responsibilities of some other family, and left the worse than useless old man standing, till the hideous rot of life should make him easier to harvest.",
    // },
    [LANG.ENG2]: {
        book: "Alice in Wonderland",
        chapter: "ch. 1, Down the Rabbit-Hole",
        content:
            "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”\n\nSo she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.\n\nThere was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.\n\nIn another moment down went Alice after it, never once considering how in the world she was to get out again.\n\nThe rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.\n\nEither the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled “ORANGE MARMALADE”, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.\n\n“Well!” thought Alice to herself, “after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!” (Which was very likely true.)\n\n Down, down, down. Would the fall never come to an end? “I wonder how many miles I’ve fallen by this time?” she said aloud. “I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—” (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) “—yes, that’s about the right distance—but then I wonder what Latitude or Longitude I’ve got to?” (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)\n\nPresently she began again. “I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think—” (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) “—but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?” (and she tried to curtsey as she spoke—fancy curtseying as you’re falling through the air! Do you think you could manage it?) “And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere.",
    },
    [LANG.FIL1]: {
        book: "Alamat ng Matsing",
        chapter: "Pinoy Edition © 2025",
        content:
            'Sa mayamang kaharian, noong unang panahon, ay may isang prinsesang ubod ng ganda. Siya ai si Prinsesa Amapela na ang lahat ay humahanga sa taglay na kagandahan.\n\nNgunit sa likod ng kanyang kagandahan ay napakasamang ugali. Ang prinsesa ay ubod ng sungit at suplada. Napakataas ng pagtingin niya sa kanyang sarili.\n\n"Ayoko sa mga taong pangit! Palayasin sila sa palasyo!" ang palding sigaw nito sa tuwing makakakita ng pangit sa palasyo.\n\nDahil sa prinsesa, ang lahat lamang ng magaganda ang nakakapasok at nakakapagtrabaho sa loob ng palasyo. At ang mga pangit ay itinaboy sa labas upang maging mga alipin at manggagawa.\n\nSa paglipas ng panahon, dumating ang takdang araw sa pagpili ni Prinsesa Amapela ng mapapangasawa. At naghanda nga ang kaharian.Inimbitahan ang maraming maharlikang tao buhat sa iba\'t ibang kaharian. Nagsidating din ang maraming makikisig na prinsipe, upang ang isa sa sa kanila ay ang siyang mapangasawa ng ng prinsesa.\n\nDi nagtagal, nagsimula ng mamilii si Prinsesa Amapela ng mapapangasawa. Ang lahat ng prinsipe ay tumayo sa kanyang harapan at nagbigay-galang. Isa sa mga prinsipe ang nagustuhan ng prinsesa, at ito\'y si Prinsipe Algori.\n\nSi Prinsipe Algori ay isang napakasipag na prinsipe, na animo Adonis na namumukod tangi sa lahat ng naroroon.Ngunit bago pa man napili ni Prinsesa Amapela ang makisig na prinsipe, ay may nakita siya na napakapangit-pangit na prinsipe na nakatayo sa likuran nito.\n\nHindi napigilan ng prinsesa ang sarili.\n\n"Sino ka? Hindi ka nahiya saiyong sarili! Napakapangit mo! Lumayas ka rito at magbalik ka na sa kwebang pinanggalingan mo!" ang bulyaw nito. Nabigla ang lahat sa nasal ng prinsesa.\n\n"Siya ang aking napili! Si Prinsipe Algori! Siya ang aking mapapangasawa," ang agad na idinugtong nito sabay turo kay Prinsipe Algori.\n\nMasayang lumapit si Prinsipe Algori sa prinsesa at humalik sa kamay nito. Isa isa ng nag-alisan ang mga nabigong prinsipe, ngunit nanatiling nakatayo sa harapan ang pangit na prinsipe.\n\n"Ano pa ang hinihintay mo! Lumayas ka na! Ayaw kitang Makita!" ang muling bulyaw ng prinsesa na tila nandidiri.\n\nMalumanay na nagsalita ang prinsipeng pangit, Hindi ako manghihinayang sa isang tulad mo. Kung ano ang ganda ng iyong mukha ay siya naming kapangitan ng iyong ugali," ang wika nito.\n\nBigla ay nagbago ang anyo ng prinsipeng pangit. Ito ay nagging isang napakakisig na lalaki, higit kay Prinsipe Algori.\n\nNamangha ang lahat, sapagkat ang pangit na prinsipe ay ang "Diyos pala ng Kakisigan." Bumababa ang isang kumpol ng ulap, at sumakay rito ang "Diyos na Kakisigan," at tuluyan nang lumisan.\n\nNanghinayang ang lahat lalo na ang hari at reyna. Ngunit higit sa lahat, nanghinayang nang husto si Prinsesa Amapela bagay na hindi niya pinahalata.\n\nAgad na ikinasal ng hari sina Prinsesa Amapela at Prinsipe Algori. Ngunit matapos ang kasal, ganun na lamang ang gulat ng lahat.\n\nNgayong mag-aswa na tayo kailangan mong sumama sa aking kaharian, "ang wika ni Prinsipe Algori.\n\n"Anong ibig mong sabihin?" ang nagtatakang tanong ng prinsesa.\n\nBigla, nabago ang anyo ni Prinsipe Algori. Ito ay naging kakaibang nilalang ng puno ng balahibo ang buong katawan. Nagsigawan at nasindak ang lahat, lalo pa\'t bigla na lang nabago ang anyo ni Prinsesa Amapela. Nabalot din ito ng balahibo sa buong katawan, at nagkaroon pa ng buntot.\n\nHindi makapaniwala ang lahat, subalit huli na. Dinala na si Prinsesa Amapela sa kagubatan ni Prinsipe Algori, na siya palang "Diyos ng mga hayop sagubat." At si Prinsesa Amapela ang kauna-unahang matsing sa kagubatan. Ito ang nagging parusa ng kanyang pagiging suplada at mapagmataas.\n\nKaya dapat nating tandaan na hindi natin dapat husgahan ang tao sa kanyang panlabas na anyo, dahil ang higit na mahalaga ay ang tunay na pagkatao at pag-uugali.',
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
