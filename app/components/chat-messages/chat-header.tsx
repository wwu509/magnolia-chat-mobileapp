import {View} from 'react-native';
import {Root, Content, Trigger, Item, ItemTitle} from 'zeego/dropdown-menu';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import {translate} from '@/app/utils/i18n';
import BackButtonWithTitle from '../header/back-button';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';

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
    <View className="flex-row bg-white items-center h-14 ">
      <View className="w-3/4">
        <BackButtonWithTitle
          navigateToPage={NAVIGATION_ROUTES.HOME}
          title={name ?? 'Anonymous Name'}
        />
      </View>
      <View className="w-1/4 bg-white flex-row-reverse	">
        <Root>
          <Trigger>
            <Entypo
              color={'black'}
              size={22}
              className="w-full"
              style={{width: '100%', padding: 10}}
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
              </>
            )}
          </Content>
        </Root>
      </View>
    </View>
  );
};

export default ChatHeader;
