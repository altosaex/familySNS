import { View, Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';

type Props = {
	onChangeText: (text: string) => void;
	value: string;
	label: string;
	height?: number;
	placeholder?: string;
};

export const CommentArea: React.FC<Props> = ({
	value,
	onChangeText,
	label,
	height,
	placeholder,
}: Props) => {
	return (
		<View style={[styles.container, !!height && { height }]}>
			<Text style={styles.label}>{label}CommentArea</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) => onChangeText(text)}
				value={value}
				multiline={true}
				placeholder={placeholder}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});