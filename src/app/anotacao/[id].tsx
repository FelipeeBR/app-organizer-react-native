import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { RichText, Toolbar, useEditorBridge, Images } from '@10play/tentap-editor';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

export default function AnotacaoInfo () {
  const { id } = useLocalSearchParams();
  const [anotacao, setAnotacao] = useState(null);

  useEffect(() => {
    const fetchAnotacao = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/anotacao/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnotacao(response.data.description);
      } catch (error) {
        
      }
    }
    fetchAnotacao();
  }, [id]);


  const initialContent = `<p>${anotacao}</p>`;
  const editor = useEditorBridge({
    autofocus: true,
    initialContent,
  });
  
  const onSubmit = async () => {
    const text = await editor.getHTML();
    console.log(text);
  };
  return (
    <View style={exampleStyles.fullScreen}>
    <SafeAreaView >
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={exampleStyles.keyboardAvoidingView}
      >
        <Toolbar editor={editor}
          items={[
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.undo();
                },
              image: () => Images.undo,
              active: ({ editorState }) => editorState.canUndo,
              disabled: ({ editorState }) => !editorState.canUndo,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.redo();
                },
              image: () => Images.redo,
              active: ({ editorState }) => editorState.canRedo,
              disabled: ({ editorState}) => !editorState.canRedo,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.toggleBold();
                },
              image: () => Images.bold,
              active: ({ editorState }) => editorState.isBoldActive,
              disabled: ({ editorState }) => !editorState.canToggleBold,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.toggleItalic();
                },
              image: () => Images.italic,
              active: ({ editorState }) => editorState.isItalicActive,
              disabled: ({ editorState }) => !editorState.canToggleItalic,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.toggleUnderline();
                },
              image: () => Images.underline,
              active: ({ editorState }) => editorState.isUnderlineActive,
              disabled: ({ editorState }) => !editorState.canToggleUnderline,
            },
            {
              onPress:
                ({ editor, editorState }) =>
                () => {
                  editor.toggleStrike();
                  editorState.isFocused;
                },
              image: () => Images.strikethrough,
              active: ({ editorState }) => editorState.isStrikeActive,
              disabled: ({ editorState }) => !editorState.canToggleStrike,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.toggleOrderedList();
                },
              image: () => Images.orderedList,
              active: ({ editorState }) => editorState.isOrderedListActive,
              disabled: ({ editorState}) => !editorState.canToggleOrderedList,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.toggleBulletList();
                },
              image: () => Images.bulletList,
              active: ({ editorState }) => editorState.isBulletListActive,
              disabled: ({ editorState }) => !editorState.canToggleBulletList,
            },
            {
              onPress:
                ({ editor }) =>
                () => {
                  editor.setLink('');
                },
              image: () => Images.link,
              active: ({ editorState }) => editorState.isLinkActive,
              disabled: () => false,
            },
          ]}
          />
      </KeyboardAvoidingView>
    </SafeAreaView>
    <TouchableOpacity className='bg-green-500 p-3 rounded' onPress={onSubmit}>
      <Text>Salvar</Text>
    </TouchableOpacity>
  </View>
  );
}

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    height: '50%',
    width: '100%',
    bottom: 0,
  },
});
