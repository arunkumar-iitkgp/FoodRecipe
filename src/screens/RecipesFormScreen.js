import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet,ScrollView,KeyboardAvoidingView,Platform} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    if (!title || !image || !description) return;
    try {
      const storedRecipes = await AsyncStorage.getItem("customRecipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      const newRecipe = { title, image, description };

      if (recipeToEdit !== undefined && recipeIndex !== undefined) {
        recipes[recipeIndex] = newRecipe;
      } else {
        recipes.push(newRecipe);
      }

      await AsyncStorage.setItem("customRecipes", JSON.stringify(recipes));
      if (onrecipeEdited) onrecipeEdited();
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp(5) }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{recipeToEdit ? "Edit Recipe" : "Add New Recipe"}</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <Text style={styles.label}>Recipe Title</Text>
        <TextInput
          placeholder="Enter recipe name..."
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          placeholder="Paste image link here..."
          value={image}
          onChangeText={setImage}
          style={styles.input}
        />
        
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}><Text>No Image Preview</Text></View>
        )}

        <Text style={styles.label}>Cooking Instructions / Description</Text>
        <TextInput
          placeholder="Describe how to cook this..."
          value={description}
          onChangeText={setDescription}
          multiline={true}
          style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
        />

        <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(5),
    marginBottom: hp(2)
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#4B5563'
  },
  backText: {
    color: '#4F75FF',
    fontSize: hp(2)
  },
  label: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#4B5563',
    marginTop: hp(2)
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(3),
    marginVertical: hp(1),
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: hp(25),
    borderRadius: 10,
    marginVertical: hp(1),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: hp(1.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
