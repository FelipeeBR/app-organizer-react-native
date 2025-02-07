import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';

export default function Anotacao() {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
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
          <Toolbar editor={editor} />
        </KeyboardAvoidingView>
      </SafeAreaView>
      <TouchableOpacity onPress={onSubmit}>
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

const initialContent = `bvvvbvvcvbcvbvc`;