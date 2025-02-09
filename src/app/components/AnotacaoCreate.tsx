import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native';
import { RichText, Toolbar, useEditorBridge, Images } from '@10play/tentap-editor';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const inputValidation = yup.object().shape({
    title: yup.string().required('O titulo é obrigatório'),
});

export default function AnotacaoCreate () {
    const [title, setTitle] = useState('');

    const { register, handleSubmit, setValue, formState: { errors },} = useForm({
        resolver: yupResolver(inputValidation)});
    
    useEffect(() => {
        register('title');
    },[register]);

    const initialContent = `<p></p>`;
    const editor = useEditorBridge({
        autofocus: true,
        initialContent,
    });
  
    const onSubmit = async (data: any) => {
        try {
            const description = await editor.getHTML()
            const token = await SecureStore.getItemAsync("authToken");
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/anotacao`, {
                title: data.title,
                description: description,
                token: token
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.status === 200) {
                console.log(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className='flex-1'>
            <SafeAreaView >
                <RichText editor={editor}/>
                <KeyboardAvoidingView
                    style={exampleStyles.keyboardAvoidingView}
                >
                    <Toolbar editor={editor}
                    items={[
                        {onPress:({ editor }) =>() => {editor.undo();},
                        image: () => Images.undo,
                        active: ({ editorState }) => editorState.canUndo,
                        disabled: ({ editorState }) => !editorState.canUndo,
                        },
                        {onPress:({ editor }) =>() => {editor.redo();},
                        image: () => Images.redo,
                        active: ({ editorState }) => editorState.canRedo,
                        disabled: ({ editorState}) => !editorState.canRedo,
                        },
                        {onPress:({ editor }) =>() => {editor.toggleBold();},
                        image: () => Images.bold,
                        active: ({ editorState }) => editorState.isBoldActive,
                        disabled: ({ editorState }) => !editorState.canToggleBold,
                        },
                        {onPress:({ editor }) =>() => {editor.toggleItalic();},
                        image: () => Images.italic,
                        active: ({ editorState }) => editorState.isItalicActive,
                        disabled: ({ editorState }) => !editorState.canToggleItalic,
                        },
                        {onPress:({ editor }) =>() => {editor.toggleUnderline();},
                        image: () => Images.underline,
                        active: ({ editorState }) => editorState.isUnderlineActive,
                        disabled: ({ editorState }) => !editorState.canToggleUnderline,
                        },
                        {onPress:({ editor }) =>() => {editor.toggleStrike();},
                        image: () => Images.strikethrough,
                        active: ({ editorState }) => editorState.isStrikeActive,
                        disabled: ({ editorState }) => !editorState.canToggleStrike,
                        },
                        {onPress:({ editor }) =>() => {editor.toggleOrderedList();},
                        image: () => Images.orderedList,
                        active: ({ editorState }) => editorState.isOrderedListActive,
                        disabled: ({ editorState}) => !editorState.canToggleOrderedList,
                        },
                        {onPress:({ editor }) =>() => {editor.toggleBulletList();},
                        image: () => Images.bulletList,
                        active: ({ editorState }) => editorState.isBulletListActive,
                        disabled: ({ editorState }) => !editorState.canToggleBulletList,
                        },
                        {onPress:({ editor }) =>() => {editor.setLink('');},
                        image: () => Images.link,
                        active: ({ editorState }) => editorState.isLinkActive,
                        disabled: () => false,
                        },
                    ]}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Text className="text-2xl font-bold mt-6">Titulo</Text>
            <View className="flex flex-row w-full mt-2 items-center justify-between rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm">
                <TextInput
                className="w-full"
                placeholder="Titulo"
                placeholderTextColor="gray"
                onChangeText={text => setValue('title', text)}
                />
            </View>
            <View>
                {errors.title && <Text className="text-red-500">{errors.title.message}</Text>}
            </View>
            <View className='flex flex-row w-full mt-2 items-start gap-2'>
                <TouchableOpacity className='bg-green-500 p-3 rounded' onPress={handleSubmit(onSubmit)}>
                    <Text className='text-white'>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const exampleStyles = StyleSheet.create({
  keyboardAvoidingView: {
    height: '30%',
    width: '100%',
    bottom: 0,
  },
});
