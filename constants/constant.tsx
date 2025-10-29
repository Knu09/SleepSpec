// NOTE: Training Results object
export const training_results = [
    {
        title: "BAcc",
        description:
            "Balanced Accuracy (BAcc) is like a fair judge — it looks at how well the model performs across all classes, especially when things aren’t evenly split. A score of 85.90% means it did a good job telling apart sleep-deprived and non-sleep-deprived voices overall.",
        image: "",
        isOpened: true,
    },
    {
        title: "Accuracy",
        description:
            "This is the percentage of times the model got it right. At 85.88%, it means that almost 3 out of 4 times, the system correctly identified whether someone was sleep-deprived or not.",
        image: "",
        isOpened: false,
    },
    {
        title: "Precision",
        description:
            "Precision tells us how many times the model was right when it said someone was sleep-deprived. At 85.90%, it means most of the time, when the system raised a flag, it was for a good reason.",
        image: "",
        isOpened: false,
    },
    {
        title: "Recall",
        description:
            "Recall measures how well the system catches actual cases of sleep deprivation. With a 85.88% score, it means it successfully found most of the people who were really sleep-deprived.",
        image: "",
        isOpened: false,
    },
    {
        title: "F1-Score",
        description:
            "The F1-Score balances both precision and recall. A 85.88% score indicates that the system is not only accurate, but also reliable in detection of mild sleep deprivation without the cause of excessive false alarms.",
        image: "",
        isOpened: false,
    },

    {
        title: "Model AUC-ROC Curve",
        description:
            "The figure shows the performance metrics of how well a binary classifier distinguishes between two classes (pre-session vs. post-session). Notably, the feature dimension combined features (Strf) has the highest Area Under the Curve or AUC of 0.84 (1.0 - 0.16), which is closer to 0.9, indicating a very good separation between classes. The second feature dimension with the high AUC is the frequency-rate (FR) with an AUC of 0.82, which is also within the very good  range. The third feature dimension that aligns the value of AUC in scale-rate (SR) is the frequency-scale (FS), which is satisfactory with an AUC of 0.64. While the scale-rate performs a satisfactory that lies with an AUC of 0.64. Hence, the dimension, combined STM feature or the Spectro-Temporal Receptive Field (STRF), is the correct decision to be used in sleep deprivation detection.",
        image: require("./../assets/images/combined_roc_curve.png"),
        isOpened: true,
    },
    {
        title: "Model Learning Curve",
        description:
            "The figure shows the feature dimension frequency-rate (FR) as the dimension with the least margin between the train score and the endpoint of the dimension; it overfits by around 5%. This indicates that FR had the least overfitting among the other plots. Despite FR having the lowest percentage of overfit, the AUC-ROC curve depicts that it performs slightly lower than the combined STM feature or Spectro-Temporal Receptive Field (STRF). It also proves that the FR is significantly worse than STRF with ~9% difference. The two remaining dimensions, scale-rate (SR), and frequency-scale (FS), significantly overfit, indicated by having large gaps between the train score and the cross-validation score. Thus, the STRF dimension is the state-of-the-art choice for sleep deprivation detection.",
        image: require("./../assets/images/learning_curve.png"),
        isOpened: true,
    },
];

// NOTE: User Manual object
export const user_manual = [
    {
        title: "Welcome to SleepSpec!",
        description:
            "SleepSpec is a mobile application that helps you check for signs of sleep deprivation based on your voice. It's easy to use and only takes a few minutes to process.",
        image: "",
        isOpened: true,
    },

    {
        title: "How to start?",
        description: "When you open the app, you will see two main buttons:",
        list: {
            type: "bullet",
            items: [
                {
                    title: "Start Test",
                    description:
                        "Choose the speech script language you want to use in recording.",
                },
                {
                    title: "Microphone",
                    description:
                        "Takes you to the Recording interface to start voice recording.",
                },
            ],
        },
        image: require("./../assets/images/home_guide.png"),
        isOpened: false,
    },
    {
        title: "Speech Script Language Selection",
        description:
            "Pick the language you are most comfortable speaking. The sentence you need to read will appear based on this choice. On this page, you can choose between:",
        list: {
            type: "bullet",
            items: [
                {
                    title: "English",
                    description: "English speech script",
                },
                {
                    title: "Filipino",
                    description: "Filipino speech script",
                },
            ],
        },
        image: require("./../assets/images/speech_script_language_guide.png"),
        isOpened: false,
    },
    {
        title: "Recording Guide",
        description:
            "The app will automatically process your recording and check for signs of sleep deprivation.",
        list: {
            type: "bullet",
            items: [
                {
                    title: "Change Language",
                    description:
                        "If you want to switch to another language before recording, you can still do it here.",
                },
                {
                    title: "Read the Sentence",
                    description:
                        "The sentence you need to read will appear based on the language you selected.",
                },
                {
                    title: "Microphone Button Controls",
                    description:
                        "Tap once to start recording, tap again to pause the recordin, and press and hold to stop recording and analyze your voice.",
                },
            ],
        },
        image: require("./../assets/images/recording_guide.png"),
        isOpened: false,
    },
    {
        title: "Tips for Best Results",
        description:
            "Before recording your voice, it is important to follow these tips:",
        list: {
            type: "bullet",
            items: [
                {
                    description:
                        "Use the app in a quiet place. A noisy environment could result in inaccurate classification.",
                },
                {
                    description:
                        "Speak naturally—no need to rush or change your voice.",
                },
                {
                    description:
                        "Follow the instructions on screen for a smooth experience.",
                },
            ],
        },
        image: "",
        isOpened: false,
    },
    {
        title: "Need Help?",
        description:
            "If you're unsure what to do, you can always return to the User Manual from the Home Page and Menu Bar.",
        list: {
            type: "bullet",
            items: [
                {
                    title: "Email us",
                    description: "sleepspec.contact@gmail.com",
                },
            ],
        },
        image: "",
        isOpened: false,
    },
];
