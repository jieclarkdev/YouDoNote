import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LeagueSpartan_400Regular } from "@expo-google-fonts/league-spartan";
import FontLoader from "./FontLoader";
import { COLORS } from "../constant/theme";
import CustomButton from "./CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotes } from "../provider/NotesProvider";
import NoteModal from "./NoteModal";
const NoteDetails = (props) => {
  const { note } = props.route.params;
  //   console.log(note);
  const { setnoteLists } = useNotes();
  const [isVisible, setisVisible] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const formatDate = (melliseconds) => {
    const date = new Date(melliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const sec = date.getSeconds();

    return `${day}/${month}/${year} - ${hrs}:${mins}:${sec}`;
  };

  const { height } = Dimensions.get("window");

  const deleteNote = async () => {
    const result = await AsyncStorage.getItem("noteLists");
    let notes = [];
    if (result !== null) notes = JSON.parse(result);

    const newNotes = notes.filter((n) => n.id !== note.id);
    setnoteLists(newNotes);
    await AsyncStorage.setItem("noteLists", JSON.stringify(newNotes));
    props.navigation.goBack();
  };

  const displayDeleteAlert = () => {
    Alert.alert("Are you sure ?", "It will delete your note ", [
      {
        text: "Delete",
        onPress: deleteNote,
      },
      {
        text: "Cancel",
        onPress: () => {
          console.log("cancelled");
        },
      },
    ]);
  };

  const handleOnClose = () => setisVisible(false);

  const handleUpdateNote = async (changeTitle, changeNote, time) => {
    try {
      const result = await AsyncStorage.getItem("noteLists");
      let notes = [];
      if (result !== null) notes = JSON.parse(result);

      // finding the index of the note to be updated
      const noteIndex = notes.findIndex((n) => n.id === note.id);

      if (noteIndex !== -1) {
        notes[noteIndex] = {
          ...notes[noteIndex],
          noteTitle: changeTitle,
          note: changeNote,
          time: time,
        };

        await AsyncStorage.setItem("noteLists", JSON.stringify(notes));

        setnoteLists(notes);

        setisVisible(false);
      } else {
        console.warn("wala nakit an ang note");
      }
    } catch (error) {
      console.error("Error pag update", error);
    }
  };

  const openEditModal = () => {
    setisEdit(true);
    setisVisible(true);
  };

  return (
    <FontLoader>
      <SafeAreaView
        style={{
          padding: 20,
          paddingTop: 60,
          flex: 1,
          //   backgroundColor: "red",
          height,
        }}
      >
        <Text
          style={{
            textAlign: "right",
            fontSize: 12,
            opacity: 0.5,
            marginBottom: 10,
            borderTopWidth: 1,
            paddingTop: 25,
          }}
        >{`Created at ${formatDate(note.time)}`}</Text>
        <ScrollView>
          <View>
            <Text
              style={{
                fontFamily: "LeagueSpartan_400Regular",
                fontSize: 18,
                marginBottom: 20,
              }}
            >
              {note.noteTitle}
            </Text>
            <Text style={{ lineHeight: 21 }}>{note.note}</Text>
          </View>
        </ScrollView>
        <View style={{ position: "absolute", right: 15, bottom: 50 }}>
          <CustomButton
            antNameIcon="delete"
            style={{
              width: 65,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 50,
              elevation: 0,
              marginBottom: 10,
            }}
            onPress={displayDeleteAlert}
          />
          <CustomButton
            antNameIcon="edit"
            style={{
              width: 65,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 50,
              elevation: 0,
            }}
            onPress={openEditModal}
          />
        </View>
        <NoteModal
          isEdit={isEdit}
          notes={note}
          visible={isVisible}
          onSubmit={handleUpdateNote}
          onClose={handleOnClose}
        />
      </SafeAreaView>
    </FontLoader>
  );
};

export default NoteDetails;

const styles = StyleSheet.create({});
