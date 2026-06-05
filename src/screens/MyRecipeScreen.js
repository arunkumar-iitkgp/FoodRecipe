import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { useRoute } from "@react-navigation/native";
  import { useDispatch, useSelector } from "react-redux";
  import { toggleFavorite } from "../redux/favoritesSlice";
  import Categories from "../components/categories";
  import FoodItems from "../components/recipes";
  
  export default function MyRecipeScreen() {
    const navigation = useNavigation();
    const [recipes, setrecipes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchrecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem("customRecipes");
          if (storedRecipes) {
            setrecipes(JSON.parse(storedRecipes));
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchrecipes();
    }, []);
  
    const handleAddrecipe = () => {
      navigation.navigate("RecipesFormScreen", {
        onrecipeEdited: async () => {
          const storedRecipes = await AsyncStorage.getItem("customRecipes");
          if (storedRecipes) setrecipes(JSON.parse(storedRecipes));
        },
      });
    };
  
    const handlerecipeClick = (recipe) => {
      navigation.navigate("CustomRecipesScreen", { recipe });
    };

    const deleterecipe = async (index) => {
      try {
        const updatedRecipes = recipes.filter((_, i) => i !== index);
        await AsyncStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));
        setrecipes(updatedRecipes);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    };
  
    const editrecipe = (recipe, index) => {
      navigation.navigate("RecipesFormScreen", {
        recipeToEdit: recipe,
        recipeIndex: index,
        onrecipeEdited: async () => {
          const storedRecipes = await AsyncStorage.getItem("customRecipes");
          if (storedRecipes) setrecipes(JSON.parse(storedRecipes));
        },
      });
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>My Recipes</Text>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"Back"}</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New recipe</Text>
        </TouchableOpacity>
  
        {loading ? (
          <ActivityIndicator size="large" color="#f59e0b" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {recipes.length === 0 ? (
              <Text style={styles.norecipesText}>No recipes added yet.</Text>
            ) : (
              recipes.map((recipe, index) => (
                <View key={index} style={styles.recipeCard} testID="recipeCard">
                  <TouchableOpacity testID="handlerecipeBtn" onPress={() => handlerecipeClick(recipe)}>
                    {recipe.image && (
                      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    )}
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <Text style={styles.recipeDescription} testID="recipeDescp">
                      {recipe.description.slice(0, 100)}...
                    </Text>
                  </TouchableOpacity>
  
                  {/* Edit and Delete Buttons */}
                  <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                    <TouchableOpacity onPress={() => editrecipe(recipe, index)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleterecipe(index)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9FAFB",
    },
    heading: {
      fontSize: hp(3.8),
      marginTop: hp(4),
      marginLeft: wp(5),
      fontWeight: "600",
      color: "#4B5563",
    },
    backButton: {
      marginLeft: wp(5),
      marginVertical: hp(1),
    },
    backButtonText: {
      fontSize: hp(2.2),
      color: "#4F75FF",
    },
    addButton: {
      backgroundColor: "#4F75FF",
      padding: hp(1.5),
      alignItems: "center",
      borderRadius: 5,
      width: wp(50),
      alignSelf: "center",
      marginBottom: hp(2),
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(2.2),
    },
    scrollContainer: {
      paddingBottom: hp(2),
      paddingHorizontal: wp(4),
    },
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2),
      color: "#6B7280",
      marginTop: hp(5),
    },
    recipeCard: {
      width: wp(92), 
      backgroundColor: "#fff",
      padding: wp(4),
      borderRadius: 8,
      marginBottom: hp(2),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3, // for Android shadow
    },
    recipeImage: {
      width: "100%",
      height: hp(20),
      borderRadius: 8,
      marginBottom: hp(1),
    },
    recipeTitle: {
      fontSize: hp(2),
      fontWeight: "600",
      color: "#111827",
      marginBottom: hp(0.5),
    },
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1.5),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
      paddingTop: hp(1),
      borderTopWidth: 1,
      borderTopColor: "#F3F4F6",
    },
    editButton: {
      backgroundColor: "#34D399",
      padding: hp(1),
      borderRadius: 5,
      width: wp(40),
      alignItems: "center",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
    deleteButton: {
      backgroundColor: "#EF4444",
      padding: hp(1),
      borderRadius: 5,
      width: wp(40),
      alignItems: "center",
    },
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  });
  