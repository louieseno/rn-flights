import { registerUser } from "@/hooks/useLogin";
import { AuthContext } from "@/utils/AuthenticationContext";
import { router } from "expo-router";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const {login: logIn} = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try{
      const result = await registerUser(data)
      const {email, id, accessToken} = result?.data;
      logIn({token: accessToken, email, id})
    } catch (error) {
      console.log(error)
    } 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

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

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <Button
        title={isSubmitting ? "Registering..." : "Register"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />

      <View style={styles.footerText}>
        <Text>Already have an account? </Text>
        <Text style={styles.linkText} onPress={router.back}>
          Login
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
