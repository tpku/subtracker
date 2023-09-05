import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const InputField = (props) => {
    const { value, setValue, placeholder, isPassword } = props;
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={setValue} secureTextEntry={isPassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,

        borderColor: "beige",
        borderWidth: 1,
        backgroundColor: "beige",
        borderRadius: 5,

        shadowRadius: 5,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowColor: "#0000001b",
    },
    input: {
        color: "#bdbdaa",
    },
});

export default InputField;
