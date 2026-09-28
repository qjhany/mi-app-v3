import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function FormularioScreen() {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipoMantenimiento, setTipoMantenimiento] = useState("");
  const [tipoPreparacion, setTipoPreparacion] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [registroGuardado, setRegistroGuardado] = useState<any>(null);

  const tiposMantenimiento = [
    "Cambio de aceite",
    "Revisión de frenos",
    "Cambio de cadena",
    "Mantenimiento general",
    "Otro",
  ];

  const tiposPreparacion = [
    "Puesta a punto",
    "Diagnóstico escáner",
    "Revisión preventiva",
    "Sincronización de motor",
    "Otro",
  ];

  // SOLO LETRAS - NOMBRE
  const handleNombreChange = (text: string) => {
    const soloLetras = text.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
      ""
    );

    setNombre(soloLetras);
  };

  // SOLO LETRAS - CIUDAD
  const handleCiudadChange = (text: string) => {
    const soloLetras = text.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
      ""
    );

    setCiudad(soloLetras);
  };

  // SOLO NÚMEROS - TELÉFONO
  const handleTelefonoChange = (text: string) => {
    const soloNumeros = text.replace(/[^0-9]/g, "");
    setTelefono(soloNumeros);
  };

  // SOLO NÚMEROS - AÑO
  const handleAnioChange = (text: string) => {
    const soloNumeros = text.replace(/[^0-9]/g, "");
    setAnio(soloNumeros);
  };

  // GUARDAR
  const enviar = async () => {
    if (
      !nombre ||
      !marca ||
      !modelo ||
      !anio ||
      !telefono ||
      !ciudad ||
      !tipoMantenimiento ||
      !tipoPreparacion
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los campos."
      );
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      Alert.alert(
        "Nombre inválido",
        "El nombre solo debe contener letras."
      );
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(ciudad)) {
      Alert.alert(
        "Ciudad inválida",
        "La ciudad solo debe contener letras."
      );
      return;
    }

    if (!/^\d+$/.test(telefono)) {
      Alert.alert(
        "Teléfono inválido",
        "El teléfono solo debe contener números."
      );
      return;
    }

    if (telefono.length < 7) {
      Alert.alert(
        "Teléfono inválido",
        "El teléfono debe tener al menos 7 dígitos."
      );
      return;
    }

    if (!/^\d+$/.test(anio)) {
      Alert.alert(
        "Año inválido",
        "El año solo debe contener números."
      );
      return;
    }

    try {
      setGuardando(true);

      const motoFavorita = `${marca} ${modelo} - Año ${anio}`;

      const { data, error } = await supabase
        .from("clientes_moto")
        .insert([
          {
            nombre: nombre,
            correo: "sin-correo@moto.com",
            telefono: telefono,
            ciudad: ciudad,
            moto_favorita: motoFavorita,
            tipo_mantenimiento: tipoMantenimiento,
            tipo_preparacion: tipoPreparacion,
          },
        ])
        .select()
        .single();

      if (error) {
        console.log("Error de Supabase:", error);

        Alert.alert(
          "Error al guardar",
          error.message
        );

        return;
      }

      console.log("Registro guardado:", data);

      setRegistroGuardado({
        id: String(data.id),
        nombre: data.nombre,
        marca: marca,
        modelo: modelo,
        anio: anio,
        telefono: data.telefono,
        ciudad: data.ciudad,
        tipoMantenimiento: data.tipo_mantenimiento,
        tipoPreparacion: data.tipo_preparacion,
      });

      setModalVisible(true);

    } catch (error) {
      console.log("Error:", error);

      Alert.alert(
        "Error",
        "Ocurrió un error al guardar los datos."
      );
    } finally {
      setGuardando(false);
    }
  };

  // MIRAR REGISTRO
  const mirarRegistro = () => {
    setModalVisible(false);

    if (!registroGuardado) {
      return;
    }

    router.push({
      pathname: "/resultado",
      params: registroGuardado,
    });
  };

  // VOLVER AL FORMULARIO
  const volverFormulario = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

      {/* BOTÓN VOLVER */}
      <Pressable
        style={styles.botonVolver}
        onPress={() => router.push("/")}
      >
        <Text style={styles.textoBotonVolver}>
          ← Volver al inicio
        </Text>
      </Pressable>

      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <View style={styles.encabezadoIcono}>
          <Text style={styles.encabezadoEmoji}>
            🏍️
          </Text>
        </View>

        <View style={styles.encabezadoInfo}>
          <Text style={styles.etiqueta}>
            MOTO🏍️YELA
          </Text>

          <Text style={styles.titulo}>
            Registro de motocicleta
          </Text>

          <Text style={styles.subtitulo}>
            Completa la información de tu motocicleta.
          </Text>
        </View>
      </View>

      {/* IMAGEN */}
      <View style={styles.imagenBox}>
        <Image
          source={{
            uri: "https://www.xtrafondos.com/thumbs/webp/1_12331.webp",
          }}
          style={styles.imagen}
        />

        <View style={styles.imagenOverlay}>
          <Text style={styles.imagenTexto}>
            🏍️ Tu moto, en buenas manos
          </Text>
        </View>
      </View>

      {/* FORMULARIO */}
      <View style={styles.card}>

        <Text style={styles.seccionTitulo}>
          Información del propietario
        </Text>

        {/* NOMBRE */}
        <Text style={styles.label}>
          👤 Nombre del propietario
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez"
          placeholderTextColor="#9B7A6E"
          value={nombre}
          onChangeText={handleNombreChange}
        />

        {/* TELÉFONO */}
        <Text style={styles.label}>
          📱 Teléfono
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: 3001234567"
          placeholderTextColor="#9B7A6E"
          value={telefono}
          onChangeText={handleTelefonoChange}
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* CIUDAD */}
        <Text style={styles.label}>
          📍 Ciudad
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: Pasto"
          placeholderTextColor="#9B7A6E"
          value={ciudad}
          onChangeText={handleCiudadChange}
        />

        <Text style={styles.seccionTituloMoto}>
          Información de la motocicleta
        </Text>

        {/* MARCA */}
        <Text style={styles.label}>
          🏍️ Marca de la moto
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: Yamaha"
          placeholderTextColor="#9B7A6E"
          value={marca}
          onChangeText={setMarca}
        />

        {/* MODELO */}
        <Text style={styles.label}>
          🔧 Modelo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: MT-09"
          placeholderTextColor="#9B7A6E"
          value={modelo}
          onChangeText={setModelo}
        />

        {/* AÑO */}
        <Text style={styles.label}>
          📅 Año de la motocicleta
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: 2024"
          placeholderTextColor="#9B7A6E"
          value={anio}
          onChangeText={handleAnioChange}
          keyboardType="numeric"
          maxLength={4}
        />

        {/* MANTENIMIENTO */}
        <Text style={styles.seccionTituloMoto}>
          Tipo de servicio
        </Text>

        <Text style={styles.label}>
          🔧 Tipo de mantenimiento
        </Text>

        <View style={styles.opciones}>
          {tiposMantenimiento.map((tipo) => (
            <Pressable
              key={tipo}
              style={[
                styles.opcion,
                tipoMantenimiento === tipo &&
                  styles.opcionSeleccionada,
              ]}
              onPress={() => setTipoMantenimiento(tipo)}
            >
              <Text
                style={[
                  styles.opcionTexto,
                  tipoMantenimiento === tipo &&
                    styles.opcionTextoSeleccionado,
                ]}
              >
                {tipo}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* PREPARACIÓN */}
        <Text style={styles.label}>
          ⚙️ Tipo de preparación
        </Text>

        <View style={styles.opciones}>
          {tiposPreparacion.map((tipo) => (
            <Pressable
              key={tipo}
              style={[
                styles.opcion,
                tipoPreparacion === tipo &&
                  styles.opcionSeleccionada,
              ]}
              onPress={() => setTipoPreparacion(tipo)}
            >
              <Text
                style={[
                  styles.opcionTexto,
                  tipoPreparacion === tipo &&
                    styles.opcionTextoSeleccionado,
                ]}
              >
                {tipo}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* GUARDAR */}
        <Pressable
          style={[
            styles.botonGuardar,
            guardando && styles.botonDesactivado,
          ]}
          onPress={enviar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.botonGuardarEmoji}>
                🏍️
              </Text>

              <Text style={styles.botonGuardarTexto}>
                Guardar registro
              </Text>
            </>
          )}
        </Pressable>

      </View>

      {/* RECOMENDACIÓN */}
      <View style={styles.destacado}>

        <View style={styles.destacadoIcono}>
          <Text style={styles.destacadoEmoji}>
            🔧
          </Text>
        </View>

        <View style={styles.destacadoInfo}>

          <Text style={styles.destacadoTitulo}>
            Recomendación
          </Text>

          <Text style={styles.destacadoTexto}>
            Realiza revisiones periódicas para mantener
            tu motocicleta en buen estado.
          </Text>

        </View>

      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Moto Yela · Desarrollo Móvil
      </Text>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>

          <View style={styles.modalCaja}>

            <View style={styles.modalIconoBox}>
              <Text style={styles.modalIcono}>
                ✅
              </Text>
            </View>

            <Text style={styles.modalTitulo}>
              ¡Registro realizado!
            </Text>

            <Text style={styles.modalTexto}>
              La información de tu motocicleta se guardó
              correctamente en Supabase.
            </Text>

            <Pressable
              style={styles.botonMirar}
              onPress={mirarRegistro}
            >
              <Text style={styles.textoBotonModal}>
                👁️ Mirar registro
              </Text>
            </Pressable>

            <Pressable
              style={styles.botonVolverFormulario}
              onPress={volverFormulario}
            >
              <Text style={styles.textoBotonVolverFormulario}>
                ↩️ Volver al formulario
              </Text>
            </Pressable>

          </View>

        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: "#FFF9F5",
    padding: 18,
  },

  /* VOLVER */

  botonVolver: {
    marginBottom: 18,
  },

  textoBotonVolver: {
    color: "#C97C8E",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* ENCABEZADO */

  encabezado: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1DDD6",
  },

  encabezadoIcono: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F8DDE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  encabezadoEmoji: {
    fontSize: 30,
  },

  encabezadoInfo: {
    flex: 1,
  },

  etiqueta: {
    color: "#C97C8E",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 3,
  },

  titulo: {
    color: "#5B3A2D",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#8B6A5D",
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },

  /* IMAGEN */

  imagenBox: {
    height: 190,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
  },

  imagen: {
    width: "100%",
    height: "100%",
  },

  imagenOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(92, 53, 38, 0.72)",
  },

  imagenTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  /* CARD */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1DDD6",
    elevation: 3,
    marginBottom: 20,
  },

  /* SECCIONES */

  seccionTitulo: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#5B3A2D",
    marginBottom: 14,
  },

  seccionTituloMoto: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#5B3A2D",
    marginTop: 12,
    marginBottom: 14,
  },

  /* LABELS */

  label: {
    color: "#7A4C3A",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 7,
    marginTop: 8,
  },

  /* INPUTS */

  input: {
    backgroundColor: "#FFF9F5",
    borderWidth: 1,
    borderColor: "#F1DDD6",
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    color: "#5B3A2D",
    fontSize: 15,
  },

  /* OPCIONES */

  opciones: {
    marginBottom: 10,
  },

  opcion: {
    backgroundColor: "#FFF9F5",
    borderWidth: 1,
    borderColor: "#F1DDD6",
    borderRadius: 14,
    padding: 13,
    marginBottom: 8,
  },

  opcionSeleccionada: {
    backgroundColor: "#F8DDE7",
    borderColor: "#C97C8E",
  },

  opcionTexto: {
    color: "#73594E",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },

  opcionTextoSeleccionado: {
    color: "#7A4C3A",
    fontWeight: "bold",
  },

  /* BOTÓN GUARDAR */

  botonGuardar: {
    backgroundColor: "#C97C8E",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
    elevation: 3,
  },

  botonDesactivado: {
    opacity: 0.6,
  },

  botonGuardarEmoji: {
    fontSize: 19,
    marginRight: 8,
  },

  botonGuardarTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* RECOMENDACIÓN */

  destacado: {
    backgroundColor: "#F8E1E8",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  destacadoIcono: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  destacadoEmoji: {
    fontSize: 25,
  },

  destacadoInfo: {
    flex: 1,
  },

  destacadoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7A4C3A",
    marginBottom: 4,
  },

  destacadoTexto: {
    color: "#73594E",
    fontSize: 13,
    lineHeight: 19,
  },

  /* FOOTER */

  footer: {
    textAlign: "center",
    color: "#9B7A6E",
    fontSize: 12,
    marginTop: 14,
    marginBottom: 12,
  },

  /* MODAL */

  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(91, 58, 45, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  modalCaja: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "#F1DDD6",
    alignItems: "center",
    elevation: 8,
  },

  modalIconoBox: {
    width: 70,
    height: 70,
    borderRadius: 25,
    backgroundColor: "#F8DDE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  modalIcono: {
    fontSize: 38,
  },

  modalTitulo: {
    color: "#5B3A2D",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  modalTexto: {
    color: "#8B6A5D",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 22,
  },

  botonMirar: {
    width: "100%",
    backgroundColor: "#C97C8E",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  textoBotonModal: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  botonVolverFormulario: {
    width: "100%",
    backgroundColor: "#FFF9F5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1DDD6",
  },

  textoBotonVolverFormulario: {
    color: "#7A4C3A",
    fontSize: 15,
    fontWeight: "bold",
  },

});
