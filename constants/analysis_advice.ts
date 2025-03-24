const Advice = {
    HIGHLY: "Your results indicate signs of sleep deprivation. To improve your sleep health, consider:",
    MODERATE:
        "Your sleep quality is moderate, but there is room for improvement.",
    LOW: "Your sleep habits seem healthy, but consistent monitoring is recommended.",
} as const;

export type AdviceType = keyof typeof Advice;

export const adviceList = {
    HIGHLY: [
        {
            id: "1",
            title: "Prioritizing Rest",
            description: "Aim for at least 7–9 hours of sleep per night.",
        },
        {
            id: "2",
            title: "Maintaining a Consistent Sleep Schedule",
            description:
                "Going to bed and waking up at the same time daily helps regulate your body's internal clock.",
        },
        {
            id: "3",
            title: "Creating a Relaxing Bedtime Routine",
            description:
                "Reduce screen time, avoid caffeine, and engage in relaxation techniques such as meditation or reading before bed.",
        },
        {
            id: "4",
            title: "Optimizing Sleep Environment",
            description:
                "Keep your room dark, cool, and quiet to enhance sleep quality.",
        },
        {
            id: "5",
            title: "Monitoring Your Sleep Patterns",
            description:
                "If sleep deprivation persists, consult a healthcare professional for further evaluation.",
        },
    ],
    MODERATE: [
        {
            id: "1",
            title: "Improve Sleep Duration",
            description:
                "Try to increase your sleep time by 30–60 minutes per night.",
        },
        {
            id: "2",
            title: "Reduce Stimulants",
            description: "Limit caffeine intake in the afternoon and evening.",
        },
    ],
    LOW: [
        {
            id: "1",
            title: "Keep Monitoring",
            description:
                "Continue your current routine and monitor any changes in sleep quality.",
        },
    ],
};

export default Advice;
