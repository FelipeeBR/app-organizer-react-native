import React, { useState } from "react";
import { View, Text } from "react-native";
import { BoardRepository } from 'react-native-draganddrop-board';
import { Board } from 'react-native-draganddrop-board'

const data = [
    {
      id: 1,
      name: 'Pendente',
      rows: [
        {
          id: '1',
          name: 'Analyze your audience',
          description: 'Learn more about the audience to whom you will be speaking'
        },
        {
          id: '2',
          name: 'Select a topic',
          description: 'Select a topic that is of interest to the audience and to you'
        },
        {
          id: '3',
          name: 'Define the objective',
          description: 'Write the objective of the presentation in a single concise statement'
        }
      ]
    },
    {
      id: 2,
      name: 'Fazendo',
      rows: [
        {
          id: '4',
          name: 'Look at drawings',
          description: 'How did they use line and shape? How did they shade?'
        },
        {
          id: '5',
          name: 'Draw from drawings',
          description: 'Learn from the masters by copying them'
        },
        {
          id: '6',
          name: 'Draw from photographs',
          description: 'For most people, it’s easier to reproduce an image that’s already two-dimensional'
        }
      ]
    },
    {
      id: 3,
      name: 'Concluído',
      rows: [
        {
          id: '7',
          name: 'Draw from life',
          description: 'Do you enjoy coffee? Draw your coffee cup'
        },
        {
          id: '8',
          name: 'Take a class',
          description: 'Check your local university extension'
        }
      ]
    }
]
   
const boardRepository = new BoardRepository(data);

export default function Anotacao() {


    return (
        <Board
            boardRepository={boardRepository}
            open={() => {}}
            onDragEnd={() => {}}
        />
    );
}