import { loginUser } from "@/hooks/useLogin";
import { AuthContext } from "@/utils/AuthenticationContext";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const {login: logIn} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  
  const onSubmit = async (data: FormData) => {
    try{
      const result = await loginUser(data)
      const {email, id, accessToken} = result?.data;
      logIn({token: accessToken, email, id})
    } catch (error) {
      console.log(error)
    } 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Button
        title={isSubmitting ? "Logging in..." : "Login"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />

      <View style={styles.footerText}>
        <Text>Don't have an account? </Text>
        <Text
          style={styles.linkText}
          onPress={() => router.navigate("/register")}
        >
          Register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
