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
import { useRouter } from "expo-router";

const inputValidation = yup.object().shape({
    title: yup.string().required('O titulo é obrigatório'),
});

export default function AnotacaoCreate () {
    const router = useRouter();
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
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/anotacao`, {
                title: data.title,
                description: description,
                token: token
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.status === 201) {
                router.push(`/anotacao`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className='flex-1'>
            <Text className="text-xl font-bold m-3">Titulo</Text>
            <View className="flex m-3">
                <View className="flex flex-row w-full px-8 py-4 items-center justify-between rounded-lg font-medium bg-white border border-gray-200 text-sm">
                    <TextInput
                        className="w-full"
                        placeholder="Titulo"
                        placeholderTextColor="gray"
                        onChangeText={text => setValue('title', text)}
                    />
                </View>
            </View>
            <View>
                {errors.title && <Text className="text-red-500">{errors.title.message}</Text>}
            </View>
            <SafeAreaView className="flex-1 mx-2">
                <RichText editor={editor}/>
                <KeyboardAvoidingView
                    style={exStyles.keyboardAvoidingView}
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
            <View className='flex flex-row w-full m-2 items-start gap-2'>
                <TouchableOpacity className='bg-green-500 p-3 rounded' onPress={handleSubmit(onSubmit)}>
                    <Text className='text-white'>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity className='bg-red-500 p-3 rounded' onPress={()=> router.push(`/anotacao`)}>
                    <Text className='text-white'>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const exStyles = StyleSheet.create({
  keyboardAvoidingView: {
    height: '20%',
    width: '100%',
    bottom: 0,
  },
});
