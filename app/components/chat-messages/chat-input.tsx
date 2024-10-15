import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import {Root, Content, Trigger, Item, ItemTitle} from 'zeego/dropdown-menu';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {useTheme} from '@/app/components/theme-context';

const ChatInput = ({
  handleActions,
  sendMsg,
  updateTyping,
  textMsg,
  FileMsg,
}: {
  handleActions: ({value}: {value: string}) => void;
  sendMsg: () => void;
  updateTyping: (value: string) => void;
  textMsg: string;
  FileMsg: string | boolean;
}) => {
  const {activeTheme} = useTheme();

  const inputAccessoryViewID = 'uniqueID';

  return (
    <View className="w-full h-full justify-between flex-row items-center bg-stone-200">
      <View className="w-[90%] flex-row items-center">
        <View className="w-[12%]">
          <Root>
            <Trigger>
              <TouchableOpacity>
                <Entypo
                  color={'gray'}
                  size={22}
                  style={{width: '100%', paddingLeft: 10}}
                  name={'attachment'}
                />
              </TouchableOpacity>
            </Trigger>
            <Content
              placeholder={''}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              <Item
                key="camera"
                placeholder={''}
                onSelect={() => {
                  handleActions({value: 'camera'});
                }}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}>
                <ItemTitle>Camera</ItemTitle>
              </Item>
              <Item
                key="gallery"
                placeholder={''}
                onSelect={() => {
                  handleActions({value: 'gallery'});
                }}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}>
                <ItemTitle>Gallery</ItemTitle>
              </Item>
              <Item
                key="videos"
                placeholder={''}
                onSelect={() => {
                  handleActions({value: 'videos'});
                }}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}>
                <ItemTitle>Videos</ItemTitle>
              </Item>
            </Content>
          </Root>
        </View>
        <TextInput
          inputAccessoryViewID={inputAccessoryViewID}
          placeholder="Type a message..."
          placeholderTextColor={'gray'}
          multiline={true}
          value={
            typeof FileMsg === 'string' && FileMsg === 'image'
              ? textMsg.substring(25)
              : textMsg
          }
          onChangeText={text => updateTyping(text)}
          className="bg-white text-base w-[85%] text-black rounded-lg h-[40px] pl-2"
        />
      </View>
      <MaterialCommunityIcons
        color={activeTheme.linkContainer}
        size={25}
        className="mx-2.5 p-1.5"
        style={{width: '6%', marginRight: 10}}
        name={'send'}
        onPress={() => sendMsg()}
      />
    </View>
  );
};

export default ChatInput;
