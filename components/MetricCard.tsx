import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

interface MetricProps {
	value: number;
	label: string;
	color?: string;
}

const MetricCard: React.FC<MetricProps> = ({ value, label, color }) => {
	return (
		<View style={styles.card}>
			<AnimatedCircularProgress
				size={100}
				width={10}
				fill={value}
				tintColor={color || "#4ADE80"}
				backgroundColor="#2E2E3E"
				backgroundWidth={10}
				lineCap="round"
			>
				{(fill: Double) => (
					<Text style={styles.percentText}>
						{`${fill.toFixed(1)}%`}
					</Text>
				)}
			</AnimatedCircularProgress>
			<Text style={styles.label}>{label}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		minWidth: 250,
		backgroundColor: "#1E1E2E",
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	percentText: {
		color: "#E5E5E5",
		fontWeight: "bold",
		fontSize: 18,
	},
	label: {
		color: "#E5E5E5",
		marginTop: 8,
		fontWeight: "600",
	},
});

export default MetricCard;
