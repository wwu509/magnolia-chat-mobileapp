import {View, Text, Pressable} from 'react-native';
import {Root, Content, Trigger, Item, ItemTitle} from 'zeego/dropdown-menu';
import Entypo from '@expo/vector-icons/Entypo';

import {TEST_IDS} from '@/app/constants/test-ids/chat-screen';
import {navigateBack} from '@/app/helper/navigation';

import BackSvg from '@/assets/svgs/arrow-left-svg';
import React from 'react';
import {translate} from '@/app/utils/i18n';

type ChatHeaderProps = {
  name: string;
  important: boolean;
  conversationType: 'group' | 'one-to-one' | '';
  isOwner: boolean;
  handleActions: (value: string) => void;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  important,
  conversationType,
  isOwner,
  handleActions,
}) => {
  const isGroup = conversationType === 'group';
  const importantTag = important ? 'mark_as_unimportant' : 'mark_as_important';
  const infoTag = isGroup ? 'group_info' : 'view_contact_info';
  return (
    <View className="flex-row bg-black justify-between items-center h-full mx-5 rounded-lg">
      <Pressable
        testID={TEST_IDS.BUTTON.BACK_ICON}
        accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
        onPress={navigateBack}
        className="w-[10%] h-[100%] justify-center items-center">
        <BackSvg fill="white" height={20} width={20} />
      </Pressable>
      <Text className="text-center text-white">{name ?? 'Anonymous Name'}</Text>
      <View className="w-[10%]">
        <Root>
          <Trigger>
            <Entypo
              color={'white'}
              size={22}
              style={{width: '100%', paddingLeft: 10}}
              name={'dots-three-vertical'}
            />
          </Trigger>
          <Content
            placeholder={''}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}>
            <Item
              key={infoTag}
              placeholder={''}
              onSelect={() => {
                handleActions(infoTag);
              }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              <ItemTitle>{translate(infoTag)}</ItemTitle>
            </Item>

            <Item
              key={importantTag}
              placeholder={''}
              onSelect={() => {
                handleActions(importantTag);
              }}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}>
              <ItemTitle>{translate(importantTag)}</ItemTitle>
            </Item>
            {conversationType === 'group' && isOwner && (
              <>
                <Item
                  key="add_user"
                  placeholder={''}
                  onSelect={() => {
                    handleActions('add_user');
                  }}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  <ItemTitle>{translate('add_user')}</ItemTitle>
                </Item>
                <Item
                  key="remove_user"
                  placeholder={''}
                  onSelect={() => {
                    handleActions('remove_user');
                  }}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  <ItemTitle>{translate('remove_user')}</ItemTitle>
                </Item>
                {/* <Item
                  key="mute_chat"
                  placeholder={''}
                  onSelect={() => {
                    handleActions('mute_chat');
                  }}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  <ItemTitle>{translate('mute_chat')}</ItemTitle>
                </Item> */}
              </>
            )}
          </Content>
        </Root>
      </View>
    </View>
  );
};

export default ChatHeader;