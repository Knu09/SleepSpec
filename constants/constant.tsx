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
        title: "AUC-ROC Curve",
        description:
            "The figure shows the performance metrics of how well a binary classifier distinguishes between two classes (pre-session vs. post-session). Notably, the feature dimension combined features (Strf) has the highest Area Under the Curve or AUC of 0.84 (1.0 - 0.16), which is closer to 0.9, indicating a very good separation between classes. The second feature dimension with the high AUC is the frequency-rate (FR) with an AUC of 0.82, which is also within the very good  range. The third feature dimension that aligns the value of AUC in scale-rate (SR) is the frequency-scale (FS), which is satisfactory with an AUC of 0.64. While the scale-rate performs a satisfactory that lies with an AUC of 0.64. Hence, the dimension, combined feature or the Spectro-Temporal Receptive Field (STRF), is the correct decision to be used in sleep deprivation detection.",
        image: require("./../assets/images/combined_roc_curve.png"),
        isOpened: false,
    },
];
