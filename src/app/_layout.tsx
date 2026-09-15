import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#030825",
        },
        headerTintColor: "#e81010",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#b96b11",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Inicio" }}
      />

      <Stack.Screen
        name="formulario"
        options={{ title: "Formulario" }}
      />

      <Stack.Screen
        name="resultado"
        options={{ title: "Datos registrados" }}
      />

      <Stack.Screen
        name="imagenes"
        options={{ title: "Galería" }}
      />

      <Stack.Screen
        name="contacto"
        options={{ title: "Contacto" }}
      />
    </Stack>
  );
}
